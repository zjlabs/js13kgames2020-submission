import { ang } from '../shared/variables';

let mouseX = 0;
let mouseY = 0;
const rootEl = document.getElementById('root');
let centerX = rootEl.offsetWidth / 2;
let centerY = rootEl.offsetHeight / 2;

document.addEventListener('mousemove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

window.addEventListener('resize', () => {
  centerX = rootEl.offsetWidth / 2;
  centerY = rootEl.offsetHeight / 2;
});

export function getMouseAngle() {
  return ang(mouseY - centerY, mouseX - centerX);
}
