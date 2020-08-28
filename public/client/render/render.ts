import { getAngleRadiansFromDegrees } from '../math-utilities';
import { getPlayerState, getState } from '../state';
import { renderGrid } from './grid';
import { renderPlayer } from './player';
import { clearCanvas } from './render-utilities';
import { getCanvas } from './canvas';
import { renderBackground } from './background';
import { renderPlayerCoordinatesStats, renderPlayerMouseAngleStats } from './stats';

export function renderGame() {
  const { ctx, width, height } = getCanvas();

  if (width === 0 || height === 0) {
    return;
  }

  const playerState = getPlayerState();

  if (playerState == null) {
    return;
  }

  const { mouseAngleDegrees, x, y } = playerState;

  renderPlayerCoordinatesStats(x, y);
  renderPlayerMouseAngleStats(mouseAngleDegrees);

  clearCanvas(ctx, width, height);

  renderBackground(ctx, width, height, getAngleRadiansFromDegrees(mouseAngleDegrees));
  renderGrid(ctx, width, height);
  renderPlayer(ctx, width / 2, height / 2, getAngleRadiansFromDegrees(mouseAngleDegrees + 90), 'red', 'black');
}

let renderStatsThrottleBuffer = 0;
