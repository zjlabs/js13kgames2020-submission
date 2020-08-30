import { renderBoundingBox } from './grid';
import { renderLine, renderStrokedEllipse } from './primitive-shapes';
import { completeRender, startRender } from './render-utilities';

export function renderPlayer(
  canvasContext,
  xPosition,
  yPosition,
  angleRadians,
  username: string,
  primaryColor,
  secondaryColor
) {
  startRender(canvasContext, xPosition, yPosition, angleRadians + Math.PI / 2, 60, 60);
  renderPlayerBody(canvasContext, 30, 30, 30, primaryColor, secondaryColor);
  completeRender(canvasContext);

  startRender(canvasContext, xPosition, yPosition, angleRadians + Math.PI / 2, 5, 100);
  renderPlayerSword(canvasContext, 40, 70, 100, 'rgba(0, 0, 70, 0.5');
  completeRender(canvasContext);

  startRender(canvasContext, xPosition, yPosition, angleRadians + Math.PI / 2, 40, 20);
  renderPlayerPauldron(canvasContext, -10, 10, 20, 10, primaryColor, secondaryColor);
  completeRender(canvasContext);

  startRender(canvasContext, xPosition, yPosition, angleRadians + Math.PI / 2, 40, 20);
  renderPlayerPauldron(canvasContext, 50, 10, 20, 10, primaryColor, secondaryColor);
  completeRender(canvasContext);

  startRender(canvasContext, xPosition, yPosition, angleRadians + Math.PI / 2, 30, 30);
  renderPlayerHead(canvasContext, 15, 15, 15, primaryColor, secondaryColor);
  completeRender(canvasContext);

  // Player bounding box.
  startRender(canvasContext, xPosition, yPosition, angleRadians + Math.PI / 2, 100, 100);
  renderBoundingBox(canvasContext, 0, 20, 100, 80, 'blue');
  completeRender(canvasContext);

  // Weapon bounding box.
  startRender(canvasContext, xPosition, yPosition, angleRadians + Math.PI / 2, 9, 100);
  renderBoundingBox(canvasContext, 37, -30, 46, 70, 'red');
  completeRender(canvasContext);

  // Username.
  startRender(canvasContext, xPosition, yPosition, 0);
  canvasContext.fillStyle = 'white';
  canvasContext.font = '32px sans-serif';
  canvasContext.textAlign = 'center';
  canvasContext.fillText(username, 0, 80);
  completeRender(canvasContext);
}

function renderPlayerBody(canvasContext, xPosition, yPosition, radius, fillStyle, strokeStyle) {
  renderStrokedEllipse(canvasContext, xPosition, yPosition, radius, radius, fillStyle, strokeStyle);
}

function renderPlayerHead(canvasContext, xPosition, yPosition, radius, fillStyle, strokeStyle) {
  renderStrokedEllipse(canvasContext, xPosition, yPosition, radius, radius, fillStyle, strokeStyle);
}

function renderPlayerPauldron(canvasContext, xPosition, yPosition, radiusX, radiusY, fillStyle, strokeStyle) {
  renderStrokedEllipse(canvasContext, xPosition, yPosition, radiusX, radiusY, fillStyle, strokeStyle);
}

function renderPlayerSword(canvasContext, xPosition, yPosition, length, strokeStyle) {
  const xPositionStart = xPosition;
  const yPositionStart = yPosition;
  const xPositionEnd = xPosition;
  const yPositionEnd = yPosition - length;

  const width = 1;
  renderLine(
    canvasContext,
    xPositionStart - width * 2,
    yPositionStart,
    xPositionEnd - width * 2,
    yPositionEnd + 6,
    width,
    strokeStyle
  );
  renderLine(
    canvasContext,
    xPositionStart - width,
    yPositionStart,
    xPositionEnd - width,
    yPositionEnd + 2,
    width,
    strokeStyle
  );
  renderLine(canvasContext, xPositionStart, yPositionStart, xPositionEnd, yPositionEnd, width, strokeStyle);
  renderLine(
    canvasContext,
    xPositionStart + width,
    yPositionStart,
    xPositionEnd + width,
    yPositionEnd + 2,
    width,
    strokeStyle
  );
  renderLine(
    canvasContext,
    xPositionStart + width * 2,
    yPositionStart,
    xPositionEnd + width * 2,
    yPositionEnd + 6,
    width,
    strokeStyle
  );
}
