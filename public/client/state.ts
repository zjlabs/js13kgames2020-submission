export interface State {
  mouseAngleDegrees: number;
}

let state: State = {
  mouseAngleDegrees: 0,
};

export function getState() {
  return state;
}

export function setStateItem(key, value) {
  state = {
    ...state,
    [key]: value,
  };
}
