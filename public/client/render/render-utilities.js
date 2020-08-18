export function clearCanvas(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
}

export function completeRender(ctx) {
  ctx.closePath();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

export function startRender(ctx, xTranslate = 0, yTranslate = 0, angle = 0, width, height) {
  const widthOffset = width / 2;
  const heightOffset = height / 2;

  ctx.beginPath();
  ctx.translate(xTranslate, yTranslate);
  ctx.rotate(angle);
  ctx.translate(-widthOffset, -heightOffset);
}
