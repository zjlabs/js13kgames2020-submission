import { SHOW_PERFORMANCE_METRICS, diff, FPS_SAMPLES } from '../shared/variables';
import configuration from './configuration';
import { getMouseAngle } from './input';
import { renderGame } from './render/render';
import { getPlayerState } from './state';
import { sendDataAction } from './socket/actions';
import { getSocket } from './socket/socket';
import { renderClientStats } from './render/stats';

// MS per game tick.
const statsFpsEl = document.getElementById('stats--fps');

export function tick() {
  const tickStart = Date.now();
  const currentPlayerState = getPlayerState();

  if (currentPlayerState != null) {
    // Update state with input state.
    // setPlayerStateItem('mouseAngleDegrees', getMouseAngle());
    // const updatedPlayerState = getPlayerState();

    // Game over screen.
    if (!currentPlayerState.active) {
      document.querySelector('#game-over').setAttribute('style', 'display: flex');
      return;
    }

    const updatedPlayerState = {
      ...currentPlayerState,
      mouseAngleDegrees: getMouseAngle(),
    };

    const d = diff(currentPlayerState, updatedPlayerState);
    if (d != undefined) {
      // Update server with input state.
      sendDataAction(getSocket(), d);
    }
  }

  // Wait until the next tick.
  renderClientStats(Date.now(), 0, Date.now() - tickStart, 0, configuration.gameLoopTickMs - (Date.now() - tickStart));
  setTimeout(tick, Math.max(0, configuration.gameLoopTickMs - (Date.now() - tickStart)));
}

let lastRenderStartMs = 1;
let renderTimes = [];

export function render() {
  const renderStartMs = Date.now();
  const renderMs = renderStartMs - lastRenderStartMs;
  lastRenderStartMs = renderStartMs;

  if (SHOW_PERFORMANCE_METRICS) {
    if (renderTimes.length > FPS_SAMPLES) renderTimes.shift();
    renderTimes.push(renderMs);
    const averageRenderTime = renderTimes.reduce((total, item) => total + item, 0) / renderTimes.length;
    statsFpsEl.innerHTML = `${Math.round(1000 / averageRenderTime)} fps`;
  }

  renderGame();

  window.requestAnimationFrame(render);
}
