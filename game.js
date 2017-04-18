// game.js
// Description: object that runs the game

"use strict";

var app = app || {};

window.onload = function () {
	app.main.init();

};

app.main = {
	// properties
	canvas: undefined,
	ctx: undefined,
	myKeys: undefined,
	bgAudio: undefined,

	lives: 3,
	score: 0,
	level: 1,

	GAME_STATE: Object.freeze({
		BEGIN: 0,
		DEFAULT: 1,
		ROUND_OVER: 2,
		END: 3,
		PAUSED: 4
	}),
	gameState: undefined,
	paused: false,

	moveLeft: false,
	moveRight: false,

	NUM_CIRCLES: 2,

	// set up the player
	player: {
		// properties
		size: 50,
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
		this.myKeys = app.myKeys;
		this.bgAudio = document.querySelector("#bgAudio");
		bgAudio.volume = 0.25;
		this.initializeCircle();
		this.initializeCircle();
		this.update();
	},

	// update function.
	update: function () {
		this.animationID = requestAnimationFrame(this.update.bind(this));

		var dt = this.calculateDeltaTime();

		this.drawCanvas(dt);

		this.checkCollisions(dt);

		bgAudio.play();

		// checks for keypresses
		if (this.myKeys.keydown[this.myKeys.KEYBOARD.KEY_LEFT]) {
			this.moveLeft = true;
		}
		else {
			this.moveLeft = false;
		}
		if (this.myKeys.keydown[this.myKeys.KEYBOARD.KEY_RIGHT]) {
			this.moveRight = true;
		}
		else {
			this.moveRight = false;
		}

		//this.drawCircles();
	},

	// draws basic canvas
	drawCanvas: function (num) {
		this.ctx.clearRect(0, 0, canvas.width, canvas.height);

		// game loop
		if (this.gameState != this.GAME_STATE.END) {

			// background color
			this.ctx.fillStyle = "#B3B3B3";
			this.ctx.fillRect(0, 0, canvas.width, canvas.height);

			// score
			this.ctx.fillStyle = "black";
			this.ctx.font = "20px Dosis";
			this.ctx.textAlign = "left";
			this.ctx.fillText("Score: " + this.score, 10, 25);
			this.ctx.fillText("Lives: " + this.lives, 10, 45);

			// initial game screen
			if (this.gameState == this.GAME_STATE.BEGIN) {
				this.ctx.textAlign = "center";
				this.ctx.font = "20px Verdana";
				this.ctx.fillText("PRESS SPACE TO PLAY", this.canvas.width / 2, 475);
				if (this.myKeys.keydown[this.myKeys.KEYBOARD.KEY_SPACE]) {
					this.gameState = this.GAME_STATE.DEFAULT;
				}
			}

			// actual gameplay, and checks if paused is ever pressed
			if (this.gameState == this.GAME_STATE.DEFAULT) {
				this.drawPlayer();
				this.drawCircles(num);

				// checks for pause 
				if (this.myKeys.keydown[this.myKeys.KEYBOARD.KEY_PAUSE] && !this.paused) {
					this.pauseGame();
					return;
				}

				// checks for game over
				if (this.lives == 0) {
					this.gameState = this.GAME_STATE.END;
				}

				// checks for round over
				if (this.score == this.level*100) {
					this.gameState = this.GAME_STATE.ROUND_OVER
				}
			}

			// if the game is paused, draw the pause screen and enable resuming
			if (this.gameState == this.GAME_STATE.PAUSED) {
				this.drawPause();
				if (this.myKeys.keydown[this.myKeys.KEYBOARD.KEY_SPACE] && this.paused) {
					this.resume();
					return;
				}

			}

			// if the round is over, continue to next level
			if (this.gameState == this.GAME_STATE.ROUND_OVER) {
				//this.pauseGame();
				this.ctx.save();
				this.ctx.textAlign = "center";
				this.ctx.fillText("SCORE: " + this.score, this.canvas.width/2, 230);
				this.ctx.fillText("PRESS SPACE FOR NEXT LEVEL", this.canvas.width/2, 260);
				if (this.myKeys.keydown[this.myKeys.KEYBOARD.KEY_SPACE]) {
					//this.resume();
					this.NUM_CIRCLES++;
					// creates circles
					this.initializeCircle();
					this.gameState = this.GAME_STATE.DEFAULT;
					this.nextLevel();
				}
			}
		}

		// draws game over screen
		else {
			this.ctx.fillStyle = "black";
			this.ctx.font = "35px Dosis";
			this.ctx.textAlign = "center";
			this.ctx.fillText("GAME OVER!", this.canvas.width / 2, 175);

			this.ctx.font = "20px Verdana";
			this.ctx.fillText("PRESS SPACE TO PLAY AGAIN", this.canvas.width / 2, 475);

			this.ctx.fillText("SCORE: " + this.score, this.canvas.width / 2, 230);

			if (this.myKeys.keydown[this.myKeys.KEYBOARD.KEY_SPACE]) {
				this.gameState = this.GAME_STATE.DEFAULT;
				this.playAgain();
			}
		}

		// keeps the level on the screen
		document.getElementById("level").innerHTML = "Level: " + this.level;
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
		// console.log("ADDING ONE CIRCLE");
		this.fallingCircles.push({
			x: Math.random() * canvas.width,
			y: 0,
			speed: Math.floor((Math.random() + 1) * 3),
			color: ["black", "purple", "white"]
		});
	},

	// draws the circles falling
	drawCircles: function (num) {

		console.log(this.fallingCircles.length);

		for (var i = 0; i < this.NUM_CIRCLES; i++) {
			this.ctx.beginPath();
			this.ctx.arc(this.fallingCircles[i].x, this.fallingCircles[i].y, 5, 0, 2 * Math.PI);
			this.ctx.fillStyle = this.fallingCircles[i].color[Math.floor(Math.random() * 3)];
			this.ctx.fill();
			this.ctx.stroke();
		}

		// circles
		for (var i = 0; i < this.NUM_CIRCLES; i++) {
			this.fallingCircles[i].y = this.fallingCircles[i].y + this.fallingCircles[i].speed;
			if (this.fallingCircles[i].y > canvas.height) {
				this.fallingCircles.splice(i, 1);
				this.initializeCircle();
				this.lives--;
			}
		}

		// player
		if (this.moveLeft && this.player.x > 0) {
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
				this.initializeCircle();
			}
		}
	},

	// resets game, life, and score 
	playAgain: function () {
		for(var i = this.fallingCircles.length; i >0 ;i--){
			this.fallingCircles.pop();
		}
		for(var i = this.NUM_CIRCLES; i > 0; i--) {
			this.initializeCircle();
		}
		this.player.color = "#E887E5";
		this.level = 1;
		this.score = 0;
		this.lives = 3;
	},

	nextLevel: function () {
		for(var i = this.fallingCircles.length; i >0 ;i--){
			this.fallingCircles.pop();
		}
		for(var i = this.NUM_CIRCLES; i > 0; i--) {
			this.initializeCircle();
		}
		this.player.color = "#E887E5";
		this.level++;
		this.score = 0;
		this.lives++;
	},

	// pause the game
	pauseGame: function () {
		this.paused = true;
		cancelAnimationFrame(this.animationID);
		this.update();
		this.gameState = this.GAME_STATE.PAUSED;
	},

	// resume the game
	resume: function () {
		cancelAnimationFrame(this.animationID);
		this.paused = false;
		this.update();
		this.gameState = this.GAME_STATE.DEFAULT;
	},

	// draw pause screen
	drawPause: function () {
		this.ctx.save();
		this.ctx.fillStyle = "black";
		this.ctx.font = "35px Dosis";
		this.ctx.textAlign = "center";
		this.ctx.fillText("PAUSED!", this.canvas.width / 2, 175);

		this.ctx.font = "20px Dosis";
		this.ctx.fillText("PRESS SPACE TO RESUME", this.canvas.width / 2, 475);

		this.ctx.fillText("SCORE: " + this.score, this.canvas.width / 2, 230);
	}
};
