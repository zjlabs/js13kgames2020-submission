import {
  diff,
  FPS_SAMPLE_RATE,
  FPS_SAMPLES,
  PLAYER_BOOST_MAX_VAL,
  SHOW_PERFORMANCE_METRICS,
  TICK_TIME,
} from '../shared/variables';
import { getIsBoosting, getMouseAngle } from './input';
import { renderGame } from './render/render';
import { getPlayerState } from './state';
import { sendDataAction } from './socket/actions';
import { getSocket } from './socket/socket';
import { renderClientStats } from './render/stats';

// MS per game tick.
const statsFpsEl = document.getElementById('stats--fps');

let delta = 0;
let elapsed = 0;
let current = Date.now();
let last;
let sleep;
export function tick() {
  last = current;
  current = Date.now();
  delta = current - last;

  const currentPlayerState = getPlayerState();
  if (currentPlayerState != null) {
    // Game over screen.
    if (!currentPlayerState.active) {
      document.querySelector('#game-over').setAttribute('style', 'display: flex');
      return;
    }

    const updatedPlayerState = {
      ...currentPlayerState,
      isBoosting:
        ((!currentPlayerState.isBoosting && currentPlayerState.boostValue / PLAYER_BOOST_MAX_VAL > 0.1) ||
          currentPlayerState.isBoosting) &&
        getIsBoosting(),
      mouseAngleDegrees: getMouseAngle(),
    };

    const d = diff(currentPlayerState, updatedPlayerState);
    if (d != undefined) {
      // Update server with input state.
      sendDataAction(getSocket(), d);
    }
  }

  // Update the stats and wait for the next tick.
  elapsed = Date.now() - current;
  sleep = Math.max(TICK_TIME - elapsed, 0);
  renderClientStats({ current, delta, elapsed, last, sleep });
  setTimeout(tick, sleep);
}

let lastRenderStartMs = Date.now();
let renderTimes = [];
let lastRenderCalc = FPS_SAMPLE_RATE;
export function render() {
  const renderStartMs = Date.now();
  const renderMs = renderStartMs - lastRenderStartMs;
  lastRenderStartMs = renderStartMs;

  if (SHOW_PERFORMANCE_METRICS) {
    if (renderTimes.length > FPS_SAMPLES) renderTimes.shift();
    renderTimes.push(renderMs);

    lastRenderCalc -= renderMs;
    if (lastRenderCalc <= 0) {
      const averageRenderTime = renderTimes.reduce((total, item) => total + item, 0) / renderTimes.length;
      statsFpsEl.innerHTML = `${Math.round(1000 / averageRenderTime)} fps`;
      lastRenderCalc = FPS_SAMPLE_RATE;
    }
  }

  renderGame();

  window.requestAnimationFrame(render);
}
