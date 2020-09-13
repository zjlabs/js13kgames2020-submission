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

// Spawn items.

// Break the map into quadrants to assure a semi-even distribution.
const quadrant1XMin = 0;
const quadrant1XMax = WORLD_WIDTH / 2;
const quadrant1YMin = 0;
const quadrant1YMax = WORLD_HEIGHT / 2;

const quadrant2XMin = WORLD_WIDTH / 2;
const quadrant2XMax = WORLD_WIDTH;
const quadrant2YMin = 0;
const quadrant2YMax = WORLD_HEIGHT / 2;

const quadrant3XMin = 0;
const quadrant3XMax = WORLD_WIDTH / 2;
const quadrant3YMin = WORLD_HEIGHT / 2;
const quadrant3YMax = WORLD_HEIGHT;

const quadrant4XMin = WORLD_WIDTH / 2;
const quadrant4XMax = WORLD_WIDTH;
const quadrant4YMin = WORLD_HEIGHT / 2;
const quadrant4YMax = WORLD_HEIGHT;

const renderItemsForQuadrant = (quadrantXMin, quadrantXMax, quadrantYMin, quadrantYMax, itemCount, renderCallback) => {
  for (let i = 0; i < itemCount; i++) {
    const x = rand(quadrantXMin, quadrantXMax);
    const y = rand(quadrantYMin, quadrantYMax);
    renderCallback(x, y);
  }
};

renderItemsForQuadrant(
  quadrant1XMin,
  quadrant1XMax,
  quadrant1YMin,
  quadrant1YMax,
  ITEM_INITIAL_SPAWN_COUNT_HEALTH,
  (x, y) => {
    game.addComponent(new Life(x, y));
  }
);

renderItemsForQuadrant(
  quadrant1XMin,
  quadrant1XMax,
  quadrant1YMin,
  quadrant1YMax,
  ITEM_INITIAL_SPAWN_COUNT_HELM,
  (x, y) => {
    game.addComponent(new Helm(x, y));
  }
);

renderItemsForQuadrant(
  quadrant1XMin,
  quadrant1XMax,
  quadrant1YMin,
  quadrant1YMax,
  ITEM_INITIAL_SPAWN_COUNT_ARMOR,
  (x, y) => {
    game.addComponent(new Armor(x, y));
  }
);

renderItemsForQuadrant(
  quadrant1XMin,
  quadrant1XMax,
  quadrant1YMin,
  quadrant1YMax,
  ITEM_INITIAL_SPAWN_COUNT_SWORD,
  (x, y) => {
    game.addComponent(new Sword(x, y));
  }
);

renderItemsForQuadrant(
  quadrant2XMin,
  quadrant2XMax,
  quadrant2YMin,
  quadrant2YMax,
  ITEM_INITIAL_SPAWN_COUNT_HEALTH,
  (x, y) => {
    game.addComponent(new Life(x, y));
  }
);

renderItemsForQuadrant(
  quadrant2XMin,
  quadrant2XMax,
  quadrant2YMin,
  quadrant2YMax,
  ITEM_INITIAL_SPAWN_COUNT_HELM,
  (x, y) => {
    game.addComponent(new Helm(x, y));
  }
);

renderItemsForQuadrant(
  quadrant2XMin,
  quadrant2XMax,
  quadrant2YMin,
  quadrant2YMax,
  ITEM_INITIAL_SPAWN_COUNT_ARMOR,
  (x, y) => {
    game.addComponent(new Armor(x, y));
  }
);

renderItemsForQuadrant(
  quadrant2XMin,
  quadrant2XMax,
  quadrant2YMin,
  quadrant2YMax,
  ITEM_INITIAL_SPAWN_COUNT_SWORD,
  (x, y) => {
    game.addComponent(new Sword(x, y));
  }
);

renderItemsForQuadrant(
  quadrant3XMin,
  quadrant3XMax,
  quadrant3YMin,
  quadrant3YMax,
  ITEM_INITIAL_SPAWN_COUNT_HEALTH,
  (x, y) => {
    game.addComponent(new Life(x, y));
  }
);

renderItemsForQuadrant(
  quadrant3XMin,
  quadrant3XMax,
  quadrant3YMin,
  quadrant3YMax,
  ITEM_INITIAL_SPAWN_COUNT_HELM,
  (x, y) => {
    game.addComponent(new Helm(x, y));
  }
);

renderItemsForQuadrant(
  quadrant3XMin,
  quadrant3XMax,
  quadrant3YMin,
  quadrant3YMax,
  ITEM_INITIAL_SPAWN_COUNT_ARMOR,
  (x, y) => {
    game.addComponent(new Armor(x, y));
  }
);

renderItemsForQuadrant(
  quadrant3XMin,
  quadrant3XMax,
  quadrant3YMin,
  quadrant3YMax,
  ITEM_INITIAL_SPAWN_COUNT_SWORD,
  (x, y) => {
    game.addComponent(new Sword(x, y));
  }
);

renderItemsForQuadrant(
  quadrant4XMin,
  quadrant4XMax,
  quadrant4YMin,
  quadrant4YMax,
  ITEM_INITIAL_SPAWN_COUNT_HEALTH,
  (x, y) => {
    game.addComponent(new Life(x, y));
  }
);

renderItemsForQuadrant(
  quadrant4XMin,
  quadrant4XMax,
  quadrant4YMin,
  quadrant4YMax,
  ITEM_INITIAL_SPAWN_COUNT_HELM,
  (x, y) => {
    game.addComponent(new Helm(x, y));
  }
);

renderItemsForQuadrant(
  quadrant4XMin,
  quadrant4XMax,
  quadrant4YMin,
  quadrant4YMax,
  ITEM_INITIAL_SPAWN_COUNT_ARMOR,
  (x, y) => {
    game.addComponent(new Armor(x, y));
  }
);

renderItemsForQuadrant(
  quadrant4XMin,
  quadrant4XMax,
  quadrant4YMin,
  quadrant4YMax,
  ITEM_INITIAL_SPAWN_COUNT_SWORD,
  (x, y) => {
    game.addComponent(new Sword(x, y));
  }
);

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
