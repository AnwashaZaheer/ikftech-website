// ===== Mobile navigation toggle =====
const toggle = document.getElementById('navToggle');
const nav = document.getElementById('mainNav');

toggle.addEventListener('click', () => {
  const isOpen = nav.classList.contains('-translate-y-[130%]');
  if (isOpen) {
    nav.classList.remove('-translate-y-[130%]');
    toggle.setAttribute('aria-expanded', 'true');
    closeAllMegaMenus(); // prevent both menus from being open at the same time
  } else {
    nav.classList.add('-translate-y-[130%]');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

// Mobile nav: close on any link click
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

// ===== Header: hide on scroll down, show on scroll up =====
const header = document.querySelector('header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const anyMegaOpen = document.querySelector('.mega-menu.open');
  if (y > lastScrollY && y > 80 && !nav.classList.contains('-translate-y-[130%]') && !anyMegaOpen) {
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
const megaMenus = [
  { btn: document.getElementById('servicesBtn'), menu: document.getElementById('megaMenu') },
  { btn: document.getElementById('consultancyBtn'), menu: document.getElementById('consultancyMenu') },
].filter((m) => m.btn && m.menu);

const setMegaMenu = (target, open) => {
  megaMenus.forEach(({ btn, menu }) => {
    const isTarget = menu === target;
    menu.classList.toggle('open', isTarget && open);
    btn.setAttribute('aria-expanded', String(isTarget && open));
    menu.setAttribute('aria-hidden', String(!(isTarget && open)));
  });
  if (open && !nav.classList.contains('-translate-y-[130%]')) {
    nav.classList.add('-translate-y-[130%]');
    toggle.setAttribute('aria-expanded', 'false');
  }
};

const closeAllMegaMenus = () => megaMenus.forEach(({ menu }) => setMegaMenu(menu, false));

if (megaMenus.length) {
  const desktopHover = window.matchMedia('(min-width: 1024px)');

  megaMenus.forEach(({ btn, menu }) => {
    let menuTimer;

    const open = () => {
      if (!desktopHover.matches) return;
      clearTimeout(menuTimer);
      setMegaMenu(menu, true);
    };
    const close = () => {
      if (!desktopHover.matches) return;
      menuTimer = setTimeout(() => setMegaMenu(menu, false), 250);
    };

    btn.addEventListener('mouseenter', open);
    btn.addEventListener('mouseleave', close);
    menu.addEventListener('mouseenter', open);
    menu.addEventListener('mouseleave', close);

    // Mobile/desktop: toggle on click
    btn.addEventListener('click', () => {
      const isOpen = menu.classList.contains('open');
      clearTimeout(menuTimer);
      setMegaMenu(menu, !isOpen);
    });
  });

  // Close when clicking outside the menu
  document.addEventListener('click', (e) => {
    const insideMenu = megaMenus.some(({ btn, menu }) => btn.contains(e.target) || menu.contains(e.target));
    if (!insideMenu) closeAllMegaMenus();
  });
}
