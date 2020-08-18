import configuration from './configuration.js';
import { getMouseAngle } from './input.js';
import { renderGame } from './render/render.js';
import { setStateItem } from './state.js';

// MS per game tick.
const statsFpsEl = document.getElementById('stats--fps');

export function tick() {
  const tickStart = Date.now();

  // Update state with input state.
  setStateItem('mouseAngleDegrees', getMouseAngle());

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
