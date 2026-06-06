/* ============================================================
   TAHURA PLUMBING CONTRACTORS — main.js
   Pure Vanilla JS — No frameworks
============================================================ */

'use strict';

// ============================================================
// NAVBAR — Scroll Effect + Mobile Toggle
// ============================================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = navLinks.querySelector(`a[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.style.color = '#D4AF37';
      } else {
        link.style.color = '';
      }
    }
  });
}, { passive: true });

// ============================================================
// HERO PARTICLES
// ============================================================
(function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  const count = 22;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const delay = Math.random() * 6;
    const dur = 6 + Math.random() * 8;
    p.style.cssText = `
      position:absolute;
      width:${size}px;height:${size}px;
      background:rgba(212,175,55,${0.15 + Math.random() * 0.3});
      border-radius:50%;
      left:${x}%;
      bottom:-10px;
      animation:particleFloat ${dur}s ${delay}s linear infinite;
    `;
    container.appendChild(p);
  }
  if (!document.getElementById('particleStyle')) {
    const style = document.createElement('style');
    style.id = 'particleStyle';
    style.textContent = `
      @keyframes particleFloat {
        0%{transform:translateY(0) translateX(0);opacity:0}
        10%{opacity:1}
        90%{opacity:0.5}
        100%{transform:translateY(-100vh) translateX(${Math.random() > 0.5 ? '' : '-'}${30 + Math.random() * 50}px);opacity:0}
      }
    `;
    document.head.appendChild(style);
  }
})();

// ============================================================
// SCROLL REVEAL
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Stagger children
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el, i) => {
  el.dataset.delay = (i % 4) * 80;
  revealObserver.observe(el);
});

// ============================================================
// ANIMATED COUNTERS
// ============================================================
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = '1';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current.toLocaleString('en-IN') + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString('en-IN') + suffix;
  }
  requestAnimationFrame(update);
}

// ============================================================
// GALLERY — Auto Scroll + Lightbox
// ============================================================
const galleryTrack = document.getElementById('galleryTrack');
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');

let lightboxImages = [];
let lightboxIndex = 0;

if (galleryTrack) {
  // Collect original gallery items (not duplicates) for lightbox
  const items = galleryTrack.querySelectorAll('.gallery-item');
  lightboxImages = Array.from(items).map(item => item.dataset.src);

  items.forEach((item, idx) => {
    item.addEventListener('click', () => {
      lightboxIndex = idx % (lightboxImages.length / 2 + 7); // account for duplicates
      openLightbox(idx < 14 ? idx : idx - 14);
    });
  });
}

function openLightbox(idx) {
  if (!lightbox) return;
  lightboxIndex = idx;
  lbImg.src = lightboxImages[lightboxIndex] || lightboxImages[0];
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

if (lbClose) lbClose.addEventListener('click', closeLightbox);
if (lbPrev) lbPrev.addEventListener('click', () => {
  lightboxIndex = (lightboxIndex - 1 + 14) % 14;
  lbImg.src = lightboxImages[lightboxIndex];
});
if (lbNext) lbNext.addEventListener('click', () => {
  lightboxIndex = (lightboxIndex + 1) % 14;
  lbImg.src = lightboxImages[lightboxIndex];
});
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}
document.addEventListener('keydown', (e) => {
  if (!lightbox || !lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft' && lbPrev) lbPrev.click();
  if (e.key === 'ArrowRight' && lbNext) lbNext.click();
});

// ============================================================
// BEFORE & AFTER SLIDER
// ============================================================
function initBASlider(id) {
  const slider = document.getElementById(id);
  if (!slider) return;
  const after = slider.querySelector('.ba-after');
  const handle = slider.querySelector('.ba-handle');
  let dragging = false;

  function setPosition(pct) {
    pct = Math.max(2, Math.min(98, pct));
    after.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = pct + '%';
  }

  setPosition(50);

  function getPercent(e) {
    const rect = slider.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return ((clientX - rect.left) / rect.width) * 100;
  }

  slider.addEventListener('mousedown', (e) => { dragging = true; setPosition(getPercent(e)); });
  slider.addEventListener('touchstart', (e) => { dragging = true; setPosition(getPercent(e)); }, { passive: true });
  document.addEventListener('mousemove', (e) => { if (dragging) setPosition(getPercent(e)); });
  document.addEventListener('touchmove', (e) => { if (dragging) setPosition(getPercent(e)); }, { passive: true });
  document.addEventListener('mouseup', () => dragging = false);
  document.addEventListener('touchend', () => dragging = false);
}

initBASlider('ba1');
initBASlider('ba2');

// ============================================================
// REVIEWS SLIDER
// ============================================================
(function initReviews() {
  const track = document.getElementById('reviewsTrack');
  const dotsContainer = document.getElementById('rvDots');
  const prevBtn = document.getElementById('rvPrev');
  const nextBtn = document.getElementById('rvNext');
  if (!track) return;

  const cards = track.querySelectorAll('.rv-card');
  const count = cards.length;
  let current = 0;
  let autoTimer;

  // Create dots
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    dot.classList.add('rv-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  function updateDots() {
    dotsContainer.querySelectorAll('.rv-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(idx) {
    current = (idx + count) % count;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 4500);
  }
  function stopAuto() { clearInterval(autoTimer); }

  prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

  // Set card widths for slider
  track.style.width = (count * 100) + '%';
  cards.forEach(card => { card.style.width = (100 / count) + '%'; });

  startAuto();
})();

// ============================================================
// FAQ ACCORDION
// ============================================================
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    // Toggle clicked
    if (!isOpen) item.classList.add('open');
  });
});

// ============================================================
// BOOKING FORM — 5-Step Multi-Step
// ============================================================
const bkData = {
  service: '',
  date: '',
  time: '',
  name: '',
  phone: '',
  email: '',
  address: '',
  landmark: '',
  notes: ''
};

let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();

function bkGoTo(step) {
  document.querySelectorAll('.bk-pane').forEach(p => p.classList.remove('active'));
  const pane = document.getElementById('bkStep' + step);
  if (pane) pane.classList.add('active');

  // Update progress
  document.querySelectorAll('.bk-step').forEach(s => {
    const n = parseInt(s.dataset.step);
    s.classList.remove('active', 'completed');
    if (n === step) s.classList.add('active');
    if (n < step) s.classList.add('completed');
  });

  if (step === 2) renderCalendar();
  if (step === 5) renderSummary();

  // Scroll to booking section
  const bkSection = document.getElementById('booking');
  if (bkSection) {
    setTimeout(() => bkSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }
}

// Step 1 — Service Selection
document.querySelectorAll('.svc-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.svc-opt').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    bkData.service = btn.dataset.service;
    document.getElementById('bk1Next').disabled = false;
  });
});

const bk1Next = document.getElementById('bk1Next');
if (bk1Next) bk1Next.addEventListener('click', () => bkGoTo(2));

// Step 2 — Calendar
function renderCalendar() {
  const daysEl = document.getElementById('calDays');
  const monthYearEl = document.getElementById('calMonthYear');
  if (!daysEl) return;

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  monthYearEl.textContent = monthNames[calMonth] + ' ' + calYear;
  daysEl.innerHTML = '';

  const today = new Date();
  today.setHours(0,0,0,0);
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  // Empty cells
  for (let i = 0; i < firstDay; i++) {
    const d = document.createElement('div');
    d.classList.add('cal-day', 'other-month');
    daysEl.appendChild(d);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const d = document.createElement('div');
    d.classList.add('cal-day');
    d.textContent = day;

    const cellDate = new Date(calYear, calMonth, day);
    if (cellDate < today) {
      d.classList.add('past');
    } else {
      if (cellDate.toDateString() === today.toDateString()) d.classList.add('today');
      const dateStr = `${day} ${monthNames[calMonth]} ${calYear}`;
      if (bkData.date === dateStr) d.classList.add('selected');

      d.addEventListener('click', () => {
        daysEl.querySelectorAll('.cal-day').forEach(x => x.classList.remove('selected'));
        d.classList.add('selected');
        bkData.date = dateStr;
        const dispEl = document.getElementById('selectedDate');
        if (dispEl) dispEl.textContent = 'Selected: ' + dateStr;
        const bk2Next = document.getElementById('bk2Next');
        if (bk2Next) bk2Next.disabled = false;
      });
    }
    daysEl.appendChild(d);
  }
}

const calPrev = document.getElementById('calPrev');
const calNext = document.getElementById('calNext');
if (calPrev) calPrev.addEventListener('click', () => {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendar();
});
if (calNext) calNext.addEventListener('click', () => {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCalendar();
});

const bk2Next = document.getElementById('bk2Next');
if (bk2Next) bk2Next.addEventListener('click', () => bkGoTo(3));

// Step 3 — Time Slots
document.querySelectorAll('.time-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.time-opt').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    bkData.time = btn.dataset.time;
    const bk3Next = document.getElementById('bk3Next');
    if (bk3Next) bk3Next.disabled = false;
  });
});

const bk3Next = document.getElementById('bk3Next');
if (bk3Next) bk3Next.addEventListener('click', () => bkGoTo(4));

// Step 4 — Customer Details
const bk4Next = document.getElementById('bk4Next');
if (bk4Next) {
  bk4Next.addEventListener('click', () => {
    const name = document.getElementById('bkName');
    const phone = document.getElementById('bkPhone');
    const address = document.getElementById('bkAddress');

    if (!name || !name.value.trim()) { showFieldError(name, 'Name is required'); return; }
    if (!phone || !phone.value.trim()) { showFieldError(phone, 'Phone number is required'); return; }
    if (!address || !address.value.trim()) { showFieldError(address, 'Service address is required'); return; }

    bkData.name = name.value.trim();
    bkData.phone = phone.value.trim();
    bkData.email = document.getElementById('bkEmail')?.value.trim() || '';
    bkData.address = address.value.trim();
    bkData.landmark = document.getElementById('bkLandmark')?.value.trim() || '';
    bkData.notes = document.getElementById('bkNotes')?.value.trim() || '';

    bkGoTo(5);
  });
}

function showFieldError(input, msg) {
  if (!input) return;
  input.style.borderColor = '#ff4444';
  input.focus();
  const existing = input.parentElement.querySelector('.field-err');
  if (!existing) {
    const err = document.createElement('span');
    err.classList.add('field-err');
    err.style.cssText = 'color:#ff4444;font-size:12px;margin-top:4px;display:block;';
    err.textContent = msg;
    input.parentElement.appendChild(err);
    setTimeout(() => { err.remove(); input.style.borderColor = ''; }, 3000);
  }
}

// Step 5 — Summary + WhatsApp
function renderSummary() {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || '—'; };
  set('sumSvc', bkData.service);
  set('sumDate', bkData.date);
  set('sumTime', bkData.time);
  set('sumName', bkData.name);
  set('sumPhone', bkData.phone);
  set('sumAddr', bkData.address + (bkData.landmark ? ', Near ' + bkData.landmark : ''));

  const notesRow = document.getElementById('sumNotesRow');
  if (notesRow) {
    notesRow.style.display = bkData.notes ? 'flex' : 'none';
    set('sumNotes', bkData.notes);
  }

  // Build WhatsApp message
  const msg = `Hello Tahura Plumbing Contractors,

I would like to book an appointment.

Service: ${bkData.service}
Date: ${bkData.date}
Time: ${bkData.time}

Name: ${bkData.name}
Phone: ${bkData.phone}
Address: ${bkData.address}${bkData.landmark ? '\nLandmark: ' + bkData.landmark : ''}
${bkData.notes ? 'Additional Notes: ' + bkData.notes : ''}

Please confirm my appointment.

Thank you.`;

  const waBtn = document.getElementById('bkWhatsapp');
  if (waBtn) {
    waBtn.href = 'https://wa.me/919867426238?text=' + encodeURIComponent(msg);
    waBtn.setAttribute('target', '_blank');
    waBtn.setAttribute('rel', 'noopener');
  }
}

// ============================================================
// CONTACT FORM — WhatsApp Send
// ============================================================
function handleCF(e) {
  e.preventDefault();
  const name = document.getElementById('cfName')?.value.trim();
  const phone = document.getElementById('cfPhone')?.value.trim();
  const svc = document.getElementById('cfSvc')?.value;
  const msg = document.getElementById('cfMsg')?.value.trim();

  if (!name || !phone) {
    alert('Please fill in your name and phone number.');
    return;
  }

  const waMsg = `Hello Tahura Plumbing Contractors,

Name: ${name}
Phone: ${phone}
${svc ? 'Service: ' + svc : ''}
${msg ? 'Message: ' + msg : ''}

Please get in touch with me.`;

  window.open('https://wa.me/919867426238?text=' + encodeURIComponent(waMsg), '_blank');
}

// Make handleCF global
window.handleCF = handleCF;
window.bkGoTo = bkGoTo;

// ============================================================
// SMOOTH SCROLL for anchor links
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ============================================================
// LAZY LOAD IMAGES (Intersection Observer)
// ============================================================
if ('IntersectionObserver' in window) {
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imgObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  document.querySelectorAll('img[loading="lazy"]').forEach(img => imgObserver.observe(img));
}

// ============================================================
// DOM Ready — Initialize Calendar & Hero animation
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  renderCalendar();

  // Animate hero content on load
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    setTimeout(() => {
      heroContent.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 150);
  }
});
