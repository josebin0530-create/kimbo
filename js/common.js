document.addEventListener('DOMContentLoaded', () => {
 const track = document.querySelector('.popular_card');
  if (!track) return;

  const items = Array.from(track.children);

  // ✅ 카드 복제 (무한처럼 보이게)
  items.forEach(el => {
    const clone = el.cloneNode(true);
    track.appendChild(clone);
  });

  let isPaused = false;
  let animationId;

  const speed = 0.8; // 속도 조절 (0.5 느림 / 1.5 빠름)

  // gap 값 계산
  const styles = getComputedStyle(track);
  const gap = parseFloat(styles.gap || styles.columnGap || 0);

  // 원본 카드 전체 길이 계산
  const cardWidth = items[0].offsetWidth;
  const originalWidth = (cardWidth + gap) * items.length;

  function autoSlide() {
    if (!isPaused) {
      track.scrollLeft += speed;

      // 원본 끝 도달하면 자연스럽게 처음으로
      if (track.scrollLeft >= originalWidth) {
        track.scrollLeft = 0;
      }
    }
    animationId = requestAnimationFrame(autoSlide);
  }

  // hover 시 멈춤
  track.addEventListener('mouseenter', () => {
    isPaused = true;
  });

  track.addEventListener('mouseleave', () => {
    isPaused = false;
  });

  autoSlide();
})//dom end