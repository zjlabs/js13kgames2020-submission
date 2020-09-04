let x = 0;
let y = 0;
let mouseAngleDegrees = 225;
let WEAPON_HEIGHT = 200;
let WEAPON_WIDTH = 5;
let WEAPON_RESOLUTION = 5;

const PRECISION = 10;
const rad = (d) => (d * Math.PI) / 180;
const sin = (d) => parseFloat(Math.sin(rad(d)).toFixed(PRECISION));
const cos = (d) => parseFloat(Math.cos(rad(d)).toFixed(PRECISION));
const min = (...i) => Math.min(...i);
const max = (...i) => Math.max(...i);
const abs = (i) => Math.abs(i);

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

// rects are drawn from bottom left to top right
// when the canvas is centered in the top left as 0,0
function collidersToRects(colliders) {
  // right
  if (mouseAngleDegrees === 0) {
    return [[x, y + WEAPON_WIDTH / 2, WEAPON_HEIGHT, WEAPON_WIDTH]];
  }
  // down
  if (mouseAngleDegrees === 90) {
    return [[x - WEAPON_WIDTH / 2, y, WEAPON_WIDTH, WEAPON_HEIGHT]];
  }
  // left
  if (mouseAngleDegrees === 180) {
    return [[x, y - WEAPON_WIDTH / 2, WEAPON_HEIGHT, WEAPON_WIDTH]];
  }
  // up
  if (mouseAngleDegrees === 270) {
    return [[x + WEAPON_WIDTH / 2, y, WEAPON_WIDTH, WEAPON_HEIGHT]];
  }

  let out = [];
  let lastX = x;
  let lastY = y;
  colliders.forEach((c, i) => {
    const [cx, cy] = c;
    const minX = min(abs(cx), abs(lastX));
    const maxX = max(abs(cx), abs(lastX));
    const minY = min(abs(cy), abs(lastY));
    const maxY = max(abs(cy), abs(lastY));
    const width = maxX - minX;
    const height = maxY - minY;

    let invertX = cx < 0;
    let invertY = cy < 0;

    console.log(i, c);
    console.log('x', minX, maxX);
    console.log('width', maxX - minX);
    console.log('y', minY, maxY);
    console.log('height', maxY - minY);

    out.push([invertX ? lastX - width : lastX, invertY ? lastY - height : lastY, width, height]);
    lastX += invertX ? -width : width;
    lastY += invertY ? -height : height;
  });
  return out;
}

console.log(collidersToRects(getWeaponColliders()));
