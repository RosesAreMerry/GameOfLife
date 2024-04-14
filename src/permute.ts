import { CellMap } from './grid';

export default function permute(blocks: CellMap) {
  const newBlocks: CellMap = {};
  for (const key in blocks) {
    const coord = key.split(",").map((s) => Number(s)) as [number, number];

    let adjacents: [number, number][] = getAdjacentCoords(coord)

    for (const adjacent of adjacents) {
      if (!blocks[`${adjacent[0]},${adjacent[1]}`]) {
        if (alive(adjacent, blocks)) {
          newBlocks[`${adjacent[0]},${adjacent[1]}`] = true
        }
      }
    }

    if (alive(coord, blocks, true)) {
      newBlocks[`${coord[0]},${coord[1]}`] = true
    }
  }
  return newBlocks
}

function getAdjacentCoords(coord: [number, number]): [number, number][] {
  let adjacents: [number, number][] = []
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i != 0 || j != 0) {
        adjacents.push([coord[0] + i, coord[1] + j])
      }
    }
  }
  return adjacents
}

function alive(coord: [number, number], blocks: CellMap, isAlive = false) {
  const adjacents = getAdjacentCoords(coord);
  const surroundings = adjacents.map((a) => !!blocks[`${a[0]},${a[1]}`]).filter((a) => a).length
  if (isAlive) {
    return surroundings == 2 || surroundings == 3
  }
  return surroundings == 3
}