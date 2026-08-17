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

// Sticky tap-hover feedback on touch devices (simulates hover on tap)
if (window.matchMedia('(hover: none), (pointer: coarse)').matches) {
  const hoverables = document.querySelectorAll('#mainNav a, #mainNav button, .mega-link, .resource-item');
  let hoverTimer;
  const clearHover = () => {
    clearTimeout(hoverTimer);
    hoverables.forEach((el) => el.classList.remove('tap-hover'));
  };
  hoverables.forEach((el) => {
    el.addEventListener('touchstart', () => {
      clearTimeout(hoverTimer);
      hoverables.forEach((x) => x.classList.remove('tap-hover'));
      el.classList.add('tap-hover');
    }, { passive: true });
    el.addEventListener('touchend', () => {
      hoverTimer = setTimeout(() => hoverables.forEach((x) => x.classList.remove('tap-hover')), 600);
    }, { passive: true });
    el.addEventListener('touchcancel', clearHover);
  });
}

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
let ticking = false;

const updateHeader = () => {
  const y = window.scrollY;
  const anyMegaOpen = document.querySelector('.mega-menu.open');
  const mobileNavOpen = !nav.classList.contains('-translate-y-[130%]');

  if (anyMegaOpen || mobileNavOpen) {
    header.classList.remove('header-hidden');
  } else if (y > lastScrollY && y > 60) {
    header.classList.add('header-hidden');
  } else if (y < lastScrollY) {
    header.classList.remove('header-hidden');
  }
  lastScrollY = y;
  ticking = false;
};

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateHeader);
    ticking = true;
  }

  // Scroll Progress Indicator
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  if (height > 0) {
    const scrolled = (window.scrollY / height) * 100;
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

// ===== Service cards: scroll-reveal from sides + 3D tilt on hover =====
const serviceCards = document.querySelectorAll('.service-card');

// Mark cards as hidden initially
serviceCards.forEach((card) => card.classList.add('card-hidden'));

const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('card-hidden');
        entry.target.classList.add('card-reveal');
        cardObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
serviceCards.forEach((card) => cardObserver.observe(card));

// 3D magnetic tilt on hover
serviceCards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2 + 20}px 50px -12px rgba(37, 99, 235, 0.2), ${-rotateY}px ${rotateX + 8}px 24px -8px rgba(37, 99, 235, 0.1)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
  });
});

// ===== Mega menus =====
const megaMenus = [
  { btn: document.getElementById('servicesBtn'), menu: document.getElementById('megaMenu'), mobileMenu: document.getElementById('mobileServicesMenu') },
  { btn: document.getElementById('consultancyBtn'), menu: document.getElementById('consultancyMenu'), mobileMenu: document.getElementById('mobileConsultancyMenu') },
  { btn: document.getElementById('companyBtn'), menu: document.getElementById('companyMenu'), mobileMenu: document.getElementById('mobileCompanyMenu') },
  { btn: document.getElementById('resourcesBtn'), menu: document.getElementById('resourcesMenu'), mobileMenu: document.getElementById('mobileResourcesMenu') },
].filter((m) => m.btn && m.menu);

const setMegaMenu = (target, open) => {
  megaMenus.forEach(({ btn, menu, mobileMenu }) => {
    const isTarget = menu === target;
    menu.classList.toggle('open', isTarget && open);
    if (mobileMenu) mobileMenu.classList.toggle('open', isTarget && open);
    btn.setAttribute('aria-expanded', String(isTarget && open));
    menu.setAttribute('aria-hidden', String(!(isTarget && open)));
    if (mobileMenu) mobileMenu.setAttribute('aria-hidden', String(!(isTarget && open)));
  });
  if (open && !nav.classList.contains('-translate-y-[130%]')) {
    nav.classList.add('-translate-y-[130%]');
    toggle.setAttribute('aria-expanded', 'false');
  }

  // Prevent background page scroll on mobile while a mega menu is open
  if (window.matchMedia('(max-width: 1023px)').matches) {
    const anyOpen = megaMenus.some(({ menu }) => menu.classList.contains('open'));
    document.body.classList.toggle('overflow-hidden', anyOpen);
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
    const insideMenu = megaMenus.some(({ btn, menu, mobileMenu }) =>
      btn.contains(e.target) || menu.contains(e.target) || (mobileMenu && mobileMenu.contains(e.target))
    );
    if (!insideMenu) closeAllMegaMenus();
  });

}

// ===== Mobile mega menu: close on link tap =====
document.querySelectorAll('[data-close-mobile]').forEach((link) => {
  link.addEventListener('click', () => closeAllMegaMenus());
});
