let x = 0;
let y = 0;
let mouseAngleDegrees = 0;
let WEAPON_HEIGHT = 200;
let WEAPON_WIDTH = 5;
let WEAPON_RESOLUTION = 5;

const PRECISION = 10;
const rad = (d) => (d * Math.PI) / 180;
const sin = (d) => parseFloat(Math.sin(rad(d)).toFixed(PRECISION));
const cos = (d) => parseFloat(Math.cos(rad(d)).toFixed(PRECISION));

// get the hit box dimensions
const len = WEAPON_HEIGHT / WEAPON_RESOLUTION;
const wid = WEAPON_WIDTH;

// Drawn center origin
// starting at 0 deg
// rotate b around a, mouseAngleDegrees degrees
function getWeaponColliders() {
  let out = [];

  // get the x/y angle for the following calcs
  const c = cos(mouseAngleDegrees);
  const s = sin(mouseAngleDegrees);

  for (let i = 1; i <= WEAPON_RESOLUTION; i++) {
    let aX = x;
    let aY = y;
    let bX = x + i * len;
    let bY = y;
    let botX = c * (bX - aX) - s * (bY - aY) + aX;
    let botY = s * (bX - aX) + c * (bY - aY) + aY;

    out.push([botX, botY]);
  }

  return out;
}

function collidersToRects(colliders) {
  const wid = WEAPON_WIDTH;
  let lastX = 0;
  let lastY = 0;

  let out = [];
  colliders.forEach((c) => {
    let [x, y] = c;

    let dx = x - lastX;
    let dy = y - lastY;
    // horizontal line
    if (dy === 0) {
    }
    // vertical line
    if (dx === 0) {
    }

    out.push();
  });
  return out;
}

console.log(getWeaponColliders());
