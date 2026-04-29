'use strict';

document.addEventListener('DOMContentLoaded', function() {
  // Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
    document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Footer year
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Optional: scroll reveal (keeps animations)
  const revealElements = document.querySelectorAll('.service-card, .solar-card, .why-card, .gallery-item, .contact-method');
  if (revealElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealElements.forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  // Form submit feedback
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function() {
      const btn = contactForm.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Sending... ⚡';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = 'Send My Quote Request ⚡';
          btn.disabled = false;
        }, 5000);
      }
    });
  }
});