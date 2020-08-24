import { debug } from '../shared/variables';
import { Player } from './entities';

/**
 * The game state model
 */
const rooms = {};
const players = {};
const items = {};
const colliders = {};
let delta;

export default {
  updatePlayer(socket, obj) {
    if (!players[socket.id]) {
      players[socket.id] = new Player(socket);
    }

    // update the player delta for every different key:value pair
    Object.keys(obj).forEach((key) => {
      let oldVal = players[socket.id].get(key);
      let newVal = obj[key];

      if (oldVal != newVal) {
        players[socket.id].set(key, newVal);
        delta.players[socket.id] = players[socket.id].getPojo();
      }
    });
    debug('updatePlayer', socket.id, obj, delta.players[socket.id]);
  },
  removePlayer(socket) {
    // TODO: Implement cleanup routine.
    if (players[socket.id] != null) {
      players[socket.id].set('active', false);
    }

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
    io.to(id).emit('sync', {
      rooms,
      players: Object.keys(players).reduce((acc, key) => {
        return {
          ...acc,
          [key]: players[key].getPojo(),
        };
      }, {}),
      items,
      colliders,
    });
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
