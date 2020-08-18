import { renderLine, renderStrokedRectangle } from './primitive-shapes.js';

export function renderBoundingBox(canvasContext, xTopLeft, yTopLeft, xBottomRight, yBottomRight, strokeStyle) {
  const strokeWidth = 1;
  const width = xBottomRight - xTopLeft;
  const height = yBottomRight - yTopLeft;

  renderStrokedRectangle(canvasContext, xTopLeft, yTopLeft, width, height, strokeWidth, strokeStyle);
}

export function renderGrid(canvasContext, width, height) {
  const numIntervals = 41; // Must be an odd number... For math.

  const widthInterval = width / numIntervals;
  const heightInterval = height / numIntervals;

  for (let widthOffset = 0; widthOffset <= width + 1; widthOffset += widthInterval) {
    canvasContext.beginPath();
    let strokeStyle =
      width / 2 - widthInterval < widthOffset && width / 2 + widthInterval > widthOffset
        ? 'rgba(255, 0, 0, 0.2)'
        : 'rgba(0, 0, 0, 0.05)';
    renderLine(canvasContext, widthOffset, 0, widthOffset, height, 1, strokeStyle);
    canvasContext.closePath();
  }

  for (let heightOffset = 0; heightOffset <= height + 1; heightOffset += heightInterval) {
    canvasContext.beginPath();
    let strokeStyle =
      height / 2 - heightInterval < heightOffset && height / 2 + heightInterval > heightOffset
        ? 'rgba(255, 0, 0, 0.2)'
        : 'rgba(0, 0, 0, 0.05)';
    renderLine(canvasContext, 0, heightOffset, width, heightOffset, 1, strokeStyle);
    canvasContext.closePath();
  }
}
