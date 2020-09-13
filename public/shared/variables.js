/**
 * Whether or not to include test code
 */
export const TEST = true;

/**
 * Emit stats on tick
 */
export const STATS = true;
export const STATS_TICK = 2000;

/**
 * The current log level
 *
 *
 * 4 = fatal = exit()
 * 3 = error = error()
 * 2 = info  = info()
 * 1 = debug = debug()
 * 0 = all   = all()
 */
export const LOG_LEVEL = 2;
export const exit = (...message) => LOG_LEVEL <= 4 && console.log('fatal', ...message);
export const error = (...message) => LOG_LEVEL <= 3 && console.log('error', ...message);
export const info = (...message) => LOG_LEVEL <= 2 && console.log('info', ...message);
export const debug = (...message) => LOG_LEVEL <= 1 && console.log('debug', ...message);
export const all = (...message) => LOG_LEVEL === 0 && console.log('all', ...message);

/**
 * Client stats debug options.
 */
export const SHOW_PERFORMANCE_METRICS = true;
export const SHOW_BOUNDING_BOXES = false;
export const SHOW_GRID = false;

/**
 * client fps settings
 */
export const FPS_SAMPLES = 10;
export const FPS_SAMPLE_RATE = 500;

/**
 * The server tick rate info
 */
export const TICK_RATE = 60;
export const TICK_TIME = 1000 / TICK_RATE;

/**
 * ASSUMPTIONS
 *
 * - Everything renders with 0,0 in the top left
 * - width and height are 100% of the full rendered width
 * - everything has its origin x,y in the center (1/2 w and 1/2 h)
 */
export const QUADTREE_CAP = 5;
export const WORLD_HEIGHT = 30000;
export const WORLD_WIDTH = 30000;
export const WORLD_QUERY_HEIGHT = 2000;
export const WORLD_QUERY_WIDTH = 2000;

export const PLAYER_HEIGHT = 60;
export const PLAYER_WIDTH = 100;
export const PLAYER_REVERSE_VELOCITY = 2;
export const PLAYER_REVERSE_DIST = 100;
export const PLAYER_REVERSE_SPREAD = 20;
export const PLAYER_MAX_HEALTH = 100;
export const PLAYER_XP_LEVEL = 1000;
export const PLAYER_XP_ON_KILL = 1000;
export const PLAYER_LIFE_SPAWN_RATE = 250;
export const PLAYER_BOOST_MAX_VAL = 3000;
export const PLAYER_BOOST_REGEN_VAL = 4;
export const PLAYER_HIT_BLOOD_DROP_CHANCE_PERCENT_INVERSE = 10;
export const PLAYER_DEATH_HEALTH_ORB_SPAWN = 8;
export const PLAYER_DEATH_HEALTH_ORB_SPAWN_OFFSET = 150;
export const PLAYER_DEATH_BLOOD_SPAWN = 5;
export const PLAYER_DEATH_BLOOD_SPAWN_OFFSET_MIN = 25;
export const PLAYER_DEATH_BLOOD_SPAWN_OFFSET_MAX = 200;
export const PLAYER_LOC_MEM = 2 * parseInt(TICK_TIME);
export const WEAPON_HEIGHT = 200;
export const WEAPON_WIDTH = 5;
export const WEAPON_RESOLUTION = 5;
export const WEAPON_Y_OFFSET = (3 / 4) * (PLAYER_WIDTH / 2);
export const WEAPON_X_OFFSET = 0;
export const WEAPON_DAMAGE = 2;
export const WEAPON_DAMAGE_SWORD = 3;
export const WEAPON_DAMAGE_REDUCTION_HELM = 0.5;
export const WEAPON_DAMAGE_REDUCTION_ARMOR = 1;
export const TILE_HEIGHT = 50;
export const TILE_WIDTH = 50;

// Leaderboard vars
export const LEADERBOARD_UPDATE_TIME = 5000;
export const LEADERBOARD_COUNT = 10;
export const LEADERBOARD_PROPS = ['id', 'username', 'xp', 'level'];

// Item vars
export const ITEM_TYPES = {
  life: 0,
  0: 'life',
  sword: 1,
  1: 'sword',
  helm: 2,
  2: 'helm',
  armor: 3,
  3: 'armor',
  blood: 4,
  4: 'blood',
};
export const ITEM_LIFE_HEIGHT = 10;
export const ITEM_LIFE_WIDTH = 10;
export const ITEM_LIFE_VALUE = 10;
export const ITEM_LIFE_VALUE_MAX = 20;
export const ITEM_SWORD_HEIGHT = 20;
export const ITEM_SWORD_WIDTH = 20;
export const ITEM_HELM_HEIGHT = 20;
export const ITEM_HELM_WIDTH = 20;
export const ITEM_ARMOR_HEIGHT = 20;
export const ITEM_ARMOR_WIDTH = 20;
export const ITEM_BLOOD_WIDTH = 20;
export const ITEM_BLOOD_HEIGHT = 20;

// Items to spawn per quadrant.
export const ITEM_INITIAL_SPAWN_COUNT_HEALTH = 30;
export const ITEM_INITIAL_SPAWN_COUNT_HELM = 5;
export const ITEM_INITIAL_SPAWN_COUNT_ARMOR = 5;
export const ITEM_INITIAL_SPAWN_COUNT_SWORD = 5;

export const BOOST_FACTOR = 1.5;

// bot utils
export const PATH_ACCURACY = 0.25;
export const WANDER_MIN = 500;
export const WANDER_MAX = 500;
export const BOT_COUNT_MAX = 50;
export const BOT_RESPAWN_RATE = 20000;

// input filters
export const VALID_PLAYER_PROPS = ['mouseAngleDegrees', 'username', 'isBoosting'];

// math utils
export const rad = (d) => (d * Math.PI) / 180;
export const sin = (d) => Math.sin(rad(d));
export const cos = (d) => Math.cos(rad(d));

// rotate bX/bY around aX/aY, angle degrees
export const rot = (angle, aX, aY, bX, bY) => {
  let c = cos(angle);
  let s = sin(angle);

  let outX = c * (bX - aX) - s * (bY - aY) + aX;
  let outY = s * (bX - aX) + c * (bY - aY) + aY;
  return [outX, outY];
};

// get the positive angle from the origin to x/y
export const ang = (y, x) => {
  const rawAngle = (Math.atan2(y, x) * 180) / Math.PI;
  return cang(rawAngle + 360);
};

// get the capped angle
export const cang = (ang) => parseInt(ang % 360);

export const rand = (min, max, int = true) => {
  min = int ? Math.ceil(min) : min;
  max = int ? Math.floor(max) : max;
  let rng = Math.random() * (max - min);
  return (int ? Math.floor(rng) : rng) + min;
};

// compare two objects recursively
// returns base with compare differences
// undefined values are not returned
export const diff = (base, compare) => {
  if (['string', 'number', 'boolean'].includes(typeof compare)) {
    return compare === base ? undefined : compare;
  }

  if (compare instanceof Array) {
    if (base && base.length == 0 && compare.length == 0) {
      return undefined;
    }

    return compare;
  }

  let temp, out;
  if (typeof compare == 'object') {
    Object.keys(compare).forEach((key) => {
      temp = base !== undefined ? diff(base[key], compare[key]) : compare[key];
      if (temp != undefined) {
        out = {
          ...out,
          [key]: temp,
        };
      }
    });
  }

  return out;
};
