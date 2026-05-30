'use strict';

// ── Theme ─────────────────────────────────────────────────────
const html = document.documentElement;
const themeBtn = document.getElementById('themeToggle');

function setTheme(t) {
  html.setAttribute('data-theme', t);
  localStorage.setItem('masar-theme', t);
}

(function initTheme() {
  const saved = localStorage.getItem('masar-theme');
  if (saved) { setTheme(saved); return; }
  setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
})();

themeBtn.addEventListener('click', () => {
  setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// ── Navbar scroll ─────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 10 ? '0 2px 16px rgba(0,0,0,.1)' : '';
}, { passive: true });

// ── Mobile menu ───────────────────────────────────────────────
const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('open');
  });
});
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('open');
  }
});

// ── Active nav link on scroll ─────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinkEls.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: `-${68}px 0px -60% 0px` });
sections.forEach(s => sectionObserver.observe(s));

// ── Category filter ───────────────────────────────────────────
const catBtns = document.querySelectorAll('.cat-btn');
const courseCards = document.querySelectorAll('.course-card');
catBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    catBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    courseCards.forEach(card => {
      const match = cat === 'all' || card.dataset.cat === cat;
      card.style.display = match ? '' : 'none';
    });
  });
});

// ── View toggle (grid / list) ─────────────────────────────────
const gridView = document.getElementById('gridView');
const listView = document.getElementById('listView');
const coursesGrid = document.getElementById('coursesGrid');
gridView.addEventListener('click', () => {
  coursesGrid.classList.remove('list-view');
  gridView.classList.add('active');
  listView.classList.remove('active');
});
listView.addEventListener('click', () => {
  coursesGrid.classList.add('list-view');
  listView.classList.add('active');
  gridView.classList.remove('active');
});

// ── Search bar → open overlay ─────────────────────────────────
const searchInput   = document.getElementById('searchInput');
const searchOverlay = document.getElementById('searchOverlay');
const overlaySearch = document.getElementById('overlaySearch');
const closeSearch   = document.getElementById('closeSearch');

function openSearch() {
  searchOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
  setTimeout(() => overlaySearch.focus(), 50);
}
function closeSearchFn() {
  searchOverlay.hidden = true;
  document.body.style.overflow = '';
}

searchInput.addEventListener('focus', openSearch);
closeSearch.addEventListener('click', closeSearchFn);
searchOverlay.addEventListener('click', e => { if (e.target === searchOverlay) closeSearchFn(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearchFn(); });

// Chip clicks fill search and close
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    overlaySearch.value = chip.textContent;
    closeSearchFn();
  });
});

// ── Load more (simulated) ─────────────────────────────────────
const loadMoreBtn = document.getElementById('loadMore');
loadMoreBtn.addEventListener('click', () => {
  loadMoreBtn.textContent = 'جاري التحميل...';
  loadMoreBtn.disabled = true;
  setTimeout(() => {
    loadMoreBtn.textContent = 'لا توجد مزيد من المواد حالياً';
    loadMoreBtn.disabled = true;
    loadMoreBtn.style.opacity = '.5';
  }, 1200);
});

// ── Animate progress bars on scroll ──────────────────────────
const progressObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fill = e.target.querySelector('.progress-fill');
      if (fill) { fill.style.width = fill.getAttribute('data-width') || fill.style.width; }
    }
  });
}, { threshold: .3 });
document.querySelectorAll('.preview-progress').forEach(el => progressObserver.observe(el));

// ── Fade-in on scroll ─────────────────────────────────────────
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: .1 });

document.querySelectorAll('.course-card, .track-card, .feature-card, .instructor-card, .testimonial-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease, box-shadow .2s ease';
  fadeObserver.observe(el);
});
