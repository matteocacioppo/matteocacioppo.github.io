const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const image = document.getElementById("source");

const k_x = 110;
const r = 20;
const coordinates = [349, 350, 305, 280, 255, 232, 205];

let random_arr = [];
let i = 0;

function generateRandomPositions() {
  random_arr = [];
  for (let j = 0; j < 6; j++) {
    const y = coordinates[Math.floor(Math.random() * coordinates.length)];
    random_arr.push(y);
  }
}

function drawCircle(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();

  if (y === coordinates[0]) {
    ctx.beginPath();
    const L = radius * 1.5;
    ctx.moveTo(x - L, y);
    ctx.lineTo(x + L, y);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";
    ctx.stroke();
  }
}

function drawCircles(skipCount = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  for (let j = skipCount; j < random_arr.length; j++) {
    const y = random_arr[j];
    const x = k_x * j + 300;
    drawCircle(x, y, r);
  }
}

image.addEventListener("load", () => {
  canvas.width = image.width;
  canvas.height = image.height;
  generateRandomPositions();
  drawCircles(0);
});

const positions = [
  [475, 554], [575, 554], [675, 554], [775, 554],
  [875, 554], [975, 554], [1075, 554],
];
const labels = ["C", "D", "E", "F", "G", "A", "B"];
const sounds = ["/mp3/C_note.mp3","/mp3/D_note.mp3","/mp3/E_note.mp3","/mp3/F_note.mp3","/mp3/G_note.mp3","/mp3/A_note.mp3","/mp3/B_note.mp3"];

const buttons = positions.map(([x, y], idx) => {
  const btn = document.createElement("button");
  btn.className = "favorite styled";
  btn.style.transform = "scale(2.5)";
  btn.textContent = labels[idx];
  btn.style.position = "absolute";
  btn.style.left = `${x}px`;
  btn.style.top = `${y}px`;
  btn.dataset.idx = String(coordinates[idx]);
  document.body.appendChild(btn);
  return btn;
});

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (Number(btn.dataset.idx) === random_arr[i]) {
      const sound = new Audio(sounds[coordinates.indexOf(random_arr[i])]);
      sound.currentTime = 0;
      sound.play().catch(console.error);

      console.log(`idx: ${btn.dataset.idx} | random_arr: [${random_arr.join(", ")}] | sound: ${sounds[i]}`);
      i++;

      if (i >= random_arr.length) {
        i = 0;
        generateRandomPositions();
        drawCircles(0);
      } else {
        drawCircles(i);
      }
    }
  });

});

