// import { debug, WORLD_QUERY_WIDTH } from '../shared/variables';
// import { Quadtree, Rectangle } from './entities';

// class EntityState {
//   constructor() {
//     this.data = {};
//     this.delta = {};
//     this._prune = false;
//   }

//   get(id) {
//     return this.data[id] || false;
//   }

//   set(entity) {
//     let diff = entity.getDiff();
//     if (diff === undefined) return;

//     this.delta[entity.id] = {
//       ...this.delta[entity.id],
//       ...diff,
//     };

//     if (diff.active == false) {
//       this._prune = true;
//     }
//   }

//   reset() {
//     Object.keys(this.delta).forEach((id) => {
//       this.data[id] = {
//         ...this.data[id],
//         ...this.delta[id],
//       };
//     });

//     this.delta = {};
//     this.prune();
//   }

//   prune() {
//     if (!this._prune) return;

//     this._prune = false;
//     Object.keys(this.data).forEach((id) => {
//       if (!this.data[id].active) {
//         delete this.data[id];
//       }
//     });
//   }
// }

// const _players = new EntityState();
// const _items = new EntityState();

// export default {
//   // IO functions
//   sync(id, player) {
//     io.to(id).emit(
//       'sync',
//       this._data({
//         currentPlayer: {
//           id: player.id,
//         },
//       })
//     );
//   },
//   tick() {
//     // Build the tick qts
//     let playerQt = new Quadtree();
//     Object.keys(_players.data).forEach((id) => {
//       _players.data[id].colliders.forEach((c) => {
//         if (c.action != 'damage') return;
//         playerQt.insert(new Rectangle(c.x, c.y, c.w, c.h, _players.data[id]));
//       });
//     });
//     let itemQt = new Quadtree();
//     Object.keys(_items.data).forEach((id) => {
//       _items.data[id].colliders.forEach((c) => itemQt.insert(c.x, c.y, c.w, c.h, _items.data[id]));
//     });

//     // transmit the tick qt to each player based on their loc
//     Object.keys(_players.data).forEach((id) => {
//       if (!_players.data[id].active || _players.data[id].bot || !_players.data[id].socketId) return;
//       io.to(_players.data[id].socketId).emit('delta', {
//         players: playerQt
//           .query(new Rectangle(_players.data[id].x, _players.data[id].y, WORLD_QUERY_WIDTH, WORLD_QUERY_WIDTH))
//           .map((pt) => {
//             delete pt.data.socketId;
//             return pt.data;
//           }),
//         items: itemQt
//           .query(new Rectangle(_players.data[id].x, _players.data[id].y, WORLD_QUERY_WIDTH, WORLD_QUERY_WIDTH))
//           .map((pt) => pt.data),
//       });
//     });

//     // reset internal state
//     // console.log('tick', itemQt, playerQt);
//     _players.reset();
//     _items.reset();
//   },
//   // delta() {
//   //   io.emit('delta', this._delta());

//   //   // reset internal state
//   //   _players.reset();
//   //   _items.reset();
//   // },

//   // State objs
//   player: _players,
//   items: _items,

//   // POJO functions
//   _delta() {
//     return {
//       players: _players.delta,
//       items: _items.delta,
//     };
//   },
//   _data(data = {}) {
//     return {
//       ...data,
//       game: {
//         players: Object.keys(_players.data).length,
//         items: Object.keys(_items.data).length,
//       },
//       players: _players.data,
//       items: _items.data,
//     };
//   },
// };
