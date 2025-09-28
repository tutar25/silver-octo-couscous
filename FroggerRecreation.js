const canvas = document.createElement("canvas");
canvas.width = 480; canvas.height = 480;
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

let frog = { x: 220, y: 432, w: 36, h: 36 };
let lanes = [
  { y: 384, dir: 1, speed: 2 },
  { y: 336, dir: -1, speed: 3 },
  { y: 288, dir: 1, speed: 2 },
  { y: 240, dir: -1, speed: 2 },
  { y: 144, dir: 2, speed: 1 }
];
let cars = [];
let score = 0, dead = false;

function reset() {
  frog.x = 220; frog.y = 432; dead = false;
}

function spawnCars() {
  cars = [];
  for (let i = 0; i < lanes.length; i++) {
    for (let j = 0; j < 4; j++) {
      let x = j * 160 + (i%2)*80;
      cars.push({ x: x, y: lanes[i].y, w: 60, h: 32, dir: lanes[i].dir, speed: lanes[i].speed });
    }
  }
}
spawnCars();

document.addEventListener("keydown", e => {
  if (dead) { reset(); return; }
  if (e.key === "ArrowLeft") frog.x -= 48;
  if (e.key === "ArrowRight") frog.x += 48;
  if (e.key === "ArrowUp") frog.y -= 48;
  if (e.key === "ArrowDown") frog.y += 48;
  frog.x = Math.max(0, Math.min(444, frog.x));
  frog.y = Math.max(0, Math.min(432, frog.y));
});

setInterval(() => {
  ctx.fillStyle = "#223"; ctx.fillRect(0,0,480,480);
  ctx.fillStyle = "#3f3"; ctx.fillRect(0,0,480,96);
  ctx.fillStyle = "#444"; ctx.fillRect(0,96,480,288);
  ctx.fillStyle = "#bbf"; ctx.fillRect(0,384,480,48);
  // Move cars
  cars.forEach(c => {
    c.x += c.dir * c.speed;
    if (c.x > 480) c.x = -c.w;
    if (c.x < -c.w) c.x = 480;
    ctx.fillStyle = "#f44";
    ctx.fillRect(c.x, c.y, c.w, c.h);
  });
  // Draw frog
  ctx.fillStyle = dead ? "#f00" : "#0f0";
  ctx.fillRect(frog.x, frog.y, frog.w, frog.h);
  // Collisions
  if (frog.y < 96) {
    score++;
    reset();
  }
  for (let c of cars) {
    if (frog.x < c.x+c.w && frog.x+frog.w > c.x && frog.y < c.y+c.h && frog.y+frog.h > c.y)
      dead = true;
  }
  ctx.fillStyle = "#fff";
  ctx.font = "22px Arial";
  ctx.fillText("Score: " + score, 10, 30);
  if (dead) ctx.fillText("Game Over! Press any key.", 90, 240);
}, 1000/60);