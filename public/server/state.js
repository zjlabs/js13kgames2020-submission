import { exit, error, info, debug, all } from '../shared/variables';

/**
 * The game state model
 */
const rooms = {};
const players = {};
const items = {};
const colliders = {};
let delta;

export default {
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
