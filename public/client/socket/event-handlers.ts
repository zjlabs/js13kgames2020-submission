import { SHOW_PERFORMANCE_METRICS } from '../../shared/variables';
import { applyState, setPlayerId } from '../state';
import { ServerStats } from '../models/server-stats';
import { renderServerStats } from '../render/stats';

export function registerEventHandlers(socket) {
  if (SHOW_PERFORMANCE_METRICS) {
    socket.on('stats', (serverStats: ServerStats) => {
      renderServerStats(serverStats);
    });
  }

  // Sent 1 time after initial play command is sent.
  socket.on('sync', (obj) => {
    setPlayerId(obj.currentPlayer.id);
  });

  // Sent on every server tick.
  socket.on('delta', (obj: any) => {
    applyState(obj);
  });
}
