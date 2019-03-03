/*
* DOM caching
*/
const canvas = document.getElementById('console');
const c = canvas.getContext('2d');

/*
* game settings
*/
const settings = {
	playerX: 10, // player initial x coordinate
	playerY: 10, // player initial y coordinate
	appleX: 5, // apple initital x coordinate
	appleY: 5, // apple initial y coordinate
	trail: [], // snake trail
	tail: 4, // initial snake tail length, following the snake head
	blockSize: 20, // block size
	dx: 0, // player x speed
	dy: 0 // player y speed
};

/*
* snake game
*/
function snake() {
	drawCanvas();
	drawSnake();
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

	// push player coordinates in snake tail
	settings.trail.push({ x: settings.playerX, y: settings.playerY });

	// loop through tail and draw snake
	c.fillStyle = 'green';
	for (let i = 0; i < settings.trail.length; i++) {
		c.fillRect(
			settings.trail[i].x * settings.blockSize,
			settings.trail[i].y * settings.blockSize,
			settings.blockSize - 2,
			settings.blockSize - 2
		);
		// detect collision and reset tail to initial
		if (settings.trail[i].x === settings.playerX && settings.trail[i].y === settings.playerY) {
			settings.tail = 4;
		}
	}

	// set trail array to only maximum allowed elements of tail
	while (settings.trail.length > settings.tail) {
		settings.trail.shift();
	}
}

/*
* draw apple
*/
function drawApple() {}

/*
* key events
*/
function keyPush(e) {
	switch (e.keyCode) {
		// left arrow
		case 37:
			settings.dx = -1;
			settings.dy = 0;
			console.log(settings);
			break;
		// up arrow
		case 38:
			settings.dx = 0;
			settings.dy = -1;
			break;
		// right arrow
		case 39:
			settings.dx = 1;
			settings.dy = 0;
			break;
		// down arrow
		case 40:
			settings.dx = 0;
			settings.dy = 1;
			break;
	}
}

// listen to events
document.addEventListener('DOMContentLoaded', function() {
	setInterval(snake, 50);
});
document.addEventListener('keydown', keyPush);
