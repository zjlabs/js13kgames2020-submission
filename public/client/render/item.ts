import { renderStrokedEllipse } from './primitive-shapes';

export function renderItem(ctx, x, y, radius) {
  ctx.beginPath();
  renderStrokedEllipse(ctx, x, y, radius, radius, '#E384DD', '#E384DD99');
}
