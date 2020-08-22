import { render, tick } from './game-loop';
import { getSocket } from './socket/socket';
import { sendPlayAction } from './socket/actions';
import { subscribeToRegistrationForm } from './registration';
import { registerEventHandlers } from './socket/event-handlers';

subscribeToRegistrationForm((username) => {
  // Start sync with server.
  const socket = getSocket();
  sendPlayAction(socket, {
    username,
  });
  registerEventHandlers(socket);

  // Kick off render cycle.
  render();

  // Kick off game cycle.
  tick();
});
