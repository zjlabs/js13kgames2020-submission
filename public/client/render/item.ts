import { renderFilledRectangle, renderStrokedEllipse } from './primitive-shapes';

export function renderItem(ctx, x, y, radius) {
  ctx.beginPath();
  renderStrokedEllipse(ctx, x, y, radius, radius, '#E384DD', '#E384DD99');
  ctx.closePath();
}

export function renderBlood(ctx, x, y, width, height) {
  ctx.beginPath();
  renderStrokedEllipse(ctx, x, y, width, height, '#E384DD', '#E384DD99');
  ctx.closePath();
}

export function renderArmor(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
  const bodyWidth = width * 2 * 0.6;
  const beltHeight = bodyWidth / 5;
  const torsoHeight = bodyWidth / 5;
  const pauldronWidth = bodyWidth / 2;

  ctx.beginPath();
  renderStrokedEllipse(ctx, x, y, width, height, 'white', 'gray');
  ctx.closePath();

  // Render belt.
  ctx.beginPath();
  renderFilledRectangle(ctx, x - bodyWidth / 2, y + torsoHeight, bodyWidth, beltHeight, 'brown');
  ctx.closePath();

  // Render torso.
  ctx.beginPath();
  renderFilledRectangle(ctx, x - bodyWidth / 2, y, bodyWidth, beltHeight, 'gray');
  ctx.closePath();

  // Render body.
  ctx.beginPath();
  ctx.arc(x, y, bodyWidth / 2, Math.PI, 2 * Math.PI);
  ctx.fillStyle = 'gray';
  ctx.fill();
  ctx.closePath();

  // Render left pauldron.
  ctx.beginPath();
  ctx.arc(x - pauldronWidth, y, pauldronWidth / 2, Math.PI, 2 * Math.PI);
  ctx.fillStyle = 'gray';
  ctx.fill();
  ctx.closePath();

  // Render right pauldron.
  ctx.beginPath();
  ctx.arc(x + pauldronWidth, y, pauldronWidth / 2, Math.PI, 2 * Math.PI);
  ctx.fillStyle = 'gray';
  ctx.fill();
  ctx.closePath();
}

export function renderHealth(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
  ctx.beginPath();
  renderStrokedEllipse(ctx, x, y, width, height, 'white', 'red');
  ctx.closePath();

  ctx.beginPath();
  renderFilledRectangle(ctx, x - width * 0.8, y - height * 0.2, width * 0.8 * 2, height * 0.2 * 2, 'red');
  renderFilledRectangle(ctx, x - width * 0.2, y - height * 0.8, width * 0.2 * 2, height * 0.8 * 2, 'red');
  ctx.closePath();
}

export function renderHelm(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
  const bandHeight = height * 0.2;
  const bandTopOffset = bandHeight;
  const bandWidth = width * 2 * 0.5;
  const openingHeight = bandHeight;
  const openingWidth = bandWidth / 2;

  ctx.beginPath();
  renderStrokedEllipse(ctx, x, y, width, height, 'white', 'gray');
  ctx.closePath();

  // Render band.
  ctx.beginPath();
  renderFilledRectangle(ctx, x - bandWidth / 2, y + bandTopOffset, bandWidth, bandHeight, 'gray');
  ctx.closePath();

  // Render opening.
  ctx.beginPath();
  renderFilledRectangle(ctx, x - bandWidth / 2, y, openingWidth, openingHeight, 'gray');
  ctx.closePath();

  // Render top.
  ctx.beginPath();
  ctx.arc(x, y, bandWidth / 2, Math.PI, 2 * Math.PI);
  ctx.fillStyle = 'gray';
  ctx.fill();
  ctx.closePath();
}

export function renderSword(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
  const edgeLength = height * 0.6 * 2;
  const edgeWidth = width * 0.15;
  const guardWidth = width * 0.5;
  const gripLength = height * 0.4;

  ctx.beginPath();
  renderStrokedEllipse(ctx, x, y, width, height, 'white', 'silver');
  ctx.closePath();

  // Render blade edge.
  ctx.beginPath();
  renderFilledRectangle(ctx, x - edgeWidth / 2, y - height * 0.9, edgeWidth, edgeLength, 'silver');
  ctx.closePath();

  // Render blade guard
  ctx.beginPath();
  renderFilledRectangle(ctx, x - guardWidth / 2, y - height * 0.9 + edgeLength, guardWidth, edgeWidth, 'silver');
  ctx.closePath();

  // Render blade grip
  ctx.beginPath();
  renderFilledRectangle(
    ctx,
    x - edgeWidth / 2,
    y - height * 0.9 + edgeLength + edgeWidth,
    edgeWidth,
    gripLength,
    'brown'
  );
  ctx.closePath();
}
