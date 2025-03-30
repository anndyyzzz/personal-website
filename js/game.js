const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 400;

const paddle = {
  width: 100,
  height: 12,
  x: (canvas.width - 100) / 2,
  y: canvas.height - 20,
  color: '#00ffcc'
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 8,
  speedX: 4,
  speedY: -4,
  color: '#ff0055'
};

let score = 0;
let highScore = parseInt(localStorage.getItem('highScore')) || 0;
let isGameOver = false;
let gameStarted = false;
let animationId = null;
let ballTouchedPaddle = false;

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  paddle.x = e.clientX - rect.left - paddle.width / 2;
  paddle.x = Math.max(0, Math.min(paddle.x, canvas.width - paddle.width));
});

canvas.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  paddle.x = touch.clientX - rect.left - paddle.width / 2;
  paddle.x = Math.max(0, Math.min(paddle.x, canvas.width - paddle.width));
});

canvas.addEventListener('click', () => {
  if (!gameStarted) {
    gameStarted = true;
    update();
  }
});

function drawPaddle() {
  ctx.fillStyle = paddle.color;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

function drawStartText() {
  ctx.fillStyle = '#ffffff';
  ctx.font = '20px Courier New';
  ctx.textAlign = 'center';
  ctx.fillText('Click anywhere to start', canvas.width / 2, canvas.height / 2);
}

function getRandomColor() {
  const r = Math.floor(Math.random() * 100 + 50);
  const g = Math.floor(Math.random() * 100 + 50);
  const b = Math.floor(Math.random() * 100 + 50);
  return `rgb(${r},${g},${b})`;
}

function updateBackground() {
  canvas.style.backgroundColor = getRandomColor();
}

function update() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  drawBall();

  ball.x += ball.speedX;
  ball.y += ball.speedY;

  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    ball.speedX = -ball.speedX;
  }
  if (ball.y - ball.radius < 0) {
    ball.speedY = -ball.speedY;
    ballTouchedPaddle = false;
  }

  if (
    ball.y + ball.radius >= paddle.y &&
    ball.y + ball.radius <= paddle.y + paddle.height &&
    ball.x >= paddle.x &&
    ball.x <= paddle.x + paddle.width
  ) {
    if (!ballTouchedPaddle) {
      ball.speedY = -Math.abs(ball.speedY);
      ball.y = paddle.y - ball.radius - 1;
      score++;
      ballTouchedPaddle = true;

      if (score % 5 === 0) {
        ball.speedX *= 1.1;
        ball.speedY *= 1.1;
      }

      if (score % 1 === 0) {
        updateBackground();
      }

      document.getElementById('score').innerText = `Score: ${score} | High Score: ${highScore}`;
    }
  }

  if (ball.y - ball.radius > canvas.height) {
    isGameOver = true;
    cancelAnimationFrame(animationId);
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
    }
    document.getElementById('score').innerText = `Score: ${score} | High Score: ${highScore}`;
    document.getElementById('gameOver').classList.remove('hidden');
    return;
  }

  animationId = requestAnimationFrame(update);
}

window.addEventListener('load', () => {
  document.getElementById('score').innerText = `Score: ${score} | High Score: ${highScore}`;
  drawPaddle();
  drawBall();
  drawStartText();
});
