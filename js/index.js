const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const startBtn = document.querySelector(".start");
const buttons = document.querySelector(".buttons-wrapper");

const mainMenuBtn = document.querySelector(".main-menu");

const multiScore = document.getElementById("multi-score");
const ballSpeedInput = document.getElementById("ball-speed-input");
const paddleSizeInput = document.getElementById("paddle-size-input");
const ballSizeInput = document.getElementById("ball-size-input");
const brickRowsInput = document.getElementById("brick-rows-input");
const volumeControl = document.getElementById("volume-control");

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

// targeting button to switch off sound
const toggleSound = document.querySelector(".sound-button");
let musicPlaying = true;
let currentSound;

// images

// ball and paddle image

const ballImg = new Image();
ballImg.src = "img/ball.png";
const paddleImg = new Image();
paddleImg.src = "img/paddle.png";

// create an empty array to push brick images
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
/* ctx.canvas.width = window.innerWidth - 200; */
ctx.canvas.height = window.innerHeight;

window.addEventListener("load", () => {
  canvas.style.display = "none";
  buttons.style.display = "none";
  // declare each multiplier
  let multiBall = 1;
  let multiPaddle = 1;
  let multiSize = 1;

  // display score multiplier on the landing page
  // whenever you change the input, calculate the combined multiBall * multiPaddle * multiSize
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

//start button
function start() {
  startBtn.style.display = "none";
  document.querySelector("h1").style.display = "none";
  document.querySelector(".body-container").style.display = "none";
  canvas.style.display = "block";

  buttons.style.display = "flex";

  // PADDLE VARIABLES

  const paddleHeight = 15;
  // get the value from the landing page input
  const paddleWidth = parseInt(paddleSizeInput.value);
  const paddleSpeedValue = 15;
  // x and y Pos of the paddle
  let paddleX = canvas.width / 2 - paddleWidth / 2;
  let paddleY = canvas.height - paddleHeight;

  let isPaddleGoingLeft = false;
  let isPaddleGoingRight = false;

  function drawPaddle() {
    ctx.beginPath();
    // image, xPos, yPos, width, height
    ctx.drawImage(paddleImg, paddleX, paddleY, paddleWidth, paddleHeight);
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

  //set global variable boolean if ball is launched
  let ballLaunched = false;

  function scoreMultiplier() {
    // multiply score by 2 if ballSpeed greater than 15
    switch (true) {
      case ballSpeed >= 25:
        scoreMultiply *= 4;
        currentSound = sounds.musicFast;
        break;
      case ballSpeed >= 20:
        scoreMultiply *= 3;
        currentSound = sounds.musicSerious;
        break;
      case ballSpeed >= 15:
        scoreMultiply *= 2;
        currentSound = sounds.musicMedium;
        break;
      case ballSpeed <= 5:
        scoreMultiply *= 0.5;
        currentSound = sounds.musicEasy;
        break;

      default:
        currentSound = sounds.musicDefault;
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
        break;
    }
  }

  scoreMultiplier();

  function drawScore() {
    ctx.font = "bold 20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Score: ${score}`, 10, 25);
  }

  function drawLives() {
    ctx.font = "bold 20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Lives: ${lives}`, canvas.width - 100, 20);
  }

  function congratulationsScreen() {
    ctx.font = "40px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("CONGRATULATIONS", canvas.width / 2, canvas.height / 2);
    ctx.fillText("Please buy the game to unlock more levels", canvas.width / 2, canvas.height / 2 + 60);
  }

  function gameOverScreen() {
    ctx.font = "80px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
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
      // if you finish the game, multiply the score by 4
      score *= 4;
      // clear the old score so it can update multiply by 4
      ctx.clearRect(0, 0, 100, 30);
      //displsay updated score
      drawScore();
      //stop the game
      cancelAnimationFrame(animationFrameId);
      congratulationsScreen();
      sounds.congratulations.play();
    }
  }

  // BRICKS

  // create a brick object
  let brick = {
    // get rows value from the input
    rows: parseInt(brickRowsInput.value),
    // tried the same with the columns but is not working
    cols: 10,
    // divide the canvas width by the number of columns
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
    // loop rows and cols
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

    //change the direction of the ball after the collision with the paddle
    if (ballY + ballRadius > paddleY && ballX + ballRadius > paddleX && ballX < paddleX + paddleWidth) {
      let deltaX = ballX + ballRadius - (paddleX + paddleWidth / 2);
      ballDirectionX = (deltaX / (paddleWidth / 2)) * ballSpeed;
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
          // // if ball is inside brick
          ballX + ballRadius > brick.x &&
          ballX - ballRadius < brick.x + brick.width &&
          ballY + ballRadius > brick.y &&
          ballY - ballRadius < brick.y + brick.height
        ) {
          sounds.ballHitBrick.play();

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

  currentSound.play();

  toggleSound.addEventListener("click", () => {
    if (musicPlaying) {
      currentSound.pause();
      toggleSound.innerText = "Music OFF";
      musicPlaying = false;
    } else {
      currentSound.play();
      musicPlaying = true;
      toggleSound.innerText = "Music ON";
    }
  });

  volumeControl.addEventListener("input", function () {
    currentSound.volume = this.value / 100;
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
    ctx.shadowColor = "aqua";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = -2;
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
}
