import { info } from '../../shared/variables';

const rootEl = document.getElementById('root');

let memoizedCanvas: GameCanvas;

export interface GameCanvas {
  ctx: CanvasRenderingContext2D;
  el: HTMLCanvasElement;
  width: number;
  height: number;
}

function createCanvas(): GameCanvas {
  // Clear any existing canvas.
  rootEl.innerHTML = '';

  const canvasEl = document.createElement('canvas');

  const rootHeight = rootEl.offsetHeight;
  const rootWidth = rootEl.offsetWidth;

  const constraint = rootHeight < rootWidth ? rootHeight : rootWidth;

  canvasEl.setAttribute('width', constraint.toString());
  canvasEl.setAttribute('height', constraint.toString());

  rootEl.append(canvasEl);

  info('canvas created with width of', constraint, 'px and height of', constraint, 'px');

  return {
    ctx: canvasEl.getContext('2d'),
    el: canvasEl,
    width: constraint,
    height: constraint,
  };
}

export function getCanvas(): GameCanvas {
  if (memoizedCanvas == null) {
    memoizedCanvas = createCanvas();

    window.addEventListener('resize', () => {
      memoizedCanvas.el.remove();
      info('window resized - creating new canvas');
      memoizedCanvas = createCanvas();
    });
  }

  return memoizedCanvas;
}
