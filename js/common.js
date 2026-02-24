document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  if (!header) return;

  let prevScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > prevScrollY && currentScrollY > 80) {
      header.classList.add('is-hidden');
    } else {
      header.classList.remove('is-hidden');
    }

    prevScrollY = currentScrollY;
  }, { passive: true });
})//dom end
