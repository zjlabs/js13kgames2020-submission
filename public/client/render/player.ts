import { renderFilledRectangle, renderFilledTriangle, renderStrokedEllipse } from './primitive-shapes';
import { WEAPON_HEIGHT, WEAPON_WIDTH } from '../../shared/variables';
import { Player } from '../models/player';
import { renderArmor, renderHelm, renderSword } from './item';

export function renderPlayer(
  ctx,
  xPosition,
  yPosition,
  width,
  height,
  angleRadians,
  username: string,
  healthPercent: number,
  primaryColor,
  secondaryColor,
  items: Player['items']
) {
  // Render body.
  ctx.beginPath();
  ctx.translate(xPosition, yPosition);
  renderPlayerBody(ctx, 0, 0, height, primaryColor, secondaryColor);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.closePath();

  // Render sword.
  ctx.beginPath();
  ctx.translate(xPosition, yPosition);
  ctx.rotate(angleRadians);
  renderPlayerSword(ctx, 0, width * 0.75 - WEAPON_WIDTH / 2, WEAPON_HEIGHT, '#333333');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.closePath();

  // Render left pauldron.
  ctx.beginPath();
  ctx.translate(xPosition, yPosition);
  ctx.rotate(angleRadians);
  renderPlayerPauldron(ctx, 0, -width / 2, height / 3, width / 2, primaryColor, secondaryColor);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.closePath();

  // Render right pauldron.
  ctx.beginPath();
  ctx.translate(xPosition, yPosition);
  ctx.rotate(angleRadians);
  renderPlayerPauldron(ctx, 0, width / 2, height / 3, width / 2, primaryColor, secondaryColor);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.closePath();

  // Render head.
  ctx.beginPath();
  ctx.translate(xPosition, yPosition);
  renderPlayerHead(ctx, 0, 0, height / 2, primaryColor, secondaryColor);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.closePath();

  // Render username.
  ctx.beginPath();
  ctx.translate(xPosition, yPosition);
  ctx.fillStyle = '#FFFFFFDD';
  ctx.font = '24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(username, 0, height + 30);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.closePath();

  // Render health bar base.
  ctx.beginPath();
  ctx.translate(xPosition, yPosition);
  renderFilledRectangle(ctx, width / -2, height + 40, width, 10, '#F07F5C');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.closePath();

  // Render health bar value.
  ctx.beginPath();
  ctx.translate(xPosition, yPosition);
  renderFilledRectangle(ctx, width / -2, height + 40, (width * healthPercent) / 100, 10, '#89F026');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.closePath();

  // Render items.
  if (items && items.armor === 1) {
    // Render health bar value.
    ctx.beginPath();
    ctx.translate(xPosition, yPosition);
    renderArmor(ctx, -30, height + 70, 12, 12);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.closePath();
  }

  if (items && items.helm === 1) {
    // Render health bar value.
    ctx.beginPath();
    ctx.translate(xPosition, yPosition);
    renderHelm(ctx, 0, height + 70, 12, 12);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.closePath();
  }

  if (items && items.sword === 1) {
    // Render health bar value.
    ctx.beginPath();
    ctx.translate(xPosition, yPosition);
    renderSword(ctx, 30, height + 70, 12, 12);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
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
  renderFilledRectangle(ctx, xPosition, yPosition - WEAPON_WIDTH / 2, edgeLength, WEAPON_WIDTH, strokeStyle);

  // Render blade point.
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

  // Render blade guard
  renderFilledRectangle(ctx, xPosition + guardWidth, yPosition - guardWidth / 2, WEAPON_WIDTH, guardWidth, strokeStyle);

  // Render blade grip
  renderFilledRectangle(
    ctx,
    xPosition - gripLength,
    yPosition - WEAPON_WIDTH / 2,
    gripLength,
    WEAPON_WIDTH,
    strokeStyle
  );

  // Render blade pommel.
  renderStrokedEllipse(
    ctx,
    xPosition - gripLength - pommelRadius,
    yPosition,
    pommelRadius,
    pommelRadius,
    strokeStyle,
    strokeStyle
  );
}
