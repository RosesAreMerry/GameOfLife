
interface Actions {
  pause: () => void;
  speedUp: () => void;
  slowDown: () => void;
  step: () => void;
  placeCell: (alive: boolean, x: number, y: number) => void;
  pan: (dx: number, dy: number) => void;
  zoom: (x: number, y: number, dz: number) => void;
  redraw: () => void;
}

export default class InputHandler {
  private pause: () => void;
  private speedUp: () => void;
  private slowDown: () => void;
  private step: () => void;
  private placeCell: (alive: boolean, x: number, y: number) => void;
  private pan: (dx: number, dy: number) => void;
  private zoom: (x: number, y: number, dz: number) => void;
  private redraw: () => void;

  private canvas: HTMLCanvasElement;

  private mouseIsDown: boolean = false;
  private previousMousePosition: { x: number, y: number } = null;

  constructor(
      canvas: HTMLCanvasElement,
      { pause, speedUp, slowDown, step, placeCell, pan, redraw, zoom }: Actions
    ) {
    this.canvas = canvas;
    this.pause = pause;
    this.speedUp = speedUp;
    this.slowDown = slowDown;
    this.step = step;
    this.placeCell = placeCell;
    this.pan = pan;
    this.zoom = zoom;
    this.redraw = redraw;
    canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    canvas.addEventListener('contextmenu', this.onContextMenu.bind(this));
    canvas.addEventListener('wheel', this.onWheel.bind(this));
    window.addEventListener('keydown', this.onKeyPress.bind(this));
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onMouseDown(event: MouseEvent) {
    this.mouseIsDown = true;
    if (event.buttons === 1 || event.button === 2) {
      this.placeCell(event.buttons === 1, event.clientX, event.clientY);
      this.redraw();
    }
  }

  onMouseMove(event: MouseEvent) {
    if (this.mouseIsDown) {
      if (event.buttons === 1 || event.buttons === 2) {
        this.placeCell(event.buttons === 1, event.clientX, event.clientY);
        this.redraw();
      } else if (event.buttons === 4) {
        if (this.previousMousePosition) {
          this.pan(
            event.clientX - this.previousMousePosition.x,
            event.clientY - this.previousMousePosition.y,
          );
          this.redraw();
        }
        this.previousMousePosition = { x: event.clientX, y: event.clientY };
      }
    }
  }

  onMouseUp() {
    this.mouseIsDown = false;
    this.previousMousePosition = null;
  }

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
  }

  onKeyPress(event: KeyboardEvent) {
    switch (event.key) {
      case ' ':
        this.pause();
        break;
      case 'ArrowUp':
        this.step();
        break;
      case 'ArrowRight':
        this.speedUp();
        break;
      case 'ArrowLeft':
        this.slowDown();
        break;
      case 'w':
        this.pan(0, 100);
        this.redraw();
        break;
      case 'a':
        this.pan(100, 0);
        this.redraw();
        break;
      case 's':
        this.pan(0, -100);
        this.redraw();
        break;
      case 'd':
        this.pan(-100, 0);
        this.redraw();
        break;
    }
  }

  onResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    this.redraw();
  }

  onWheel(event: WheelEvent) {
    this.zoom(event.clientX, event.clientY, event.deltaY);
    this.redraw();
  }

  
}