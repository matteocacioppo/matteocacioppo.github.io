const cv = document.querySelector(".cv-frame");
const arrow = document.querySelector(".down-arrow");

let hovering = false; // stato hover

// gestisco hover manualmente
if (cv) {
  cv.addEventListener("mouseenter", () => {
    hovering = true;
    cv.classList.add("hover-boost");
    applyScrollTransform(); // aggiorna subito con lo zoom
  });

  cv.addEventListener("mouseleave", () => {
    hovering = false;
    cv.classList.remove("hover-boost");
    applyScrollTransform(); // torna allo scale normale
  });
}

window.addEventListener("scroll", () => {
  applyScrollTransform();
});

function applyScrollTransform() {
  if (!cv || !arrow) return;

  const scrollY = window.scrollY;
  const windowH = window.innerHeight;

  // 1. freccia fade-out
  const arrowFade = Math.min(scrollY / 100, 1);
  arrow.style.opacity = String(1 - arrowFade);

  // 2. progress CV (0 a 1)
  const progress = Math.min(scrollY / (windowH * 0.4), 1);

  // valori base guidati dallo scroll
  const baseScale = 0.8 + 0.2 * progress;        // 0.8 -> 1.0
  const translateY = 100 * (1 - progress);       // 100px -> 0px
  const blur = 10 * (1 - progress);              // 10px -> 0px
  const opacity = progress;                      // 0 -> 1

  // zoom aggiuntivo se hover
  const hoverScaleBoost = hovering ? 1.03 : 1.0;
  const finalScale = baseScale * hoverScaleBoost;

  cv.style.transform = `perspective(1000px) scale(${finalScale}) translateY(${translateY}px)`;
  cv.style.filter = `blur(${blur}px)`;
  cv.style.opacity = String(opacity);
}

// inizializza stato corretto al load
applyScrollTransform();


// =============================================================
// ROTAZIONE 3D FLUIDA CONTROLLATA DAL MOUSE (senza click)
// =============================================================
const cvObject = document.getElementById("cvObject");
const inner = document.querySelector(".cv-inner");

if (cvObject && inner) {
  let targetRotX = 0;
  let targetRotY = 0;
  let currentRotX = 0;
  let currentRotY = 0;

  // aggiorna i target in base alla posizione del mouse
  cvObject.addEventListener("mousemove", (e) => {
    const rect = cvObject.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;   // 0 → 1
    const relY = (e.clientY - rect.top) / rect.height;  // 0 → 1

    targetRotY = (relX - 0.5) * 12;  // max ±12°
    targetRotX = (0.5 - relY) * 12;  // max ±12°
  });

  // reset morbido quando il mouse esce
  cvObject.addEventListener("mouseleave", () => {
    targetRotX = 0;
    targetRotY = 0;
  });

  // animazione fluida (interpolazione)
  function animateRotation() {
    currentRotX += (targetRotX - currentRotX) * 0.1;
    currentRotY += (targetRotY - currentRotY) * 0.1;
    inner.style.transform = `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
    requestAnimationFrame(animateRotation);
  }

  animateRotation();
}
