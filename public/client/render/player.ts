import { renderFilledRectangle, renderFilledTriangle, renderStrokedEllipse } from './primitive-shapes';
import { WEAPON_HEIGHT, WEAPON_WIDTH } from '../../shared/variables';
import { Player } from '../models/player';
import { renderArmor, renderHelm, renderSword } from './item';
import { renderText } from './advanced-items';

export function renderPlayer(
  ctx,
  xPosition,
  yPosition,
  width,
  height,
  angleRadians,
  username: string,
  boostPercent: number,
  healthPercent: number,
  primaryColor,
  secondaryColor,
  level: number,
  xp: number,
  items: Player['items']
) {
  const barWidth = width * 2;
  const barHeight = 18;
  const barTextSize = barHeight - 2;
  const dataAlpha = 0.6;

  // Render body.
  ctx.beginPath();
  ctx.translate(xPosition, yPosition);
  renderPlayerBody(ctx, 0, 0, height, primaryColor, items?.armor === 1 ? '#D0D2D1' : secondaryColor);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.closePath();

  // Render sword.
  ctx.translate(xPosition, yPosition);
  ctx.rotate(angleRadians);
  renderPlayerSword(ctx, 0, width * 0.75 - WEAPON_WIDTH / 2, WEAPON_HEIGHT, items?.sword === 1 ? '#D0D2D1' : '#333333');
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // Render left pauldron.
  ctx.beginPath();
  ctx.translate(xPosition, yPosition);
  ctx.rotate(angleRadians);
  renderPlayerPauldron(
    ctx,
    0,
    -width / 2,
    height / 3,
    width / 2,
    primaryColor,
    items?.armor === 1 ? '#D0D2D1' : secondaryColor
  );
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.closePath();

  // Render right pauldron.
  ctx.beginPath();
  ctx.translate(xPosition, yPosition);
  ctx.rotate(angleRadians);
  renderPlayerPauldron(
    ctx,
    0,
    width / 2,
    height / 3,
    width / 2,
    primaryColor,
    items?.armor === 1 ? '#D0D2D1' : secondaryColor
  );
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.closePath();

  // Render head.
  ctx.beginPath();
  ctx.translate(xPosition, yPosition);
  renderPlayerHead(ctx, 0, 0, height / 2, primaryColor, items?.helm === 1 ? '#D0D2D1' : secondaryColor);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.closePath();

  const usernameTopOffset = 40;

  // Render username.
  renderText(ctx, xPosition, yPosition + height + usernameTopOffset, username, {
    globalAlpha: dataAlpha,
    fillStyle: '#FFFFDD',
    font: '24px sans-serif',
    textAlign: 'center',
  });

  const xpTopOffset = usernameTopOffset + 20;

  // Render XP.
  renderText(ctx, xPosition, yPosition + height + xpTopOffset, `Lv.${level} - ${Math.round(xp)}xp`, {
    globalAlpha: dataAlpha,
    fillStyle: '#FFFFDD',
    font: '16px sans-serif',
    textAlign: 'center',
  });

  const healthBarTopOffset = xpTopOffset + 10;

  // Render health bar base.
  ctx.beginPath();
  ctx.translate(xPosition, yPosition);
  ctx.globalAlpha = dataAlpha;
  renderFilledRectangle(ctx, barWidth / -2, height + healthBarTopOffset, barWidth, barHeight, '#EB0945');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.closePath();

  // Render health bar value.
  ctx.beginPath();
  ctx.translate(xPosition, yPosition);
  ctx.globalAlpha = dataAlpha;
  renderFilledRectangle(
    ctx,
    barWidth / -2,
    height + healthBarTopOffset,
    (barWidth * healthPercent) / 100,
    barHeight,
    '#2E9E3D'
  );
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.closePath();

  // Render health bar descriptor.
  renderText(
    ctx,
    xPosition + barWidth / -2 + 2,
    yPosition + height + healthBarTopOffset + barTextSize - (barHeight - barTextSize),
    'Health',
    {
      globalAlpha: dataAlpha,
      fillStyle: '#FFFFFF',
      font: `${barTextSize}px sans-serif`,
      textAlign: 'left',
    }
  );

  // Render health par percentage descriptor.
  renderText(
    ctx,
    xPosition + barWidth - (barTextSize * 3 + 4),
    yPosition + height + healthBarTopOffset + barTextSize - (barHeight - barTextSize),
    `${Math.round(healthPercent)}%`,
    {
      globalAlpha: dataAlpha,
      fillStyle: '#FFFFFF',
      font: `${barTextSize}px sans-serif`,
      textAlign: 'right',
    }
  );

  const boostBarTopOffset = healthBarTopOffset + 25;

  // Render boost bar base.
  ctx.beginPath();
  ctx.translate(xPosition, yPosition);
  ctx.globalAlpha = dataAlpha;
  renderFilledRectangle(ctx, barWidth / -2, height + boostBarTopOffset, barWidth, barHeight, '#FFAF24');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.closePath();

  // Render boost bar value.
  ctx.beginPath();
  ctx.translate(xPosition, yPosition);
  ctx.globalAlpha = dataAlpha;
  renderFilledRectangle(
    ctx,
    barWidth / -2,
    height + boostBarTopOffset,
    (barWidth * boostPercent) / 100,
    barHeight,
    '#004C9E'
  );
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.closePath();

  // Render boost bar descriptor.
  renderText(
    ctx,
    xPosition + barWidth / -2 + 2,
    yPosition + height + boostBarTopOffset + barTextSize - (barHeight - barTextSize),
    'Boost',
    {
      globalAlpha: dataAlpha,
      fillStyle: '#FFFFFF',
      font: `${barTextSize}px sans-serif`,
      textAlign: 'left',
    }
  );

  // Render boost par percentage descriptor.
  renderText(
    ctx,
    xPosition + barWidth - (barTextSize * 3 + 4),
    yPosition + height + boostBarTopOffset + barTextSize - (barHeight - barTextSize),
    `${boostPercent}%`,
    {
      globalAlpha: dataAlpha,
      fillStyle: '#FFFFFF',
      font: `${barTextSize}px sans-serif`,
      textAlign: 'right',
    }
  );

  const itemTopOffset = boostBarTopOffset + 35;

  // Render items.
  if (items && items.armor === 1) {
    // Render health bar value.
    ctx.beginPath();
    ctx.translate(xPosition, yPosition);
    ctx.globalAlpha = dataAlpha;
    renderArmor(ctx, -35, height + itemTopOffset, 12, 12);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.closePath();
  }

  if (items && items.helm === 1) {
    // Render health bar value.
    ctx.beginPath();
    ctx.translate(xPosition, yPosition);
    ctx.globalAlpha = dataAlpha;
    renderHelm(ctx, 0, height + itemTopOffset, 12, 12);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.closePath();
  }

  if (items && items.sword === 1) {
    // Render health bar value.
    ctx.beginPath();
    ctx.translate(xPosition, yPosition);
    ctx.globalAlpha = dataAlpha;
    renderSword(ctx, 35, height + itemTopOffset, 12, 12);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.closePath();
  }
}

function renderPlayerBody(ctx, xPosition, yPosition, radius, fillStyle, strokeStyle) {
  renderStrokedEllipse(ctx, xPosition, yPosition, radius, radius, fillStyle, strokeStyle);
}

function renderPlayerHead(ctx, xPosition, yPosition, radius, fillStyle, strokeStyle) {
  renderStrokedEllipse(ctx, xPosition, yPosition, radius, radius, fillStyle, strokeStyle);
}

function renderPlayerPauldron(ctx, xPosition, yPosition, radiusX, radiusY, fillStyle, strokeStyle) {
  renderStrokedEllipse(ctx, xPosition, yPosition, radiusX, radiusY, fillStyle, strokeStyle);
}

function renderPlayerSword(ctx, xPosition, yPosition, length, strokeStyle) {
  const edgeLength = length * 0.95;
  const pointLength = length * 0.05;
  const gripLength = length * 0.1;
  const guardWidth = length * 0.1;
  const pommelRadius = WEAPON_WIDTH;

  // Render blade edge.
  ctx.beginPath();
  renderFilledRectangle(ctx, xPosition, yPosition - WEAPON_WIDTH / 2, edgeLength, WEAPON_WIDTH, strokeStyle);
  ctx.closePath();

  // Render blade point.
  ctx.beginPath();
  renderFilledTriangle(
    ctx,
    xPosition + edgeLength,
    yPosition - WEAPON_WIDTH / 2,
    edgeLength + pointLength,
    yPosition,
    xPosition + edgeLength,
    yPosition + WEAPON_WIDTH / 2,
    strokeStyle
  );
  ctx.closePath();

  // Render blade guard
  ctx.beginPath();
  renderFilledRectangle(ctx, xPosition + guardWidth, yPosition - guardWidth / 2, WEAPON_WIDTH, guardWidth, strokeStyle);
  ctx.closePath();

  // Render blade grip
  ctx.beginPath();
  renderFilledRectangle(
    ctx,
    xPosition - gripLength,
    yPosition - WEAPON_WIDTH / 2,
    gripLength * 2,
    WEAPON_WIDTH,
    '#41270E'
  );
  ctx.closePath();

  // Render blade pommel.
  ctx.beginPath();
  renderStrokedEllipse(
    ctx,
    xPosition - gripLength - pommelRadius,
    yPosition,
    pommelRadius,
    pommelRadius,
    strokeStyle,
    strokeStyle
  );
  ctx.closePath();
}
