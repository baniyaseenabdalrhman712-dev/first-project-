'use strict';

/* ── WhatsApp number ──────────────────────────────────────────
   Replace with the actual number in international format
   (digits only, no +, spaces, or dashes).
   Example: "962791234567" for +962 79 123 4567
──────────────────────────────────────────────────────────────*/
const WA_NUMBER = '962775521607';

/* ── Theme toggle ────────────────────────────────────────────── */
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) { applyTheme(saved); return; }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
}

themeToggle.addEventListener('click', () => {
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

initTheme();

/* ── Language toggle ─────────────────────────────────────────── */
const langToggle = document.getElementById('langToggle');
const langLabel  = document.getElementById('langLabel');
let currentLang = localStorage.getItem('lang') || 'en';

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  langLabel.textContent = lang === 'en' ? 'AR' : 'EN';

  document.querySelectorAll('[data-en]').forEach(el => {
    const text = lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
    if (!text) return;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = text;
    } else {
      el.innerHTML = text;
    }
  });

  // Update form placeholders separately
  const placeholders = {
    en: { name: 'Your name', email: 'you@example.com', message: 'What would you like to discuss?' },
    ar: { name: 'اسمك', email: 'بريدك@مثال.com', message: 'ما الذي تريد مناقشته؟' }
  };
  const p = placeholders[lang];
  const nameEl    = document.getElementById('name');
  const emailEl   = document.getElementById('email');
  const messageEl = document.getElementById('message');
  if (nameEl)    nameEl.placeholder    = p.name;
  if (emailEl)   emailEl.placeholder   = p.email;
  if (messageEl) messageEl.placeholder = p.message;
}

langToggle.addEventListener('click', () => {
  applyLang(currentLang === 'en' ? 'ar' : 'en');
});

applyLang(currentLang);

/* ── Navbar: scroll shadow + active link ─────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 10 ? '0 2px 12px rgba(0,0,0,.1)' : '';
}, { passive: true });

// Highlight active section
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.classList.toggle('nav-link--active', link.getAttribute('href') === '#' + entry.target.id);
    });
  });
}, { rootMargin: `-${64}px 0px -60% 0px` });

sections.forEach(s => observer.observe(s));

// Add active style dynamically
const style = document.createElement('style');
style.textContent = `.nav-link--active { color: var(--color-text) !important; font-weight: 600; }`;
document.head.appendChild(style);

/* ── Mobile menu ─────────────────────────────────────────────── */
const menuToggle = document.getElementById('menuToggle');
const navLinksEl = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  const isOpen = navLinksEl.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', isOpen);
});

// Close on link click
navLinksEl.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    menuToggle.classList.remove('open');
  });
});

// Close on outside click
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    navLinksEl.classList.remove('open');
    menuToggle.classList.remove('open');
  }
});

/* ── WhatsApp helpers ────────────────────────────────────────── */
function buildWaUrl(text) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

// Update the static WhatsApp button href
const waBtn = document.getElementById('whatsappBtn');
if (waBtn) {
  const defaultMsg = currentLang === 'ar'
    ? 'مرحباً عبد الرحمن، وجدت موقعك وأريد التواصل معك.'
    : 'Hello Abdel Rahman, I found your website and would like to connect.';
  waBtn.href = buildWaUrl(defaultMsg);
}

/* ── Contact form → WhatsApp ─────────────────────────────────── */
const form          = document.getElementById('contactForm');
const formWaBtn     = document.getElementById('formWhatsapp');
const formSuccess   = document.getElementById('formSuccess');

function getFormData() {
  return {
    name:    document.getElementById('name').value.trim(),
    email:   document.getElementById('email').value.trim(),
    message: document.getElementById('message').value.trim(),
  };
}

function buildFormMessage({ name, email, message }) {
  return currentLang === 'ar'
    ? `مرحباً عبد الرحمن،\nالاسم: ${name}\nالبريد: ${email}\n\n${message}`
    : `Hello Abdel Rahman,\nName: ${name}\nEmail: ${email}\n\n${message}`;
}

function validateForm() {
  const { name, email, message } = getFormData();
  if (!name || !email || !message) {
    alert(currentLang === 'ar' ? 'يرجى ملء جميع الحقول.' : 'Please fill in all fields.');
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert(currentLang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.');
    return false;
  }
  return true;
}

formWaBtn.addEventListener('click', () => {
  if (!validateForm()) return;
  const url = buildWaUrl(buildFormMessage(getFormData()));
  window.open(url, '_blank', 'noopener,noreferrer');
  formSuccess.hidden = false;
  form.reset();
  setTimeout(() => { formSuccess.hidden = true; }, 5000);
});

// Prevent default form submit (no server-side handler)
form.addEventListener('submit', e => {
  e.preventDefault();
  formWaBtn.click();
});
