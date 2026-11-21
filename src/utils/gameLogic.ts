import {
  AnimalColor,
  BASE_COLORS,
  BaseAnimalColor,
  Coord,
  DANGER_ROW,
  DIFFICULTY_CONFIG,
  Difficulty,
  GRID_COLS,
  GRID_ROWS,
  GridMatrix,
  INITIAL_ROWS,
  Tile,
} from '../types/game';

let tileCounter = 0;
function nextTileId(): string {
  tileCounter += 1;
  return `tile-${Date.now()}-${tileCounter}`;
}

export function randomBaseColor(): BaseAnimalColor {
  return BASE_COLORS[Math.floor(Math.random() * BASE_COLORS.length)];
}

export function hasWildOnBoard(grid: GridMatrix): boolean {
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      if (grid[r][c]?.color === 'wild') {
        return true;
      }
    }
  }
  return false;
}

export function generateBottomRow(
  wildChance = 0.04,
  allowWild = true
): Tile[] {
  const row: Tile[] = [];
  let wildSpawned = false;

  for (let c = 0; c < GRID_COLS; c++) {
    let color: AnimalColor;
    if (allowWild && !wildSpawned && Math.random() < wildChance) {
      color = 'wild';
      wildSpawned = true;
    } else {
      color = randomBaseColor();
    }
    row.push({
      id: nextTileId(),
      color,
    });
  }

  // Ensure the row is never completely monochrome
  const firstColor = row[0].color;
  if (row.every((t) => t.color === firstColor)) {
    const altColors = BASE_COLORS.filter((color) => color !== firstColor);
    const swapIdx = Math.floor(Math.random() * GRID_COLS);
    row[swapIdx] = {
      id: nextTileId(),
      color: altColors[Math.floor(Math.random() * altColors.length)],
    };
  }
  return row;
}

export function createInitialGrid(difficulty: Difficulty = 'normal'): GridMatrix {
  const grid: GridMatrix = Array.from({ length: GRID_ROWS }, () =>
    Array.from({ length: GRID_COLS }, () => null)
  );
  const wildChance = DIFFICULTY_CONFIG[difficulty].wildChance;
  let hasWild = false;

  for (let r = GRID_ROWS - INITIAL_ROWS; r < GRID_ROWS; r++) {
    const newRow = generateBottomRow(wildChance, !hasWild);
    if (newRow.some((t) => t.color === 'wild')) {
      hasWild = true;
    }
    for (let c = 0; c < GRID_COLS; c++) {
      grid[r][c] = newRow[c];
    }
  }
  return grid;
}

export function cloneGrid(grid: GridMatrix): GridMatrix {
  return grid.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

export function getLandingRow(grid: GridMatrix, col: number): number {
  if (col < 0 || col >= GRID_COLS) return -1;
  for (let r = GRID_ROWS - 1; r >= 0; r--) {
    if (grid[r][col] === null) {
      return r;
    }
  }
  return -1;
}

const DIRECTIONS: Coord[] = [
  { row: -1, col: 0 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
  { row: -1, col: -1 },
  { row: -1, col: 1 },
  { row: 1, col: -1 },
  { row: 1, col: 1 },
];

function getNeighbors(row: number, col: number): Coord[] {
  const result: Coord[] = [];
  for (const d of DIRECTIONS) {
    const nr = row + d.row;
    const nc = col + d.col;
    if (nr >= 0 && nr < GRID_ROWS && nc >= 0 && nc < GRID_COLS) {
      result.push({ row: nr, col: nc });
    }
  }
  return result;
}

function bfsSameColor(
  grid: GridMatrix,
  startRow: number,
  startCol: number,
  targetColor: BaseAnimalColor
): Coord[] {
  const visited = new Set<string>();
  const queue: Coord[] = [{ row: startRow, col: startCol }];
  const group: Coord[] = [];
  visited.add(`${startRow},${startCol}`);

  while (queue.length > 0) {
    const curr = queue.shift()!;
    group.push(curr);

    for (const n of getNeighbors(curr.row, curr.col)) {
      const key = `${n.row},${n.col}`;
      if (visited.has(key)) continue;
      const cell = grid[n.row][n.col];
      if (cell && cell.color === targetColor) {
        visited.add(key);
        queue.push(n);
      }
    }
  }
  return group;
}

function collectImpactMatchCoords(
  grid: GridMatrix,
  dropRow: number,
  dropCol: number,
  orbColor: BaseAnimalColor
): { coords: Coord[]; isWildHit: boolean } {
  const neighbors = getNeighbors(dropRow, dropCol);
  const directWildCoords: Coord[] = [];
  let hasSameColorNeighbor = false;

  for (const n of neighbors) {
    const tile = grid[n.row][n.col];
    if (!tile) continue;
    if (tile.color === orbColor) {
      hasSameColorNeighbor = true;
    } else if (tile.color === 'wild') {
      directWildCoords.push(n);
    }
  }

  // If the falling orb touches a wild tile, clear the falling orb, the wild tile(s),
  // and ALL tiles across the board with the same color as the falling orb.
  if (directWildCoords.length > 0) {
    const clearedMap = new Map<string, Coord>();
    clearedMap.set(`${dropRow},${dropCol}`, { row: dropRow, col: dropCol });

    for (const w of directWildCoords) {
      clearedMap.set(`${w.row},${w.col}`, w);
    }

    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const cell = grid[r][c];
        if (cell && cell.color === orbColor) {
          clearedMap.set(`${r},${c}`, { row: r, col: c });
        }
      }
    }

    return {
      coords: Array.from(clearedMap.values()),
      isWildHit: true,
    };
  }

  if (!hasSameColorNeighbor) {
    return { coords: [], isWildHit: false };
  }

  const coords = bfsSameColor(grid, dropRow, dropCol, orbColor);
  if (coords.length < 3) {
    return { coords: [], isWildHit: false };
  }

  return {
    coords,
    isWildHit: false,
  };
}

export function previewMatchKeys(
  grid: GridMatrix,
  col: number,
  orbColor: BaseAnimalColor
): Set<string> {
  const landingRow = getLandingRow(grid, col);
  const preview = new Set<string>();
  if (landingRow < 0) return preview;

  const tempGrid = cloneGrid(grid);
  tempGrid[landingRow][col] = { id: 'preview', color: orbColor };

  const { coords } = collectImpactMatchCoords(
    tempGrid,
    landingRow,
    col,
    orbColor
  );

  for (const coord of coords) {
    if (!(coord.row === landingRow && coord.col === col)) {
      preview.add(`${coord.row},${coord.col}`);
    }
  }

  return preview;
}

export function placeAndCheckImpact(
  grid: GridMatrix,
  dropRow: number,
  dropCol: number,
  orbColor: BaseAnimalColor
): {
  gridWithOrb: GridMatrix;
  clearedCoords: Coord[];
  isWildHit: boolean;
} {
  const next = cloneGrid(grid);
  next[dropRow][dropCol] = {
    id: nextTileId(),
    color: orbColor,
    justSettled: true,
  };

  const { coords, isWildHit } = collectImpactMatchCoords(
    next,
    dropRow,
    dropCol,
    orbColor
  );

  return {
    gridWithOrb: next,
    clearedCoords: coords,
    isWildHit,
  };
}

export function clearTilesAt(grid: GridMatrix, coords: Coord[]): GridMatrix {
  const next = cloneGrid(grid);
  for (const { row, col } of coords) {
    next[row][col] = null;
  }
  return next;
}

export function applyGravity(grid: GridMatrix): {
  nextGrid: GridMatrix;
  movedCoords: Coord[];
} {
  const nextGrid: GridMatrix = Array.from({ length: GRID_ROWS }, () =>
    Array.from({ length: GRID_COLS }, () => null)
  );
  const movedCoords: Coord[] = [];

  for (let c = 0; c < GRID_COLS; c++) {
    let writeRow = GRID_ROWS - 1;
    for (let r = GRID_ROWS - 1; r >= 0; r--) {
      const tile = grid[r][c];
      if (tile) {
        const moved = writeRow !== r;
        nextGrid[writeRow][c] = {
          ...tile,
          justSettled: moved,
        };
        if (moved) {
          movedCoords.push({ row: writeRow, col: c });
        }
        writeRow -= 1;
      }
    }
  }

  return { nextGrid, movedCoords };
}

export function findChainMatchesFromMoved(
  grid: GridMatrix,
  movedCoords: Coord[]
): Coord[] {
  const clearedMap = new Map<string, Coord>();

  for (const coord of movedCoords) {
    const key = `${coord.row},${coord.col}`;
    if (clearedMap.has(key)) continue;

    const tile = grid[coord.row][coord.col];
    if (!tile || tile.color === 'wild') continue;

    const neighbors = getNeighbors(coord.row, coord.col);
    const hasSameColor = neighbors.some((n) => {
      const nTile = grid[n.row][n.col];
      return nTile && nTile.color === tile.color;
    });

    if (hasSameColor) {
      const group = bfsSameColor(grid, coord.row, coord.col, tile.color);
      if (group.length >= 3) {
        for (const member of group) {
          clearedMap.set(`${member.row},${member.col}`, member);
        }
      }
    }
  }

  return Array.from(clearedMap.values());
}

export function pushBottomRow(
  grid: GridMatrix,
  difficulty: Difficulty = 'normal'
): {
  nextGrid: GridMatrix;
  overflowed: boolean;
} {
  // If any tile is already at DANGER_ROW (row 0), pushing up overflows immediately
  for (let c = 0; c < GRID_COLS; c++) {
    if (grid[DANGER_ROW][c] !== null) {
      return { nextGrid: cloneGrid(grid), overflowed: true };
    }
  }

  const canSpawnWild = !hasWildOnBoard(grid);
  const wildChance = DIFFICULTY_CONFIG[difficulty].wildChance;

  const nextGrid = cloneGrid(grid);
  for (let r = 0; r < GRID_ROWS - 1; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const cell = nextGrid[r + 1][c];
      nextGrid[r][c] = cell ? { ...cell, justSettled: false } : null;
    }
  }

  const newBottomRow = generateBottomRow(wildChance, canSpawnWild);
  for (let c = 0; c < GRID_COLS; c++) {
    nextGrid[GRID_ROWS - 1][c] = newBottomRow[c];
  }

  const touchedDanger = hasReachedDangerLine(nextGrid);
  return {
    nextGrid,
    overflowed: touchedDanger,
  };
}

export function hasReachedDangerLine(grid: GridMatrix): boolean {
  for (let c = 0; c < GRID_COLS; c++) {
    if (grid[DANGER_ROW][c] !== null) {
      return true;
    }
  }
  return false;
}

export function isNearDangerLine(grid: GridMatrix): boolean {
  for (let c = 0; c < GRID_COLS; c++) {
    if (grid[DANGER_ROW + 1][c] !== null) {
      return true;
    }
  }
  return false;
}
