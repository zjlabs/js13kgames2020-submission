export function renderFilledRectangle(ctx, xPosition, yPosition, width, height, fillStyle) {
  ctx.save();
  ctx.fillStyle = fillStyle;
  ctx.rect(xPosition, yPosition, width, height);
  ctx.fill();
  ctx.restore();
}

export function renderFilledTriangle(ctx, x1, y1, x2, y2, x3, y3, fillStyle) {
  ctx.save();
  ctx.fillStyle = fillStyle;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.fill();
  ctx.restore();
}

export function renderStrokedEllipse(ctx, xPosition, yPosition, radiusX, radiusY, fillStyle, strokeStyle) {
  ctx.save();
  ctx.fillStyle = fillStyle;
  ctx.strokeStyle = strokeStyle;
  ctx.ellipse(xPosition, yPosition, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
