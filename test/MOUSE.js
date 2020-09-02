let x = 0;
let y = 0;
let mouseAngleDegrees = 180;
let WEAPON_HEIGHT = 200;
let WEAPON_WIDTH = 5;
let WEAPON_RESOLUTION = 5;

function getWeaponColliders() {
  let out = [];

  for (let i = 1; i <= WEAPON_RESOLUTION; i++) {
    let len = (WEAPON_HEIGHT / WEAPON_RESOLUTION) * i;
    let wid = (WEAPON_WIDTH / WEAPON_RESOLUTION) * i;
    console.log('i', i, len, wid);

    out.push([
      x + ((Math.cos((mouseAngleDegrees * Math.PI) / 180) * WEAPON_HEIGHT) / WEAPON_RESOLUTION) * (i - 1),
      y + ((Math.sin((mouseAngleDegrees * Math.PI) / 180) * WEAPON_WIDTH) / WEAPON_RESOLUTION) * (i - 1),

      x + ((Math.cos((mouseAngleDegrees * Math.PI) / 180) * WEAPON_HEIGHT) / WEAPON_RESOLUTION) * i,
      y +
        ((Math.sin((mouseAngleDegrees * Math.PI) / 180) * WEAPON_WIDTH) / WEAPON_RESOLUTION) * i +
        Math.cos((mouseAngleDegrees * Math.PI) / 180) * WEAPON_WIDTH,
    ]);
  }

  return out;
}

console.log(getWeaponColliders());
