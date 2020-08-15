'use strict';

const DEBUG = true;
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

/**
 * Socket.IO on connect event
 * @param {Socket} socket
 */
module.exports = {
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
   * Simple dbg endpoint
   */
  state: (req, res, next) => {
    return res.json({ players, items, colliders });
  },
};
