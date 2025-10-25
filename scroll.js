window.addEventListener("scroll", () => {
  const cv = document.querySelector(".cv-frame");
  const arrow = document.querySelector(".down-arrow");
  if (!cv || !arrow) return;

  const scrollY = window.scrollY;
  const windowH = window.innerHeight;

  // 1. Gestione freccia: scompare subito
  const arrowFade = Math.min(scrollY / 100, 1);
  arrow.style.opacity = String(1 - arrowFade);

  // 2. Gestione CV: progressiva
  // da 0 (inizio pagina) a 1 (dopo 80% di viewport)
  const progress = Math.min(scrollY / (windowH * 0.5), 1);

  // mappa progress in parametri visivi
  const scale = 0.8 + 0.2 * progress;           // da 0.8 → 1
  const blur = 10 * (1 - progress);             // da 10px → 0
  const opacity = progress;                     // da 0 → 1
  const translateY = 100 * (1 - progress);      // da 100px → 0

  cv.style.transform = `scale(${scale}) translateY(${translateY}px)`;
  cv.style.filter = `blur(${blur}px)`;
  cv.style.opacity = String(opacity);
});
