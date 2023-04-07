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

function moveBall = () {
  ballX += ballDirectionX;
  ballY += ballDirectionY;
}


function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 100;
}

function drawBall() {
  ctx.beginPath();
  // xPos, yPos, width, height
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  drawBall();
  moveBall()



  animationFrameId = requestAnimationFrame(animate);
}
animate();

document.addEventListener("keydown", (event) => {
  console.log(event);
  if (event.code === "ArrowLeft") {
    isPaddleGoingLeft = true;
  }
  if (event.code === "ArrowRight") {
    isPaddleGoingRight = true;
  }
});

document.addEventListener("keyup", (event) => {
  isPaddleGoingLeft = false;
  isPaddleGoingRight = false;
});
