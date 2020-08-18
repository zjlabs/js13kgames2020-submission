export function createCanvas() {
  const rootEl = document.getElementById('root');
  const canvasEl = document.createElement('canvas');

  const rootHeight = rootEl.offsetHeight;
  const rootWidth = rootEl.offsetWidth;

  const constraint = rootHeight < rootWidth ? rootHeight : rootWidth;

  canvasEl.setAttribute('width', constraint.toString());
  canvasEl.setAttribute('height', constraint.toString());

  rootEl.append(canvasEl);

  return {
    ctx: canvasEl.getContext('2d'),
    width: constraint,
    height: constraint,
  };
}
