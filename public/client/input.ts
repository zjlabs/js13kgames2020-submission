import { ang } from '../shared/variables';

let mouseX = 0;
let mouseY = 0;
const rootEl = document.getElementById('root');
let centerX = rootEl.offsetWidth / 2;
let centerY = rootEl.offsetHeight / 2;

let isBoosting = false;

document.addEventListener('mousemove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

document.addEventListener('touchmove', (event) => {
  mouseX = event.targetTouches[0].clientX;
  mouseY = event.targetTouches[0].clientY;
});

document.addEventListener('mousedown', () => {
  // Don't respond to this event on mobile.
  if (navigator.maxTouchPoints > 1) {
    return;
  }

  isBoosting = true;
});

document.addEventListener('mouseup', () => {
  // Don't respond to this event on mobile.
  if (navigator.maxTouchPoints > 1) {
    return;
  }

  isBoosting = false;
});

window.addEventListener('resize', () => {
  centerX = rootEl.offsetWidth / 2;
  centerY = rootEl.offsetHeight / 2;
});

export function getIsBoosting() {
  const isCurrentlyBoosting = isBoosting;

  return isCurrentlyBoosting;
}

export function getMouseAngle() {
  return ang(mouseY - centerY, mouseX - centerX);
}
