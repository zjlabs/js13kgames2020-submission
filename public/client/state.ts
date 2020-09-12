import { Player } from './models/player';
import { Item } from './models/items';

export interface State {
  colliders?: any;
  items?: Item[];
  mouseAngleDegrees: number;
  playerId?: string;
  players?: {
    [key: string]: Player;
  };
  rooms?: any;
  leaderboard?: any;
}

let state: State = {
  mouseAngleDegrees: 0,
};

export function applyState(serverUpdatedState: any) {
  state.items = serverUpdatedState.items;
  state.players = serverUpdatedState.players;
}

export function applyLeaderboard(serverUpdate: any) {
  state.leaderboard = serverUpdate.leaderboard;
}

export function getState() {
  return state;
}

export function getPlayerState() {
  if (state == null || state.players == null || state.players[state.playerId] == null) {
    return null;
  }

  return state.players[state.playerId];
}

export function setPlayerId(playerId: string) {
  state = {
    ...state,
    playerId: playerId,
  };
}

export function setPlayerStateItem(key: string, value) {
  state = {
    ...state,
    players: {
      ...state.players,
      [state.playerId]: {
        ...state.players[state.playerId],
        [key]: value,
      },
    },
  };
}

// Debug functionality.
(window as any).getState = () => {
  return state;
};
