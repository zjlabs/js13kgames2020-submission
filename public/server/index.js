import { Armor, Blood, Game, Helm, Life, Player, Point, Spawner, Sword } from './entities';
import {
  BOT_COUNT_MAX,
  BOT_RESPAWN_RATE,
  ITEM_INITIAL_SPAWN_COUNT_ARMOR,
  ITEM_INITIAL_SPAWN_COUNT_HEALTH,
  ITEM_INITIAL_SPAWN_COUNT_HELM,
  ITEM_INITIAL_SPAWN_COUNT_SWORD,
  rand,
  STATS_TICK,
  TICK_TIME,
  VALID_PLAYER_PROPS,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from '../shared/variables';

/**
 * Init game
 */
const game = new Game();
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

/**
 * Handle incoming connections.
 */
io.on('connection', (socket) => {
  const player = new Player(socket);

  socket.on('disconnect', () => {
    player.active = false;
  });

  socket.on('data', (obj) => {
    Object.keys(obj).forEach((key) => {
      if (VALID_PLAYER_PROPS.includes(key)) {
        player[key] = obj[key];
      }
    });
  });

  socket.on('play', (obj) => {
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
  setTimeout(tick, sleep);
};

// Start the main game loop
setTimeout(tick, TICK_TIME);

/**
 * Mount all the API endpoints
 *
 * NOTE: DO NOT make an endpoint named 'io', this is non-standard behavior.
 */
module.exports = Object.assign({
  // Debug endpoint for server state
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
});
