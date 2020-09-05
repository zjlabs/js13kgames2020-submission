import { Collider } from '../models/collider';
import { renderStrokedRectangle } from './primitive-shapes';

export function renderColliders(ctx: CanvasRenderingContext2D, colliders: Collider[], xOffset, yOffset) {
  if (colliders == null) {
    return;
  }

  Object.values(colliders).forEach(({ x, y, w, h, action }) => {
    let strokeStyle = action === 'weapon' ? 'green' : 'pink';

    ctx.beginPath();
    renderStrokedRectangle(ctx, x - xOffset, y - yOffset, w, h, 1, strokeStyle);
    ctx.closePath();
  });
}
