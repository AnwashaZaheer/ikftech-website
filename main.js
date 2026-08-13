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

  // Scroll Progress Indicator
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  if (height > 0) {
    const scrolled = (y / height) * 100;
    const progress = document.getElementById('scrollProgress');
    if (progress) progress.style.width = scrolled + '%';
  }
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

// ===== Mega menus =====
const companyMenu = document.getElementById('companyMenu');

const megaMenus = [
  { btn: document.getElementById('servicesBtn'), menu: document.getElementById('megaMenu') },
  { btn: document.getElementById('consultancyBtn'), menu: document.getElementById('consultancyMenu') },
  { btn: document.getElementById('companyBtn'), menu: companyMenu },
  { btn: document.getElementById('resourcesBtn'), menu: document.getElementById('resourcesMenu') },
].filter((m) => m.btn && m.menu);

const setMegaMenu = (target, open) => {
  megaMenus.forEach(({ btn, menu }) => {
    const isTarget = menu === target;
    menu.classList.toggle('open', isTarget && open);
    btn.setAttribute('aria-expanded', String(isTarget && open));
    menu.setAttribute('aria-hidden', String(!(isTarget && open)));
  });
  if (!open && target === companyMenu && companyMenu) {
    companyMenu.querySelectorAll('.company-preview').forEach((pane) => {
      pane.classList.toggle('active', pane.dataset.pane === 'default');
    });
    companyMenu.querySelectorAll('.company-item').forEach((item) => item.classList.remove('active'));
  }
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
      menuTimer = setTimeout(() => setMegaMenu(menu, false), 500);
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

  // Close buttons at the top of each mega menu card
  document.querySelectorAll('.mega-close').forEach((btn) => {
    btn.addEventListener('click', closeAllMegaMenus);
  });

  // ===== Company mega menu: interactive left-nav / right-preview =====
  if (companyMenu) {
    const companyItems = companyMenu.querySelectorAll('.company-item');
    const previewPanes = companyMenu.querySelectorAll('.company-preview');

    const setCompanyPreview = (id) => {
      previewPanes.forEach((pane) => pane.classList.toggle('active', pane.dataset.pane === id));
      companyItems.forEach((item) => item.classList.toggle('active', item.dataset.preview === id));
    };

    companyItems.forEach((item) => {
      item.addEventListener('mouseenter', () => setCompanyPreview(item.dataset.preview));
      item.addEventListener('focus', () => setCompanyPreview(item.dataset.preview));
      item.addEventListener('click', () => setCompanyPreview(item.dataset.preview));
    });

    companyMenu.addEventListener('mouseleave', () => setCompanyPreview('default'));
  }
}

// ===== Resources mega menu: featured carousel (auto-scroll) =====
const featuredCarousel = document.getElementById('featuredCarousel');
if (featuredCarousel) {
  const slides = featuredCarousel.querySelectorAll('.featured-slide');
  const dots = featuredCarousel.querySelectorAll('.featured-dot');
  const INTERVAL = 2000;
  let current = 0;
  let timer;

  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  };

  const start = () => {
    clearInterval(timer);
    timer = setInterval(() => show(current + 1), INTERVAL);
  };
  const stop = () => clearInterval(timer);

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      show(i);
      start();
    });
  });

  featuredCarousel.addEventListener('mouseenter', stop);
  featuredCarousel.addEventListener('mouseleave', start);

  start();
}
