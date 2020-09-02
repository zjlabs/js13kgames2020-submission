let x = 0;
let y = 0;
let mouseAngleDegrees = 90;
let WEAPON_HEIGHT = 200;
let WEAPON_WIDTH = 5;
let WEAPON_RESOLUTION = 5;

const PRECISION = 10;
const rad = (d) => (d * Math.PI) / 180;
const sin = (d) => parseFloat(Math.sin(rad(d)).toFixed(PRECISION));
const cos = (d) => parseFloat(Math.cos(rad(d)).toFixed(PRECISION));

// Drawn center origin
// starting at 0 deg
function getWeaponColliders() {
  let out = [];

  const xOffset = 0;
  const YOffset = 0;

  // get the x/y angle for the following calcs
  const aX = cos(mouseAngleDegrees);
  const aY = sin(mouseAngleDegrees);

  // get the hit box dimensions
  const dX = WEAPON_HEIGHT / WEAPON_RESOLUTION;
  const dY = WEAPON_WIDTH;

  for (let i = 0; i < WEAPON_RESOLUTION; i++) {
    let startX = dX * i * aX;
    let endX = dX * (i + 1) * aX;

    let startY = dY * i * aY;
    let endY = dY * (i + 1) * aY;

    console.log(`i (${i}) startX (${startX}) endX (${endX}) dX (${dX}) startY (${startY}) endY (${endY}) dY (${dY})`);
    out.push([x + startX, y + startY, dX, dY]);

    // out.push([
    //   x + ((cos(mouseAngleDegrees) * WEAPON_HEIGHT) / WEAPON_RESOLUTION) * (i - 1),
    //   y + ((sin(mouseAngleDegrees) * WEAPON_WIDTH) / WEAPON_RESOLUTION) * (i - 1),

    //   x + ((cos(mouseAngleDegrees) * WEAPON_HEIGHT) / WEAPON_RESOLUTION) * i,
    //   y + ((sin(mouseAngleDegrees) * WEAPON_WIDTH) / WEAPON_RESOLUTION) * i + cos(mouseAngleDegrees) * WEAPON_WIDTH,
    // ]);
  }

  return out;
}

console.log(getWeaponColliders());
