import { SHOW_BOUNDING_BOXES, SHOW_GRID, SHOW_PERFORMANCE_METRICS } from '../../shared/variables';
import { getAngleRadiansFromDegrees } from '../math-utilities';
import { getPlayerState, getState } from '../state';
import { renderPlayer } from './player';
import { clearCanvas } from './render-utilities';
import { getCanvas } from './canvas';
import { renderBackground } from './background';
import { renderPlayerCoordinatesStats, renderPlayerMouseAngleStats } from './stats';
import { renderMap } from './map';
import { renderGrid } from './grid';
import { renderColliders } from './colliders';
import { Item } from '../models/items';
import { renderItem } from './item';

export function renderGame() {
  const { ctx, width, height } = getCanvas();

  if (width === 0 || height === 0) {
    return;
  }

  const state = getState();

  if (state == null) {
    return;
  }

  const playerState = getPlayerState();

  if (playerState == null) {
    return;
  }

  const { id, mouseAngleDegrees, x, y } = playerState;

  // Clear canvas.
  clearCanvas(ctx, width, height);

  // Render background.
  renderBackground(ctx, width, height, getAngleRadiansFromDegrees(mouseAngleDegrees));

  // TODO: This makes me feel like puking. Figure out how to get rid of motion sickness.
  // Render debug grid.
  if (SHOW_GRID) {
    renderGrid(ctx, width, height);
  }

  const screenCoordinate0X = x - width / 2;
  const screenCoordinate0Y = y - height / 2;

  // Render players.
  Object.keys(state.players)
    // Map the id to the player object.
    .map((key) => {
      return state.players[key];
    })
    // Filter out players outside of the screen view.
    // TODO: Use Zack's dank math machine to make this more efficient.
    .filter((player) => {
      return (
        player.x > screenCoordinate0X &&
        player.x < screenCoordinate0X + width &&
        player.y > screenCoordinate0Y &&
        player.y < screenCoordinate0Y + height
      );
    })
    // Render the foe relative to the player.
    .forEach((player) => {
      const relativeCoordinateX = player.x - screenCoordinate0X;
      const relativeCoordinateY = player.y - screenCoordinate0Y;

      if (SHOW_BOUNDING_BOXES) {
        renderColliders(ctx, player.colliders, screenCoordinate0X, screenCoordinate0Y);
      }

      renderPlayer(
        ctx,
        relativeCoordinateX,
        relativeCoordinateY,
        player.width,
        player.height,
        getAngleRadiansFromDegrees(player.mouseAngleDegrees),
        player.username,
        player.health,
        player.id === id ? '#0F9BF2' : '#F25C05',
        'black'
      );
    });

  // Render items.
  Object.keys(state.items)
    .map((key: string) => {
      return state.items[key];
    })
    // TODO: Use Zack's dank math machine to make this more efficient.
    .filter((item: Item) => {
      return (
        item.x > screenCoordinate0X &&
        item.x < screenCoordinate0X + width &&
        item.y > screenCoordinate0Y &&
        item.y < screenCoordinate0Y + height
      );
    })
    .forEach((item: Item) => {
      const relativeCoordinateX = item.x - screenCoordinate0X;
      const relativeCoordinateY = item.y - screenCoordinate0Y;

      renderItem(ctx, relativeCoordinateX, relativeCoordinateY, item.height);
    });

  // Render map.
  renderMap(
    ctx,
    width,
    height,
    { x, y },
    Object.keys(state.players)
      // Map the id to the player object.
      .map((key) => {
        return state.players[key];
      })
      .filter((player) => {
        return player.id !== id;
      })
  );

  // Render stats.
  if (SHOW_PERFORMANCE_METRICS) {
    renderPlayerCoordinatesStats(x, y);
    renderPlayerMouseAngleStats(mouseAngleDegrees);
  }
}

let renderStatsThrottleBuffer = 0;
