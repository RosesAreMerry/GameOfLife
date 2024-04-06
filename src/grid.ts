//** Class responsible for drawing the infinite grid and cells */
export default class Grid {
  context: CanvasRenderingContext2D;

  currentX: number = 0;
  currentY: number = 0;
  currentZoom: number = 20;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  draw(currentBlocks: Map) {
    //draw the grid
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

    // draw the blocks

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'white';

    for (let x = xOffset - gridSize; x < ctx.canvas.width + gridSize; x += gridSize) {
      for (let y = yOffset - gridSize; y < ctx.canvas.height + gridSize; y += gridSize) {
        ctx.moveTo(x, y);
        if (currentBlocks[`${Math.floor(x / gridSize - this.currentX + 0.01)},${Math.floor(y / gridSize - this.currentY + 0.01)}`]) {
          ctx.fillStyle = 'white';
          ctx.fillRect(x, y, gridSize, gridSize);
          ctx.strokeRect(x, y, gridSize, gridSize);
        }
      }
    }
    ctx.fill();
    ctx.stroke();
  }
}

export type Map = {[key: `${number},${number}`]: boolean};