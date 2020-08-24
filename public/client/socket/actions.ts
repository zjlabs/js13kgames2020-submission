import { Socket } from 'socket.io-client';

export interface DataAction {
  headingDegrees?: number;
  username?: string;
}

export function sendDataAction(socket: typeof Socket, dataAction: DataAction) {
  socket.emit('data', dataAction);
}

export function sendPlayAction(socket: typeof Socket, dataAction: DataAction) {
  socket.emit('play', dataAction);
}
