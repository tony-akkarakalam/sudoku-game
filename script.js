const grid = document.getElementById("sudoku-grid");
const timerEl = document.getElementById("timer");
const checkBtn = document.getElementById("check-btn");
const newGameBtn = document.getElementById("new-game-btn");
const modal = document.getElementById("completion-modal");
const finalTime = document.getElementById("final-time");
const playAgainBtn = document.getElementById("play-again-btn");
const difficultySelect = document.getElementById("difficulty");

let activeCell = null;
let seconds = 0;
let timer;

const baseSolution = [
    [1,2,3,4,5,6,7,8,9],
    [4,5,6,7,8,9,1,2,3],
    [7,8,9,1,2,3,4,5,6],
    [2,3,4,5,6,7,8,9,1],
    [5,6,7,8,9,1,2,3,4],
    [8,9,1,2,3,4,5,6,7],
    [3,4,5,6,7,8,9,1,2],
    [6,7,8,9,1,2,3,4,5],
    [9,1,2,3,4,5,6,7,8]
];

function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

function generateSudoku(level) {
    const nums = shuffle([1,2,3,4,5,6,7,8,9]);
    const solution = baseSolution.map(row => row.map(n => nums[n-1]));
    const puzzle = solution.map(row => row.slice());

    let blanks = level === "easy" ? 35 : level === "hard" ? 55 : 45;

    while (blanks > 0) {
        const r = Math.floor(Math.random() * 9);
        const c = Math.floor(Math.random() * 9);
        if (puzzle[r][c] !== 0) {
            puzzle[r][c] = 0;
            blanks--;
        }
    }
    return { puzzle, solution };
}

let current;

function startTimer() {
    clearInterval(timer);
    seconds = 0;
    timer = setInterval(() => {
        seconds++;
        const m = String(Math.floor(seconds / 60)).padStart(2, "0");
        const s = String(seconds % 60).padStart(2, "0");
        timerEl.textContent = `${m}:${s}`;
    }, 1000);
}

function createGrid() {
    grid.innerHTML = "";
    activeCell = null;

    current.puzzle.forEach((row, r) => {
        row.forEach((val, c) => {
            const cell = document.createElement("div");
            cell.classList.add("sudoku-cell");
            cell.dataset.row = r;
            cell.dataset.col = c;

            if (val !== 0) {
                cell.textContent = val;
                cell.classList.add("prefilled");
            } else {
                cell.onclick = () => selectCell(cell);
            }
            grid.appendChild(cell);
        });
    });
}

function selectCell(cell) {
    if (activeCell) activeCell.classList.remove("active");
    activeCell = cell;
    cell.classList.add("active");
}

document.addEventListener("keydown", e => {
    if (!activeCell) return;

    if (e.key >= "1" && e.key <= "9") {
        activeCell.textContent = e.key;
        activeCell.classList.add("filled");
    }
    if (e.key === "Backspace" || e.key === "Delete") {
        activeCell.textContent = "";
    }
});

checkBtn.onclick = () => {
    let correct = true;
    document.querySelectorAll(".sudoku-cell").forEach(cell => {
        const r = cell.dataset.row;
        const c = cell.dataset.col;
        if (cell.textContent != current.solution[r][c]) {
            cell.classList.add("invalid");
            correct = false;
        }
    });

    if (correct) {
        clearInterval(timer);
        finalTime.textContent = `Time Taken: ${timerEl.textContent}`;
        modal.classList.remove("hidden");
    }
};

function newGame() {
    modal.classList.add("hidden");
    current = generateSudoku(difficultySelect.value);
    createGrid();
    startTimer();
}

newGameBtn.onclick = newGame;
playAgainBtn.onclick = newGame;
difficultySelect.onchange = newGame;

newGame();
