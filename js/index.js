const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const startBtn = document.querySelector(".start");
const buttons = document.querySelector(".buttons-wrapper");
buttons.style.display = "none";
const mainMenuBtn = document.querySelector(".main-menu");

const multiScore = document.getElementById("multi-score");
const ballSpeedInput = document.getElementById("ball-speed-input");
const paddleSizeInput = document.getElementById("paddle-size-input");
const ballSizeInput = document.getElementById("ball-size-input");
const brickRowsInput = document.getElementById("brick-rows-input");
// score, lives, gameOver
let lives = 3;
let scoreMultiply = 1;
let score = 0;

// sounds object
const sounds = {
  ballBounce: new Audio("sounds/ball-bounce.wav"),
  ballHitBrick: new Audio("sounds/ball-hit-brick.wav"),
  ballHitPaddle: new Audio("sounds/ball-hit-paddle.wav"),
  gameOver: new Audio("sounds/game-over.m4a"),
  congratulations: new Audio("sounds/congratulations.wav"),
  musicFast: new Audio("sounds/music-fast.wav"),
  musicMedium: new Audio("sounds/music-medium.mp3"),
  musicSerious: new Audio("sounds/music-serious.mp3"),
  musicEasy: new Audio("sounds/music-easy.mp3"),
  musicDefault: new Audio("sounds/music-default.mp3"),
  ballLaunch: new Audio("sounds/launch-ball.wav"),
};

//sounds volume and loop

sounds.musicFast.volume = 0.2;
sounds.musicMedium.volume = 0.5;
sounds.musicSerious.volume = 0.5;
sounds.musicEasy.volume = 0.5;
sounds.musicDefault.volume = 0.5;
sounds.congratulations.volume = 0.8;
sounds.musicDefault.loop = true;
sounds.musicEasy.loop = true;
sounds.musicFast.loop = true;
sounds.musicMedium.loop = true;
sounds.musicSerious.loop = true;

// images

const imageBg = new Image();
imageBg.src = "img/background.jpg";

const ballImg = new Image();
ballImg.src = "img/ball.png";
const paddleImg = new Image();
paddleImg.src = "img/paddle.png";

const bricksImg = [];

bricksImg.push(new Image());
bricksImg[0].src = "img/brick-blue.png";
bricksImg.push(new Image());
bricksImg[1].src = "img/brick-brown.png";
bricksImg.push(new Image());
bricksImg[2].src = "img/brick-dark-green.png";
bricksImg.push(new Image());
bricksImg[3].src = "img/brick-green.png";
bricksImg.push(new Image());
bricksImg[4].src = "img/brick-grey.png";
bricksImg.push(new Image());
bricksImg[5].src = "img/brick-light-blu.png";
bricksImg.push(new Image());
bricksImg[6].src = "img/brick-orange.png";
bricksImg.push(new Image());
bricksImg[7].src = "img/brick-purple.png";
bricksImg.push(new Image());
bricksImg[8].src = "img/brick-red.png";
bricksImg.push(new Image());
bricksImg[9].src = "img/brick-yellow.png";

//////////////////////////////////////////////////

// fit canvas width and height to windows
ctx.canvas.width = window.innerWidth - 200;
ctx.canvas.height = window.innerHeight;
// score, lives, gameOver
// Define an object with some multipliers

window.addEventListener("load", () => {
  canvas.style.display = "none";
  // display Multi Score

  // declare each multiplier
  let multiBall = 1;
  let multiPaddle = 1;
  let multiSize = 1;

  ballSpeedInput.addEventListener("change", () => {
    if (ballSpeedInput.value >= 15) {
      multiBall = 2;
    }
    if (ballSpeedInput.value >= 20) {
      multiBall = 3;
    }
    if (ballSpeedInput.value >= 25) {
      multiBall = 4;
    }
    if (ballSpeedInput.value <= 5) {
      multiBall = 0.5;
    }
    if (ballSpeedInput.value < 15 && ballSpeedInput.value > 5) {
      multiBall = 1;
    }

    // combine multipliers
    let combineMulti = multiBall * multiPaddle * multiSize;

    // display inside the HTML

    multiScore.innerText = combineMulti;
  });

  paddleSizeInput.addEventListener("change", () => {
    if (paddleSizeInput.value <= 75) {
      multiPaddle = 2;
    }
    if (paddleSizeInput.value <= 50) {
      multiPaddle = 3;
    }
    if (paddleSizeInput.value <= 25) {
      multiPaddle = 4;
    }

    let combineMulti = multiBall * multiPaddle * multiSize;
    multiScore.innerText = combineMulti;
  });

  ballSizeInput.addEventListener("change", () => {
    if (ballSizeInput.value <= 5) {
      multiSize = 2;
    }

    let combineMulti = multiBall * multiPaddle * multiSize;

    multiScore.innerText = combineMulti;
  });

  multiScore.innerText = multiBall * multiPaddle * multiSize;

  startBtn.addEventListener("click", () => {
    start();
  });

  mainMenuBtn.addEventListener("click", () => {
    window.location.reload();
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

  const paddleWidth = parseInt(paddleSizeInput.value);
  const paddleSpeedValue = 15;
  let paddleX = canvas.width / 2 - paddleWidth / 2;
  let paddleY = canvas.height - paddleHeight;

  let isPaddleGoingLeft = false;
  let isPaddleGoingRight = false;

  function drawPaddle() {
    ctx.beginPath();
    // xPos, yPos, width, height
    ctx.drawImage(paddleImg, paddleX, paddleY, paddleWidth, paddleHeight);
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

  const ballSpeed = parseInt(ballSpeedInput.value);

  //ball velocity
  let ballDirectionX = ballSpeed;
  let ballDirectionY = ballSpeed;

  let ballLaunched = false;

  function scoreMultiplier() {
    // multiply score by 2 if ballSpeed greater than 15
    switch (true) {
      case ballSpeed >= 25:
        scoreMultiply *= 4;
        sounds.musicFast.play();
        break;
      case ballSpeed >= 20:
        scoreMultiply *= 3;
        sounds.musicSerious.play();
        break;
      case ballSpeed >= 15:
        scoreMultiply *= 2;
        sounds.musicMedium.play();
        break;
      case ballSpeed <= 5:
        scoreMultiply *= 0.5;
        sounds.musicEasy.play();
        break;

      default:
        sounds.musicDefault.play();
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
      sounds.gameOver.play();
    }
  }

  function congratulations() {
    if (score === brick.rows * brick.cols * scoreMultiply) {
      score *= 4;
      ctx.clearRect(0, 0, 100, 30);
      drawScore();
      cancelAnimationFrame(animationFrameId);
      congratulationsScreen();
      sounds.congratulations.play();
    }
  }

  // BRICKS
  // target the input from the HTML page

  // tried the same with the columns but is not working
  // const brickColsInput = document.getElementById("brick-cols-input");

  // create a brick object
  let brick = {
    // get rows value from the input
    rows: parseInt(brickRowsInput.value),
    // get columns value from the input
    cols: 10,
    get width() {
      return canvas.width / this.cols;
    },
    height: 50,
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
        // Get the index of the image based on the brick's x position
        let indexImage = Math.floor(brick.x / (canvas.width / 10));
        //draw image on canvas
        ctx.drawImage(bricksImg[indexImage], brick.x, brick.y, brick.width, brick.height);
      }
    });
  }

  function drawBall() {
    ctx.beginPath();
    // xPos, yPos, width, height
    /* ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2); */
    ctx.drawImage(ballImg, ballX - ballRadius, ballY - ballRadius, ballRadius * 2, ballRadius * 2);
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
    sounds.ballLaunch.play();
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
    else if (ballX < 0 + ballRadius) {
      ballDirectionX *= -1;
    }
    // if the ball hit the top wall
    else if (ballY < 0) {
      ballDirectionY *= -1;
    }
    // if the ball hit the paddle
    else if (ballY + ballRadius > paddleY && ballX + ballRadius > paddleX && ballX < paddleX + paddleWidth) {
      ballDirectionY *= -1;
    }

    // if the ball fall
    if (ballY > canvas.height + ballRadius) {
      ballLaunched = false;
      // decrease lives
      if (lives > 0) {
        lives--;
      }
    }

    brickField.forEach((brick) => {
      // if brick has not been hit
      if (brick.hit === true)
        if (
          ballX + ballRadius > brick.x &&
          ballX - ballRadius < brick.x + brick.width &&
          ballY + ballRadius > brick.y &&
          ballY - ballRadius < brick.y + brick.height
        ) {
          sounds.ballHitBrick.play();
          // // if ball is inside brick
          // if ball hit left or right side of brick, change X direction
          if (ballX + ballRadius - ballDirectionX <= brick.x || ballX - ballDirectionX >= brick.x + brick.width) {
            ballDirectionX *= -1;
            brick.hit = false;
            score += 1 * scoreMultiply;
          }
          // if ball hit top or bottom side of brick, change Y direction
          else {
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
    ballCollision();
    drawScore();
    drawLives();

    animationFrameId = requestAnimationFrame(animate);

    gameOver();
    congratulations();
  }
  animate();

  const restartBtn = document.querySelector(".restart");

  /*   restartBtn.addEventListener("click", () => {
    canvas.reload();
  }); */
}
