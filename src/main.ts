import InputHandler from "./inputHandler";
import Grid, { CellMap } from "./grid";
import permute from "./permute";

const scrollScale = 0.01;


const canvas = document.getElementById('gameWorld') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
const grid = new Grid(ctx);

// add coord display
canvas.addEventListener('mousemove', (e) => {
  const [gridX, gridY] = grid.getGridCoord(e.offsetX, e.offsetY);

  document.getElementById('coords').innerText = `(${gridX}, ${gridY})`;
});


let currentBlocks: CellMap = {};

grid.draw(currentBlocks);

function zoom(x: number, y: number, dz: number) {
  const scrollTravel = dz * scrollScale;
  grid.currentZoom += scrollTravel;

  if (grid.currentZoom < 10) {
    grid.currentZoom = 10;
    grid.draw(currentBlocks);
    return;
  }

  if (grid.currentZoom > 1000) {
    grid.currentZoom = 1000;
    grid.draw(currentBlocks);
    return;
  }
  
  const mouseX = x;
  const mouseY = y;


  const xBias = mouseX / canvas.width;
  const yBias = mouseY / canvas.height;

  // Since the zoom is done in scale with x, we need to adjust the y value to keep the zoom centered
  const yAdjustment = canvas.height / canvas.width;

  const xTravel = scrollTravel * xBias;
  const yTravel = scrollTravel * yBias * yAdjustment;

  grid.currentX += xTravel;
  grid.currentY += yTravel;
}

function pan(dx: number, dy: number) {
  grid.currentX += dx / grid.gridSize;
  grid.currentY += dy / grid.gridSize;
}

function placeCell(alive: boolean, x: number, y: number) {
  const [gridX, gridY] = grid.getGridCoord(x, y);

  if (alive) {
    currentBlocks[`${gridX},${gridY}`] = true;
  } else {
    delete currentBlocks[`${gridX},${gridY}`];
  }
}

function placeCellLine(alive: boolean, x1: number, y1: number, x2: number, y2: number) {
  const [gridX1, gridY1] = grid.getGridCoord(x1, y1);

  const [gridX2, gridY2] = grid.getGridCoord(x2, y2);
  
  const dx = gridX2 - gridX1;
  const dy = gridY2 - gridY1;

  const steps = Math.max(Math.abs(dx), Math.abs(dy));

  for (let i = 0; i <= steps; i++) {
    const x = Math.floor(gridX1 + (dx * i / steps));
    const y = Math.floor(gridY1 + (dy * i / steps));

    if (alive) {
      currentBlocks[`${x},${y}`] = true;
    } else {
      delete currentBlocks[`${x},${y}`];
    }
  }
}

function permuteBlocks() {
  currentBlocks = permute(currentBlocks);
  grid.draw(currentBlocks);
}

let interval: NodeJS.Timeout;
let speed = 250;

function pause() { 
  if (interval) {
    clearInterval(interval);
    interval = null;
  } else {
    interval = setInterval(permuteBlocks, speed);
  }
}

function speedUp() {
  speed *= 0.5;
  clearInterval(interval);
  interval = setInterval(permuteBlocks, speed);
}

function slowDown() {
  speed *= 2;
  clearInterval(interval);
  interval = setInterval(permuteBlocks, speed);
}

function step() {
  if (interval) {
    clearInterval(interval);
  }
  permuteBlocks();
}


const inputHandler = new InputHandler(canvas, {
  pause,
  speedUp,
  slowDown,
  step,
  placeCell,
  placeCellLine,
  pan,
  zoom,
  redraw: () => grid.draw(currentBlocks),
});
