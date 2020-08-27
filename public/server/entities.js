import state from './state';
import { debug, error, TILE_HEIGHT, TILE_WIDTH } from '../shared/variables';
import { getId } from '../shared/id';

export class Component {
  constructor() {
    this.id = getId();
    this.components = [];
  }

  addComponent(component) {
    if (!component instanceof Component) {
      error('Only components can be added as child components!');
      return;
    }

    this.components.push(component);
  }

  removeComponent(remove, deep = false) {
    this.components = this.components.filter((component) =>
      component.id != remove.hasOwnProperty('id') ? remove.id : remove
    );

    if (deep) {
      this.components.map((component) => {
        component.removeComponent(remove, deep);
      });
    }
  }

  start() {}

  update(deltaTime) {
    this.component.forEach((component) => component.update(deltaTime));
  }
}

export class Entity extends Component {
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

  getPojo() {
    return Object.keys(this).reduce((acc, key) => {
      if (this.unSerializableKeys != null && this.unSerializableKeys.includes(key)) {
        return acc;
      }

      return {
        ...acc,
        [key]: this.get(key),
      };
    }, {});
  }
}

export class Player extends Entity {
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
    this.items = {};
    this.bot = false;
    this.skin = 0;
    this.powerups = {};
    this.mouseAngleDegrees = 0;
    this.speed = 1;

    this.unSerializableKeys = ['components', 'unSerializableKeys', 'socket'];
  }

  update(deltaTime) {
    this.x += Math.cos(this.mouseAngleDegrees) * (deltaTime / this.speed) || 0;
    this.y += Math.sin(this.mouseAngleDegrees) * (deltaTime / this.speed) || 0;

    // update all the children components
    this.components.forEach((component) => component.update(deltaTime));
  }
}

export class Tile {
  constructor(x, y, walk = true, height = TILE_HEIGHT, width = TILE_WIDTH) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.walk = walk;
  }

  // Getter for unique tile id
  get id() {
    return `${this.x},${this.y}`;
  }
}

export class Grid extends Component {
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

  distance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
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
    debug('buildPath', nodeList, node);
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
    let open = new BinaryHeap();

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

    let iter = 0;
    let node;
    let temp;
    let tempG;
    while ((node = open.extractMin()) && node && iter < 50) {
      iter++;
      node = node.value;
      if (!node) break;
      if (node.id == end.id) return this.buildPath(cameFrom, node);

      this.getNeighbors(node.x, node.y).forEach((neighbor) => {
        // this path to neighbor is better than any previous one, record it
        tempG = gScore[node.id] + this.distance(node, neighbor);
        if (tempG < (gScore[neighbor.id] != undefined ? gScore[neighbor.id] : Number.MAX_SAFE_INTEGER)) {
          cameFrom[neighbor.id] = node;
          gScore[neighbor.id] = tempG;
          fScore[neighbor.id] = gScore[neighbor.id] + this.heuristic(neighbor, end);

          // Only add the neighbor to the openset if it doesnt exist in there
          temp = open
            .getNodesByKey(fScore[neighbor.id])
            .map((node) => node.value.id == neighbor.id)
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
    if (temp && temp.walk) out.push(temp);

    // top
    temp = this.getNode(x, y + 1);
    if (temp && temp.walk) out.push(temp);

    // diag right top
    temp = this.getNode(x + 1, y + 1);
    if (temp && temp.walk) out.push(temp);

    // left
    temp = this.getNode(x - 1, y);
    if (temp && temp.walk) out.push(temp);

    // right
    temp = this.getNode(x + 1, y);
    if (temp && temp.walk) out.push(temp);

    // diag left bot
    temp = this.getNode(x - 1, y - 1);
    if (temp && temp.walk) out.push(temp);

    // bot
    temp = this.getNode(x, y - 1);
    if (temp && temp.walk) out.push(temp);

    // diag right bot
    temp = this.getNode(x + 1, y - 1);
    if (temp && temp.walk) out.push(temp);

    return out;
  }
}

export class Game extends Component {
  constructor() {
    super();
    console.log('------------------- START -----------------------');
  }

  start() {}

  update(deltaTime) {
    this.components.forEach((component) => component.update(deltaTime));
  }

  syncState() {
    io.emit('delta', state.getDelta());
  }

  pruneInactiveEntities() {
    let old = [].concat(state.prunePlayers());
    old.forEach((c) => this.removeComponent(c));
  }
}

export class BinaryHeap {
  constructor() {
    this.data = [];
  }

  insert(key, value) {
    let node = new HeapNode(key, value);
    this.data.push(node);

    let temp;
    let index = this.data.length;
    let parent = this.getNode(this.parent(index));
    while (index >= 0 && parent && parent.key < node.key) {
      temp = parent;
      parent = node;
      node = temp;
      index = this.parent(index);
    }
  }

  extractMin() {
    if (this.data.length <= 0) return undefined;
    let min = this.data[0];
    this.data[0] = undefined;
    let temp = this.data.pop();
    if (!temp) {
      this.data = [];
    } else {
      this.data[0] = temp;
    }
    this.minHeap();
    return min;
  }

  minHeap(index = 0) {
    let min;
    let left = this.getNode(this.left(index));
    let right = this.getNode(this.right(index));
    let current = this.getNode(index);

    if (left && current && left.key < current.key) {
      min = this.left(index);
    } else {
      min = index;
    }

    current = this.getNode(min);
    if (right && current && right.key < current.key) {
      min = this.right(index);
    }

    if (min != index) {
      let temp = this.data[index];
      this.data[index] = this.data[min];
      this.data[min] = temp;
      return this.minHeap(min);
    }
  }

  left(index) {
    return 2 * index + 1 || undefined;
  }

  right(index) {
    return 2 * index + 2 || undefined;
  }

  parent(index) {
    return parseInt(index - 1 / 2) || undefined;
  }

  getNode(index) {
    return this.data[index] || undefined;
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
    return this.data.filter((node) => node.key == key);
  }
}

export class HeapNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
}
