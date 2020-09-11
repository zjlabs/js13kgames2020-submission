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
    if (diff === undefined) return;

    this.delta[entity.id] = {
      ...this.delta[entity.id],
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
const _items = new EntityState();

export default {
  // IO functions
  sync(id, player) {
    io.to(id).emit(
      'sync',
      this._data({
        currentPlayer: {
          id: player.id,
        },
      })
    );
  },
  delta() {
    io.emit('delta', this._delta());

    // reset internal state
    _players.reset();
    _items.reset();
  },

  // State objs
  player: _players,
  items: _items,

  // POJO functions
  _delta() {
    return {
      players: _players.delta,
      items: _items.delta,
    };
  },
  _data(data = {}) {
    return {
      ...data,
      game: {
        players: Object.keys(_players.data).length,
        items: Object.keys(_items.data).length,
      },
      players: _players.data,
      items: _items.data,
    };
  },
};
