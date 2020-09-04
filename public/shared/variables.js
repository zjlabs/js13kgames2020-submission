/**
 * Whether or not to include test code
 */
export const TEST = true;

/**
 * Emit stats on tick
 */
export const STATS = true;

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
export const LOG_LEVEL = 1;
export const exit = (...message) => LOG_LEVEL <= 4 && console.log('fatal', ...message);
export const error = (...message) => LOG_LEVEL <= 3 && console.log('error', ...message);
export const info = (...message) => LOG_LEVEL <= 2 && console.log('info', ...message);
export const debug = (...message) => LOG_LEVEL <= 1 && console.log('debug', ...message);
export const all = (...message) => LOG_LEVEL === 0 && console.log('all', ...message);

/**
 * Client stats debug options.
 */
export const SHOW_PERFORMANCE_METRICS = true;
export const SHOW_BOUNDING_BOXES = true;
export const SHOW_GRID = false;

/**
 * The server tick rate info
 */
export const TICK_RATE = 120;
export const TICK_TIME = 1000 / TICK_RATE;

/**
 * ASSUMPTIONS
 *
 * - Everything renders with 0,0 in the top left
 * - width and height are 100% of the full rendered width
 * - everything has its origin x,y in the center (1/2 w and 1/2 h)
 */
export const WORLD_HEIGHT = 30000;
export const WORLD_WIDTH = 30000;
export const PLAYER_HEIGHT = 60;
export const PLAYER_WIDTH = 100;
export const WEAPON_HEIGHT = 200;
export const WEAPON_WIDTH = 5;
export const WEAPON_RESOLUTION = 5;
export const WEAPON_Y_OFFSET = (3 / 5) * (PLAYER_WIDTH / 2);
export const WEAPON_X_OFFSET = 10;
export const TILE_HEIGHT = 50;
export const TILE_WIDTH = 50;

// math utils
export const PRECISION = 10;
export const rad = (d) => (d * Math.PI) / 180;
export const sin = (d) => parseFloat(Math.sin(rad(d)).toFixed(PRECISION));
export const cos = (d) => parseFloat(Math.cos(rad(d)).toFixed(PRECISION));
