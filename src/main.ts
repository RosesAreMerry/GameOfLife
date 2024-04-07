import InputHandler from "./inputHandler";
import Grid, { Map } from "./grid";
import permute from "./permute";

const scrollScale = 0.01;


const canvas = document.getElementById('gameWorld') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
ctx.imageSmoothingEnabled = false;

const grid = new Grid(ctx);


let currentBlocks: Map = {};

grid.draw(currentBlocks);

function zoom(x: number, y: number, dz: number) {
  const scrollTravel = dz * scrollScale;
  grid.currentZoom += scrollTravel;

  if (grid.currentZoom < 10) {
    grid.currentZoom = 10;
    return;
  }

  if (grid.currentZoom > 1000) {
    grid.currentZoom = 1000;
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
  const gridSize = ctx.canvas.width / grid.currentZoom;
  grid.currentX += dx / gridSize;
  grid.currentY += dy / gridSize;
}

function placeCell(alive: boolean, x: number, y: number) {
  const gridSize = ctx.canvas.width / grid.currentZoom;

  const xBlock = Math.floor((x / gridSize - grid.currentX + 0.01));
  const yBlock = Math.floor((y / gridSize - grid.currentY + 0.01));

  if (alive) {
    currentBlocks[`${xBlock},${yBlock}`] = true;
  } else {
    delete currentBlocks[`${xBlock},${yBlock}`];
  }
}

function placeCellLine(alive: boolean, x1: number, y1: number, x2: number, y2: number) {
  const gridSize = ctx.canvas.width / grid.currentZoom;

  const xBlock1 = Math.floor((x1 / gridSize - grid.currentX + 0.01));
  const yBlock1 = Math.floor((y1 / gridSize - grid.currentY + 0.01));

  const xBlock2 = Math.floor((x2 / gridSize - grid.currentX + 0.01));
  const yBlock2 = Math.floor((y2 / gridSize - grid.currentY + 0.01));

  const dx = xBlock2 - xBlock1;
  const dy = yBlock2 - yBlock1;

  const steps = Math.max(Math.abs(dx), Math.abs(dy));

  for (let i = 0; i < steps; i++) {
    const x = Math.floor(xBlock1 + (dx * i / steps));
    const y = Math.floor(yBlock1 + (dy * i / steps));

    if (alive) {
      currentBlocks[`${x},${y}`] = true;
    } else {
      delete currentBlocks[`${x},${y}`];
    }
  }
}

const permuteWorker = new Worker('worker.js');

function permuteBlocks() {
  permuteWorker.postMessage(currentBlocks);
}

permuteWorker.onmessage = function(e) {
  currentBlocks = e.data;
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
