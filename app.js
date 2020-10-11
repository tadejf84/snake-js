// DOM Caching
const canvas = document.getElementById('console');
const ctx = canvas.getContext('2d');
const btnStart = document.getElementById('btn-start');
const btnRestart = document.getElementById('btn-restart');
const introScreen = document.getElementById('intro-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const currentScore = document.getElementById('current-score');
const finalScore = document.getElementById('final-score');
const highScore = document.getElementById('high-score');
const currentLvl = document.getElementById('current-lvl');
const gameDisplay = document.getElementById('game-display');


/**
 * Class Timer
 * Control the speed of the game 	
 * 
 */
class Timer {

    /**
     * @constructor
     * 
     * @callback fn
     * @param {number} speed 
     */
    constructor(fn, speed) {
        this.speed = speed;
        this.fn = fn;
        this.timerObj = setInterval(this.fn, this.speed);
    }

    /**
     * Stop interval
     * 
     * @return {object}
     */
    stop() {
        if (this.timerObj) {
            clearInterval(this.timerObj);
            this.timerObj = null;
        }
        return this;
    }

    /**
     * Restart the interval with old speed settings
     * 
     * @return {object}
     */
    start() {
        if (!this.timerObj) {
            this.stop();
            this.timerObj = setInterval(this.fn, this.speed);
        }
        return this;
    }

    /**
     * Stop and reset to new interval speed
     * 
     * @param {number} newSpeed 
     * @return {object}
     */
    reset(newSpeed) {
        this.speed = newSpeed;
        return this.stop().start();
    }
}


/**
 * Class Snake 	
 * 
 */
class Snake {

    /**
     * @constructor
     * 
     * @param {object} settings 
     */
    constructor(settings) {

        // User settings
        this.speed = settings.speed; // initial game speed
        this.tail = settings.tail; // initial snake length
        this.speedIncrement = settings.speedIncrement; // speed increment

        // Game settings
        this.playerX = 10; // player initial x coordinate
        this.playerY = 10; // player initial y coordinate
        this.blockSize = 20; // block size
        this.appleX = Math.floor(Math.random() * this.blockSize); // spawn initial apple randomly - x coordinate
        this.appleY = Math.floor(Math.random() * this.blockSize); // spawn initial apple randomly - Y coordinate
        this.trail = []; // snake trail
        this.dx = 0; // player x speed
        this.dy = 0; // player y speed
        this.score = 0; // initial score
        this.actualScore = 0; // initial actual score - levels considered in calculation
        this.started = false; // game not started on init
        this.level = 1; // initial lvl
        this.timer = new Timer(() => {
            this.init();
        }, this.speed);
    }

    /**
     * Init game
     * 
     */
    init() {
        this.drawCanvas();
        this.drawSnake();
        this.drawApple();
        this.timer.start();
    }

    /**
     * Draw game canvas
     * 
     */
    drawCanvas() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    /**
     * Draw snake on canvas
     * 
     */
    drawSnake() {

        // Recalculate player position on current move direction
        this.playerX += this.dx;
        this.playerY += this.dy;

        // Detect movement off gameboard boundaries
        this.detectGameboardBoundaries();

        // Loop through trail and draw snake
        ctx.fillStyle = 'green';
        ctx.fillRect(
            this.playerX * this.blockSize,
            this.playerY * this.blockSize,
            this.blockSize - 2,
            this.blockSize - 2
        );

        this.trail.forEach((block) => {
            ctx.fillRect(block.x * this.blockSize, block.y * this.blockSize, this.blockSize - 2, this.blockSize - 2);
            // Detect collision -> end game
            if (block.x === this.playerX && block.y === this.playerY && this.started === true) {
                SnakeUI.saveHighScore(this.actualScore);
                SnakeUI.showHideGameOverScreen(this.actualScore);
            }
        });

        // Push player coords in snake trail array
        this.trail.push({ x: this.playerX, y: this.playerY });

        // Set trail array length to tail length
        while (this.trail.length >= this.tail) {
            this.trail.shift();
        }
    }

    /**
     * Draw apples on canvas
     * 
     */
    drawApple() {
        
        // If player position is equal to apple position, grow tail, randomly spawn new apple and add score
        if (this.appleX === this.playerX && this.appleY === this.playerY) {
            this.tail++;
            this.addScore();
            this.appleX = Math.floor(Math.random() * this.blockSize);
            this.appleY = Math.floor(Math.random() * this.blockSize);

            // Check if apple position on snake, if so generate new
            this.trail.forEach((block) => {
                while (block.x === this.appleX && block.y === this.appleY) {
                    this.appleX = Math.floor(Math.random() * this.blockSize);
                    this.appleY = Math.floor(Math.random() * this.blockSize);
                }
            });
        }

        // Draw apple
        ctx.fillStyle = 'red';
        ctx.fillRect(this.appleX * this.blockSize, this.appleY * this.blockSize, this.blockSize - 2, this.blockSize - 2);
    }

    /**
     * Add score logic
     * 
     */
    addScore() {
        this.score++;
        this.actualScore += this.level;
        SnakeUI.updateScore(this.actualScore);
        if (this.score % 5 === 0 && this.speed >= 50) {
            this.level++;
            SnakeUI.updateLvl(this.level);
            this.speed = this.speed - this.speedIncrement;
            this.timer.reset(this.speed);
        }
    }

    /**
     * Restart game logic
     * 
     * @param {object} settings 
     */
    restartGame(settings) {
        this.playerX = 10;
        this.playerY = 10;
        this.drawApple();
        this.trail = [];
        this.tail = settings.tail;
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.actualScore = 0;
        this.speed = settings.speed;
        this.started = false;
        this.level = 1;
        SnakeUI.updateLvl(this.level);
        SnakeUI.updateScore(this.actualScore);
        SnakeUI.getHighScore();
        this.timer.reset(settings.speed);
        this.init();
    }

    /**
     * Move snake on key push event
     * 
     * @param {object} e 
     */
    moveSnakeOnKeyPush(e) {
        const key = e.keyCode;
        if (this.started === false) {
            this.started = true; // start game
        }
        if (key === 37 && this.dx !== -1 && this.dx !== 1) {
            this.dx = -1;
            this.dy = 0;
        } else if (key === 38 && this.dy !== -1 && this.dy !== 1) {
            this.dx = 0;
            this.dy = -1;
        } else if (key === 39 && this.dx !== -1 && this.dx !== 1) {
            this.dx = 1;
            this.dy = 0;
        } else if (key === 40 && this.dy !== -1 && this.dy !== 1) {
            this.dx = 0;
            this.dy = 1;
        }
    }

    /**
     * Detect if outside canvas
     * 
     */
    detectGameboardBoundaries() {
        if (this.playerX < 0) this.playerX = this.blockSize - 1;
        if (this.playerX > this.blockSize - 1) this.playerX = 0;
        if (this.playerY < 0) this.playerY = this.blockSize - 1;
        if (this.playerY > this.blockSize - 1) this.playerY = 0;
    }
}


/**
 * Snake UI Class
 * 
 */
class SnakeUI {

	/**
	 * Hide intro screen and set initial score and lvl
	 * 
	 */
	static hideIntroScreen() {
		currentScore.innerText = 0;
		currentLvl.innerText = 1;
		introScreen.classList.add('hide');
		gameDisplay.classList.add('show');
		SnakeUI.getHighScore();
	}

	/**
	 * Update current score
	 * 
	 * @param {number} score 
	 */
	static updateScore(score) {
		currentScore.innerText = score;
	}

	/**
	 * Update current level
	 * 
	 * @param {number} lvl 
	 */
	static updateLvl(lvl) {
		currentLvl.innerText = lvl;
	}

	/**
	 * Save high score to local storage
	 * 
	 * @param {number} score 
	 */
	static saveHighScore(score) {
		const storedHighScore = JSON.parse(localStorage.getItem('highScore'));
		if (score > storedHighScore) {
			localStorage.setItem('highScore', JSON.stringify(score));
		}
	}

	/**
	 * Get high score from local storage and update UI display
	 * 
	 */
	static getHighScore() {
		let storedHigh;
		if (!localStorage.getItem('highScore')) {
			storedHigh = 0;
		} else {
			storedHigh = JSON.parse(localStorage.getItem('highScore'));
		}
		highScore.innerText = storedHigh;
	}

	/**
	 * Show/hide end game screen
	 * 
	 * @param {number} score 
	 */
	static showHideGameOverScreen(score = 0) {
		if (!gameOverScreen.classList.contains('show')) {
			gameOverScreen.classList.add('show');
		} else {
			gameOverScreen.classList.remove('show');
		}
		finalScore.innerText = score;
	}
}


// Instantiate the game
const settings = {
	tail: 5, // set initial snake length
	speed: 200, // set initial game speed
	speedIncrement: 15 // set speed increments by level
};
const snakeGame = new Snake(settings);


// Event listeners
btnStart.addEventListener('click', function() {
	snakeGame.init();
	SnakeUI.hideIntroScreen();
	document.addEventListener('keydown', function(e) {
		snakeGame.moveSnakeOnKeyPush(e);
	});
});

btnRestart.addEventListener('click', function() {
	snakeGame.restartGame(settings);
	SnakeUI.showHideGameOverScreen();
});
