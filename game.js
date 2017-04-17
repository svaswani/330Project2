// game.js
// Description: object that runs the game

"use strict";

var app = app || {};

window.onload = function () {
	app.main.init();
};

window.addEventListener("keydown", function (e) {
	// right arrow key
	if (e.keyCode == 39) {
		this.moveRight = true;
	}
	// left arrow key
	else if (e.keyCode == 37) {
		this.moveLeft = true;
	}
});
window.addEventListener("keyup", function (e) {
	// right arrow key
	if (e.keyCode == 39) {
		this.moveRight = false;
	}
	// left arrow key
	else if (e.keyCode == 37) {
		this.moveLeft = false;
	}
});

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

	NUM_CIRCLES: 2,

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
		// set up canvas
		this.canvas = document.getElementById("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.gameState = this.GAME_STATE.BEGIN;
		this.update();
	},

	// update function.
	update: function () {
		this.animationID = requestAnimationFrame(this.update.bind(this));

		var dt = this.calculateDeltaTime();

		this.drawCanvas();

		this.checkCollisions();

		this.drawCircles(dt);

		

		//this.drawCircles();
	},

	// draws basic canvas
	drawCanvas: function () {
		this.ctx.clearRect(0, 0, canvas.width, canvas.height);
		if (this.gameState != this.GAME_STATE.END) {

			// background color
			this.ctx.fillStyle = "#B3B3B3";
			this.ctx.fillRect(0, 0, canvas.width, canvas.height);

			this.drawPlayer();
			//this.drawCircles();

			// score
			this.ctx.fillStyle = "black";
			this.ctx.font = "20px Dosis";
			this.ctx.textAlign = "left";
			this.ctx.fillText("Score: " + this.score, 10, 25);
		}
		else {
			this.ctx.fillStyle = "black";
			this.ctx.font = "35px Dosis";
			this.ctx.textAlign = "center";
			this.ctx.fillText("GAME OVER!", this.canvas.width / 2, 175);

			this.ctx.font = "20px Verdana";
			this.ctx.fillText("PRESS SPACE TO PLAY", this.canvas.width / 2, 475);

			this.ctx.fillText("SCORE: " + this.score, this.canvas.width / 2, 230);
		}
		document.getElementById("level").innerHTML = "Level: " + level;
	},

	// calculate how much time has passed
	calculateDeltaTime: function () {
		var now, fps;
		now = performance.now();
		fps = 1000 / (now - this.lastTime);
		fps = Math.max(60, Math.min(fps, 12));
		this.lastTime = now;
		return 1 / fps;
	},

	// creates falling circles
	initializeCircle: function () {
		this.fallingCircles.push({
			x: Math.random() * canvas.width,
			y: 0,
			speed: Math.floor((Math.random() + 1) * 3),
			color: ["black", "purple", "white"]
		});
	},

	// draws the circles falling
	drawCircles: function (num) {

		// creates circles
		for (var i = 0; i < num/4; i++) {
			this.initializeCircle();
		}

		for (var i = 0; i < this.fallingCircles.length; i++) {
			this.ctx.beginPath();
			this.ctx.arc(this.fallingCircles[i].x, this.fallingCircles[i].y, 5, 0, 2 * Math.PI);
			this.ctx.fillStyle = this.fallingCircles[i].color[Math.floor(Math.random() * 3)];
			this.ctx.fill();
			this.ctx.stroke();
		}
		// circles
		for (var i = 0; i < this.fallingCircles.length; i++) {
			this.fallingCircles[i].y = this.fallingCircles[i].y + this.fallingCircles[i].speed;

			if (this.fallingCircles[i].y > canvas.height) {
				this.fallingCircles.splice(i, 1);
			}
		}

		// player
		if (this.moveLeft && this.player.x > 0) {
			console.log('key press');
			this.player.x -= 7;
		}
		if (this.moveRight && this.player.x + this.player.size < this.canvas.width) {
			this.player.x += 7;
		}
	},

	// draw player to canvas
	drawPlayer: function () {
		var img = document.getElementById("toilet");
		this.ctx.drawImage(img, this.player.x, this.player.y);
	},

	// check for collisions between player and falling circles
	checkCollisions: function () {
		for (var i = 0; i < this.fallingCircles.length; i++) {
			if (this.player.x < this.fallingCircles[i].x + 5 &&
				this.player.x + this.player.size > this.fallingCircles[i].x &&
				this.player.y < this.fallingCircles[i].y + 5 &&
				this.player.size + this.player.y > this.fallingCircles[i].y) {
				this.score += 10;
				this.fallingCircles.splice(i, 1);
			}
		}
	},

	// resets game, life, and score 
	playAgain: function () {
		//gameOver = false;
		this.player.color = "#E887E5";
		this.level = 1;
		this.score = 0;
		this.lives = 3;

	}
};
