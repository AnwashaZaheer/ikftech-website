// ===== Mobile navigation toggle =====
const toggle = document.getElementById('navToggle');
const nav = document.getElementById('mainNav');

toggle.addEventListener('click', () => {
  const isOpen = nav.classList.contains('-translate-y-[130%]');
  if (isOpen) {
    nav.classList.remove('-translate-y-[130%]');
    toggle.setAttribute('aria-expanded', 'true');
    setMegaMenu(false); // dono ek saath open na ho
  } else {
    nav.classList.add('-translate-y-[130%]');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

// Mobile nav: kisi bhi link par click karne se band
document.querySelectorAll('#mainNav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.add('-translate-y-[130%]');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

// ===== Hero video autoplay handling =====
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

// ===== Header: scroll down pe hide, up pe show =====
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

// ===== Scroll-reveal animation =====
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

// ===== Services mega menu =====
const servicesBtn = document.getElementById('servicesBtn');
const megaMenu = document.getElementById('megaMenu');
let menuTimer;

const setMegaMenu = (open) => {
  if (!servicesBtn || !megaMenu) return;
  megaMenu.classList.toggle('open', open);
  servicesBtn.setAttribute('aria-expanded', String(open));
  megaMenu.setAttribute('aria-hidden', String(!open));
  if (open && !nav.classList.contains('-translate-y-[130%]')) {
    nav.classList.add('-translate-y-[130%]');
    toggle.setAttribute('aria-expanded', 'false');
  }
};

if (servicesBtn && megaMenu) {
  const desktopHover = window.matchMedia('(min-width: 1024px)');

  // Desktop: hover se open/close
  if (desktopHover.matches) {
    servicesBtn.addEventListener('mouseenter', () => setMegaMenu(true));
    servicesBtn.addEventListener('mouseleave', () => {
      menuTimer = setTimeout(() => setMegaMenu(false), 120);
    });
    megaMenu.addEventListener('mouseenter', () => {
      clearTimeout(menuTimer);
      setMegaMenu(true);
    });
    megaMenu.addEventListener('mouseleave', () => {
      menuTimer = setTimeout(() => setMegaMenu(false), 120);
    });
  }

  // Mobile/desktop: click se toggle
  servicesBtn.addEventListener('click', () => {
    const isOpen = megaMenu.classList.contains('open');
    clearTimeout(menuTimer);
    setMegaMenu(!isOpen);
  });

  // Menu ke bahar click karne se band
  document.addEventListener('click', (e) => {
    if (servicesBtn.contains(e.target) || megaMenu.contains(e.target)) return;
    setMegaMenu(false);
  });
}
