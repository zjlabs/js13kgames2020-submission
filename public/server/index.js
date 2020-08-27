import state from './state';
import { Game, Grid, Player } from './entities';
import { all, debug, STATS, TEST, TICK_TIME } from '../shared/variables';

/**
 * Init game
 */
const game = new Game();

/**
 * Handle incoming connections.
 */
io.on('connection', (socket) => {
  const player = state.addPlayer(socket);

  socket.on('disconnect', () => {
    debug('Disconnected', socket.id);
    state.removePlayer(socket);
  });

  socket.on('data', (obj) => {
    debug('Data', socket.id, obj);
    state.updatePlayer(socket, obj);
  });

  socket.on('play', (obj) => {
    debug('Play', socket.id);
    state.updatePlayer(socket, obj);
    state.sync(socket.id);
  });
  debug('Connected', socket.id);
  game.addComponent(player);
});

// Start the game loop
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
  game.syncState();
  game.pruneInactiveEntities();
  game.update(delta);

  // Update the stats and wait for the next tick.
  elapsed = Date.now() - current;
  sleep = Math.max(TICK_TIME - elapsed, 0);
  all('TICK');
  all('delta', delta);
  all('current', current);
  all('last', last);
  all('elapsed', elapsed);
  all('sleep', sleep);
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
module.exports = Object.assign(
  {
    // Debug endpoint for server state
    state: (req, res, next) => {
      return res.send(`<pre>${JSON.stringify(state.all(), null, 2)}</pre>`);
    },
  },
  TEST && {
    path: (req, res, next) => {
      let grid = new Grid(5, 5);

      for (let a = 0; a < grid.tiles.length; a++) {
        if (a < grid.tiles[1].length - 1) {
          grid.tiles[1][a].walk = false;
        }
      }
      let path = grid.findPath(0, 0, 2, 2);
      return res.json(path);
    },
  }
);
