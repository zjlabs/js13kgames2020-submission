'use strict';

/**
 * Whether or not to include test code
 */
const TEST = true;

/**
 * Emit stats on tick
 */
const STATS = true;

/**
 * The current log level
 *
 *
 * 4 = fatal = exit()
 * 3 = error = error()
 * 2 = info  = info()
 * 1 = debug = debug()
 * 0 = all   = all()
 */
const LOG_LEVEL = 3;

const exit = (...message) => LOG_LEVEL >= 4 && console.log('fatal', ...message);
const error = (...message) => LOG_LEVEL >= 3 && console.log('error', ...message);
const info = (...message) => LOG_LEVEL >= 2 && console.log('info', ...message);
const debug = (...message) => LOG_LEVEL >= 1 && console.log('debug', ...message);
const all = (...message) => LOG_LEVEL >= 0 && console.log('all', ...message);

/**
 * The server tick rate info
 */
const TICK_RATE = 10;
const TICK_TIME = 1000 / TICK_RATE;

/**
 * The game state model
 */
const state = (() => {
  const rooms = {};
  const players = {};
  const items = {};
  const colliders = {};
  let delta;

  return {
    addPlayer(socket, player) {
      players[socket.id] = player;
      debug('addPlayer', socket.id);
    },
    updatePlayer(socket, obj) {
      if (!players[socket.id]) return;

      // update the player delta for every different key:value pair
      Object.keys(obj).forEach((key) => {
        let oldVal = players[socket.id].get(key);
        let newVal = obj[key];

        if (oldVal != newVal) {
          players[socket.id].set(key, newVal);
          delta.players[socket.id] = Object.assign(players[socket.id], { [key]: newVal });
        }
      });
      debug('updatePlayer', socket.id, obj, delta.players[socket.id]);
    },
    removePlayer(socket) {
      delete players[socket.id];
      delta.players[socket.id].set('active', false);
      debug('removePlayer', socket.id);
    },
    getPlayer(id = undefined) {
      if (id == undefined) {
        return players;
      }
      if (players[id]) {
        return players[id];
      }

      return undefined;
    },
    prunePlayers() {
      Object.keys(players).forEach((id) => {
        if (players[id].get('active') == false) {
          delete players[id];
        }
      });
    },
    sync(id) {
      debug('sync', id);
      io.to(id).emit('sync', { rooms, players, items, colliders });
    },
    getDelta() {
      let out = delta;
      delta = {
        rooms: {},
        players: {},
        items: {},
        colliders: {},
      };

      return out || delta;
    },
    all() {
      return { rooms, players, items, colliders, delta };
    },
  };
})();

class Component {
  constructor() {
    this.components = [];
  }

  addComponent(component) {
    this.components.push(component);
  }

  start() {}
  update(deltaTime) {}
}

class Entity extends Component {
  constructor() {
    super();
    this.active = true;
  }

  set(key, val) {
    if (this.hasOwnProperty(key)) {
      this[key] = val;
    }
  }

  get(key) {
    if (this.hasOwnProperty(key)) return this[key];

    return undefined;
  }
}

class Player extends Entity {
  /**
   * @param {Socket} socket
   */
  constructor(socket) {
    super();
    this.socket = socket;
    this.username = '';
    this.x = 0;
    this.y = 0;
    this.height = 0;
    this.width = 0;
    this.xp = 0;
    this.level = 1;
    this.health = 10;
    this.items = [];
    this.bot = false;
    this.skin = 0;
    this.powerups = [];
  }

  update(deltaTime) {}
}

class Tile {
  constructor(x, y, height = TILE_HEIGHT, width = TILE_WIDTH) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
  }

  // Getter for unique tile id
  get id() {
    return `${this.x},${this.y}`;
  }
}

class Grid extends Component {
  constructor(height = 50, width = 50) {
    super();
    this.height = height;
    this.width = width;
    this.tiles = [];
  }

  start() {
    this.tiles = [];
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.tiles[x] = this.tiles[x] || [];
        this.tiles[x][y] = this.tiles[x][y] || [];
        this.tiles[x][y] = new Tile(x, y);
      }
    }
  }

  update(deltaTime) {
    this.tiles.forEach((tile) => tile.update(deltaTime));
  }

  /**
   * Octile distance formula, from:
   * http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html#diagonal-distance
   *
   * @param {Object} node
   *   The starting node for the calculation
   * @param {Object} goal
   *   The end node for the calculation
   *
   * @returns {Number}
   *   The distance between the two nodes.
   */
  heuristic(node, goal) {
    const D = 1;
    const D2 = Math.SQRT2;
    let dx = Math.abs(node.x - goal.x);
    let dy = Math.abs(node.y - goal.y);
    return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
  }

  /**
   * Util function to reconstruct the final path from findPath, on success.
   *
   * @param {Object} nodeList
   *   The visited nodeList map from findPath
   * @param {Object} node
   *   The final node in the path.
   *
   * @returns {Array}
   *   The shortest path from the node to the origin of nodeList.
   */
  buildPath(nodeList, node) {
    debug('buildPath', nodeList);
    let out = [node];
    while (nodeList[node.id]) {
      node = nodeList[node.id];
      out.push(node);
    }
    return out.reverse();
  }

  /**
   * Get a path from start tile x/y to end tile x/y, using a*, from:
   * https://en.wikipedia.org/wiki/A*_search_algorithm
   *
   * @param {Number} startX
   *   The start tile x coordinate.
   * @param {Number} startY
   *   The start tile y coordinate.
   * @param {Number} endX
   *   The end tile x coordinate.
   * @param {Number} endY
   *   The end tile y coordinate.
   *
   * @returns {Array}
   *   The array of game tiles in the path
   */
  findPath(startX, startY, endX, endY) {
    let open = new MinHeap();

    // convert tile coords to actual tile nodes
    let start = this.getNode(startX, startY);
    let end = this.getNode(endX, endY);
    if (!start || !end) {
      return [];
    }

    // For node n, path[n] is the node immediately preceding it on the cheapest path from start
    // to n currently known.
    let cameFrom = {};

    // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
    let gScore = { [start.id]: 0 };

    // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
    // how short a path from start to finish can be if it goes through n.
    let fScore = { [start.id]: this.heuristic(start, end) };

    // start the openset with the start node
    open.insert(fScore[start.id], start);

    let node;
    let temp;
    while ((node = open.remove()) && node) {
      debug('findPath node', node);
      node = node.value;
      if (!node) break;
      if (node == end) return buildPath(cameFrom, node);

      this.getNeighbors(node.x, node.y).forEach((neighbor) => {
        debug('findPath neighbor', neighbor);
        // this path to neighbor is better than any previous one, record it
        if (gScore[node.id] < (gScore[neighbor.id] || Number.MAX_SAFE_INTEGER)) {
          cameFrom[neighbor.id] = node;
          gScore[neighbor.id] = gScore[node.id];
          fScore[neighbor.id] = gScore[neighbor.id] + this.heuristic(neighbor, end);

          debug('node', gScore[node.id], fScore[node.id]);
          debug('neighbor', gScore[neighbor.id], fScore[neighbor.id]);

          // Only add the neighbor to the openset if it doesnt exist in there
          // note: only each nodes id is unique
          temp = open
            .getNodesByKey(fScore[neighbor.id])
            .map((node) => node.id == neighbor.id)
            .reduce((acc, cur) => cur || acc, false);
          if (!temp) {
            open.insert(fScore[neighbor.id], neighbor);
          }
        }
      });
    }

    // no path available
    return [];
  }

  /**
   * Util helper to get the tilemap tile or undefined for the given coordinates.
   *
   * @param {Number} x
   *   The grid x coordinate
   * @param {Number} y
   *   The grid y coordinate
   *
   * @returns {Object|undefined}
   *   The grid node or undefined
   */
  getNode(x, y) {
    if (x > this.width - 1 || x < 0 || y > this.height - 1 || y < 0) {
      return undefined;
    }

    debug('getNode', x, y, this.tiles[x][y]);
    return this.tiles[x][y];
  }

  /**
   * Get all the neighbor nodes for the input grid x/y tile location
   *
   * @param {Number} x
   *   The grid x coordinate
   * @param {Number} y
   *   The grid y coordinate
   *
   * @returns {Array}
   *   The nodes immediate neighbors list, for all 8 directions.
   */
  getNeighbors(x, y) {
    let out = [];
    let temp;

    // diag left top
    temp = this.getNode(x - 1, y + 1);
    if (temp) out.push(temp);

    // top
    temp = this.getNode(x, y + 1);
    if (temp) out.push(temp);

    // diag right top
    temp = this.getNode(x + 1, y + 1);
    if (temp) out.push(temp);

    // left
    temp = this.getNode(x - 1, y);
    if (temp) out.push(temp);

    // right
    temp = this.getNode(x + 1, y);
    if (temp) out.push(temp);

    // diag left bot
    temp = this.getNode(x - 1, y - 1);
    if (temp) out.push(temp);

    // bot
    temp = this.getNode(x, y - 1);
    if (temp) out.push(temp);

    // diag right bot
    temp = this.getNode(x + 1, y - 1);
    if (temp) out.push(temp);

    return out;
  }
}

class Game extends Component {
  constructor() {
    super();
  }

  start() {}

  update(deltaTime) {}

  syncState() {
    io.emit('delta', state.getDelta());
  }

  pruneInactiveEntities() {
    state.prunePlayers();
  }
}

// logic from https://en.wikipedia.org/wiki/Binary_heap
class MinHeap {
  constructor(sort) {
    this.sort = sort;
    this.data = [];
  }

  /**
   *
   *
   * @param {Number} key
   *   The primary key to sort on
   * @param {Object} value
   *   The stored values in this node
   */
  insert(key, value) {
    // Add the new data
    let index = this.data.length;
    let node = new HeapNode(key, value);
    this.data.push(node);
    debug('insert', node);

    // compare with parent
    let parent;
    let temp;
    while ((parent = this.getNode(this.getParent(index))) && parent) {
      debug('insert parent', parent, node, index);
      if (parent.key > node.key) {
        temp = node;
        node = parent;
        parent = temp;
        index = this.getParent(index);
        continue;
      }

      break;
    }
  }

  minHeap(index) {
    debug(`minHeap ${index}`, this.data.length);

    // rebalance
    let node;
    let left;
    let right;
    let temp;
    while ((node = this.getNode(index)) && node) {
      // node = this.getNode(index);
      left = this.getNode(this.getLeft(index));
      right = this.getNode(this.getRight(index));

      // escape if node doesnt exist anymore
      if (!node) break;

      // attempt left swap first
      if (left && node.key > left.key) {
        debug('minHeap swap left', node.key, left.key);
        temp = left;
        left = node;
        node = temp;
        index = this.getLeft(index);
        this.minHeap(index);
      }

      // now right is smaller, swap
      if (right && node.key > right.key) {
        debug('minHeap swap left', node.key, right.key);
        temp = right;
        right = node;
        node = temp;
        index = this.getRight(index);
        this.minHeap(index);
      }

      // if (!left && !right)
      break;
    }
  }

  /**
   * Removes the node with the smallest key.
   *
   * @returns {Object|undefined}
   */
  remove() {
    // get the first element, smallest, store for return.
    let out = this.getNode(0);
    delete this.data[0];
    if (!out) return;

    // set the head to the end node and rebalance
    let temp = this.data.pop();
    if (temp != undefined) {
      this.data[0] = temp;
      this.minHeap(0);
    }

    debug('heap remove', out, this.data.length, temp);
    return out;
  }

  /**
   * Search the heap for all nodes with the same key.
   *
   * @param {Number} key
   *   The key to search for
   *
   * @returns {Array}
   *   Any matching nodes
   */
  getNodesByKey(key) {
    return this.data.map((node) => node.key == key);
  }

  getNode(index) {
    return this.data[index] || undefined;
  }

  getParent(nodeIndex) {
    return parseInt(nodeIndex - 1 / 2) || undefined;
  }

  getLeft(nodeIndex) {
    return 2 * nodeIndex + 1 || undefined;
  }

  getRight(nodeIndex) {
    return 2 * nodeIndex + 2 || undefined;
  }
}

class HeapNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
}

/**
 * Handle incoming connections.
 */
io.on('connection', (socket) => {
  const player = new Player(socket);

  socket.on('disconnect', () => {
    state.removePlayer(socket);
    debug('Disconnected', socket.id);
  });

  socket.on('play', () => {
    state.addPlayer(socket, player);
  });

  socket.on('data', (obj) => {
    state.updatePlayer(socket, obj);
  });

  debug('Connected', socket.id);
});

/**
 * Init game
 */
const game = new Game();
game.start();

// Start the game loop
let delta = 0;
let elapsed = 0;
let current = Date.now();
let last;
let sleep;
const tick = () => {
  last = current;
  current = Date.now();
  delta = current - last;

  /**
   * GAME LOGIC
   */
  game.syncState();
  game.pruneInactiveEntities();
  game.update(delta);

  // Update the stats and wait for the next tick.
  elapsed = Date.now() - current;
  sleep = Math.max(TICK_TIME - elapsed, 0);
  debug('TICK');
  debug('delta', delta);
  debug('current', current);
  debug('last', last);
  debug('elapsed', elapsed);
  debug('sleep', sleep);
  STATS && io.emit('stats', { delta, current, last, elapsed, sleep });
  setTimeout(tick, sleep);
};

// Start the main game loop
setTimeout(tick, TICK_TIME);

/**
 * Mount all the API endpoints
 *
 * NOTE: DO NOT make an endpoint named 'io', this is non-standard behavior.
 */
module.exports = Object.assign(
  {
    // Debug endpoint for server state
    state: (req, res, next) => {
      return res.send(`<pre>${JSON.stringify(state.all(), null, 2)}</pre>`);
    },
  },
  TEST && {
    path: (req, res, next) => {
      let grid = new Grid(5, 5);
      grid.start();

      debug('grid', grid);

      let path = grid.findPath(0, 0, 2, 2);
      return res.json(path);
    },
  }
);
