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

    // for (let x = xOffset - gridSize; x < ctx.canvas.width + gridSize; x += gridSize) {
    //   for (let y = yOffset - gridSize; y < ctx.canvas.height + gridSize; y += gridSize) {
    //     if (currentBlocks[`${Math.floor(x / gridSize - this.currentX + 0.01)},${Math.floor(y / gridSize - this.currentY + 0.01)}`]) {
    //       ctx.fillStyle = 'white';
    //       ctx.moveTo(x, y);
    //       ctx.fillRect(x, y, gridSize, gridSize);
    //       ctx.strokeRect(x, y, gridSize, gridSize);
    //     }
    //   }
    // }

    for (const [key, value] of Object.entries(currentBlocks)) {
      const [x, y] = key.split(',').map(Number);
      const xCoord = (x + this.currentX) * gridSize;
      const yCoord = (y + this.currentY) * gridSize;

      ctx.fillStyle = 'white';
      ctx.moveTo(xCoord, yCoord);
      ctx.fillRect(xCoord, yCoord, gridSize, gridSize);
      ctx.strokeRect(xCoord, yCoord, gridSize, gridSize);
    }

    ctx.fill();
    ctx.stroke();
  }
}

export type Map = {[key: `${number},${number}`]: boolean};