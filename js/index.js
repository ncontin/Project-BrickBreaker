const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("start");

/* window.addEventListener("load", () => {
  canvas.style.display = "none";

  startBtn.addEventListener("click", () => {
    start();
  });
});

function start() {} */

startBtn.style.display = "none";
document.querySelector("h1").style.display = "none";
canvas.style.display = "block";
canvas.style.background = "black";

// PADDLE VARIABLES
const paddleWidth = 120;
const paddleHeight = 15;
const paddleSpeedValue = 5;
let paddleX = canvas.width / 2 - paddleWidth / 2;
let paddleY = canvas.height - paddleHeight;

let isPaddleGoingLeft = false;
let isPaddleGoingRight = false;

function drawPaddle() {
  ctx.beginPath();
  // xPos, yPos, width, height
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
  if (isPaddleGoingLeft) {
    if (paddleX > 0) {
      paddleX -= paddleSpeedValue;
    }
  } else if (isPaddleGoingRight) {
    if (paddleX < canvas.width - paddleWidth) {
      paddleX += paddleSpeedValue;
    }
  }
}

// BALL VARIABLES

// ball size
const ballRadius = 10;
// ball X and Y axis position
let ballX = paddleX + paddleWidth / 2;
let ballY = canvas.height - (paddleHeight + ballRadius);

// speed of the ball
let ballSpeed = 1;

//ball velocity
let ballDirectionX = ballSpeed;
let ballDirectionY = ballSpeed;

let ballLaunched = false;

// BRICKS VARIABLES

const brickX = 0;
const brickY = 0;
const brickHeight = 10;
const brickWidth = 75;

function drawBricks() {
  ctx.beginPath();
  // xPos, yPos, width, height
  ctx.rect(brickX, brickY, brickWidth, brickHeight);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}

function drawBall() {
  ctx.beginPath();
  // xPos, yPos, width, height
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function launchBall() {
  // ball already in motion
  // Set the direction of the ball

  let angle = Math.PI / 2;
  ballDirectionX = 0;
  ballDirectionY = ballSpeed * Math.sin(angle);
  // Set ballLaunched to true
  ballLaunched = true;
}

function moveBall() {
  // move the stationary ball with the paddle

  if (!ballLaunched) {
    // Set the ball position to the paddle position
    ballX = paddleX + paddleWidth / 2;
    ballY = canvas.height - (paddleHeight + ballRadius);
  } else {
    // Move the ball
    ballX += ballDirectionX;
    ballY -= ballDirectionY;
  }

  //change the direction of the ball after the collision
  if (ballY + ballRadius > paddleY && ballX + ballRadius > paddleX && ballX < paddleX + paddleWidth) {
    let deltaX = ballX + ballRadius - (paddleX + paddleWidth / 2);
    ballDirectionX = (deltaX / (paddleWidth / 2)) * ballSpeed;
  }
}

// Collisions
function ballCollision() {
  // if the ball hit the right wall
  if (ballX > canvas.width - ballRadius) {
    ballDirectionX *= -1;
  }
  // if the ball hit the left wall
  if (ballX < 0 + ballRadius) {
    ballDirectionX *= -1;
  }
  // if the ball hit the top wall
  if (ballY < 0) {
    ballDirectionY *= -1;
  }
  // if the ball hit the paddle
  if (ballY + ballRadius > paddleY && ballX + ballRadius > paddleX && ballX < paddleX + paddleWidth) {
    ballDirectionY *= -1;
  }

  // if the ball fall
  if (ballY > canvas.height) {
    ballLaunched = false;
  }

  // if the ball hit the bricks
  if (ballY < brickY + brickHeight + ballRadius && ballX < brickX + brickWidth + ballRadius) {
    ballDirectionY *= -1;
  }
}

// event listener

document.addEventListener("keydown", (event) => {
  console.log(event);
  if (event.code === "ArrowLeft") {
    isPaddleGoingLeft = true;
  }
  if (event.code === "ArrowRight") {
    isPaddleGoingRight = true;
  }
  if (event.code === "Space") {
    ballLaunched = true;
  }
});

document.addEventListener("keyup", (event) => {
  isPaddleGoingLeft = false;
  isPaddleGoingRight = false;
});

// moving paddle with the mouse

document.addEventListener("mousemove", (event) => {
  let mouseX = event.offsetX;
  paddleX = mouseX - paddleWidth / 2;

  if (paddleX < 0) {
    paddleX = 0;
  } else if (paddleX + paddleWidth > canvas.width) {
    paddleX = canvas.width - paddleWidth;
  }
});

//launch ball with the click

canvas.addEventListener("click", (event) => {
  if (!ballLaunched) {
    launchBall();
  }
});

console.log(event);

//loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  drawBall();
  drawBricks();
  moveBall();
  ballCollision();

  animationFrameId = requestAnimationFrame(animate);
}
animate();
