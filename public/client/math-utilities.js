export function getAngleRadiansFromDegrees(degrees) {
  return (degrees * Math.PI) / 180;
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
