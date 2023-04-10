/* const matrix = document.getElementById("Matrix");
const context = matrix.getContext("2d");

window.addEventListener("load", () => {
  matrix.style.display = "none";

  startBtn.addEventListener("click", () => {
    start();
  });
});

function startMatrix() {
  matrix.style.display = "block";

  matrix.width = window.innerWidth;
  matrix.height = window.innerHeight;

  const katakana =
    "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";
  const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nums = "0123456789";

  const alphabet = katakana + latin + nums;

  const fontSize = 16;
  const columns = matrix.width / fontSize;

  const rainDrops = [];

  for (let x = 0; x < columns; x++) {
    rainDrops[x] = 1;
  }

  const draw = () => {
    context.fillStyle = "rgba(0, 0, 0, 0.05)";
    context.fillRect(0, 0, matrix.width, matrix.height);

    context.fillStyle = "#0F0";
    context.font = fontSize + "px monospace";

    for (let i = 0; i < rainDrops.length; i++) {
      const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      context.fillText(text, i * fontSize, rainDrops[i] * fontSize);

      if (rainDrops[i] * fontSize > matrix.height && Math.random() > 0.975) {
        rainDrops[i] = 0;
      }
      rainDrops[i]++;
    }
  };

  setInterval(draw, 30);
}
 */