const toggle = document.getElementById('navToggle');
const nav = document.getElementById('mainNav');

toggle.addEventListener('click', () => {
  const isOpen = nav.classList.contains('-translate-y-[130%]');
  if (isOpen) {
    nav.classList.remove('-translate-y-[130%]');
    toggle.setAttribute('aria-expanded', 'true');
  } else {
    nav.classList.add('-translate-y-[130%]');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

document.querySelectorAll('#mainNav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.add('-translate-y-[130%]');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

const heroVideo = document.getElementById('heroVideo');
if (heroVideo) {
  const tryPlay = () => heroVideo.play().catch(() => {});
  tryPlay();
  heroVideo.addEventListener('loadeddata', tryPlay);
  document.addEventListener('click', tryPlay, { once: true });
}
