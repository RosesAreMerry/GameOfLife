//** Class responsible for drawing the infinite grid and cells */
export default class Grid {
  context: CanvasRenderingContext2D;

  currentX: number = 0;
  currentY: number = 0;
  currentZoom: number = 20;

  lastX: number = this.currentX;
  lastY: number = this.currentY;
  lastZoom: number = this.currentZoom;

  lastBlocks: Map;

  resizeLayer: CanvasRenderingContext2D;

  canvasX: number = this.currentX;
  canvasY: number = this.currentY;
  canvasZoom: number = this.currentZoom;
  canvasBlocks: Map = {};

  hiddenContext: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.hiddenContext = document.createElement('canvas').getContext('2d');
    this.hiddenContext.canvas.width = context.canvas.width;
    this.hiddenContext.canvas.height = context.canvas.height;
    this.hiddenContext.imageSmoothingEnabled = false;

    this.resizeLayer = document.createElement('canvas').getContext('2d');
    this.resizeLayer.canvas.width = context.canvas.width;
    this.resizeLayer.canvas.height = context.canvas.height;
    this.resizeLayer.imageSmoothingEnabled = false;
  }

  async draw(currentBlocks: Map) {
    this.drawGrid();
    this.drawBlocks(currentBlocks);
    this.context.drawImage(this.hiddenContext.canvas, 0, 0);
    this.lastX = this.currentX;
    this.lastY = this.currentY;
    this.lastZoom = this.currentZoom;
    this.lastBlocks = {...currentBlocks};
  }

  drawGrid(ctx = this.context) {
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

  drawBlocks(currentBlocks: Map, ctx = this.hiddenContext) {
    ctx.beginPath();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = 'white';
    let shouldSetLastCanvas = false;
    const resizeThreshold = 500;

    // find the blocks wholely represented in the resize layer
    const blocks = Object.keys(currentBlocks).filter((key: `${number},${number}`) => {
      const [x, y] = key.split(',').map(Number);
      // console.log(`x1: ${Math.ceil(this.canvasX)}, x2: ${Math.floor(this.canvasX + this.canvasZoom)}, y1: ${Math.ceil(this.canvasY)}, y2: ${Math.floor(this.canvasY + this.canvasZoom * (this.context.canvas.height / this.context.canvas.width))}`);
      // if (x > -Math.ceil(this.canvasX) && 
      //     x < -Math.floor(this.canvasX - this.canvasZoom) && 
      //     y > -Math.ceil(this.canvasY) && 
      //     y < -Math.floor(this.canvasY - this.canvasZoom * (this.context.canvas.height / this.context.canvas.width))) {
      //   // block is within the area captured by the last canvas
      //   // check to see if it is represented in the canvas.
      //   return this.canvasBlocks[key] == undefined;
      // }
      return this.canvasBlocks[key] == undefined
      return true;
    });

    if (blocks.length > 500 || 
      this.currentX - this.canvasX > resizeThreshold || 
      this.currentY - this.canvasY > resizeThreshold || 
      this.currentZoom - this.canvasZoom > resizeThreshold) {
      shouldSetLastCanvas = true;
    }
    if (blocks.length == 0) {
      this.resize();
      return;
    }

    const blocksToDraw = shouldSetLastCanvas ? Object.keys(currentBlocks) : blocks;



    const gridSize = ctx.canvas.width / this.currentZoom;

    for (const block of blocksToDraw) {
      const [x, y] = block.split(',').map(Number);
      // flooring the coords to prevent subpixel rendering
      const xCoord = Math.floor((x + this.currentX) * gridSize);
      const yCoord = Math.floor((y + this.currentY) * gridSize);
      const fGridSize = Math.ceil(gridSize);

      ctx.fillStyle = 'white';
      ctx.moveTo(xCoord, yCoord);
      ctx.fillRect(xCoord, yCoord, fGridSize, fGridSize);
    }

    if (shouldSetLastCanvas) {
      this.setLastCanvas(currentBlocks);
      this.hiddenContext.clearRect(0, 0, this.hiddenContext.canvas.width, this.hiddenContext.canvas.height);
    }

    this.resize();
  }

  // redraw canvas contents without needing to rerender the grid
  async resize(ctx = this.context) {
    const gridWidth = ctx.canvas.width / this.currentZoom;

    const dx = (this.currentX - this.canvasX) * gridWidth;
    const dy = (this.currentY - this.canvasY) * gridWidth;
    const dz = this.canvasZoom / this.currentZoom;


    const newWidth = Math.floor(ctx.canvas.width * dz);
    const newHeight = Math.floor(ctx.canvas.height * dz);

    ctx.drawImage(this.resizeLayer.canvas, dx, dy, newWidth, newHeight);
  }

  setLastCanvas(currentBlocks: Map) {
    this.resizeLayer.clearRect(0, 0, this.resizeLayer.canvas.width, this.resizeLayer.canvas.height);
    this.resizeLayer.drawImage(this.hiddenContext.canvas, 0, 0);
    this.canvasX = this.currentX;
    this.canvasY = this.currentY;
    this.canvasZoom = this.currentZoom;
    this.canvasBlocks = {...currentBlocks};
  }
}

export type Map = {[key: `${number},${number}`]: boolean};