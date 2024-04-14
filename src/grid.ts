//** Class responsible for drawing the infinite grid and cells */
export default class Grid {
  context: CanvasRenderingContext2D;

  currentX: number = 0;
  currentY: number = 0;
  currentZoom: number = 20;

  lastX: number = this.currentX;
  lastY: number = this.currentY;
  lastZoom: number = this.currentZoom;

  lastBlocks: Map = {};

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  draw(currentBlocks: Map) {
    if (this.currentX === this.lastX && this.currentY === this.lastY && this.currentZoom === this.lastZoom && currentBlocks === this.lastBlocks) {
      return;
    }
    this.drawGrid();
    this.drawBlocks(currentBlocks);
  }

  drawGrid() {
    const ctx = this.context;
    // clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = 'grey';
    ctx.lineWidth = 20 / this.currentZoom;

    
    // the width of each grid cell
    const gridSize = ctx.canvas.width / this.currentZoom;

    const xOffset = (this.currentX % 1) * gridSize;
    const yOffset = (this.currentY % 1) * gridSize;

    for (let x = xOffset; x < ctx.canvas.width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);

    }
    for (let y = yOffset; y < ctx.canvas.height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
    }
    ctx.stroke();
  }

  drawBlocks(currentBlocks: Map) {
    const ctx = this.context;

    ctx.beginPath();
    ctx.strokeStyle = 'white';

    const gridSize = ctx.canvas.width / this.currentZoom;

    // Blocks shouldn't have grid lines around them, so we need to expand the blocks by a little bit
    const bloom = (25 / this.currentZoom);

    for (const key of Object.keys(currentBlocks)) {
      const [gridX, gridY] = key.split(',').map(Number);
      const [screenX, screenY] = this.getScreenCoord(gridX, gridY);

      ctx.fillStyle = 'white';
      ctx.moveTo(screenX, screenY);
      ctx.fillRect(screenX - bloom, screenY - bloom, gridSize +  2 * bloom, gridSize + 2 * bloom);
    }

    ctx.fill();
  }

  /**
   * A function that takes screen coordinates and returns the grid coordinates that the screen coordinates are in.
   * @param screenX The x coordinate relative to the canvas
   * @param screenY The y coordinate relative to the canvas
   * @returns The x and y coordinates of the grid cell that the screen coordinates are in.
   */ 
  getGridCoord(screenX: number, screenY: number): [number, number] {
    const gridSize = this.context.canvas.width / this.currentZoom;

    const xBlock = Math.floor((screenX / gridSize - this.currentX + 0.01));
    const yBlock = Math.floor((screenY / gridSize - this.currentY + 0.01));

    return [xBlock, yBlock];
  }

  /**
   * A function that takes grid coordinates and returns the screen coordinates that the grid coordinates are in.
   * @param x The x coordinate of the grid cell
   * @param y The y coordinate of the grid cell
   * @returns The x and y coordinates of the screen cell that the grid coordinates are in.
   */
  getScreenCoord(gridX: number, gridY: number): [number, number] {
    const gridSize = this.context.canvas.width / this.currentZoom;

    const xCoord = (gridX + this.currentX) * gridSize;
    const yCoord = (gridY + this.currentY) * gridSize;

    return [xCoord, yCoord];
  }
}

export type Map = {[key: `${number},${number}`]: boolean};