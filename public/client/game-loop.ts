import configuration from './configuration';
import { getMouseAngle } from './input';
import { renderGame } from './render/render';
import { getPlayerState, setPlayerStateItem } from './state';
import { sendDataAction } from './socket/actions';
import { getSocket } from './socket/socket';
import { getDiff } from './object-utilities';

// MS per game tick.
const statsFpsEl = document.getElementById('stats--fps');

export function tick() {
  const tickStart = Date.now();
  const currentPlayerState = getPlayerState();

  if (currentPlayerState != null) {
    // Update state with input state.
    setPlayerStateItem('mouseAngleDegrees', getMouseAngle());

    const updatedPlayerState = getPlayerState();

    const diff = getDiff(currentPlayerState, updatedPlayerState);

    if (diff != null) {
      // Update server with input state.
      sendDataAction(getSocket(), diff);
    }
  }

  // Wait until the next tick.
  setTimeout(tick, configuration.gameLoopTickMs - (Date.now() - tickStart));
}

let lastRenderStartMs = 1;
let renderTimes = [];

export function render() {
  const renderStartMs = Date.now();
  const renderMs = renderStartMs - lastRenderStartMs;
  lastRenderStartMs = renderStartMs;

  renderTimes.push(renderMs);

  if (renderTimes.length === 60) {
    const averageRenderTime = renderTimes.reduce((total, item) => total + item, 0) / renderTimes.length;
    statsFpsEl.innerHTML = `${Math.round(1000 / averageRenderTime)} fps`;
    renderTimes = [];
  }

  renderGame();

  window.requestAnimationFrame(render);
}
