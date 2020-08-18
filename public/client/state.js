let state = {};

export function getState() {
  return state;
}

export function setStateItem(key, value) {
  state = {
    ...state,
    [key]: value,
  };
}
