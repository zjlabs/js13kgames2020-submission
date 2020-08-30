import { PLAYER_HEIGHT, PLAYER_WIDTH, WEAPON_HEIGHT, WEAPON_WIDTH } from '../../shared/variables';
import { renderBoundingBox } from './grid';
import { renderFilledRectangle, renderLine, renderStrokedEllipse } from './primitive-shapes';
import { completeRender, startRender } from './render-utilities';

const angle0OffsetRadians = Math.PI / 2;

export function renderPlayer(
  canvasContext,
  xPosition,
  yPosition,
  angleRadians,
  username: string,
  healthPercent: number,
  primaryColor,
  secondaryColor
) {
  const PLAYER_MIN_BOUND = PLAYER_HEIGHT < PLAYER_WIDTH ? PLAYER_HEIGHT : PLAYER_WIDTH;

  startRender(
    canvasContext,
    xPosition,
    yPosition,
    angleRadians + angle0OffsetRadians,
    PLAYER_MIN_BOUND,
    PLAYER_MIN_BOUND
  );
  renderPlayerBody(
    canvasContext,
    PLAYER_MIN_BOUND / 2,
    PLAYER_MIN_BOUND / 2,
    PLAYER_MIN_BOUND / 2,
    primaryColor,
    secondaryColor
  );
  completeRender(canvasContext);

  startRender(canvasContext, xPosition, yPosition, angleRadians + angle0OffsetRadians, WEAPON_WIDTH, WEAPON_HEIGHT);
  renderPlayerSword(canvasContext, PLAYER_WIDTH * 0.4, PLAYER_HEIGHT * 2, WEAPON_HEIGHT, 'rgba(0, 0, 70, 0.5)');
  completeRender(canvasContext);

  startRender(
    canvasContext,
    xPosition,
    yPosition,
    angleRadians + angle0OffsetRadians,
    (PLAYER_WIDTH / 5) * 2,
    (PLAYER_HEIGHT / 6) * 2
  );
  renderPlayerPauldron(
    canvasContext,
    PLAYER_WIDTH / 5 - PLAYER_MIN_BOUND / 2,
    PLAYER_MIN_BOUND / 6,
    PLAYER_WIDTH / 5,
    PLAYER_HEIGHT / 6,
    primaryColor,
    secondaryColor
  );
  completeRender(canvasContext);

  startRender(
    canvasContext,
    xPosition,
    yPosition,
    angleRadians + angle0OffsetRadians,
    (PLAYER_WIDTH / 5) * 2,
    (PLAYER_HEIGHT / 6) * 2
  );
  renderPlayerPauldron(
    canvasContext,
    PLAYER_WIDTH - PLAYER_MIN_BOUND / 2 - PLAYER_WIDTH / 5,
    PLAYER_MIN_BOUND / 6,
    PLAYER_WIDTH / 5,
    PLAYER_HEIGHT / 6,
    primaryColor,
    secondaryColor
  );
  completeRender(canvasContext);

  startRender(
    canvasContext,
    xPosition,
    yPosition,
    angleRadians + angle0OffsetRadians,
    PLAYER_MIN_BOUND / 2,
    PLAYER_MIN_BOUND / 2
  );
  renderPlayerHead(
    canvasContext,
    PLAYER_MIN_BOUND / 4,
    PLAYER_MIN_BOUND / 4,
    PLAYER_MIN_BOUND / 4,
    primaryColor,
    secondaryColor
  );
  completeRender(canvasContext);

  // Player bounding box.
  startRender(canvasContext, xPosition, yPosition, angleRadians + angle0OffsetRadians, PLAYER_WIDTH, PLAYER_HEIGHT);
  renderBoundingBox(canvasContext, 0, 0, PLAYER_WIDTH, PLAYER_HEIGHT, 'blue');
  completeRender(canvasContext);

  // Weapon bounding box.
  startRender(canvasContext, xPosition, yPosition, angleRadians + angle0OffsetRadians, 9, 100);
  renderBoundingBox(
    canvasContext,
    PLAYER_WIDTH * 0.4 + WEAPON_WIDTH,
    WEAPON_HEIGHT * 0.65 * -1,
    PLAYER_WIDTH * 0.4,
    PLAYER_HEIGHT + PLAYER_HEIGHT / 6,
    'red'
  );
  completeRender(canvasContext);

  // Username.
  startRender(canvasContext, xPosition, yPosition, 0);
  canvasContext.fillStyle = '#FFFFFFDD';
  canvasContext.font = '24px sans-serif';
  canvasContext.textAlign = 'center';
  canvasContext.fillText(username, 0, PLAYER_HEIGHT + 20);
  completeRender(canvasContext);

  // Health.
  startRender(canvasContext, xPosition, yPosition, 0);
  renderFilledRectangle(canvasContext, PLAYER_WIDTH / -2, PLAYER_HEIGHT + 30, PLAYER_WIDTH, 10, '#F07F5C');
  completeRender(canvasContext);
  startRender(canvasContext, xPosition, yPosition, 0);
  renderFilledRectangle(canvasContext, PLAYER_WIDTH / -2, PLAYER_HEIGHT + 30, healthPercent, 10, '#89F026');
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
