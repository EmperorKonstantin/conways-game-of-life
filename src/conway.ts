const canvas = document.querySelector<HTMLCanvasElement>('#conway');
const width = canvas.width;
const height = canvas.height;
const context = canvas.getContext('2d');

const tileSize = 20;
const tileX = width / tileSize;
const tileY = height / tileSize;
let gamePaused = false;
let gameSpeed = 100;

context.fillStyle = 'rgb(252, 211, 77)';
context.strokeStyle = 'rgb(90, 90, 90)';
context.lineWidth = 0.5;

const gameOfLifeGrid = (): boolean[][] => {
    const matrix = [];
    for (let i = 0; i < tileX; i++) {
        const row = [];
        for (let j = 0; j < tileY; j++) {
            row.push(false);
        }
        matrix.push(row);
    }
    return matrix;
};

let GRID = gameOfLifeGrid();

const clear = () => {
    context?.clearRect(0, 0, width, height);
}

const drawGridLines = () => {
    for (let i = 0; i < tileX; i++) {
        context?.beginPath();
        context?.moveTo(i * tileSize - 0.5, 0);
        context?.lineTo(i * tileSize - 0.5, height);
        context?.stroke();
    }

    for (let i = 0; i < tileY; i++) {
        context?.beginPath();
        context?.moveTo(0, i * tileSize - 0.5);
        context?.lineTo(width, i * tileSize - 0.5);
        context?.stroke();
    }
};

const drawGameOfLifeGrid = (grid: boolean[][]) => {
    for(let i=0; i < tileX; i++) {
        for(let j=0; j < tileY; j++) {
            if (!grid[i][j]) {
                continue;
            }
            context?.fillRect(i * tileSize, j * tileSize, tileSize, tileSize);
        }
    }
}

const cellAlive = (x: number, y: number): number => {
    if (x < 0 || x>= tileX || y < 0 || y>= tileY) {
        return 0;
    }
    return GRID[x][y] ? 1 : 0;
}

const countNeighbours = (x: number, y: number): number => {
    let amountOfNeighbors = 0;
    for (let i of [-1, 0, 1]) {
        for (let j of [-1, 0, 1]) {
            if (! (i === 0 && j === 0)) {
                amountOfNeighbors += cellAlive(x + i, y + j);
            }   
        }
    }
    return amountOfNeighbors;
}

const computeNextGeneration = () => {
    const nextGridPositions = gameOfLifeGrid();
    for(let i=0;i<tileX;i++) {
        for(let j=0;j<tileY;j++) {
            if (!cellAlive(i, j)) {
                if (countNeighbours(i, j) === 3) {
                    nextGridPositions[i][j] = true;
                }
            } else {
                const count = countNeighbours(i, j);
                if (count == 2 || count == 3) {
                    nextGridPositions[i][j] = true;
                }
            }
        }
    }
    return nextGridPositions;
}

const drawCanvas = () => {
    clear();
    drawGameOfLifeGrid(GRID);
    drawGridLines();
}

const nextGeneration = () => {
    if (gamePaused) {
        return;
    }
    GRID = computeNextGeneration();
    drawCanvas();
}

const nextGenerationLoop = () => {
    nextGeneration();
    setTimeout(nextGenerationLoop, gameSpeed);
}

// Canoe Pattern on Grid (Still)
GRID[5][7] = true;
GRID[5][8] = true;
GRID[6][8] = true;
GRID[7][7] = true;
GRID[8][4] = true;
GRID[8][6] = true;
GRID[9][4] = true;
GRID[9][5] = true;

// Glider Pattern on Grid (Spaceship)
GRID[1][12] = true;
GRID[2][13] = true;
GRID[0][14] = true;
GRID[1][14] = true;
GRID[2][14] = true;

// Blinker Pattern on Grid (Oscillator)
GRID[4][18] = true;
GRID[4][19] = true;
GRID[4][20] = true;

// Pulsar Pattern on Grid (Oscillator)
GRID[6][25] = true;
GRID[6][26] = true;
GRID[6][27] = true;
GRID[6][31] = true;
GRID[6][32] = true;
GRID[6][33] = true;
GRID[8][23] = true;
GRID[8][28] = true;
GRID[8][30] = true;
GRID[8][35] = true;
GRID[9][23] = true;
GRID[9][28] = true;
GRID[9][30] = true;
GRID[9][35] = true;
GRID[10][23] = true;
GRID[10][28] = true;
GRID[11][30] = true;
GRID[12][35] = true;
GRID[11][25] = true;
GRID[11][26] = true;
GRID[11][27] = true;
GRID[11][31] = true;
GRID[11][32] = true;
GRID[11][33] = true;
GRID[13][25] = true;
GRID[13][26] = true;
GRID[13][27] = true;
GRID[13][31] = true;
GRID[13][32] = true;
GRID[13][33] = true;
GRID[14][23] = true;
GRID[14][28] = true;
GRID[14][30] = true;
GRID[14][35] = true;
GRID[15][23] = true;
GRID[15][28] = true;
GRID[15][30] = true;
GRID[15][35] = true;
GRID[16][23] = true;
GRID[16][28] = true;
GRID[16][30] = true;
GRID[16][35] = true;
GRID[18][25] = true;
GRID[18][26] = true;
GRID[18][27] = true;
GRID[18][31] = true;
GRID[18][32] = true;
GRID[18][33] = true;

nextGenerationLoop();
