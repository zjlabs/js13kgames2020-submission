export function renderText(
  ctx: CanvasRenderingContext2D,
  xPosition: number,
  yPosition: number,
  text: string,
  {
    fillStyle,
    font,
    globalAlpha,
    textAlign,
  }: {
    fillStyle?: string;
    font?: string;
    globalAlpha?: number;
    textAlign?: CanvasTextAlign;
  }
) {
  ctx.beginPath();
  ctx.translate(xPosition, yPosition);

  if (fillStyle) {
    ctx.fillStyle = fillStyle;
  }

  if (font) {
    ctx.font = font;
  }

  if (globalAlpha) {
    ctx.globalAlpha = globalAlpha;
  }

  if (textAlign) {
    ctx.textAlign = textAlign;
  }

  ctx.fillText(text, 0, 0);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.closePath();
}
