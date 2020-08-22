export function clearCanvas(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
}

export function completeRender(ctx) {
  ctx.closePath();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

export function startRender(ctx, xTranslate = 0, yTranslate = 0, angle = 0, width = 0, height = 0) {
  const widthOffset = width / 2;
  const heightOffset = height / 2;

  ctx.beginPath();

  if (xTranslate !== 0 || yTranslate !== 0) {
    ctx.translate(xTranslate, yTranslate);
  }

  if (angle !== 0) {
    ctx.rotate(angle);
  }

  if (widthOffset !== 0 || heightOffset !== 0) {
    ctx.translate(-widthOffset, -heightOffset);
  }
}
