let x = 0;
let y = 0;
let mouseAngleDegrees = 270;
let WEAPON_HEIGHT = 200;
let WEAPON_WIDTH = 5;
let WEAPON_RESOLUTION = 5;

const PRECISION = 10;
const rad = (d) => (d * Math.PI) / 180;
const sin = (d) => parseFloat(Math.sin(rad(d)).toFixed(PRECISION));
const cos = (d) => parseFloat(Math.cos(rad(d)).toFixed(PRECISION));

// Drawn center origin
// starting at 0 deg
// rotate b around a, mouseAngleDegrees degrees
function getWeaponColliders() {
  let out = [];

  // get the x/y angle for the following calcs
  const c = cos(mouseAngleDegrees);
  const s = sin(mouseAngleDegrees);

  // get the hit box dimensions
  const len = WEAPON_HEIGHT / WEAPON_RESOLUTION;
  const wid = WEAPON_WIDTH;

  for (let i = 1; i <= WEAPON_RESOLUTION; i++) {
    let aX = x;
    let bX = x + i * len;
    let aY = y;
    let bY = y;

    let outX = c * (bX - aX) - s * (bY - aY) + aX;
    let outY = s * (bX - aX) + c * (bY - aY) + aY;

    console.log(`i: ${i}`);
    console.log(`len: ${len}, wid: ${wid}`);
    console.log(`aX: ${aX}, aY: ${aY}`);
    console.log(`bX: ${bX}, bY: ${bY}`);
    console.log(`outX: ${outX}, outY: ${outY}`);
    out.push([outX, outY]);
  }

  return out;
}

console.log(getWeaponColliders());
