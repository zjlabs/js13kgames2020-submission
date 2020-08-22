import { renderFilledRectangle, renderFilledTriangle } from './primitive-shapes';
import { completeRender, startRender } from './render-utilities';

const triangleSidePx = 32;
const patternPaddingPx = 8;

let movementOffsetPxX = 0;
let movementOffsetPxY = 0;

const movementSpeedPx = 4;

function getMovementOffsetVector(angleRadians) {
  const x = Math.cos(angleRadians);
  const y = Math.sin(angleRadians);

  return {
    x: isNaN(x) ? 0 : x,
    y: isNaN(y) ? 0 : y,
  };
}

function getMovementOffset(angleRadians) {
  const { x, y } = getMovementOffsetVector(angleRadians);

  movementOffsetPxX += x;
  movementOffsetPxY += y;

  if (
    movementOffsetPxX >= triangleSidePx + patternPaddingPx ||
    movementOffsetPxX <= (triangleSidePx + patternPaddingPx) * -1
  ) {
    movementOffsetPxX = 0;
  }

  if (
    movementOffsetPxY >= triangleSidePx + patternPaddingPx ||
    movementOffsetPxY <= (triangleSidePx + patternPaddingPx) * -1
  ) {
    movementOffsetPxY = 0;
  }

  return {
    x: movementOffsetPxX * movementSpeedPx,
    y: movementOffsetPxY * movementSpeedPx,
  };
}

export function renderBackground(ctx, width, height, angleRadians = 0) {
  // Render solid background.
  startRender(ctx, 0, 0, 0, width, height);
  renderFilledRectangle(ctx, 0, 0, width * 2, height * 2, '#3F4656');
  completeRender(ctx);

  // Render triangle pattern.
  const { x, y } = getMovementOffset(angleRadians);

  // TODO: Figure out why the f88888888888k this works if I multiply by -8.
  for (
    let yOffset = triangleSidePx * -8 - y;
    yOffset < width + triangleSidePx;
    yOffset += triangleSidePx + patternPaddingPx
  ) {
    for (
      let xOffset = triangleSidePx * -8 - x;
      xOffset < width + triangleSidePx;
      xOffset += triangleSidePx + patternPaddingPx
    ) {
      startRender(ctx, xOffset, yOffset);
      renderFilledTriangle(ctx, 0, 0, triangleSidePx, 0, 0, triangleSidePx, '#99A3BA16');
      completeRender(ctx);

      startRender(ctx, xOffset, yOffset);
      renderFilledTriangle(ctx, triangleSidePx, 0, triangleSidePx, triangleSidePx, 0, triangleSidePx, '#6C748616');
      completeRender(ctx);
    }
  }
}
