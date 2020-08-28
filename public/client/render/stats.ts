const playerXElement = document.getElementById('stats--player-x');
const playerYElement = document.getElementById('stats--player-y');
const mouseAngleElement = document.getElementById('stats--mouseangle');

export function renderPlayerCoordinatesStats(playerX: number, playerY: number) {
  playerXElement.innerHTML = `X: ${Math.round(playerX)}`;
  playerYElement.innerHTML = `Y: ${Math.round(playerY)}`;
}

export function renderPlayerMouseAngleStats(mouseAngleDegrees: number) {
  mouseAngleElement.innerHTML = `M∠: ${mouseAngleDegrees}°`;
}
