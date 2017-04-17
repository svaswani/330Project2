// game.js
// Description: object that runs the game

"use strict";

var app = app || {};

app.main = {
	// properties
	canvas: undefined,
	ctx: undefined,

	lives: 3,
	score: 0,
	level: 1,

	GAME_STATE: Object.freeze({
		BEGIN: 0,
		DEFAULT: 1,
		ROUND_OVER: 2,
		END: 3,
	}),
	gameState: undefined,

	moveLeft: false,
	moveRight: false,

	NUM_CIRCLES: 5,

	// set up the player
	player: {
		// properties
		size: 35,
		//color: "#E887E5",
		// put in middle of screen
		x: (this.canvas.width - 30) / 2,
		y: this.canvas.height - 85

	},

	fallingCircles: [],

	// methods
	// initializes the game
	init: function () {
		console.log("app.main.init() called");
		// set up canvas
		this.canvas = document.getElementById("canvas");
		this.ctx = this.canvas.getContext("2d");


		// event listeners for keys up and down
		document.addEventListener("keydown", keysDown, false);
		document.addEventListener("keyup", keysUp, false);

		// creates circles
		for (var i = 0; i < numCircles; i++) {
			this.initializeCircle();
		}

		this.update();

	},

	// update function
	update: function () {
		this.animationID = requestAnimationFrame(this.update.bind(this));

		this.drawCircles(dt);
		// circles
		for (var i = 0; i < this.fallingCircles.length; i++) {
			this.fallingCircles[i].y = this.fallingCircles[i].y + this.fallingCircles[i].speed;

			if (fallingCircles[i].y == Math.floor(canvas.height / 2)) {
				initializeCircle();
			} else if (fallingCircles[i].y > canvas.height) {
				fallingCircles.splice(i, 1);
			}
		}
		// player
		if (moveLeft && player.x > 0) {
			player.x -= 7;
		}
		if (moveRight && player.x + player.size < canvas.width) {
			player.x += 7;
		}

		checkCollisions();

	},

	draw: function () {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		if (!gameOver) {

			// background color
			ctx.fillStyle = "#B3B3B3";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			drawPlayer();
			drawCircles();
			Update();

			// score
			ctx.fillStyle = "black";
			ctx.font = "20px Dosis";
			ctx.textAlign = "left";
			ctx.fillText("Score: " + score, 10, 25);

			// lives
			// ctx.textAlign = "right";
			// ctx.fillText("Lives: " + lives, 500, 25);
		}
		else {
			ctx.fillStyle = "black";
			ctx.font = "35px Dosis";
			ctx.textAlign = "center";
			ctx.fillText("GAME OVER!", canvas.width / 2, 175);

			ctx.font = "20px Verdana";
			ctx.fillText("PRESS SPACE TO PLAY", canvas.width / 2, 475);

			ctx.fillText("SCORE: " + score, canvas.width / 2, 230);
		}
		document.getElementById("level").innerHTML = "Level: " + level;

	},

	// when key is pressed down, move
	keysDown: function (e) {
		// right arrow key
		if (e.keyCode == 39) {
			this.moveRight = true;
		}
		// left arrow key
		else if (e.keyCode == 37) {
			this.moveLeft = true;
			console.log('left');
		}
		// space bar to start
		else if (e.keyCode == 32 && gameOver) {
			// call playAgain to start the game
			playAgain();
		}
	},

	// if a key is released then stop movement
	keysUp: function (e) {
		if (e.keyCode == 39) {
			moveRight = false;
		}
		else if (e.keyCode == 37) {
			moveLeft = false;
		}
	},

	// creates falling circles
	initializeCircle: function () {
		fallingCircles.push({
			x: Math.random() * canvas.width,
			y: 0,
			speed: Math.floor((Math.random() + 1) * 3),
			color: ["black", "purple", "white"]
		});
	},

	// draws the circles falling
	drawCircles: function (num) {
		for (var i = 0; i < fallingCircles.length; i++) {
			ctx.beginPath();
			ctx.arc(fallingCircles[i].x, fallingCircles[i].y, 5, 0, 2 * Math.PI);
			ctx.fillStyle = fallingCircles[i].color[Math.floor(Math.random() * 3)];
			ctx.fill();
			ctx.stroke();
		}
	},

	// draw player to canvas
	drawPlayer: function () {
		var img = document.getElementById("toilet");
		ctx.drawImage(img, player.x, player.y);
	},

	// check for collisions between player and falling circles
	checkCollisions: function () {
		for (var i = 0; i < fallingCircles.length; i++) {
			if (player.x < fallingCircles[i].x + 5 &&
				player.x + player.size > fallingCircles[i].x &&
				player.y < fallingCircles[i].y + 5 &&
				player.size + player.y > fallingCircles[i].y) {
				score += 10;
				fallingCircles.splice(i, 1);
			}
		}
	},

	// resets game, life, and score 
	playAgain: function () {
		gameOver = false;
		player.color = "#E887E5";
		level = 1;
		score = 0;
		lives = 3;

	}
};
