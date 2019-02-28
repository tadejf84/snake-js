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
	tail: 4, // initial snake tail length
	blockSize: 20, // block size
	dx: 0, // player x speed
	dy: 0 // player y speed
};

/*
* main snake game function
*/
function snake() {
	drawCanvas();
	setInterval(game, 50);
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

	// draw snake trail rectangle
	c.fillStyle = 'green';
	c.fillRect(
		settings.playerX * settings.blockSize,
		settings.playerY * settings.blockSize,
		settings.blockSize - 2,
		settings.blockSize - 2
	);
}

/*
* draw apple
*/
function drawApple() {}

/*
* run game
*/
function game(settings) {
	drawSnake(settings);
}

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
document.addEventListener('DOMContentLoaded', snake);
document.addEventListener('keydown', keyPush);
