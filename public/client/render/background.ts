import { renderFilledRectangle, renderFilledTriangle } from './primitive-shapes';
import { BOOST_FACTOR } from '../../shared/variables';

const triangleSidePx = 64;
const patternPaddingPx = 8;

let movementOffsetPxX = 0;
let movementOffsetPxY = 0;

const movementSpeedPx = 4 * (window.devicePixelRatio === 1 ? 1 : window.devicePixelRatio / 2);

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

function getMovementOffset(angleRadians: number, isSpeedBoosted: boolean) {
  const { x, y } = getMovementOffsetVector(angleRadians);

  const boostedSpeed = isSpeedBoosted ? movementSpeedPx * BOOST_FACTOR : movementSpeedPx;

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
    x: movementOffsetPxX * boostedSpeed * -1,
    y: movementOffsetPxY * boostedSpeed * -1,
  };
}

export function renderBackground(ctx, width, height, angleRadians = 0, isSpeedBoosted) {
  const { x, y } = getMovementOffset(angleRadians, isSpeedBoosted);

  ctx.drawImage(backgroundCanvas, ((width * 4) / 2) * -1 + x, ((height * 4) / 2) * -1 + y);
}

export function getBackgroundImageCanvas(width, height) {
  const offscreenCanvas = document.createElement('canvas');
  const offscreenCanvasWidth = width * 6;
  const offscreenCanvasHeight = height * 6;
  offscreenCanvas.width = offscreenCanvasWidth;
  offscreenCanvas.height = offscreenCanvasHeight;

  const ctx = offscreenCanvas.getContext('2d');

  // Render solid background.
  ctx.beginPath();
  renderFilledRectangle(ctx, 0, 0, offscreenCanvasWidth, offscreenCanvasHeight, '#3F4656');
  ctx.closePath();

  for (let yOffset = 0; yOffset < offscreenCanvasHeight; yOffset += triangleSidePx + patternPaddingPx) {
    for (let xOffset = 0; xOffset < offscreenCanvasWidth; xOffset += triangleSidePx + patternPaddingPx) {
      ctx.beginPath();

      ctx.save();
      ctx.translate(xOffset, yOffset);
      renderFilledTriangle(ctx, 0, 0, triangleSidePx, 0, 0, triangleSidePx, '#99A3BA16');
      renderFilledTriangle(ctx, triangleSidePx, 0, triangleSidePx, triangleSidePx, 0, triangleSidePx, '#6C748616');
      ctx.restore();

      ctx.closePath();
    }
  }

  return offscreenCanvas;
}
