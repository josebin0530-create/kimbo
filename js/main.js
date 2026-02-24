document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".popular_section .popular_card");
  if (!track) return;

  const originalItems = Array.from(track.children);
  if (!originalItems.length) return;

  originalItems.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.dataset.clone = "true";
    track.appendChild(clone);
  });

  let isPaused = false;
  const speedPxPerSecond = 45;
  let originalWidth = 0;
  let lastTime = performance.now();

  const calculateOriginalWidth = () => {
    const firstClone = track.querySelector('[data-clone="true"]');
    originalWidth = firstClone
      ? firstClone.offsetLeft
      : track.scrollWidth / 2;
  };

  const animate = (now) => {
    const delta = now - lastTime;
    lastTime = now;

    if (!isPaused && originalWidth > 0) {
      track.scrollLeft += (speedPxPerSecond * delta) / 1000;
      if (track.scrollLeft >= originalWidth) {
        track.scrollLeft -= originalWidth;
      }
    }

    requestAnimationFrame(animate);
  };

  track.addEventListener("mouseenter", () => {
    isPaused = true;
  });

  track.addEventListener("mouseleave", () => {
    isPaused = false;
  });

  window.addEventListener("resize", calculateOriginalWidth);

  calculateOriginalWidth();
  requestAnimationFrame(animate);
});
