import { debug } from '../shared/variables';
import { Player } from './entities';

/**
 * The game state model
 */
const rooms = {};
const players = {};
const tiles = {};
const items = {};
const colliders = {};
let delta;

export default {
  addPlayer(socket) {
    players[socket.id] = players[socket.id] || new Player(socket);
    return players[socket.id];
  },
  updatePlayer(socket, obj) {
    // update the player delta for every different key:value pair
    Object.keys(obj).forEach((key) => {
      let oldVal = players[socket.id].get(key);
      let newVal = obj[key];

      if (oldVal != newVal) {
        players[socket.id].set(key, newVal);
        delta.players[socket.id] = players[socket.id].getPojo();
      }
    });
    debug('updatePlayer', socket.id, players[socket.id].getPojo());
  },
  removePlayer(socket) {
    // TODO: Implement cleanup routine.
    if (players[socket.id]) {
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
    let out = [];
    Object.keys(players).forEach((id) => {
      if (players[id].get('active') == false) {
        delete players[id];
        out.push(id);
      }
    });

    return out;
  },
  sync(id) {
    debug('sync', id);
    io.to(id).emit('sync', this.all());
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
    return {
      // rooms,
      // players: Object.keys(players).reduce((acc, id) => ({ ...acc, [id]: players[id].getPojo() }), {}),
      // items,
      // colliders,
      // delta,
      temp,
    };
  },
  setTemp(obj) {
    temp = obj;
  },
  setPlayers(obj) {},
  setTiles(obj) {},
};
