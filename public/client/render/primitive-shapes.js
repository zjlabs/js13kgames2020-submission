export function renderLine(ctx, xPositionStart, yPositionStart, xPositionEnd, yPositionEnd, width, strokeStyle) {
  ctx.save();
  ctx.lineWidth = width;
  ctx.strokeStyle = strokeStyle;
  ctx.moveTo(xPositionStart, yPositionStart);
  ctx.lineTo(xPositionEnd, yPositionEnd);
  ctx.stroke();
  ctx.restore();
}

export function renderStrokedRectangle(ctx, xPosition, yPosition, width, height, strokeWidth, strokeStyle) {
  ctx.save();
  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = strokeStyle;
  ctx.rect(xPosition, yPosition, width, height);
  ctx.stroke();
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
