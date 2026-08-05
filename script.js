/**
 * ==========================================================================
 * MD FATEH MUHTASIM - PORTFOLIO SCRIPT
 * Vanilla JavaScript (No Frameworks)
 * - Theme Switcher (Dark/Light with localStorage persistence)
 * - Mobile Navigation Menu Toggle
 * - Intersection Observer for Scroll Reveal & Stagger Animations
 * - Active Section Link Highlighting on Scroll
 * - Front-end Contact Form Validation & Toast Notification
 * - Dynamic Footer Copyright Year
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all core functions
  initThemeToggle();
  initMobileMenu();
  initHeroRoleAnimation();
  initScrollReveal();
  initActiveNavHighlight();
  initContactForm();
  updateCopyrightYear();
});

/* --------------------------------------------------------------------------
   1. THEME SWITCHER (DARK / LIGHT MODE WITH LOCALSTORAGE)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  // Check saved theme in localStorage or fallback to preferred system theme
  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);
    localStorage.setItem('portfolio-theme', currentTheme);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

/* --------------------------------------------------------------------------
   2. MOBILE NAVIGATION DRAWER MENU
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburger-menu');
  const navLinksContainer = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburgerBtn || !navLinksContainer) return;

  // Toggle drawer menu
  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
    hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
    hamburgerBtn.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
  });

  // Close mobile drawer when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('active');
      navLinksContainer.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close mobile drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinksContainer.classList.contains('active') &&
        !navLinksContainer.contains(e.target) &&
        !hamburgerBtn.contains(e.target)) {
      hamburgerBtn.classList.remove('active');
      navLinksContainer.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* --------------------------------------------------------------------------
   2b. HERO ROLE WORD-BY-WORD ENTRANCE ANIMATION
   -------------------------------------------------------------------------- */
function initHeroRoleAnimation() {
  const roleElement = document.getElementById('hero-role-animated');
  if (!roleElement) return;

  // Trigger initial entrance animation on page load
  setTimeout(() => {
    roleElement.classList.add('animate');
  }, 150);

  // Re-trigger entrance animation when hero section enters viewport
  const heroSection = document.getElementById('hero');
  if (heroSection && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          roleElement.classList.add('animate');
        }
      });
    }, { threshold: 0.2 });

    heroObserver.observe(heroSection);
  }
}

/* --------------------------------------------------------------------------
   3. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');

          // If entry is a skill category, trigger pop-in animation on children pills
          if (entry.target.classList.contains('skill-category')) {
            const pills = entry.target.querySelectorAll('.skill-pill');
            pills.forEach((pill, index) => {
              pill.style.animation = `popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.08}s forwards`;
            });
          }

          // Stop observing once animated
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is unsupported
    revealElements.forEach(el => el.classList.add('active'));
  }
}

/* Add dynamic Keyframe animation for skill pills */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes popIn {
    0% { opacity: 0; transform: scale(0.8) translateY(10px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
`;
document.head.appendChild(styleSheet);

/* --------------------------------------------------------------------------
   4. ACTIVE NAV-LINK HIGHLIGHTING ON SCROLL
   -------------------------------------------------------------------------- */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!('IntersectionObserver' in window)) return;

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');

        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    root: null,
    threshold: 0.3
  });

  sections.forEach(section => navObserver.observe(section));
}

/* --------------------------------------------------------------------------
   5. CONTACT FORM VALIDATION & DYNAMIC TOAST NOTIFICATION
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Input fields
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Reset previous errors
    clearFormErrors(form);

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      showError(nameInput, 'Please enter your name');
      isValid = false;
    }

    // Validate Phone
    if (!phoneInput.value.trim()) {
      showError(phoneInput, 'Please enter a phone number');
      isValid = false;
    }

    // Validate Email format
    const emailValue = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue) {
      showError(emailInput, 'Please enter your email address');
      isValid = false;
    } else if (!emailRegex.test(emailValue)) {
      showError(emailInput, 'Please enter a valid email address (e.g. name@domain.com)');
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      showError(messageInput, 'Please enter your message');
      isValid = false;
    }

    if (isValid) {
      // Simulate form submission success
      showToast(toast, toastMessage, 'Message sent successfully! Thank you for reaching out, Muhtasim will get back to you soon.', false);
      
      // Optionally reset message input while leaving pre-filled details
      messageInput.value = '';
    } else {
      showToast(toast, toastMessage, 'Please fill in all required fields correctly.', true);
    }
  });

  // Real-time input listener to clear error states
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const parent = input.closest('.form-group');
      if (parent) {
        parent.classList.remove('invalid');
      }
    });
  });
}

function showError(inputElement, messageText) {
  const formGroup = inputElement.closest('.form-group');
  if (!formGroup) return;

  formGroup.classList.add('invalid');
  const errorSpan = formGroup.querySelector('.error-msg');
  if (errorSpan) {
    errorSpan.textContent = messageText;
  }
}

function clearFormErrors(form) {
  const formGroups = form.querySelectorAll('.form-group');
  formGroups.forEach(group => group.classList.remove('invalid'));
}

function showToast(toastEl, messageEl, messageText, isError = false) {
  if (!toastEl || !messageEl) return;

  messageEl.textContent = messageText;
  toastEl.classList.remove('hidden');

  if (isError) {
    toastEl.classList.add('error-toast');
  } else {
    toastEl.classList.remove('error-toast');
  }

  // Auto-hide toast after 4.5 seconds
  setTimeout(() => {
    toastEl.classList.add('hidden');
  }, 4500);
}

/* --------------------------------------------------------------------------
   6. DYNAMIC FOOTER COPYRIGHT YEAR
   -------------------------------------------------------------------------- */
function updateCopyrightYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
