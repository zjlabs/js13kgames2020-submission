import { renderStrokedEllipse } from './primitive-shapes';

export function renderBoostButton(ctx: CanvasRenderingContext2D, x, y) {
  ctx.beginPath();
  renderStrokedEllipse(ctx, x, y, 10, 10, 'red', 'red');
  ctx.closePath();
}
