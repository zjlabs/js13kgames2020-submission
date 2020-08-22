import { getAngleRadiansFromDegrees } from '../math-utilities';
import { getPlayerState } from '../state';
import { renderGrid } from './grid';
import { renderPlayer } from './player';
import { clearCanvas } from './render-utilities';
import { getCanvas } from './canvas';
import { renderBackground } from './background';

export function renderGame() {
  const { ctx, width, height } = getCanvas();
  const playerState = getPlayerState();

  if (width === 0 || height === 0) {
    return;
  }

  if (playerState == null) {
    return;
  }

  const { mouseAngleDegrees } = playerState;
  clearCanvas(ctx, width, height);

  renderBackground(ctx, width, height, getAngleRadiansFromDegrees(mouseAngleDegrees));
  renderGrid(ctx, width, height);
  renderPlayer(ctx, width / 2, height / 2, getAngleRadiansFromDegrees(mouseAngleDegrees + 90), 'red', 'black');
}
