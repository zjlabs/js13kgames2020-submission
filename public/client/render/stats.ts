import { ServerStats } from '../models/server-stats';
import { ClientStats } from '../models/client-stats';

const playerXElement = document.getElementById('stats--player-x');
const playerYElement = document.getElementById('stats--player-y');
const mouseAngleElement = document.getElementById('stats--mouseangle');
const currentElementS = document.getElementById('stats--current-s');
const deltaElementS = document.getElementById('stats--delta-s');
const elapsedElementS = document.getElementById('stats--elapsed-s');
const lastElementS = document.getElementById('stats--last-s');
const sleepElementS = document.getElementById('stats--sleep-s');
const currentElementC = document.getElementById('stats--current-c');
const deltaElementC = document.getElementById('stats--delta-c');
const elapsedElementC = document.getElementById('stats--elapsed-c');
const lastElementC = document.getElementById('stats--last-c');
const sleepElementC = document.getElementById('stats--sleep-c');

export function renderPlayerCoordinatesStats(playerX: number, playerY: number) {
  playerXElement.innerHTML = `X: ${Math.round(playerX)}`;
  playerYElement.innerHTML = `Y: ${Math.round(playerY)}`;
}

export function renderPlayerMouseAngleStats(mouseAngleDegrees: number) {
  mouseAngleElement.innerHTML = `M∠: ${mouseAngleDegrees}°`;
}

export function renderServerStats({ current, delta, elapsed, last, sleep }: ServerStats) {
  currentElementS.innerHTML = `S Current: ${Math.round(current)}`;
  deltaElementS.innerHTML = `S Delta: ${Math.round(delta)}`;
  elapsedElementS.innerHTML = `S Elapsed: ${Math.round(elapsed)}`;
  lastElementS.innerHTML = `S Last: ${Math.round(last)}`;
  sleepElementS.innerHTML = `S Sleep: ${Math.round(sleep)}`;
}

export function renderClientStats(current, delta, elapsed, last, sleep) {
  currentElementC.innerHTML = `C Current: ${Math.round(current)}`;
  deltaElementC.innerHTML = `C Delta: ${Math.round(delta)}`;
  elapsedElementC.innerHTML = `C Elapsed: ${Math.round(elapsed)}`;
  lastElementC.innerHTML = `C Last: ${Math.round(last)}`;
  sleepElementC.innerHTML = `C Sleep: ${Math.round(sleep)}`;
}
