/*
* DOM caching
*/
const canvas = document.getElementById('console');

/*
* game settings
*/
const gameSettings = {
	playerX: 10,
	playerY: 10,
	appleX: 5,
	appleY: 5
};

const snake = () => {
	drawCanvas();
};

/*
* draw canvas
*/
function drawCanvas() {
	// set 2D canvas
	const c = canvas.getContext('2d');

	// set canvas fill color
	c.fillStyle = 'black';
	c.fillRect(0, 0, canvas.height, canvas.width);
}

/*
* run game
*/
function game() {}

// event listener - DOM loaded
document.addEventListener('DOMContentLoaded', snake);
