import { renderFilledRectangle, renderFilledTriangle } from './primitive-shapes';
import { completeRender, startRender } from './render-utilities';

const triangleSidePx = 64;
const patternPaddingPx = 8;

let movementOffsetPxX = 0;
let movementOffsetPxY = 0;

const movementSpeedPx = 4;

let backgroundCanvas;

export function initializeBackground(width, height) {
  backgroundCanvas = getBackgroundImageCanvas(width, height);
}

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
  const { x, y } = getMovementOffset(angleRadians);

  ctx.drawImage(backgroundCanvas, x, y);

  // // Render solid background.
  // startRender(ctx, 0, 0, 0, width, height);
  // renderFilledRectangle(ctx, 0, 0, width * 2, height * 2, '#3F4656');
  // completeRender(ctx);
  //
  // // Render triangle pattern.
  // const { x, y } = getMovementOffset(angleRadians);
  //
  // startRender(ctx);
  // renderFilledTriangle(ctx, 0, 0, triangleSidePx, 0, 0, triangleSidePx, '#99A3BA16');
  // renderFilledTriangle(ctx, triangleSidePx, 0, triangleSidePx, triangleSidePx, 0, triangleSidePx, '#6C748616');
  // completeRender(ctx);
  //
  // // TODO: Figure out why the f88888888888k this works if I multiply by -8.
  // for (
  //   let yOffset = triangleSidePx * -8 - y;
  //   yOffset < width + triangleSidePx;
  //   yOffset += triangleSidePx + patternPaddingPx
  // ) {
  //   for (
  //     let xOffset = triangleSidePx * -8 - x;
  //     xOffset < width + triangleSidePx;
  //     xOffset += triangleSidePx + patternPaddingPx
  //   ) {
  //     // ctx.save();
  //     // ctx.translate(xOffset, yOffset);
  //     // renderFilledTriangle(ctx, 0, 0, triangleSidePx, 0, 0, triangleSidePx, '#99A3BA16');
  //     // renderFilledTriangle(ctx, triangleSidePx, 0, triangleSidePx, triangleSidePx, 0, triangleSidePx, '#6C748616');
  //     // ctx.restore();
  //     //
  //     //
  //     //
  //     //
  //     // startRender(ctx, xOffset, yOffset);
  //     // completeRender(ctx);
  //     //
  //     // startRender(ctx, xOffset, yOffset);
  //     // completeRender(ctx);
  //   }
  // }
}

export function getBackgroundImageCanvas(width, height) {
  const offscreenCanvas = document.createElement('canvas');
  const offscreenCanvasWidth = width * 2;
  const offscreenCanvasHeight = height * 2;
  offscreenCanvas.width = offscreenCanvasWidth;
  offscreenCanvas.height = offscreenCanvasHeight;

  const ctx = offscreenCanvas.getContext('2d');

  // Render solid background.
  startRender(ctx, 0, 0, 0, width, height);
  renderFilledRectangle(ctx, 0, 0, width * 2, height * 2, '#3F4656');
  completeRender(ctx);

  ctx.beginPath();

  for (let yOffset = 0; yOffset < offscreenCanvasHeight; yOffset += triangleSidePx + patternPaddingPx) {
    for (let xOffset = 0; xOffset < offscreenCanvasWidth; xOffset += triangleSidePx + patternPaddingPx) {
      ctx.save();
      ctx.translate(xOffset, yOffset);
      renderFilledTriangle(ctx, 0, 0, triangleSidePx, 0, 0, triangleSidePx, '#99A3BA16');
      renderFilledTriangle(ctx, triangleSidePx, 0, triangleSidePx, triangleSidePx, 0, triangleSidePx, '#6C748616');
      ctx.restore();
    }
  }

  ctx.closePath();

  return offscreenCanvas;
}
