/*
* DOM caching
*/
const canvas = document.getElementById('console');
const c = canvas.getContext('2d');
const scoreboard = document.getElementById('scoreboard');
const lvlCounter = document.getElementById('lvl');
const btnRestart = document.getElementById('restart');
const lostScreen = document.getElementById('lost-screen');
const endScore = document.getElementById('endscore');
const btnStart = document.getElementById('btn-start');
const introScreen = document.getElementById('intro-screen');
const gameControl = document.getElementById('game-control');

/*
* class timer - to control the speed of the game
*/
class Timer {
	
		constructor (fn, speed) {
			this.speed = speed;
			this.fn = fn;
			this.timerObj = setInterval(this.fn, this.speed);
		}
	
		// stop interval
		stop () {
			if(this.timerObj) {
				  clearInterval(this.timerObj);
          this.timerObj = null;
			}
			return this;
		}

		// restart the interval with old speed settings
		start () {
			if (!this.timerObj) {
					this.stop();
					this.timerObj = setInterval(this.fn, this.speed);
			}
			return this;
		}
	
		// stop and reset to new interval speed
		reset (newSpeed) {
			 this.speed = newSpeed;
       return this.stop().start();
		}

}

/*
* class snake - for game instance
*/
class Snake {
	
	constructor (settings) {
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
		this.started = false; // game not started on init
		this.level = 1; // initial lvl
		this.timer = new Timer( () => {
			this.init();
		}, this.speed);
	}
	
	// init game
	init () {
		this.drawCanvas();
		this.drawSnake();
		this.drawApple();
		this.timer.start();
	}
	
	// draw canvas
	drawCanvas () {
		c.fillStyle = 'black';
		c.fillRect(0, 0, canvas.height, canvas.width);
	}
	
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
		for (let i = 0; i < this.trail.length; i++) {
			c.fillRect(
				this.trail[i].x * this.blockSize,
				this.trail[i].y * this.blockSize,
				this.blockSize - 2,
				this.blockSize - 2
			);
			// detect collision -> reset tail to initial, reset score
			if (
				this.trail[i].x === this.playerX &&
				this.trail[i].y === this.playerY &&
				this.started === true
			) {
				this.tail = 4;
				//this.restartGame();
				SnakeUI.showLostScreen(this.score, this.restartGame);
			}
		}

		// push player coordinates in snake trail array
		this.trail.push({ x: this.playerX, y: this.playerY });

		// set trail array to only maximum allowed elements of tail
		while (this.trail.length > this.tail) {
			this.trail.shift();
		}
	}
	
	// draw apple
	drawApple() {
		
		// if player position is equal to apple position, grow tail, randomly spawn new apple and add score
		if (this.appleX === this.playerX && this.appleY === this.playerY) {
			this.tail++;
			this.addScore();
			this.appleX = Math.floor(Math.random() * this.blockSize);
			this.appleY = Math.floor(Math.random() * this.blockSize);
		}

		// draw apple
		c.fillStyle = 'red';
		c.fillRect(
			this.appleX * this.blockSize,
			this.appleY * this.blockSize,
			this.blockSize - 2,
			this.blockSize - 2
		);
	}
	
	// add score
	addScore() {
		this.score++;
		SnakeUI.displayScore(this.score);
		if (this.score % 2 === 0 && this.speed >= 50) {
			this.level++;
			SnakeUI.displayLvl(this.level);
			this.speed = this.speed - 15;
			this.timer.reset(this.speed);
		}
	}
	
	restartGame () {
		this.playerX = 10; 
		this.playerY = 10;
		this.appleX = Math.floor(Math.random() * this.blockSize);
		this.appleY = Math.floor(Math.random() * this.blockSize);
		this.trail = [];
		this.tail = settings.tail;
		this.dx = 0;
		this.dy = 0;
		this.score = 0;
		this.speed = settings.speed;
		this.started = false;
		this.level = 1; 
		this.timer.reset(settings.speed);
	}

	keyPush (e) {
		const key = e.keyCode;
		
		// start game
		if (this.started === false) {
			this.started = true;
		}
		
		if (key === 37 && this.dx !== -1 && this.dx !== 1) {
			this.dx = -1;
			this.dy = 0;
		} else if (key === 38  && this.dy !== -1 && this.dy !== 1) {
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
	static initialStats() {
		scoreboard.innerText = 0;
		lvlCounter.innerText = 1;
	}
	static displayScore (score) {
			scoreboard.innerText = score;
	}
	static displayLvl (lvl) {
			lvlCounter.innerText = lvl;
	}
	static showLostScreen (score, fn) {
		if(!lostScreen.classList.contains('show')) {
			lostScreen.classList.add('show');
			gameControl.classList.remove('show');
			endScore.innerText = score;	
			fn();
		} 
	}
	static hideLostScreen (fn) {
		if(lostScreen.classList.contains('show')) {
			lostScreen.classList.remove('show');
			endScore.innerText = 0;	
			gameControl.classList.add('show');
		}
	}
	static hideIntroScreen () {
		introScreen.classList.add('hide');
		gameControl.classList.add('show');
	}
}


// instantiate the game
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
	SnakeUI.initialStats();
	SnakeUI.hideIntroScreen();
	document.addEventListener('keydown', function(e){
		snakeGame.keyPush(e);
	});
});
btnRestart.addEventListener('click', function() {
	snakeGame.restartGame();
	SnakeUI.hideLostScreen();
});





