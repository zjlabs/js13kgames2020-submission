'use strict';

const { OPEN_SHAREDCACHE } = require('sqlite3');

/**
 * Emit stats on tick
 */
const STATS = true;

/**
 * The current log level
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

class Tile extends Component {
  constructor(x, y, height = TILE_HEIGHT, width = TILE_WIDTH) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
  }
}

class Grid extends Component {
  constructor(height = 50, width = 50) {
    this.height = 50;
    this.width = 50;
    this.tiles = [];
  }

  start() {
    this.tiles = [];
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.tiles.push[x][y] = new Tile(x, y);
      }
    }
  }

  update(deltaTime) {
    this.tiles.forEach((tile) => tile.update(deltaTime));
  }

  /**
   * Get a path from start tile x/y to end tile x/y
   *
   * @param {*} startX
   * @param {*} startY
   * @param {*} endX
   * @param {*} endY
   */
  findPath(startX, startY, endX, endY) {
    let open = new Heap();
    let close = new Heap();

    let start = this.getNode(startX, startY);
    let end = this.getNode(endX, endY);

    // the start or end isnt valid, no path.
    if (!start || !end) {
      return [];
    }

    // add the start node to the open set
    open.insert(this.getF(start), start);

    let node;
    let neighbors;
    while ((node = open.remove(0))) {
      close.insert(this.getF(node), node);

      // path found
      if (node.value == end) {
        return;
      }

      neighbors = this.getNeighbors(node.value);
    }

    // no path available
    return [];
  }

  getNode(x, y) {
    if (!(x < this.width) || !(y < this.height)) {
      return undefined;
    }

    return this.tiles[x][y];
  }

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
    temp = this.getNode(x + 1, y);
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
  constructor() {}

  start() {}

  update(deltaTime) {}

  syncState() {
    io.emit('delta', state.getDelta());
  }

  pruneInactiveEntities() {
    state.prunePlayers();
  }
}

// based on https://codeburst.io/implementing-a-complete-binary-heap-in-javascript-the-priority-queue-7d85bd256ecf
class Heap {
  constructor(sort) {
    this.sort = sort;
    this.data = [];
  }

  insert(key, value) {
    // edge case when empty
    if (!this.data) {
      this.data = [new HeapNode(key, value)];
      return true;
    }

    // make and add the new node
    let index = this.data.length;
    let node = new HeapNode(key, value);
    this.data.push(node);

    //
    let parentIndex = this.getParent(index);
    let parentNode = this.getNode(parentIndex);
    let temp;

    while (parentNode) {
      // swap the parent with this node
      if (parent.key > node.key) {
        temp = parent;
        parent = node;
        node = parent;

        // get the index for new parent
        parentIndex = this.getParent(parentIndex);
        parentNode = this.getNode(parent);
      } else {
        return;
      }
    }
  }

  remove() {
    let index = 0;
    let out = this.getNode(index);

    // set the head to the end node and rebalance
    this.data[index] = this.data.pop();
    let node = this.data[index];
    let leftIndex;
    let leftNode;
    let rightIndex;
    let rightNode;
    let temp;
    while (node) {
      leftIndex = this.getLeft(index);
      leftNode = this.getNode(leftIndex);
      rightIndex = this.getRight(index);
      rightNode = this.getNode(rightIndex);

      // Left is smaller, swap
      if (leftNode && node.key > leftNode.key) {
        temp = leftNode;
        leftNode = node;
        node = leftNode;
        index = leftIndex;
      }
      // right is smaller, swap
      else if (rightNode && node.key > rightNode.key) {
        temp = rightNode;
        rightNode = node;
        node = rightNode;
        index = rightIndex;
      }
      // out of moves, escape
      else {
        return;
      }
    }

    return out;
  }

  getNode(index) {
    return index > 0 && index < this.data.length - 1 ? this.data[index] : undefined;
  }

  getParent(nodeIndex) {
    nodeIndex = Math.floor(nodeIndex - 1 / 2);
    // return this.getNode(nodeIndex);
    return nodeIndex;
  }

  getLeft(nodeIndex) {
    nodeIndex = 2 * nodeIndex + 1;
    // return this.getNode(nodeIndex);
    return nodeIndex;
  }

  getRight(nodeIndex) {
    nodeIndex = 2 * nodeIndex + 2;
    // return this.getNode(nodeIndex);
    return nodeIndex;
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
module.exports = {
  // Debug endpoint for server state
  state: (req, res, next) => {
    return res.send(`<pre>${JSON.stringify(state.all(), null, 2)}</pre>`);
  },
};
