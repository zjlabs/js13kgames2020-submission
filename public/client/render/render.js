import { getAngleRadiansFromDegrees } from '../math-utilities.js';
import { getState } from '../state.js';
import { renderBackground } from './background.js';
import { createCanvas } from './canvas.js';
import { renderGrid } from './grid.js';
import { renderPlayer } from './player.js';
import { clearCanvas } from './render-utilities.js';

const { ctx, width, height } = createCanvas();

export function renderGame() {
  const { mouseAngleDegrees } = getState();
  clearCanvas(ctx, width, height);

  renderBackground(ctx, width, height, getAngleRadiansFromDegrees(mouseAngleDegrees));
  renderGrid(ctx, width, height);
  renderPlayer(ctx, width / 2, height / 2, getAngleRadiansFromDegrees(mouseAngleDegrees + 90), 'red', 'black');
}
