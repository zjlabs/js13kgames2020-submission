import state from './state';
import {
  debug,
  error,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  TILE_HEIGHT,
  TILE_WIDTH,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  WEAPON_HEIGHT,
  WEAPON_RESOLUTION,
  WEAPON_WIDTH,
  WEAPON_X_OFFSET,
  WEAPON_Y_OFFSET,
  rad,
  sin,
  cos,
  ITEM_TYPES,
  ITEM_LIFE_HEIGHT,
  ITEM_LIFE_WIDTH,
  ITEM_SWORD_HEIGHT,
  ITEM_SWORD_WIDTH,
  ITEM_HELM_HEIGHT,
  ITEM_HELM_WIDTH,
  ITEM_ARMOR_HEIGHT,
  ITEM_ARMOR_WIDTH,
  rot,
  PATH_ACCURACY,
  ang,
  rand,
  WANDER_MAX,
  WEAPON_DAMAGE,
  ITEM_LIFE_VALUE,
  PLAYER_REVERSE_DIST,
  cang,
  PLAYER_REVERSE_SPREAD,
  PLAYER_REVERSE_VELOCITY,
  PLAYER_MAX_HEALTH,
  PLAYER_XP_LEVEL,
} from '../shared/variables';
import { getId } from '../shared/id';
import { getDiff } from '../client/object-utilities.ts';
const { min, max, abs, sqrt } = Math;

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

  getComponents(deep = false) {
    if (!deep) {
      return this.components;
    }

    return [...this.components, ...this.components.map((c) => c.getComponents(deep).flat())];
  }

  update(deltaTime) {
    this.component.forEach((component) => component.update(deltaTime));
  }

  getPojo() {
    let { id, components } = this;
    return {
      id,
      components,
    };
  }
}

export class Entity extends Component {
  constructor() {
    super();
    this.active = true;
    this._prevState = {};
  }

  update(delta) {}

  set(key, val) {
    if (this.hasOwnProperty(key)) {
      this[key] = val;
    }

    this.updateState();
  }

  get(key) {
    if (this.hasOwnProperty(key)) return this[key];

    return undefined;
  }

  getPojo() {
    return {
      ...super.getPojo(),
      active: this.active,
    };
  }

  getDiff() {
    const pojo = this.getPojo();
    let out = getDiff(this._prevState, pojo);
    this._prevState = pojo;

    if (!out || Object.keys(out) == 0) return false;
    return out;
  }

  hasColliders() {
    return this.getColliders().length > 0;
  }

  getColliders() {
    return [];
  }

  updateState() {}

  onCollision(collider, other) {}
}

export class Player extends Entity {
  /**
   * @param {Socket} socket
   */
  constructor(socket) {
    super();
    this.socket = socket;
    this.username = '';
    this.x = WORLD_WIDTH / 2;
    this.y = WORLD_HEIGHT / 2;
    this.height = PLAYER_HEIGHT / 2;
    this.width = PLAYER_WIDTH / 2;
    this.xp = 0;
    this.level = 1;
    this.health = 10;
    this.items = {};
    // start bot specific props
    this.bot = false;
    this.path = [];
    this.target = false;
    // end bot specific props
    this.skin = 0;
    this.powerups = {};
    this.mouseAngleDegrees = 0;
    this.speed = 500;
    this.frozen = false;
    this.reverse = false;
    state.player.set(this);
  }

  update(deltaTime) {
    // update direction before movement if we're a bot
    if (this.bot && !this.frozen) {
      // try to update the path
      if ([false, undefined, null].includes(this.target)) {
        error(`bot player has no target and is not frozen: ${this.username}|${this.id}`);
        // this.target = this.path.length > this.target ? this.path[this.target] : this.path[0];
      }
      // random wandering
      else if (this.target instanceof Point) {
        let pt = this.target;
        let playerBB = new Rectangle(this.x, this.y, this.height, this.height);
        let targetBB = new Rectangle(pt.x, pt.y, this.height * PATH_ACCURACY, this.height * PATH_ACCURACY);

        // new random point
        if (playerBB.intersects(targetBB)) {
          this.target = new Point(
            this.x + rand(-WANDER_MAX, WANDER_MAX, false),
            this.y + rand(-WANDER_MAX, WANDER_MAX, false)
          );
        }

        // update the mouseAngleDegrees
        this.mouseAngleDegrees = (ang(this.y - pt.y, this.x - pt.x) + 180) % 360;
      }
      // target is on and we have a valid index
      else if (typeof this.target === 'number' && this.path.length > this.target) {
        let pt = this.path[this.target];
        let playerBB = new Rectangle(this.x, this.y, this.height, this.height);
        let targetBB = new Rectangle(pt.x, pt.y, this.height * PATH_ACCURACY, this.height * PATH_ACCURACY);

        // move the index
        if (playerBB.intersects(targetBB)) {
          this.target = (this.target + 1) % this.path.length;
        }

        // update the mouseAngleDegrees
        this.mouseAngleDegrees = (ang(this.y - pt.y, this.x - pt.x) + 180) % 360;
      }
    }

    // perform movement based on player/mouseAngleDegrees
    if (!this.frozen) {
      const dir = this.reverse != false ? -PLAYER_REVERSE_VELOCITY : 1;

      // TODO: Determine if "world wrapping" will be a nightmare for bots.
      const intendedXOffset =
        Math.cos((this.mouseAngleDegrees * Math.PI) / 180) * (deltaTime / 1000) * this.speed * dir || 0;
      const intendedYOffset =
        Math.sin((this.mouseAngleDegrees * Math.PI) / 180) * (deltaTime / 1000) * this.speed * dir || 0;
      if (this.reverse != false) {
        const hyp = sqrt(intendedXOffset ** 2 + intendedYOffset ** 2);
        this.reverse -= hyp;
        if (this.reverse < 0) this.reverse = false;
      }

      const intendedXDestination = this.x + intendedXOffset;
      const intendedYDestination = this.y + intendedYOffset;

      if (intendedXDestination > WORLD_WIDTH) {
        this.x = intendedXDestination - WORLD_WIDTH;
      } else if (intendedXDestination < 0) {
        this.x = WORLD_WIDTH + intendedXDestination;
      } else {
        this.x += intendedXOffset;
      }

      if (intendedYDestination > WORLD_HEIGHT) {
        this.y = intendedYDestination - WORLD_HEIGHT;
      } else if (intendedYDestination < 0) {
        this.y = WORLD_HEIGHT + intendedYDestination;
      } else {
        this.y += intendedYOffset;
      }
    }

    // update all the children components
    this.components.forEach((component) => component.update(deltaTime));
  }

  // Drawn center origin
  // starting at 0 deg
  // rotate b around a, mouseAngleDegrees degrees
  getWeaponColliderCoords() {
    let out = [];

    const w = WEAPON_HEIGHT / 2 / WEAPON_RESOLUTION;
    const h = WEAPON_WIDTH / 2;
    for (let i = 1; i <= WEAPON_RESOLUTION; i++) {
      out.push(
        new Rectangle(
          this.x + WEAPON_X_OFFSET + w + 2 * w * (i - 1),
          this.y + WEAPON_Y_OFFSET - h,
          w,
          h,
          this,
          'weapon'
        ).rotateAround(this.mouseAngleDegrees, new Point(this.x, this.y))
      );
    }

    return out;
  }

  getColliders() {
    return [new Rectangle(this.x, this.y, this.height, this.height, this, 'damage'), ...this.getWeaponColliderCoords()];
  }

  onCollision(collider, other) {
    if (collider.action == 'damage' && other.action == ITEM_TYPES['life']) {
      let health = this.health + ITEM_LIFE_VALUE;
      let newHealth = health > PLAYER_MAX_HEALTH ? PLAYER_MAX_HEALTH : health;
      let xp = health > PLAYER_MAX_HEALTH ? health % PLAYER_MAX_HEALTH : 0;
      let newXp = this.xp + xp;
      let newLevel = 1 + parseInt(newXp / PLAYER_XP_LEVEL);

      collider.data.set('health', newHealth);
      collider.data.set('xp', newXp);
      collider.data.set('level', newLevel);
      other.data.set('active', false);
      return true;
    }
    if (collider.action == 'damage' && other.action == 'weapon') {
      let newHealth = max(this.health - WEAPON_DAMAGE, 0);
      collider.data.set('health', newHealth);
      if (!newHealth) collider.data.set('active', false);
      return true;
    }
    if (collider.action == 'weapon' && other.action == 'weapon') {
      collider.data.set('reverse', PLAYER_REVERSE_DIST);
      collider.data.set(
        'mouseAngleDegrees',
        cang(collider.data.mouseAngleDegrees + rand(-PLAYER_REVERSE_SPREAD, PLAYER_REVERSE_SPREAD, true))
      );
      other.data.set('reverse', PLAYER_REVERSE_DIST);
      other.data.set(
        'mouseAngleDegrees',
        cang(other.data.mouseAngleDegrees + rand(-PLAYER_REVERSE_SPREAD, PLAYER_REVERSE_SPREAD, true))
      );
      return true;
    }
    if (collider.action == 'damage' && other.action == ITEM_TYPES['sword']) {
      if (!collider.data.items.sword) {
        collider.data.set('items', {
          ...collider.data.items,
          ...{ sword: 1 },
        });
        other.data.set('active', false);
        return true;
      }
    }
    if (collider.action == 'damage' && other.action == ITEM_TYPES['helm']) {
      if (!collider.data.items.helm) {
        collider.data.set('items', {
          ...collider.data.items,
          ...{ helm: 1 },
        });
        other.data.set('active', false);
        return true;
      }
    }
    if (collider.action == 'damage' && other.action == ITEM_TYPES['armor']) {
      if (!collider.data.items.armor) {
        collider.data.set('items', {
          ...collider.data.items,
          ...{ armor: 1 },
        });
        other.data.set('active', false);
        return true;
      }
    }
  }

  updateState() {
    state.player.set(this);
  }

  getPojo() {
    let {
      username,
      x,
      y,
      width,
      height,
      xp,
      level,
      health,
      items,
      bot,
      skin,
      powerups,
      mouseAngleDegrees,
      speed,
      frozen,
      path,
      target,
    } = this;
    return {
      ...super.getPojo(),
      username,
      x,
      y,
      width,
      height,
      xp,
      level,
      health,
      items,
      bot,
      path,
      target,
      skin,
      powerups,
      mouseAngleDegrees,
      speed,
      frozen,
      colliders: this.getColliders().map((c) => c.pure()),
    };
  }
}

export class Item extends Entity {
  constructor(x, y, width, height, type = '', scale = 1) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = typeof type == 'string' ? ITEM_TYPES[type] : type;
    this.scale = scale;
    state.items.set(this);
  }

  getColliders() {
    return [new Rectangle(this.x, this.y, this.scale * this.width, this.scale * this.height, this, this.type)];
  }

  getPojo() {
    const { x, y, width, height, type, scale } = this;
    return {
      ...super.getPojo(),
      x,
      y,
      width,
      height,
      type,
      scale,
    };
  }

  updateState() {
    state.items.set(this);
  }
}

export class Life extends Item {
  constructor(x, y) {
    super(x, y, ITEM_LIFE_WIDTH, ITEM_LIFE_HEIGHT, 'life');
  }
}

export class Sword extends Item {
  constructor(x, y) {
    super(x, y, ITEM_SWORD_WIDTH, ITEM_SWORD_HEIGHT, 'sword');
  }
}

export class Helm extends Item {
  constructor(x, y) {
    super(x, y, ITEM_HELM_WIDTH, ITEM_HELM_HEIGHT, 'helm');
  }
}

export class Armor extends Item {
  constructor(x, y) {
    super(x, y, ITEM_ARMOR_WIDTH, ITEM_ARMOR_HEIGHT, 'armor');
  }
}

export class Tile extends Entity {
  constructor(x, y, walk = true, height = TILE_HEIGHT, width = TILE_WIDTH) {
    super();
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.walk = walk;
  }

  // Getter for unique tile id
  get tid() {
    return `${this.x},${this.y}`;
  }

  getColliders() {
    return !this.walk
      ? [
          new Rectangle(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.width / 2,
            this.height / 2,
            this,
            'tile'
          ),
        ]
      : [];
  }

  getPojo() {
    let { x, y, height, width, walk } = this;
    return {
      ...super.getPojo(),
      x,
      y,
      height,
      width,
      walk,
      tid: this.tid,
      colliders: this.getColliders().map((c) => c.pure()),
    };
  }
}

export class Grid extends Component {
  constructor(height = 50, width = 50) {
    super();
    this.height = height;
    this.width = width;
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
    while (nodeList[node.tid]) {
      node = nodeList[node.tid];
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
    let gScore = { [start.tid]: 0 };

    // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
    // how short a path from start to finish can be if it goes through n.
    let fScore = { [start.tid]: this.heuristic(start, end) };

    // start the openset with the start node
    open.insert(fScore[start.tid], start);

    let iter = 0;
    let node;
    let temp;
    let tempG;
    while ((node = open.extractMin()) && node && iter < 50) {
      iter++;
      node = node.value;
      if (!node) break;
      if (node.tid == end.tid) return this.buildPath(cameFrom, node);

      this.getNeighbors(node.x, node.y).forEach((neighbor) => {
        // this path to neighbor is better than any previous one, record it
        tempG = gScore[node.tid] + this.distance(node, neighbor);
        if (tempG < (gScore[neighbor.tid] != undefined ? gScore[neighbor.tid] : Number.MAX_SAFE_INTEGER)) {
          cameFrom[neighbor.tid] = node;
          gScore[neighbor.tid] = tempG;
          fScore[neighbor.tid] = gScore[neighbor.tid] + this.heuristic(neighbor, end);

          // Only add the neighbor to the openset if it doesnt exist in there
          temp = open
            .getNodesByKey(fScore[neighbor.tid])
            .map((node) => node.value.tid == neighbor.tid)
            .reduce((acc, cur) => cur || acc, false);
          if (!temp) {
            open.insert(fScore[neighbor.tid], neighbor);
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
    const w = WORLD_WIDTH / 2;
    const h = WORLD_HEIGHT / 2;
    this.world = new Rectangle(w, h, w, h);
  }

  checkCollisions() {
    let cmap = {};

    this.components.forEach((component) => {
      if (!component.active || !component.hasColliders()) return;
      component.getColliders().forEach((collider) => {
        if (!collider.data || !collider.action) return;
        this.quadTree.query(collider).forEach((collision) => {
          if (component.id == collision.data.id) return;
          if (!collision.data.active) return;
          if (cmap[collider.data.id] && cmap[collider.data.id][collision.data.id]) return;

          if (collider.intersects(collision)) {
            debug('collision!', collider, collision);
            // if this was a collision, make sure the parent cant collide with this again
            if (component.onCollision(collider, collision)) {
              cmap[collider.data.id] = cmap[collider.data.id] || {};
              cmap[collider.data.id][collision.data.id] = true;
            }
          }
        });
      });
    });
  }

  update(deltaTime) {
    this.clearFrameMemory();

    // Update every component before applying primary control logic
    this.components.forEach((component) => {
      if (!component.active) return;
      component.update(deltaTime);
      component.getColliders().forEach((c) => this.quadTree.insert(c));
      component.updateState();
    });

    // check all collisions
    this.checkCollisions();

    state.delta();
  }

  clearFrameMemory() {
    this.quadTree = new Quadtree(this.world);
  }
}

// Min Heap entitiy used for a*
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

// Min Heap entitiy used for a*
export class HeapNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
}

export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  rotateAround(angle, origin = new Point(0, 0)) {
    let [x, y] = rot(angle, origin.x, origin.y, this.x, this.y);
    this.x = x;
    this.y = y;
    return this;
  }
}

// Quadtree entity
// should be middle centered with half-width dimensions
// 0,0 in the top left
export class Rectangle {
  constructor(x, y, w, h, data, action) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 0;
    this.h = h || 0;
    this.data = data;
    this.action = action;
  }

  contains(point) {
    return (
      point.x >= this.x - this.w &&
      point.x <= this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y <= this.y + this.h
    );
  }

  // aabb
  intersects(rect) {
    return (
      this.x - this.w < rect.x + rect.w &&
      this.x + this.w > rect.x - rect.w &&
      this.y - this.h < rect.y + rect.h &&
      this.y + this.h > rect.y - rect.h
    );
  }

  pure() {
    let { x, y, w, h, action } = this;
    return {
      x,
      y,
      w,
      h,
      action,
    };
  }

  rotateAround(angle, origin = new Point(0, 0)) {
    let topLeft = new Point(this.x - this.w, this.y - this.h).rotateAround(angle, origin);
    let botLeft = new Point(this.x - this.w, this.y + this.h).rotateAround(angle, origin);
    let topRight = new Point(this.x + this.w, this.y - this.h).rotateAround(angle, origin);
    let botRight = new Point(this.x + this.w, this.y + this.h).rotateAround(angle, origin);
    return this.toAABB([topLeft, botLeft, topRight, botRight]);
  }

  toAABB(points = []) {
    let x = points.map((point) => point.x);
    let y = points.map((point) => point.y);

    let minX = min(...x);
    let minY = min(...y);

    let dx = (max(...x) - minX) / 2;
    let dy = (max(...y) - minY) / 2;

    this.x = minX + dx;
    this.y = minY + dy;
    this.w = dx;
    this.h = dy;
    return this;
  }
}

// Quadtree entity
// should be middle centered with half-width dimensions
export class Quadtree {
  // 400x400
  constructor(boundry = new Rectangle(200, 200, 200, 200), capacity = 10) {
    this.boundry = boundry;
    this.capacity = capacity;
    this.points = [];
    this.divided = false;
  }

  subdivide() {
    this.divided = true;
    let x = this.boundry.x;
    let y = this.boundry.y;
    let w = this.boundry.w;
    let h = this.boundry.h;

    this.northWest = new Quadtree(new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2), this.capacity);
    this.northEast = new Quadtree(new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2), this.capacity);
    this.southWest = new Quadtree(new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2), this.capacity);
    this.southEast = new Quadtree(new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2), this.capacity);
  }

  insert(point) {
    if (!this.boundry.contains(point)) return false;
    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    }

    if (!this.divided) this.subdivide();
    return (
      this.northWest.insert(point) ||
      this.northEast.insert(point) ||
      this.southWest.insert(point) ||
      this.southEast.insert(point)
    );
  }

  query(boundry) {
    let out = [];

    if (this.boundry.intersects(boundry)) {
      out = this.points;

      if (this.divided) {
        out.push(
          ...this.northWest.query(boundry),
          ...this.northEast.query(boundry),
          ...this.southWest.query(boundry),
          ...this.southEast.query(boundry)
        );
      }
    }

    return out;
  }
}
