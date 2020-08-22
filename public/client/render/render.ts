import { getAngleRadiansFromDegrees } from '../math-utilities';
import { getState } from '../state';
import { renderBackground } from './background';
import { createCanvas } from './canvas';
import { renderGrid } from './grid';
import { renderPlayer } from './player';
import { clearCanvas } from './render-utilities';

const { ctx, width, height } = createCanvas();

export function renderGame() {
  const { mouseAngleDegrees } = getState();
  clearCanvas(ctx, width, height);

  renderBackground(ctx, width, height, getAngleRadiansFromDegrees(mouseAngleDegrees));
  renderGrid(ctx, width, height);
  renderPlayer(ctx, width / 2, height / 2, getAngleRadiansFromDegrees(mouseAngleDegrees + 90), 'red', 'black');
}
