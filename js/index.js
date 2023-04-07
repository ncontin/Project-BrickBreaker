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

//paddle code
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

//ball code

let ballX = 150;
let ballY = 170;
let ballRadius = 15;
let ballSpeed = 2;
let ballDirectionX = ballSpeed;
// ballSpeed * (Math.random() * 2 - 1); // Random trajectory
let ballDirectionY = ballSpeed;

function moveBall() {
  ballX += ballDirectionX;
  ballY += ballDirectionY;
}

// Collisions
function ballCollision() {
  if (ballX > canvas.width - ballRadius) {
    ballDirectionX *= -1;
  }
  if (ballX < 0 + ballRadius) {
    ballDirectionX *= -1;
  }
}

function resetBall() {
  ballX = paddleX + paddleWidth / 2;
  ballY = canvas.height - 2 * paddleHeight;
}

function drawBall() {
  ctx.beginPath();
  // xPos, yPos, width, height
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}
resetBall();
// Moving Paddle
document.addEventListener("keydown", (event) => {
  console.log(event);
  if (event.code === "ArrowLeft") {
    isPaddleGoingLeft = true;
  }
  if (event.code === "ArrowRight") {
    isPaddleGoingRight = true;
  }
  if (ballDirectionX === 0 && ballDirectionY === 0 && event.code === "Space") {
  }
});

document.addEventListener("keyup", (event) => {
  isPaddleGoingLeft = false;
  isPaddleGoingRight = false;
});

console.log(event);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  drawBall();
  resetBall();
  moveBall();
  ballCollision();

  animationFrameId = requestAnimationFrame(animate);
}
animate();

if (ballDirectionX || ballDirectionY) {
  drawBall();
}
