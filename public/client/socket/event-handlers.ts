import { applyState, setPlayerId } from '../state';

export function registerEventHandlers(socket) {
  // Sent 1 time after initial play command is sent.
  socket.on('sync', (obj) => {
    applyState(obj);
    setPlayerId(socket.id);
  });

  // Sent on every server tick.
  socket.on('delta', (obj: any) => {
    applyState(obj);
  });
}
