import state from './state';
import { Game, Grid, Player, Life, Sword, Armor, Helm } from './entities';
import {
  all,
  debug,
  STATS,
  TEST,
  TICK_TIME,
  TILE_HEIGHT,
  TILE_WIDTH,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  ITEM_LIFE_HEIGHT,
  ITEM_LIFE_WIDTH,
} from '../shared/variables';

/**
 * Init game
 */
const tileH = WORLD_HEIGHT / TILE_HEIGHT;
const tileW = WORLD_WIDTH / TILE_WIDTH;
const game = new Game(new Grid(tileH, tileW));

// start testing code
let combatBot = new Player({ id: 'bot1' });
combatBot.x = WORLD_WIDTH / 2;
combatBot.y = WORLD_HEIGHT / 2;
combatBot.frozen = true;
combatBot.bot = true;
combatBot.username = 'smashmaster69x420';
combatBot.health = 69;
game.addComponent(combatBot);

let lifeCount = 5;
let lifeSpace = 20;
for (let x = 0; x < lifeCount; x++) {
  for (let y = 0; y < lifeCount; y++) {
    game.addComponent(
      new Life(
        WORLD_WIDTH / 2 + x * (ITEM_LIFE_WIDTH + lifeSpace),
        WORLD_HEIGHT / 2 + y * (ITEM_LIFE_HEIGHT + lifeSpace)
      )
    );
  }
}

game.addComponent(new Sword(WORLD_WIDTH / 2 + 50, WORLD_HEIGHT / 2));
game.addComponent(new Helm(WORLD_WIDTH / 2 + 50, WORLD_HEIGHT / 2 + 100));
game.addComponent(new Armor(WORLD_WIDTH / 2 + 50, WORLD_HEIGHT / 2 + 200));
// end testing code

/**
 * Handle incoming connections.
 */
io.on('connection', (socket) => {
  const player = new Player(socket);

  socket.on('disconnect', () => {
    debug('Disconnected', socket.id);
    player.active = false;
  });

  socket.on('data', (obj) => {
    debug('Data', socket.id, obj);
    // TODO: add field edit limitations
    Object.keys(obj).forEach((key) => {
      player.set(key, obj[key]);
    });
    state.player.set(player);
  });

  socket.on('play', (obj) => {
    debug('Play', socket.id, obj);
    // TODO: add field edit limitations
    Object.keys(obj).forEach((key) => {
      player.set(key, obj[key]);
    });
    state.player.set(player);
    state.sync(socket.id, player);
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
      return res.send(`<pre>${JSON.stringify(state._data(), null, 2)}</pre>`);
    },
    // Debug endpoint for server delta
    delta: (req, res, next) => {
      return res.send(`<pre>${JSON.stringify(state._delta(), null, 2)}</pre>`);
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
