import Grid, { Map } from "./grid";
import permute from "./permute";

const scrollScale = 0.01;


const canvas = document.getElementById('gameWorld') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
const grid = new Grid(ctx);

let currentBlocks: Map = {};

grid.draw(currentBlocks);

function onWheel(event: WheelEvent) {
  const scrollTravel = event.deltaY * scrollScale;
  grid.currentZoom += scrollTravel;

  if (grid.currentZoom < 10) {
    grid.currentZoom = 10;
    grid.draw(currentBlocks);
    return;
  }

  if (grid.currentZoom > 300) {
    grid.currentZoom = 300;
    grid.draw(currentBlocks);
    return;
  }
  
  const centerX = event.clientX;
  const centerY = event.clientY;

  const xBias = centerX / canvas.width;
  const yBias = centerY / canvas.height;


  const xTravel = scrollTravel * xBias;
  const yTravel = scrollTravel * yBias;

  grid.currentX += xTravel;
  grid.currentY += yTravel;

  grid.draw(currentBlocks);
}

function onClick(event: MouseEvent) {
  const x = event.clientX;
  const y = event.clientY;

  const gridSize = ctx.canvas.width / grid.currentZoom;

  const xBlock = Math.floor((x / gridSize - grid.currentX + 0.01));
  const yBlock = Math.floor((y / gridSize - grid.currentY + 0.01));

  currentBlocks[`${xBlock},${yBlock}`] = true;


  grid.draw(currentBlocks);
  permute(currentBlocks)
}

function onContextMenu(event: MouseEvent) {
  event.preventDefault();
  const x = event.clientX;
  const y = event.clientY;

  const gridSize = ctx.canvas.width / grid.currentZoom;

  const xBlock = Math.floor((x / gridSize - grid.currentX + 0.01));
  const yBlock = Math.floor((y / gridSize - grid.currentY + 0.01));

  delete currentBlocks[`${xBlock},${yBlock}`];

  grid.draw(currentBlocks);
}

function onResize() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  
  grid.draw(currentBlocks);
}


function permuteBlocks() {
  currentBlocks = permute(currentBlocks);
  grid.draw(currentBlocks);
}

let interval: NodeJS.Timeout;
let speed = 250;

function onKey(evt: KeyboardEvent) {
  if (evt.key == ' ') {
    if (interval) {
      clearInterval(interval);
      interval = null;
    } else {
      interval = setInterval(permuteBlocks, speed);
    }
  }
  if (evt.key == 'ArrowRight') {
    speed *= 0.5;
    clearInterval(interval);
    interval = setInterval(permuteBlocks, speed);
    console.log(speed);
  }
  if (evt.key == 'ArrowLeft') {
    speed *= 2;
    clearInterval(interval);
    interval = setInterval(permuteBlocks, speed);
    console.log(speed);
  }
  if (evt.key == 'ArrowUp') {
    if (!interval) {
      permuteBlocks();
    }
  }
}

canvas.addEventListener('keydown', onKey);
canvas.addEventListener('wheel', onWheel);
canvas.addEventListener('click', onClick);
canvas.addEventListener('contextmenu', onContextMenu);
window.addEventListener('resize', onResize);