import state from './state';
import { Player, Game, Grid } from './entities';
import { STATS, TEST, TICK_TIME, exit, error, info, debug, all } from '../shared/variables';

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

/**
 * Init game
 */
const game = new Game();
game.start();

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
      grid.start();

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
