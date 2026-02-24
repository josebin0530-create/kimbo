document.addEventListener("DOMContentLoaded", () => {
  // AOS (있을 때만)
  if (window.AOS) {
    AOS.init({ 
      duration: 1500,  
      once: false,     // ⭐ 다시 들어오면 반복 실행
      mirror: true });
  }

  // 인기상품 슬라이더 (있을 때만)
  const track = document.querySelector(".popular_section .popular_card");
  if (!track) return;

  const originalItems = Array.from(track.children);
  if (!originalItems.length) return;

  // 이미 클론 붙였으면(중복 방지) 종료
  if (track.dataset.inited === "true") return;
  track.dataset.inited = "true";

  // 클론 생성
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
    originalWidth = firstClone ? firstClone.offsetLeft : track.scrollWidth / 2;
  };

  const animate = (now) => {
    const delta = now - lastTime;
    lastTime = now;

    if (!isPaused && originalWidth > 0) {
      track.scrollLeft += (speedPxPerSecond * delta) / 1000;
      if (track.scrollLeft >= originalWidth) track.scrollLeft -= originalWidth;
    }

    requestAnimationFrame(animate);
  };

  track.addEventListener("mouseenter", () => (isPaused = true));
  track.addEventListener("mouseleave", () => (isPaused = false));
  window.addEventListener("resize", calculateOriginalWidth);

  calculateOriginalWidth();
  requestAnimationFrame(animate);
});