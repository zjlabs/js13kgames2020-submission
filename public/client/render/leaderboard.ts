import { Player } from '../models/player';
import { clearCanvas } from './render-utilities';
import { renderFilledRectangle } from './primitive-shapes';

// Text rendering attributes.
const textBaseOffset = 5;
const textGlobalAlpha = 0.6;
const textFillStyle = '#FFFFFF';
const textFillStylePlayer = '#2E9E3D';
const textFont = '16px sans-serif';

// Size variables.
const maxPercent = 0.4;
const maxWidth = 200;
const textOffsetIncrement = 20;

// Memoized canvas.
let leaderboardCanvas: HTMLCanvasElement;
let leaderboardCanvasWidth: number;
let leaderboardCanvasHeight: number;
let leaderboardCanvasCtx: CanvasRenderingContext2D;

// Throttle variables.
const throttleHits = 30;
let currentThrottleHit = 0;

export function renderLeaderboard(
  ctx: CanvasRenderingContext2D,
  displayWidth: number,
  displayHeight: number,
  players: { [id: string]: Player },
  currentPlayerId: string | number
) {
  if (leaderboardCanvas == null) {
    createOffscreenLeaderboardCanvas(displayWidth, displayHeight);
  }

  currentThrottleHit += 1;

  if (currentThrottleHit > throttleHits) {
    updateOffscreenLeaderboardCanvas(players, currentPlayerId);
    currentThrottleHit = 0;
  }

  ctx.drawImage(leaderboardCanvas, displayWidth - leaderboardCanvasWidth, 0);
}

function updateOffscreenLeaderboardCanvas(players: { [id: string]: Player }, currentPlayerId: string | number) {
  const ctx = leaderboardCanvasCtx;

  clearCanvas(ctx, leaderboardCanvasWidth, leaderboardCanvasHeight);

  const playersArray = Object.values(players);
  const filteredPlayers = playersArray.filter(
    (player: Player) => player?.xp != null && player?.username != null && player?.username !== ''
  );
  const sortedPlayers = filteredPlayers.sort((a: Player, b: Player) => {
    if (a.xp === b.xp) {
      return 0;
    }

    if (a.xp < b.xp) {
      return 1;
    }

    return -1;
  });

  // Render solid background.
  ctx.beginPath();
  renderFilledRectangle(
    ctx,
    0,
    0,
    leaderboardCanvasWidth,
    sortedPlayers.length * textOffsetIncrement * 3 + textOffsetIncrement * 2,
    '#3F4656AA'
  );
  ctx.closePath();

  // Render heading.
  ctx.beginPath();
  ctx.translate(textBaseOffset, textOffsetIncrement);
  ctx.fillStyle = textFillStyle;
  ctx.font = textFont;
  ctx.globalAlpha = textGlobalAlpha;
  ctx.fillText('Leaderboard:', 0, 0);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.closePath();

  // Render players.
  let textOffset = textOffsetIncrement * 3;
  sortedPlayers.forEach((player: Player, index: number) => {
    ctx.beginPath();
    ctx.translate(textBaseOffset, textOffset);
    ctx.fillStyle = player.id === currentPlayerId ? textFillStylePlayer : textFillStyle;
    ctx.font = textFont;
    ctx.globalAlpha = textGlobalAlpha;
    ctx.fillText(`${index + 1}) ${player.username}`, 0, 0);
    ctx.fillText(`Lv.${player.level} - ${player.xp}xp`, 20, textOffsetIncrement);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.closePath();
    textOffset += textOffsetIncrement * 3;
  });
}

function createOffscreenLeaderboardCanvas(displayWidth: number, displayHeight: number) {
  leaderboardCanvas = document.createElement('canvas');
  const displayWidthPercent = displayWidth * maxPercent;
  leaderboardCanvasWidth = displayWidthPercent < maxWidth ? displayWidthPercent : maxWidth;
  leaderboardCanvasHeight = displayHeight;

  leaderboardCanvas.width = leaderboardCanvasWidth;
  leaderboardCanvas.height = leaderboardCanvasHeight;

  leaderboardCanvasCtx = leaderboardCanvas.getContext('2d');
}
