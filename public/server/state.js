import { debug } from '../shared/variables';

class EntityState {
  constructor() {
    this.data = {};
    this.delta = {};
    this._prune = false;
  }

  get(id) {
    return this.data[id] || false;
  }

  set(entity) {
    let diff = entity.getDiff();
    this.delta[entity.id] = {
      ...(this.delta[entity.id] || {}),
      ...diff,
    };

    if (diff.active == false) {
      this._prune = true;
    }
  }

  reset() {
    Object.keys(this.delta).forEach((id) => {
      this.data[id] = {
        ...this.data[id],
        ...this.delta[id],
      };
    });

    this.delta = {};
    this.prune();
  }

  prune() {
    if (!this._prune) return;

    this._prune = false;
    Object.keys(this.data).forEach((id) => {
      if (!this.data[id].active) {
        delete this.data[id];
      }
    });
  }
}

const _players = new EntityState();
const _tiles = new EntityState();

export default {
  // IO functions
  sync(id) {
    io.to(id).emit('sync', this._data());
  },
  delta() {
    io.emit('delta', this._delta());

    // reset internal state
    _players.reset();
    _tiles.reset();
  },

  // State objs
  player: _players,
  tile: _tiles,

  // POJO functions
  _delta() {
    return {
      players: _players.delta,
      tiles: _tiles.delta,
    };
  },
  _data() {
    return {
      players: _players.data,
      tiles: _tiles.data,
    };
  },
};
