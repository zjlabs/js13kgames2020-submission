'use strict';

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
      return { rooms, players, items, colliders };
    },
  };
})();

class Entity {
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
    this.xp = 0;
    this.level = 1;
    this.health = 10;
    this.items = [];
    this.bot = false;
    this.skin = 0;
    this.powerups = [];
  }
}

const Game = {
  height: 50,
  width: 50,

  syncState() {
    io.emit('delta', state.getDelta());
  },

  pruneInactiveEntities() {
    state.prunePlayers();
  },

  update(deltaTime) {},
};

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
  Game.syncState();
  Game.pruneInactiveEntities();
  Game.update(delta);

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
    return res.json(state.all());
  },
};
