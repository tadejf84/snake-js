/*
* DOM caching
*/
const canvas = document.getElementById('console');
const c = canvas.getContext('2d');
const btnStart = document.getElementById('btn-start');
const btnRestart = document.getElementById('btn-restart');
const introScreen = document.getElementById('intro-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const currentScore = document.getElementById('current-score');
const finalScore = document.getElementById('final-score');
const highScore = document.getElementById('high-score');
const currentLvl = document.getElementById('current-lvl');
const gameDisplay = document.getElementById('game-display');

/*
* class timer - to control the speed of the game
*/
class Timer {
	constructor(fn, speed) {
		this.speed = speed;
		this.fn = fn;
		this.timerObj = setInterval(this.fn, this.speed);
	}

	// stop interval
	stop() {
		if (this.timerObj) {
			clearInterval(this.timerObj);
			this.timerObj = null;
		}
		return this;
	}

	// restart the interval with old speed settings
	start() {
		if (!this.timerObj) {
			this.stop();
			this.timerObj = setInterval(this.fn, this.speed);
		}
		return this;
	}

	// stop and reset to new interval speed
	reset(newSpeed) {
		this.speed = newSpeed;
		return this.stop().start();
	}
}

/*
* class snake - for game instance
*/
class Snake {
	constructor(settings) {
		// user settings
		this.speed = settings.speed; // initial game speed
		this.tail = settings.tail; // initial snake length
		this.speedIncrement = settings.speedIncrement; // speed increment

		// game settings
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

	// init game
	init() {
		this.drawCanvas();
		this.drawSnake();
		this.drawApple();
		this.timer.start();
	}

	// draw canvas
	drawCanvas() {
		c.fillStyle = 'black';
		c.fillRect(0, 0, canvas.height, canvas.width);
	}

	// draw snake on canvas
	drawSnake() {
		// recalculate player position on key event
		this.playerX += this.dx;
		this.playerY += this.dy;

		// detect movement off canvas boundaries
		if (this.playerX < 0) {
			this.playerX = this.blockSize - 1;
		}
		if (this.playerX > this.blockSize - 1) {
			this.playerX = 0;
		}
		if (this.playerY < 0) {
			this.playerY = this.blockSize - 1;
		}
		if (this.playerY > this.blockSize - 1) {
			this.playerY = 0;
		}

		// loop through tail and draw snake
		c.fillStyle = 'green';
		c.fillRect(
			this.playerX * this.blockSize,
			this.playerY * this.blockSize,
			this.blockSize - 2,
			this.blockSize - 2
		);
		
		this.trail.forEach( block => {
			c.fillRect(
				block.x * this.blockSize,
				block.y * this.blockSize,
				this.blockSize - 2,
				this.blockSize - 2
			);
			// detect collision -> reset tail to initial, reset score
			if (block.x === this.playerX && block.y === this.playerY && this.started === true) {
				this.tail = 4;
				SnakeUI.saveHighScore(this.actualScore);
				SnakeUI.showGameOverScreen(this.actualScore, this.restartGame);
			}
			
		});
		
		// push player coordinates in snake trail array
		this.trail.push({ x: this.playerX, y: this.playerY });

		// set trail array to only maximum allowed elements of tail
		while (this.trail.length > this.tail) {
			this.trail.shift();
		}
	}

	// draw apple on canvas
	drawApple() {
		// if player position is equal to apple position, grow tail, randomly spawn new apple and add score
		if (this.appleX === this.playerX && this.appleY === this.playerY) {
			this.tail++;
			this.addScore();
			this.appleX = Math.floor(Math.random() * this.blockSize);
			this.appleY = Math.floor(Math.random() * this.blockSize);
			// check if apple position on snake, if so generate new
			this.trail.forEach( block => {
				if(block.x === this.appleX && block.y === this.appleY) {
					this.appleX = Math.floor(Math.random() * this.blockSize);
					this.appleY = Math.floor(Math.random() * this.blockSize);	
				}
			});
		}

		// draw apple
		c.fillStyle = 'red';
		c.fillRect(this.appleX * this.blockSize, this.appleY * this.blockSize, this.blockSize - 2, this.blockSize - 2);
	}

	// add score - increase score increment for each level
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

	// restart game - reset settings to initial, reset speed, update display and init game
	restartGame() {
		this.playerX = 10;
		this.playerY = 10;
		this.appleX = Math.floor(Math.random() * this.blockSize);
		this.appleY = Math.floor(Math.random() * this.blockSize);
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
		this.timer.reset(settings.speed);
		this.init();
	}

	// move snake on key push events
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
	
}

/*
* UI class
*/
class SnakeUI {
	// hide intro screen and set initial score and lvl
	static hideIntroScreen() {
		currentScore.innerText = 0;
		currentLvl.innerText = 1;
		introScreen.classList.add('hide');
		gameDisplay.classList.add('show');
		SnakeUI.getHighScore();
	}

	// update current score in UI
	static updateScore(score) {
		currentScore.innerText = score;
	}

	// update current level in UI
	static updateLvl(lvl) {
		currentLvl.innerText = lvl;
	}

	// save high score to local storage
	static saveHighScore(score) {
		let storedHighScore = JSON.parse(localStorage.getItem('highScore'));
		if(score > storedHighScore) {
			localStorage.setItem('highScore', JSON.stringify(score));	
		}
	}

	// fetch high score from local storage and update display
	static getHighScore() {
		let storedHigh;
		if (!localStorage.getItem('highScore')) {
			storedHigh = 0;
		} else {
			storedHigh = JSON.parse(localStorage.getItem('highScore'));
		}
		highScore.innerText = storedHigh;
	}

	// show end game screen with final score
	static showGameOverScreen(score) {
		if (!gameOverScreen.classList.contains('show')) {
			gameOverScreen.classList.add('show');
			gameDisplay.classList.remove('show');
			finalScore.innerText = score;
		}
	}

	// hide the end game screen on game restart
	static hideGameOverScreen() {
		if (gameOverScreen.classList.contains('show')) {
			gameOverScreen.classList.remove('show');
			finalScore.innerText = 0;
			gameDisplay.classList.add('show');
		}
		SnakeUI.getHighScore();
	}
}

/*
* instantiate the game
*/
const settings = {
	tail: 4, // set initial snake length
	speed: 200, // set initial game speed,
	speedIncrement: 15 // set speed increments by level
};
const snakeGame = new Snake(settings);

/*
* listen to events
*/
btnStart.addEventListener('click', function() {
	snakeGame.init();
	SnakeUI.hideIntroScreen();
	document.addEventListener('keydown', function(e) {
		snakeGame.moveSnakeOnKeyPush(e);
	});
});
btnRestart.addEventListener('click', function() {
	snakeGame.restartGame();
	SnakeUI.hideGameOverScreen();
});
