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
export const LOG_LEVEL = 3;
export const exit = (...message) => LOG_LEVEL >= 4 && console.log('fatal', ...message);
export const error = (...message) => LOG_LEVEL >= 3 && console.log('error', ...message);
export const info = (...message) => LOG_LEVEL >= 2 && console.log('info', ...message);
export const debug = (...message) => LOG_LEVEL >= 1 && console.log('debug', ...message);
export const all = (...message) => LOG_LEVEL >= 0 && console.log('all', ...message);

/**
 * The server tick rate info
 */
export const TICK_RATE = 10;
export const TICK_TIME = 1000 / TICK_RATE;

export const TILE_HEIGHT = 40;
export const TILE_WIDTH = 40;
