import { Player } from './models/player';

export interface State {
  colliders?: any;
  items?: any;
  mouseAngleDegrees: number;
  playerId?: string;
  players?: {
    [key: string]: Player;
  };
  rooms?: any;
}

let state: State = {
  mouseAngleDegrees: 0,
};

export function applyState(serverUpdatedState: any) {
  state = {
    ...state,
    colliders: deepMerge(state.colliders, serverUpdatedState.colliders),
    items: deepMerge(state.items, serverUpdatedState.items),
    players: deepMerge(state.players, serverUpdatedState.players),
    rooms: deepMerge(state.rooms, serverUpdatedState.rooms),
  };
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

function deepMerge(stateObj = {}, obj: any) {
  return Object.keys(obj).reduce((acc, key) => {
    const primitives = ['number', 'string', 'boolean'];

    if (primitives.includes(typeof obj[key])) {
      return {
        ...acc,
        [key]: obj[key],
      };
    }

    return {
      ...acc,
      [key]: deepMerge(stateObj[key], obj[key]),
    };
  }, stateObj);
}
