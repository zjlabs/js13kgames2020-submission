'use strict';

const DEBUG = true;
const TICK_RATE = 10;
const TICK_TIME = 1000 / TICK_RATE;

const log = (...message) => {
  if (DEBUG) console.log(...message);
};

// Game data
const state = (() => {
  const rooms = {};
  const players = {};
  const items = {};
  const colliders = {};

  return {
    addPlayer: (socket, player) => {
      players[socket.id] = player;
    },
    remPlayer: (socket) => {
      delete players[socket.id];
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
  };
})();

/**
 * Player
 */
class Player {
  /**
   * @param {Socket} socket
   */
  constructor(socket) {
    this.socket = socket;
  }
}

let delta = 0;
let elapsed = 0;
let current = Date.now();
let last;
let sleep;
const tick = () => {
  last = current;
  current = Date.now();
  delta = current - last;

  // GAME LOGIC

  elapsed = Date.now() - current;
  sleep = Math.max(TICK_TIME - elapsed, 0);
  log('TICK', Date.now());
  log('delta', delta);
  log('current', current);
  log('last', last);
  log('elapsed', elapsed);
  log('sleep', sleep);
  setTimeout(tick, sleep);
};

// Start the main game loop
setTimeout(tick, TICK_TIME);

module.exports = {
  /**
   * Socket.io configuration
   */
  io: (socket) => {
    const player = new Player(socket);

    socket.on('disconnect', () => {
      state.remPlayer(socket);
      log('Disconnected', socket.id);
    });

    socket.on('play', () => {
      state.addPlayer(socket, player);
    });

    log('Connected', socket.id);
  },

  /**
   * API Endpoints.
   */

  // Debug endpoint for server state
  state: (req, res, next) => {
    return res.json({ players, items, colliders });
  },
};
