import { Armor, Blood, Game, Grid, Helm, Life, Player, Point, Spawner, Sword } from './entities';
import {
  all,
  BOT_COUNT_MAX,
  BOT_RESPAWN_RATE,
  debug,
  info,
  ITEM_INITIAL_SPAWN_COUNT_ARMOR,
  ITEM_INITIAL_SPAWN_COUNT_HEALTH,
  ITEM_INITIAL_SPAWN_COUNT_HELM,
  ITEM_INITIAL_SPAWN_COUNT_SWORD,
  rand,
  STATS,
  STATS_TICK,
  TEST,
  TICK_TIME,
  VALID_PLAYER_PROPS,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from '../shared/variables';

/**
 * Init game
 */
const game = new Game();
info('game start');

const botSpawner = new Spawner(
  BOT_COUNT_MAX,
  BOT_RESPAWN_RATE,
  (players) => players.filter((p) => p.bot).length,
  () => {
    let id = `bot${Date.now()}`;
    let p = new Player({ id });
    p.x = rand(0, WORLD_WIDTH);
    p.y = rand(0, WORLD_HEIGHT);
    p.username = id;
    p.bot = true;
    return p;
  }
);

const helmSpawner = new Spawner(
  ITEM_INITIAL_SPAWN_COUNT_HELM,
  BOT_RESPAWN_RATE,
  (players, items) => players.filter((p) => p.items && p.items.helm == 1).length + items.Helm || 0,
  () => new Helm(rand(0, WORLD_WIDTH), rand(0, WORLD_HEIGHT))
);

const swordSpawner = new Spawner(
  ITEM_INITIAL_SPAWN_COUNT_SWORD,
  BOT_RESPAWN_RATE,
  (players, items) => players.filter((p) => p.items && p.items.sword == 1).length + items.Sword || 0,
  () => new Sword(rand(0, WORLD_WIDTH), rand(0, WORLD_HEIGHT))
);

const armorSpawner = new Spawner(
  ITEM_INITIAL_SPAWN_COUNT_ARMOR,
  BOT_RESPAWN_RATE,
  (players, items) => players.filter((p) => p.items && p.items.armor == 1).length + items.Armor || 0,
  () => new Armor(rand(0, WORLD_WIDTH), rand(0, WORLD_HEIGHT))
);

const lifeSpawner = new Spawner(
  ITEM_INITIAL_SPAWN_COUNT_HEALTH,
  BOT_RESPAWN_RATE,
  (players, items) => items.Life || 0,
  () => new Life(rand(0, WORLD_WIDTH), rand(0, WORLD_HEIGHT))
);

// start testing code
let combatBot = new Player({ id: 'bot1' });
combatBot.x = WORLD_WIDTH / 2 + 300;
combatBot.y = WORLD_HEIGHT / 2;
combatBot.frozen = true;
combatBot.bot = true;
combatBot.username = 'smashmaster69x420';
combatBot.health = 69;
game.addComponent(combatBot);
game.addComponent(new Blood(WORLD_WIDTH / 2, WORLD_HEIGHT / 2));

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
let statTick = STATS_TICK;
let delta = 0;
let elapsed = 0;
let current = Date.now();
let last;
let sleep;
const tick = () => {
  last = current;
  current = Date.now();
  delta = current - last;
  statTick -= delta;

  /**
   * GAME LOGIC
   */
  game.update(delta, game, [botSpawner, helmSpawner, swordSpawner, armorSpawner, lifeSpawner]);

  // Update the stats and wait for the next tick.
  elapsed = Date.now() - current;
  sleep = Math.max(TICK_TIME - elapsed, 0);
  all('TICK');
  all('delta', delta);
  all('current', current);
  all('last', last);
  all('elapsed', elapsed);
  all('sleep', sleep);
  if (STATS && statTick <= 0) {
    io.emit('stats', { delta, current, last, elapsed, sleep });
    statTick = STATS_TICK;
  }
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
      let inactive = {};
      _components.forEach((c) => {
        types[c.constructor.name] = types[c.constructor.name] || 0;
        inactive[c.constructor.name] = inactive[c.constructor.name] || 0;

        if (c.active) types[c.constructor.name] += 1;
        else inactive[c.constructor.name] += 1;
      });
      return res.send(
        `<pre>${JSON.stringify(
          {
            components: _components.length,
            types,
            inactive,
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
