import { Game, Grid, Player, Life, Sword, Armor, Helm, Point, Spawner } from './entities';
import {
  all,
  debug,
  STATS,
  TEST,
  TICK_TIME,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  ITEM_LIFE_HEIGHT,
  ITEM_LIFE_WIDTH,
  rand,
  info,
  BOT_COUNT_MAX,
  BOT_RESPAWN_RATE,
  VALID_PLAYER_PROPS,
} from '../shared/variables';

/**
 * Init game
 */
const game = new Game();
info('game start');

// start testing code
let combatBot = new Player({ id: 'bot1' });
combatBot.x = WORLD_WIDTH / 2 + 300;
combatBot.y = WORLD_HEIGHT / 2;
combatBot.frozen = true;
combatBot.bot = true;
combatBot.username = 'smashmaster69x420';
combatBot.health = 69;
game.addComponent(combatBot);

// add random life pick ups
let lifeCount = 5;
let lifeSpace = 100;
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

// add random items
game.addComponent(new Sword(WORLD_WIDTH / 2 - 100, WORLD_HEIGHT / 2));
game.addComponent(new Helm(WORLD_WIDTH / 2 - 100, WORLD_HEIGHT / 2 + 100));
game.addComponent(new Armor(WORLD_WIDTH / 2 - 100, WORLD_HEIGHT / 2 + 200));

// add patrol bot
const halfW = WORLD_WIDTH / 2;
const halfH = WORLD_HEIGHT / 2;
let patrolBot = new Player({ id: 'bot2' });
patrolBot.x = halfW;
patrolBot.y = halfH;
patrolBot.bot = true;
patrolBot.username = 'x patrolbot x';
patrolBot.health = 69;
patrolBot.path = [
  new Point(halfW + 400, halfH - 400),
  new Point(halfW + 400, halfH + 400),
  new Point(halfW - 400, halfH + 400),
  new Point(halfW - 400, halfH - 400),
];
patrolBot.target = 0;
game.addComponent(patrolBot);

// wander bot
let wanderBot = new Player({ id: 'bot3' });
wanderBot.x = halfW;
wanderBot.y = halfH;
wanderBot.bot = true;
wanderBot.username = 'cartographer';
wanderBot.health = 69;
game.addComponent(wanderBot);

game.addComponent(
  new Spawner(BOT_COUNT_MAX, BOT_RESPAWN_RATE, () => {
    let p = new Player({ id: `bot${Date.now()}` });
    p.x = rand(0, WORLD_WIDTH);
    p.y = rand(0, WORLD_HEIGHT);
    p.bot = true;
    return p;
  })
);
// end testing code

/**
 * Handle incoming connections.
 */
io.on('connection', (socket) => {
  info('socket [connection]', socket.id);
  const player = new Player(socket);

  socket.on('disconnect', () => {
    info('socket [disconnect]', socket.id);
    player.active = false;
  });

  socket.on('data', (obj) => {
    debug('socket [data]', socket.id, obj);
    Object.keys(obj).forEach((key) => {
      if (VALID_PLAYER_PROPS.includes(key)) {
        player[key] = obj[key];
      }
    });
  });

  socket.on('play', (obj) => {
    info('socket [play]', socket.id);
    Object.keys(obj).forEach((key) => {
      if (VALID_PLAYER_PROPS.includes(key)) {
        player[key] = obj[key];
      }
    });
    io.to(socket.id).emit('sync', { currentPlayer: { id: player.id } });
  });

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
  game.update(delta, game);

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
    // TODO: Search for inactive components
    state: (req, res, next) => {
      const _components = game.getComponents();
      let types = {};
      _components.forEach((c) => {
        types[c.constructor.name] = types[c.constructor.name] || 0;
        types[c.constructor.name] += 1;
      });
      return res.send(
        `<pre>${JSON.stringify(
          {
            components: _components.length,
            types,
          },
          null,
          2
        )}</pre>`
      );
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
