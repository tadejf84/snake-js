/*
* DOM caching
*/
const canvas = document.getElementById('console');
const c = canvas.getContext('2d');
const scoreboard = document.getElementById('scoreboard');
const livesCounter = document.getElementById('lives');
const lvlCounter = document.getElementById('lvl');

// game interval
let game;

/*
* game settings initial
*/
const settings = {
	playerX: 10, // player initial x coordinate
	playerY: 10, // player initial y coordinate
	appleX: 14, // apple initital x coordinate
	appleY: 3, // apple initial y coordinate
	trail: [], // snake trail
	tail: 4, // initial snake length
	blockSize: 20, // block size
	dx: 0, // player x speed
	dy: 0, // player y speed,
	score: 0, // init score
	speed: 200, // init game speed.
	started: false, // game not started on init,
	life: 3, // initial life,
	level: 1
};

/*
* snake game
*/
function snake() {
	drawCanvas();
	drawSnake();
	drawApple();
}

/*
* draw canvas - set canvas fill and size
*/
function drawCanvas() {
	c.fillStyle = 'black';
	c.fillRect(0, 0, canvas.height, canvas.width);
}

/*
* draw snake
*/
function drawSnake() {
	// recalculate player position on key event
	settings.playerX += settings.dx;
	settings.playerY += settings.dy;

	// detect movement off canvas boundaries
	if (settings.playerX < 0) {
		settings.playerX = settings.blockSize - 1;
	}
	if (settings.playerX > settings.blockSize - 1) {
		settings.playerX = 0;
	}
	if (settings.playerY < 0) {
		settings.playerY = settings.blockSize - 1;
	}
	if (settings.playerY > settings.blockSize - 1) {
		settings.playerY = 0;
	}

	// loop through tail and draw snake
	c.fillStyle = 'green';
	c.fillRect(
		settings.playerX * settings.blockSize,
		settings.playerY * settings.blockSize,
		settings.blockSize - 2,
		settings.blockSize - 2
	);
	for (let i = 0; i < settings.trail.length; i++) {
		c.fillRect(
			settings.trail[i].x * settings.blockSize,
			settings.trail[i].y * settings.blockSize,
			settings.blockSize - 2,
			settings.blockSize - 2
		);
		// detect collision -> reset tail to initial, reset score
		if (
			settings.trail[i].x === settings.playerX &&
			settings.trail[i].y === settings.playerY &&
			settings.started === true
		) {
			settings.tail = 4;
			resetScore();
		}
	}

	// push player coordinates in snake trail array
	settings.trail.push({ x: settings.playerX, y: settings.playerY });

	// set trail array to only maximum allowed elements of tail
	while (settings.trail.length > settings.tail) {
		settings.trail.shift();
	}
}

/*
* draw apple
*/
function drawApple() {
	// if player position is equal to apple position, grow tail, randomly spawn new apple and add score
	if (settings.appleX === settings.playerX && settings.appleY === settings.playerY) {
		settings.tail++;
		addScore();
		settings.appleX = Math.floor(Math.random() * settings.blockSize);
		settings.appleY = Math.floor(Math.random() * settings.blockSize);
	}

	// draw apple
	c.fillStyle = 'red';
	c.fillRect(
		settings.appleX * settings.blockSize,
		settings.appleY * settings.blockSize,
		settings.blockSize - 2,
		settings.blockSize - 2
	);
}

/*
* key events
*/
let prevKey;
function keyPush(e) {
	const key = e.keyCode;

	// start game
	if (settings.started === false) {
		settings.started = true;
		game = setInterval(snake, settings.speed);
	}

	if (key === 37 && prevKey !== 39 && prevKey !== 37) {
		settings.dx = -1;
		settings.dy = 0;
	} else if (key === 38 && prevKey !== 40 && prevKey !== 38) {
		settings.dx = 0;
		settings.dy = -1;
	} else if (key === 39 && prevKey !== 37 && prevKey !== 39) {
		settings.dx = 1;
		settings.dy = 0;
	} else if (key === 40 && prevKey !== 38 && prevKey !== 40) {
		settings.dx = 0;
		settings.dy = 1;
	}
	prevKey = e.keyCode;
}

/* 
* add score
*/
function addScore() {
	settings.score++;
	scoreboard.innerText = settings.score;
	if (settings.score % 2 === 0 && settings.speed >= 50) {
		settings.level++;
		lvlCounter.innerText = settings.level;
		settings.speed = settings.speed - 15;
		clearInterval(game);
		game = setInterval(snake, settings.speed);
	}
}

/*
* reset score
*/
function resetScore() {
	settings.life--;
	livesCounter.innerText = settings.life;
	if (settings.life < 1) {
		clearInterval(game);
	}
}

// listen to events
document.addEventListener('DOMContentLoaded', snake);
document.addEventListener('keydown', keyPush);
