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
  heroVideo.muted = true;
  heroVideo.playsInline = true;
  heroVideo.setAttribute('muted', '');
  const tryPlay = () => heroVideo.play().catch(() => {});
  tryPlay();
  ['loadeddata', 'canplay', 'canplaythrough'].forEach((evt) => heroVideo.addEventListener(evt, tryPlay));
  ['click', 'touchstart', 'scroll'].forEach((evt) => document.addEventListener(evt, tryPlay, { once: true, passive: true }));
}

const header = document.querySelector('header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > lastScrollY && y > 80 && !nav.classList.contains('-translate-y-[130%]')) {
    header.classList.add('header-hidden');
  } else {
    header.classList.remove('header-hidden');
  }
  lastScrollY = y;
}, { passive: true });

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
