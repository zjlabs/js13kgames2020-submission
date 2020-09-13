import { Player } from './models/player';
import { LeaderboardPlayer } from './models/leaderboard-player';
import { Item } from './models/items';
import { MinimapPlayer } from './models/minimap-player';

export interface State {
  colliders?: any;
  items?: Item[];
  mouseAngleDegrees: number;
  playerId?: string;
  players?: {
    [key: string]: Player;
  };
  rooms?: any;
  leaderboard: LeaderboardPlayer[];
  minimap: MinimapPlayer[];
}

let state: State = {
  mouseAngleDegrees: 0,
  leaderboard: [],
  minimap: [],
};

export function applyState(serverUpdatedState: any) {
  state.items = serverUpdatedState.items;
  state.players = serverUpdatedState.players;
}

export function applyLeaderboard(serverUpdate: any) {
  state.leaderboard = serverUpdate.leaderboard;
}

export function applyMinimap(serverUpdate: any) {
  state.minimap = serverUpdate.minimap;
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
