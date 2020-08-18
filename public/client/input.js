let mouseX;
let mouseY;

document.addEventListener('mousemove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

// TODO: Refactor to allow for screen size updates.
const rootEl = document.getElementById('root');
const centerX = rootEl.offsetWidth / 2;
const centerY = rootEl.offsetHeight / 2;

export function getMouseAngle() {
  const rawAngle = (Math.atan2(mouseY - centerY, mouseX - centerX) * 180) / Math.PI;
  const correctedAngle = (rawAngle + 360) % 360;
  return correctedAngle;
}
