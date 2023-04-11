const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const startBtn = document.querySelector(".start");
const buttons = document.querySelector(".buttons-wrapper");
buttons.style.display = "none";

// fit canvas width and height to windows
/* ctx.canvas.width = window.innerWidth - 200;
ctx.canvas.height = window.innerHeight; */

window.addEventListener("load", () => {
  canvas.style.display = "none";

  startBtn.addEventListener("click", () => {
    start();
  });

  const restartBtn = document.querySelector(".restart");

  restartBtn.addEventListener("click", () => {
    canvas.reload();
  });

  const mainMenuBtn = document.querySelector(".main-menu");

  mainMenuBtn.addEventListener("click", () => {
    location.reload();
  });
});

function start() {
  startBtn.style.display = "none";
  document.querySelector("h1").style.display = "none";
  document.querySelector(".body-container").style.display = "none";
  canvas.style.display = "block";

  buttons.style.display = "block";

  // PADDLE VARIABLES

  const paddleHeight = 15;
  const paddleSizeInput = document.getElementById("paddle-size-input");
  const paddleWidth = parseInt(paddleSizeInput.value);
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

  const ballSizeInput = document.getElementById("ball-size-input");
  const ballRadius = parseInt(ballSizeInput.value);
  // ball X and Y axis position
  let ballX = paddleX + paddleWidth / 2;
  let ballY = canvas.height - (paddleHeight + ballRadius);

  // speed of the ball
  const ballSpeedInput = document.getElementById("ball-speed-input");
  const ballSpeed = parseInt(ballSpeedInput.value);

  //ball velocity
  let ballDirectionX = ballSpeed;
  let ballDirectionY = ballSpeed;

  let ballLaunched = false;

  // score, lives, gameOver
  let lives = 3;
  let scoreMultiply = 1;
  let score = 0;

  function scoreMultiplier() {
    // multiply score by 2 if ballSpeed greater than 15
    switch (true) {
      case ballSpeed >= 25:
        scoreMultiply *= 4;
        break;
      case ballSpeed >= 20:
        scoreMultiply *= 3;
        break;
      case ballSpeed >= 15:
        scoreMultiply *= 2;
        break;
      case ballSpeed <= 5:
        scoreMultiply *= 0.5;
        break;

      default:
        // do nothing if none of the above conditions are met
        break;
    }

    switch (true) {
      case paddleWidth <= 25:
        scoreMultiply *= 4;
        break;
      case paddleWidth <= 50:
        scoreMultiply *= 3;
        break;
      case paddleWidth <= 75:
        scoreMultiply *= 2;
        break;

      default:
        // do nothing if none of the above conditions are met
        break;
    }

    switch (true) {
      case ballRadius <= 5:
        scoreMultiply *= 2;
        break;
      default:
        // do nothing if none of the above conditions are met
        break;
    }
  }

  scoreMultiplier();

  function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(`Score: ${score}`, 5, 20);
  }

  function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(`Lives: ${lives}`, canvas.width - 70, 20);
  }

  function congratulationsScreen() {
    ctx.font = "40px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("CONGRATULATIONS", canvas.width / 2 - 120, canvas.height / 2);
    ctx.fillText("please buy the game to unlock more levels", canvas.width / 2 - 300, canvas.height / 2 + 60);
  }

  function gameOverScreen() {
    ctx.font = "40px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("GAME OVER", canvas.width / 2 - 120, canvas.height / 2);
  }

  function gameOver() {
    if (lives === 0) {
      cancelAnimationFrame(animationFrameId);
      gameOverScreen();
    }
  }

  function congratulations() {
    if (score === brick.rows * brick.cols * scoreMultiply) {
      cancelAnimationFrame(animationFrameId);
      congratulationsScreen();
    }
  }

  // BRICKS
  // target the input from the HTML page
  const brickRowsInput = document.getElementById("brick-rows-input");
  // tried the same with the columns but is

  const brickColsInput = document.getElementById("brick-cols-input");

  // create a brick object
  let brick = {
    // get rows value from the input
    rows: parseInt(brickRowsInput.value),
    // get columns value from the input
    cols: 10,
    get width() {
      return canvas.width / this.cols;
    },
    height: 30,
    hit: true,
  };

  // function that create and push bricks into the array

  function bricks() {
    brickField = [];
    const marginTop = 50;

    for (let row = 0; row < brick.rows; row++) {
      for (let col = 0; col < brick.cols; col++) {
        brickField.push({
          x: col * brick.width,
          y: row * brick.height + marginTop,
          height: brick.height,
          width: brick.width,
          color: "white",
          hit: true,
        });
      }
    }
  }

  bricks();

  // draw bricks into the canvas
  function drawBricks() {
    brickField.forEach((brick) => {
      if (brick.hit === true) {
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
      }
    });
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
    // Set the direction of the ball
    let angle = Math.PI / 2;
    ballDirectionX = 0;
    ballDirectionY = ballSpeed * Math.sin(angle);

    // Set ballLaunched to true
    ballLaunched = true;
  }

  function moveBall() {
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

  // Collision
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
      // decrease lives
      if (lives > 0) {
        lives--;
      }
    }

    // if the ball hit the bricks
    brickField.forEach((brick) => {
      if (brick.hit === true) {
        if (
          ballX + ballRadius > brick.x &&
          ballX - ballRadius < brick.x + brick.width &&
          ballY + ballRadius > brick.y &&
          ballY - ballRadius < brick.y + brick.height
        ) {
          ballDirectionY *= -1;
          brick.hit = false;

          score += 1 * scoreMultiply;
        }
      }
    });
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
      if (!ballLaunched) {
        launchBall();
      }
    }
  });

  document.addEventListener("keyup", (event) => {
    isPaddleGoingLeft = false;
    isPaddleGoingRight = false;
  });

  // moving paddle with the mouse

  document.addEventListener("mousemove", (event) => {
    //check if the target of the event is the canvas element
    if (event.target === canvas) {
      //horizontal distance between the mouse pointer and the canvas
      let mouseX = event.offsetX;
      paddleX = mouseX - paddleWidth / 2;

      if (paddleX < 0) {
        paddleX = 0;
      } else if (paddleX + paddleWidth > canvas.width) {
        paddleX = canvas.width - paddleWidth;
      }
    }
  });

  //launch ball with the click

  canvas.addEventListener("click", (event) => {
    if (!ballLaunched) {
      launchBall();
    }
  });

  //loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();

    drawBricks();
    drawBall();
    moveBall();

    drawScore();
    drawLives();
    ballCollision();
    animationFrameId = requestAnimationFrame(animate);

    gameOver();
    congratulations();
  }
  animate();
}
