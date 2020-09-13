import { diff, PLAYER_BOOST_MAX_VAL, TICK_TIME } from '../shared/variables';
import { getIsBoosting, getMouseAngle } from './input';
import { renderGame } from './render/render';
import { getPlayerState } from './state';
import { sendDataAction } from './socket/actions';
import { getSocket } from './socket/socket';

let delta = 0;
let elapsed = 0;
let current = Date.now();
let last;
let sleep;
export function tick() {
  last = current;
  current = Date.now();
  delta = current - last;

  const currentPlayerState = getPlayerState();
  if (currentPlayerState != null) {
    // Game over screen.
    if (!currentPlayerState.active) {
      document.querySelector('#game-over').setAttribute('style', 'display: flex');
      return;
    }

    const updatedPlayerState = {
      ...currentPlayerState,
      isBoosting:
        ((!currentPlayerState.isBoosting && currentPlayerState.boostValue / PLAYER_BOOST_MAX_VAL > 0.1) ||
          currentPlayerState.isBoosting) &&
        getIsBoosting(),
      mouseAngleDegrees: getMouseAngle(),
    };

    const d = diff(currentPlayerState, updatedPlayerState);
    if (d != undefined) {
      // Update server with input state.
      sendDataAction(getSocket(), d);
    }
  }

  // Update the stats and wait for the next tick.
  elapsed = Date.now() - current;
  sleep = Math.max(TICK_TIME - elapsed, 0);
  setTimeout(tick, sleep);
}

export function render() {
  renderGame();
  window.requestAnimationFrame(render);
}
