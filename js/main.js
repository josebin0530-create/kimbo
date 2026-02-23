// data-io 가진 요소를 스크롤로 등장시키기
const els = document.querySelectorAll("[data-io]");

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-in");
    io.unobserve(e.target);
  });
}, { threshold: 0.15 });

els.forEach((el) => io.observe(el));

// 간단한 CSS 애니메이션 클래스 적용을 위한 스타일 주입(선호하면 css에 옮겨도 됨)
const style = document.createElement("style");
style.textContent = `
  [data-io]{ opacity:0; transform: translateY(12px); transition: .6s ease; }
  [data-io].is-in{ opacity:1; transform: translateY(0); }
`;
document.head.appendChild(style);
//스크롤 이벤트 - 헤더
let lastScrollY = window.scrollY;//직전 스크롤 위치 저장


const header = document.querySelector("header");

let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  // 맨 위에서는 항상 보이게
  if (currentScroll <= 50) {
    header.classList.remove("header--hide");
    header.classList.add("header--show");
    return;
  }

  // 아래로 스크롤
  if (currentScroll > lastScroll) {
    header.classList.remove("header--show");
    header.classList.add("header--hide");
  }
  // 위로 스크롤
  else {
    header.classList.remove("header--hide");
    header.classList.add("header--show");
  }

  lastScroll = currentScroll;
});

// popular card slider: infinite autoplay + center highlight
const popularSlider = document.querySelector("[data-popular-slider]");

if (popularSlider) {
  popularSlider.style.scrollBehavior = "auto";

  const originals = Array.from(popularSlider.querySelectorAll(".popular_item"));
  const headClones = document.createDocumentFragment();
  const tailClones = document.createDocumentFragment();

  originals.forEach((item) => {
    const headClone = item.cloneNode(true);
    const tailClone = item.cloneNode(true);
    headClone.dataset.clone = "head";
    tailClone.dataset.clone = "tail";
    headClones.appendChild(headClone);
    tailClones.appendChild(tailClone);
  });

  popularSlider.prepend(headClones);
  popularSlider.appendChild(tailClones);

  const firstOriginal = originals[0];
  const firstTailClone = popularSlider.querySelector('.popular_item[data-clone="tail"]');
  const loopStart = firstOriginal ? firstOriginal.offsetLeft : 0;
  const loopWidth = firstTailClone ? firstTailClone.offsetLeft - loopStart : 0;

  if (loopStart > 0) {
    popularSlider.scrollLeft = loopStart;
  }

  let activeCard = null;
  const updatePopularCenter = () => {
    const cards = Array.from(popularSlider.querySelectorAll(".popular_item"));
    if (!cards.length) return;

    const firstCard = cards[0];
    const secondCard = cards[1] || null;
    const step = secondCard
      ? secondCard.offsetLeft - firstCard.offsetLeft
      : firstCard.offsetWidth;
    const centerX = popularSlider.scrollLeft + popularSlider.clientWidth / 2;
    const rawIndex = Math.round(
      (centerX - firstCard.offsetLeft - firstCard.offsetWidth / 2) / step
    );
    const clampedIndex = Math.max(0, Math.min(cards.length - 1, rawIndex));
    const nextActive = cards[clampedIndex];

    if (activeCard === nextActive) return;
    if (activeCard) activeCard.classList.remove("is-center");
    activeCard = nextActive;
    if (activeCard) activeCard.classList.add("is-center");
  };

  let rafId = null;
  const onScroll = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(() => {
      updatePopularCenter();
      rafId = null;
    });
  };

  popularSlider.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updatePopularCenter);
  window.addEventListener("load", updatePopularCenter);
  updatePopularCenter();

  let isDown = false;
  let startX = 0;
  let startScrollLeft = 0;

  popularSlider.addEventListener("pointerdown", (e) => {
    isDown = true;
    startX = e.clientX;
    startScrollLeft = popularSlider.scrollLeft;
    popularSlider.classList.add("is-dragging");
    popularSlider.setPointerCapture(e.pointerId);
  });

  popularSlider.addEventListener("pointermove", (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    popularSlider.scrollLeft = startScrollLeft - dx;
  });

  const stopDrag = () => {
    isDown = false;
    popularSlider.classList.remove("is-dragging");
  };

  popularSlider.addEventListener("pointerup", stopDrag);
  popularSlider.addEventListener("pointercancel", stopDrag);
  popularSlider.addEventListener("pointerleave", stopDrag);

  popularSlider.addEventListener(
    "wheel",
    (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      popularSlider.scrollLeft += e.deltaY;
    },
    { passive: false }
  );

  const pxPerSecond = 68;
  let isPointerInside = false;
  let raf = null;
  let lastTime = performance.now();
  let centerUpdateElapsed = 0;

  const tick = (now) => {
    const dt = Math.min(now - lastTime, 34);
    lastTime = now;

    if (!isDown && !isPointerInside && loopWidth > 0) {
      popularSlider.scrollLeft += (pxPerSecond * dt) / 1000;

      while (popularSlider.scrollLeft >= loopStart + loopWidth) {
        popularSlider.scrollLeft -= loopWidth;
      }
      while (popularSlider.scrollLeft < loopStart) {
        popularSlider.scrollLeft += loopWidth;
      }
    }

    centerUpdateElapsed += dt;
    if (centerUpdateElapsed >= 66) {
      updatePopularCenter();
      centerUpdateElapsed = 0;
    }

    raf = window.requestAnimationFrame(tick);
  };

  popularSlider.addEventListener("mouseenter", () => {
    isPointerInside = true;
  });

  popularSlider.addEventListener("mouseleave", () => {
    isPointerInside = false;
  });

  raf = window.requestAnimationFrame(tick);
}
