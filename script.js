const playBoard = document.querySelector('.play-board');
const scoreElement = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score');
const controls = document.querySelectorAll('.controls i');
const gameOverPopup = document.querySelector('.game-over_popup');
const overlay = document.querySelector('.overlay');
const newGameButton = gameOverPopup.querySelector('.new-game_button');

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;

// getting high score from the local storage
let highScore = localStorage.getItem('high-score') || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const changeFoodPosition = () => {
    // Passing a random 0 - 30 value as food position
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    // clearing the timer and reloading the page on game over
    clearInterval(setIntervalId);
    ///alert('Конец игры! Нажми OK, чтобы начать заново.');
    gameOver = false;
    gameOverPopup.classList.add('popup_active');
    overlay.classList.add('overlay_active');
}

const changeDirection = (evt) => {
    // changing velocity value based on key press
    if (evt.key === 'ArrowUp' && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (evt.key === 'ArrowDown' && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (evt.key === 'ArrowLeft' && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (evt.key === 'ArrowRight' && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

controls.forEach(key => {
    // calling changeDirection on each key click and passing key dataset value as an object
    key.addEventListener('click', () => changeDirection({ key: key.CDATA_SECTION_NODE.key}));
});

const initGame = (evt) => {
    if (gameOver) return handleGameOver();

    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    
    // checking if the snake hit the food
    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]); // pushing food position to snake body array
        score++; // increment score by 1

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem('high-score', highScore);
        scoreElement.innerText = `Score: ${score}`;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        // shifting forward the values of elements in the snake body bu one
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY]; // setting first element of snake body to current snake position

    // updating the snake's head position based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;

    // checking the snake's head position based on the current velocity
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        // adding a div for each part of the snake's body
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        // checking if the snake head hit the body, if so set gameOver to true
        if (i != 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = htmlMarkup;
}

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener('keydown', changeDirection);
newGameButton.addEventListener('click', () => location.reload());