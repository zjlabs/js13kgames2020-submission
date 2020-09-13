import { applyLeaderboard, applyMinimap, applyState, setPlayerId } from '../state';

export function registerEventHandlers(socket) {
  // Sent 1 time after initial play command is sent.
  socket.on('sync', (obj) => {
    setPlayerId(obj.currentPlayer.id);
  });

  // Sent on every server tick.
  socket.on('delta', applyState);

  // leaderboard sent on every LEADERBOARD_UPDATE_TIME
  socket.on('leaderboard', applyLeaderboard);

  socket.on('minimap', applyMinimap);
}
