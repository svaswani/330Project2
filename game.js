"use strict";

// set up canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// variables
var lives = 3;
var score = 0;
var level = 1;

var moveLeft = false;
var moveRight = false;

// game over state 
var gameOver = true;
var paused = false;

var numCircles = 5;

// event listeners for keys up and down
document.addEventListener("keydown", keysDown, false);
document.addEventListener("keyup", keysUp, false);

// when key is pressed down, move
function keysDown(e) {
	// right arrow key
	if (e.keyCode == 39) {
		moveRight = true;
	}
	// left arrow key
	else if (e.keyCode == 37) {
		moveLeft = true;
	}
	// space bar to start
	else if (e.keyCode == 32 && gameOver) {
		// call play to start the game
		play(0);
	}
	// p key for pausing and resuming 
	else if (e.keyCode == 80 && paused === false) {
		console.log("p pressed");
		paused = true;
		console.log(paused);
	}
	else if (e.keyCode == 80 && paused) {
		console.log("p pressed");
		paused = false;
		console.log(paused);
	}
}

function drawPause(s) {
	score = s;

	ctx.fillStyle = "black";
	ctx.font = "35px Dosis";
	ctx.textAlign = "center";
	ctx.fillText("PAUSED!", canvas.width / 2, 175);

	ctx.font = "20px Dosis";
	ctx.fillText("PRESS P TO RESUME", canvas.width / 2, 475);

	ctx.fillText("SCORE: " + score, canvas.width / 2, 230);
}

// if a key is released then stop movement
function keysUp(e) {
	if (e.keyCode == 39) {
		moveRight = false;
	}
	else if (e.keyCode == 37) {
		moveLeft = false;
	}

}

// set up the player
var player = {
	// properties
	size: 35,
	//color: "#E887E5",
	// put in middle of screen
	x: (canvas.width - 30) / 2,
	y: canvas.height - 85

};

// set up falling objects
var fallingCircles = [];
function initializeCircle() {
	fallingCircles.push({
		x: Math.random() * canvas.width,
		y: 0,
		speed: Math.floor((Math.random() + 1) * 3),
		color: ["black", "purple", "white"]
	});
}
for (var i = 0; i < numCircles; i++) {
	initializeCircle();
}


function drawCircles() {
	for (var i = 0; i < fallingCircles.length; i++) {
		ctx.beginPath();
		ctx.arc(fallingCircles[i].x, fallingCircles[i].y, 5, 0, 2 * Math.PI);
		ctx.fillStyle = fallingCircles[i].color[Math.floor(Math.random() * 3)];
		ctx.fill();
		ctx.stroke();
	}
}

// draw player to canvas
function drawPlayer() {
	// ctx.beginPath();
	// ctx.rect(player.x, player.y, player.size, player.size);
	// ctx.fillStyle = player.color;
	// ctx.fill();
	// ctx.closePath();
	var img = document.getElementById("toilet");
	ctx.drawImage(img, player.x, player.y);
}

function checkCollisions() {
	for (var i = 0; i < fallingCircles.length; i++) {
		if (player.x < fallingCircles[i].x + 5 &&
			player.x + player.size > fallingCircles[i].x &&
			player.y < fallingCircles[i].y + 5 &&
			player.size + player.y > fallingCircles[i].y) {
			score += 10;
			fallingCircles.splice(i, 1);
		}

	}
}

// update function
function Update() {

	if(!paused) {
		// circles
		for (var i = 0; i < fallingCircles.length; i++) {
			fallingCircles[i].y = fallingCircles[i].y + fallingCircles[i].speed;

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
	}

	else if (paused) {
		drawPause(score);
	}

}
// end of game 
function gamesOver() {
	gameOver = true;
}

// resets game, life, and score 
function play(s) {
	gameOver = false;
	paused = false;
	level = 1;
	score = s;
	lives = 3;

}

function draw() {
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
		ctx.fillText("WELCOME!", canvas.width / 2, 175);

		ctx.font = "20px Dosis";
		ctx.fillText("PRESS SPACE TO PLAY AND P TO PAUSE", canvas.width / 2, 475);

		ctx.fillText("SCORE: " + score, canvas.width / 2, 230);
	}
	document.getElementById("level").innerHTML = "Level: " + level;
	requestAnimationFrame(draw);
}



draw();