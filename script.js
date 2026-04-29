'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // ========== DARK MODE TOGGLE ==========
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const THEME_KEY = 'me-theme';

  function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    if (themeToggle) {
      const iconSpan = themeToggle.querySelector('.theme-toggle__icon');
      if (iconSpan) iconSpan.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  const savedTheme = localStorage.getItem(THEME_KEY) ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  // ========== HAMBURGER MENU ==========
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
    });
  });

  // ========== SCROLL REVEAL ==========
  const revealEls = document.querySelectorAll(
    '.service-card, .solar-card, .why-card, .gallery-item, .contact-method'
  );
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const idx = [...revealEls].indexOf(entry.target);
        entry.target.style.transitionDelay = `${(idx % 6) * 0.08}s`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // ========== STICKY NAVBAR SCROLL ==========
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar?.classList.add('navbar--scrolled');
    } else {
      navbar?.classList.remove('navbar--scrolled');
    }
  }, { passive: true });

  // ========== GALLERY LIGHTBOX ==========
  const galleryImages = [
    { src: 'assets/images/image1.png', alt: 'Mobile Electrician – Electrical & Solar Services' },
    { src: 'assets/images/image2.png', alt: 'Solar System Packages – PMB KZN' },
    { src: 'assets/images/image3.png', alt: 'Electrical Solutions – Full Service List' },
    { src: 'assets/images/image4.png', alt: '5kW Solar Combo – R37,500' },
    { src: 'assets/images/image5.png', alt: '3kW Solar Combo – R22,500' },
    { src: 'assets/images/image6.png', alt: 'Fridge & Washing Machine Repairs' },
  ];
  let currentImgIdx = 0;
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  window.openLightbox = (idx) => {
    currentImgIdx = idx;
    if (lightboxImg) lightboxImg.src = galleryImages[idx].src;
    lightbox?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  window.closeLightbox = () => {
    lightbox?.classList.remove('active');
    document.body.style.overflow = '';
  };
  window.nextImage = () => {
    currentImgIdx = (currentImgIdx + 1) % galleryImages.length;
    if (lightboxImg) lightboxImg.src = galleryImages[currentImgIdx].src;
  };
  window.prevImage = () => {
    currentImgIdx = (currentImgIdx - 1 + galleryImages.length) % galleryImages.length;
    if (lightboxImg) lightboxImg.src = galleryImages[currentImgIdx].src;
  };
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) window.closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') window.closeLightbox();
    if (e.key === 'ArrowRight') window.nextImage();
    if (e.key === 'ArrowLeft') window.prevImage();
  });

  // ========== ACTIVE NAV HIGHLIGHTING ==========
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinksAll.forEach(link => {
          link.classList.toggle(
            'nav-link--active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => sectionObserver.observe(s));

  // ========== FOOTER YEAR ==========
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ========== FORM SUBMIT FEEDBACK ==========
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (e) => {
    const btn = contactForm.querySelector('button[type="submit"]');
    if (btn) {
      btn.textContent = 'Sending... ⚡';
      btn.disabled = true;
    }
    setTimeout(() => {
      if (btn) {
        btn.textContent = 'Send My Quote Request ⚡';
        btn.disabled = false;
      }
    }, 6000);
  });
});