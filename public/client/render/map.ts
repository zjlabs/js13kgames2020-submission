import { renderFilledRectangle } from './primitive-shapes';
import { WORLD_HEIGHT, WORLD_WIDTH } from '../../shared/variables';

const PLAYER_BLOCK_SIDE = 1000;

export function renderMap(
  ctx,
  width: number,
  height: number,
  playerCoordinates: { x: number; y: number },
  foeCoordinates: { x: number; y: number }[]
) {
  // Calculate a scale factor so the map takes up a small percentage of the screen;
  const xScaleFactor = (width / WORLD_WIDTH) * 0.2;
  const yScaleFactor = (height / WORLD_HEIGHT) * 0.2;
  const squareScaleFactor = xScaleFactor > yScaleFactor ? yScaleFactor : xScaleFactor;

  ctx.save();
  ctx.scale(squareScaleFactor, squareScaleFactor);

  // Render background.
  ctx.beginPath();
  renderFilledRectangle(ctx, 0, 0, WORLD_WIDTH, WORLD_HEIGHT, '#3F4656AA');
  ctx.closePath();

  // Render player.
  ctx.beginPath();
  renderFilledRectangle(
    ctx,
    playerCoordinates.x - PLAYER_BLOCK_SIDE / 2,
    playerCoordinates.y - PLAYER_BLOCK_SIDE / 2,
    PLAYER_BLOCK_SIDE,
    PLAYER_BLOCK_SIDE,
    'green'
  );
  ctx.closePath();

  // Render foes.
  foeCoordinates.forEach((foeCoordinates) => {
    ctx.beginPath();
    renderFilledRectangle(
      ctx,
      foeCoordinates.x - PLAYER_BLOCK_SIDE / 2,
      foeCoordinates.y - PLAYER_BLOCK_SIDE / 2,
      PLAYER_BLOCK_SIDE,
      PLAYER_BLOCK_SIDE,
      'red'
    );
    ctx.closePath();
  });

  ctx.restore();
}
