const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const image = document.getElementById("source");
const scoreEl = document.getElementById("score");

const k_x = 110;
const r = 20;

const coordinates = [349, 350, 305, 280, 255, 232, 205, 183, 158, 134, 110, 80];

let random_arr = [];
let i = 0;
let score = 0;

const notesPerOctave = 7;
const circlesPerRound = 6;

function generateRandomPositions() {
  random_arr = [];
  for (let j = 0; j < circlesPerRound; j++) {
    const y = coordinates[Math.floor(Math.random() * coordinates.length)];
    random_arr.push(y);
  }
}

function drawCircle(x, y, radius, isActive) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = isActive ? "#6366f1" : "#b0b8cc";
  ctx.fill();

  if (isActive) {
    ctx.beginPath();
    ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(99, 102, 241, 0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  if (y === coordinates[0]) {
    ctx.beginPath();
    const L = radius * 1.6;
    ctx.moveTo(x - L, y);
    ctx.lineTo(x + L, y);
    ctx.lineWidth = isActive ? 4 : 3;
    ctx.strokeStyle = isActive ? "#6366f1" : "#b0b8cc";
    ctx.stroke();
  }
}

function drawCircles(skipCount = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  for (let j = skipCount; j < random_arr.length; j++) {
    const y = random_arr[j];
    const x = k_x * j + 300;
    drawCircle(x, y, r, j === skipCount);
  }
}

function initCanvas() {
  canvas.width = image.width;
  canvas.height = image.height;
  generateRandomPositions();
  drawCircles(0);
}

if (image.complete) {
  initCanvas();
} else {
  image.addEventListener("load", initCanvas);
}

const labels = ["C", "D", "E", "F", "G", "A", "B"];
const sounds = [
  "/mp3/C_note.mp3", "/mp3/D_note.mp3", "/mp3/E_note.mp3",
  "/mp3/F_note.mp3", "/mp3/G_note.mp3", "/mp3/A_note.mp3", "/mp3/B_note.mp3"
];

const keyboard = document.getElementById("keyboard");

const buttons = labels.map((label, idx) => {
  const btn = document.createElement("button");
  btn.className = "piano-key";
  btn.textContent = label;
  btn.dataset.idx = String(coordinates[idx]);
  keyboard.appendChild(btn);
  return btn;
});

// Answer with physical keys C, D, E, F, G, A, B
document.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  const idx = labels.indexOf(e.key.toUpperCase());
  if (idx !== -1) buttons[idx].click();
});

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const btnValue = Number(btn.dataset.idx);
    const currentY = random_arr[i];
    const noteIndex = coordinates.indexOf(currentY);
    if (noteIndex === -1) return;

    const baseIndex = noteIndex % notesPerOctave;
    const expectedValue = coordinates[baseIndex];

    if (btnValue === expectedValue) {
      const sound = new Audio(sounds[baseIndex]);
      sound.currentTime = 0;
      sound.play().catch(() => {});

      btn.classList.add("correct");
      setTimeout(() => btn.classList.remove("correct"), 350);

      score++;
      if (scoreEl) scoreEl.textContent = score;

      i++;
      if (i >= random_arr.length) {
        i = 0;
        generateRandomPositions();
        drawCircles(0);
      } else {
        drawCircles(i);
      }
    } else {
      btn.classList.add("wrong");
      setTimeout(() => btn.classList.remove("wrong"), 350);
    }
  });
});
