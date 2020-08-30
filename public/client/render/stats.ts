import { ServerStats } from '../models/server-stats';

const playerXElement = document.getElementById('stats--player-x');
const playerYElement = document.getElementById('stats--player-y');
const mouseAngleElement = document.getElementById('stats--mouseangle');
const currentElement = document.getElementById('stats--current');
const deltaElement = document.getElementById('stats--delta');
const elapsedElement = document.getElementById('stats--elapsed');
const lastElement = document.getElementById('stats--last');
const sleepElement = document.getElementById('stats--sleep');

export function renderPlayerCoordinatesStats(playerX: number, playerY: number) {
  playerXElement.innerHTML = `X: ${Math.round(playerX)}`;
  playerYElement.innerHTML = `Y: ${Math.round(playerY)}`;
}

export function renderPlayerMouseAngleStats(mouseAngleDegrees: number) {
  mouseAngleElement.innerHTML = `M∠: ${mouseAngleDegrees}°`;
}

export function renderServerStats({ current, delta, elapsed, last, sleep}: ServerStats) {
  currentElement.innerHTML = `Current: ${Math.round(current)}`;
  deltaElement.innerHTML = `Delta: ${Math.round(delta)}`;
  elapsedElement.innerHTML = `Elapsed: ${Math.round(elapsed)}`;
  lastElement.innerHTML = `Last: ${Math.round(last)}`;
  sleepElement.innerHTML = `Sleep: ${Math.round(sleep)}`;
}
