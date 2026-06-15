'use strict';

/* ============================================================
   TAHURA PLUMBING CONTRACTORS — script.js
   Lightweight Vanilla JS — No frameworks, no 3D effects
============================================================ */

// ============================================================
// NAVBAR — Scroll Effect + Mobile Toggle
// ============================================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', function () {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

hamburger.addEventListener('click', function () {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Active nav highlight on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', function () {
  var scrollY = window.scrollY + 100;
  sections.forEach(function (sec) {
    var top = sec.offsetTop;
    var height = sec.offsetHeight;
    var id = sec.getAttribute('id');
    var link = navLinks.querySelector('a[href="#' + id + '"]');
    if (link) {
      link.style.color = (scrollY >= top && scrollY < top + height) ? '#D4AF37' : '';
    }
  });
}, { passive: true });

// ============================================================
// SCROLL REVEAL (lightweight IntersectionObserver)
// ============================================================
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function (el) {
  revealObserver.observe(el);
});

// ============================================================
// ANIMATED COUNTERS
// ============================================================
var counterObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = '1';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stat-num[data-target]').forEach(function (el) {
  counterObserver.observe(el);
});

function animateCounter(el) {
  var target = parseInt(el.dataset.target);
  var suffix = el.dataset.suffix || '';
  var duration = 1800;
  var start = performance.now();
  function update(now) {
    var elapsed = now - start;
    var progress = Math.min(elapsed / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('en-IN') + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString('en-IN') + suffix;
  }
  requestAnimationFrame(update);
}

// ============================================================
// GALLERY LIGHTBOX
// ============================================================
var lightbox = document.getElementById('lightbox');
var lbImg = document.getElementById('lbImg');
var lbClose = document.getElementById('lbClose');
var lbPrev = document.getElementById('lbPrev');
var lbNext = document.getElementById('lbNext');
var lightboxImages = [];
var lightboxIndex = 0;
var TOTAL_IMAGES = 14;

var galleryTrack = document.getElementById('galleryTrack');
if (galleryTrack) {
  var items = galleryTrack.querySelectorAll('.gallery-item');
  lightboxImages = Array.from(items).slice(0, TOTAL_IMAGES).map(function (item) {
    return item.dataset.src;
  });
  items.forEach(function (item, idx) {
    item.addEventListener('click', function () {
      openLightbox(idx % TOTAL_IMAGES);
    });
  });
}

function openLightbox(idx) {
  if (!lightbox) return;
  lightboxIndex = idx;
  lbImg.src = lightboxImages[lightboxIndex];
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

if (lbClose) lbClose.addEventListener('click', closeLightbox);
if (lbPrev) lbPrev.addEventListener('click', function () {
  lightboxIndex = (lightboxIndex - 1 + TOTAL_IMAGES) % TOTAL_IMAGES;
  lbImg.src = lightboxImages[lightboxIndex];
});
if (lbNext) lbNext.addEventListener('click', function () {
  lightboxIndex = (lightboxIndex + 1) % TOTAL_IMAGES;
  lbImg.src = lightboxImages[lightboxIndex];
});
if (lightbox) {
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
}
document.addEventListener('keydown', function (e) {
  if (!lightbox || !lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft' && lbPrev) lbPrev.click();
  if (e.key === 'ArrowRight' && lbNext) lbNext.click();
});

// ============================================================
// BEFORE & AFTER SLIDER
// ============================================================
function initBASlider(id) {
  var slider = document.getElementById(id);
  if (!slider) return;
  var after = slider.querySelector('.ba-after');
  var handle = slider.querySelector('.ba-handle');
  var dragging = false;

  function setPosition(pct) {
    pct = Math.max(2, Math.min(98, pct));
    after.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    handle.style.left = pct + '%';
  }

  setPosition(50);

  function getPercent(e) {
    var rect = slider.getBoundingClientRect();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return ((clientX - rect.left) / rect.width) * 100;
  }

  slider.addEventListener('mousedown', function (e) { dragging = true; setPosition(getPercent(e)); });
  slider.addEventListener('touchstart', function (e) { dragging = true; setPosition(getPercent(e)); }, { passive: true });
  document.addEventListener('mousemove', function (e) { if (dragging) setPosition(getPercent(e)); });
  document.addEventListener('touchmove', function (e) { if (dragging) setPosition(getPercent(e)); }, { passive: true });
  document.addEventListener('mouseup', function () { dragging = false; });
  document.addEventListener('touchend', function () { dragging = false; });
}

initBASlider('ba1');
initBASlider('ba2');

// ============================================================
// REVIEWS SLIDER
// ============================================================
(function () {
  var track = document.getElementById('reviewsTrack');
  var dotsContainer = document.getElementById('rvDots');
  var prevBtn = document.getElementById('rvPrev');
  var nextBtn = document.getElementById('rvNext');
  if (!track) return;

  var cards = track.querySelectorAll('.rv-card');
  var count = cards.length;
  var current = 0;
  var autoTimer;

  for (var i = 0; i < count; i++) {
    (function (i) {
      var dot = document.createElement('div');
      dot.classList.add('rv-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function () { goTo(i); });
      dotsContainer.appendChild(dot);
    })(i);
  }

  function updateDots() {
    dotsContainer.querySelectorAll('.rv-dot').forEach(function (d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(idx) {
    current = (idx + count) % count;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    updateDots();
  }

  track.style.width = (count * 100) + '%';
  cards.forEach(function (card) { card.style.width = (100 / count) + '%'; });

  function startAuto() { autoTimer = setInterval(function () { goTo(current + 1); }, 4500); }
  function stopAuto() { clearInterval(autoTimer); }

  if (prevBtn) prevBtn.addEventListener('click', function () { stopAuto(); goTo(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { stopAuto(); goTo(current + 1); startAuto(); });

  startAuto();
})();

// ============================================================
// FAQ ACCORDION
// ============================================================
document.querySelectorAll('.faq-q').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var item = btn.parentElement;
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function (i) { i.classList.remove('open'); });
    if (!isOpen) item.classList.add('open');
  });
});

// ============================================================
// BOOKING FORM — 5-Step Multi-Step Wizard
// ============================================================
var bkData = { service: '', date: '', time: '', name: '', phone: '', email: '', address: '', landmark: '', notes: '' };
var calYear = new Date().getFullYear();
var calMonth = new Date().getMonth();

function bkGoTo(step) {
  document.querySelectorAll('.bk-pane').forEach(function (p) { p.classList.remove('active'); });
  var pane = document.getElementById('bkStep' + step);
  if (pane) pane.classList.add('active');

  document.querySelectorAll('.bk-step').forEach(function (s) {
    var n = parseInt(s.dataset.step);
    s.classList.remove('active', 'completed');
    if (n === step) s.classList.add('active');
    if (n < step) s.classList.add('completed');
  });

  if (step === 2) renderCalendar();
  if (step === 5) renderSummary();

  var bkSection = document.getElementById('booking');
  if (bkSection) setTimeout(function () { bkSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
}

document.querySelectorAll('.svc-opt').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.svc-opt').forEach(function (b) { b.classList.remove('selected'); });
    btn.classList.add('selected');
    bkData.service = btn.dataset.service;
    var n = document.getElementById('bk1Next');
    if (n) n.disabled = false;
  });
});

var bk1Next = document.getElementById('bk1Next');
if (bk1Next) bk1Next.addEventListener('click', function () { bkGoTo(2); });

// Calendar
function renderCalendar() {
  var daysEl = document.getElementById('calDays');
  var monthYearEl = document.getElementById('calMonthYear');
  if (!daysEl) return;
  var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  monthYearEl.textContent = monthNames[calMonth] + ' ' + calYear;
  daysEl.innerHTML = '';
  var today = new Date(); today.setHours(0,0,0,0);
  var firstDay = new Date(calYear, calMonth, 1).getDay();
  var daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  for (var i = 0; i < firstDay; i++) {
    var empty = document.createElement('div');
    empty.classList.add('cal-day', 'other-month');
    daysEl.appendChild(empty);
  }

  for (var day = 1; day <= daysInMonth; day++) {
    (function (day) {
      var d = document.createElement('div');
      d.classList.add('cal-day');
      d.textContent = day;
      var cellDate = new Date(calYear, calMonth, day);
      if (cellDate < today) {
        d.classList.add('past');
      } else {
        if (cellDate.toDateString() === today.toDateString()) d.classList.add('today');
        var dateStr = day + ' ' + monthNames[calMonth] + ' ' + calYear;
        if (bkData.date === dateStr) d.classList.add('selected');
        d.addEventListener('click', function () {
          daysEl.querySelectorAll('.cal-day').forEach(function (x) { x.classList.remove('selected'); });
          d.classList.add('selected');
          bkData.date = dateStr;
          var dispEl = document.getElementById('selectedDate');
          if (dispEl) dispEl.textContent = 'Selected: ' + dateStr;
          var bk2Next = document.getElementById('bk2Next');
          if (bk2Next) bk2Next.disabled = false;
        });
      }
      daysEl.appendChild(d);
    })(day);
  }
}

var calPrev = document.getElementById('calPrev');
var calNextBtn = document.getElementById('calNext');
if (calPrev) calPrev.addEventListener('click', function () {
  calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderCalendar();
});
if (calNextBtn) calNextBtn.addEventListener('click', function () {
  calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderCalendar();
});

var bk2Next = document.getElementById('bk2Next');
if (bk2Next) bk2Next.addEventListener('click', function () { bkGoTo(3); });

document.querySelectorAll('.time-opt').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.time-opt').forEach(function (b) { b.classList.remove('selected'); });
    btn.classList.add('selected');
    bkData.time = btn.dataset.time;
    var bk3Next = document.getElementById('bk3Next');
    if (bk3Next) bk3Next.disabled = false;
  });
});

var bk3Next = document.getElementById('bk3Next');
if (bk3Next) bk3Next.addEventListener('click', function () { bkGoTo(4); });

var bk4Next = document.getElementById('bk4Next');
if (bk4Next) {
  bk4Next.addEventListener('click', function () {
    var name = document.getElementById('bkName');
    var phone = document.getElementById('bkPhone');
    var address = document.getElementById('bkAddress');
    if (!name || !name.value.trim()) { showFieldError(name, 'Name is required'); return; }
    if (!phone || !phone.value.trim()) { showFieldError(phone, 'Phone number is required'); return; }
    if (!address || !address.value.trim()) { showFieldError(address, 'Service address is required'); return; }
    bkData.name = name.value.trim();
    bkData.phone = phone.value.trim();
    bkData.email = (document.getElementById('bkEmail') || {value:''}).value.trim();
    bkData.address = address.value.trim();
    bkData.landmark = (document.getElementById('bkLandmark') || {value:''}).value.trim();
    bkData.notes = (document.getElementById('bkNotes') || {value:''}).value.trim();
    bkGoTo(5);
  });
}

function showFieldError(input, msg) {
  if (!input) return;
  input.style.borderColor = '#ff4444';
  input.focus();
  var existing = input.parentElement.querySelector('.field-err');
  if (!existing) {
    var err = document.createElement('span');
    err.classList.add('field-err');
    err.style.cssText = 'color:#ff4444;font-size:12px;margin-top:4px;display:block;';
    err.textContent = msg;
    input.parentElement.appendChild(err);
    setTimeout(function () { err.remove(); input.style.borderColor = ''; }, 3000);
  }
}

function renderSummary() {
  function set(id, val) { var el = document.getElementById(id); if (el) el.textContent = val || '—'; }
  set('sumSvc', bkData.service);
  set('sumDate', bkData.date);
  set('sumTime', bkData.time);
  set('sumName', bkData.name);
  set('sumPhone', bkData.phone);
  set('sumAddr', bkData.address + (bkData.landmark ? ', Near ' + bkData.landmark : ''));
  var notesRow = document.getElementById('sumNotesRow');
  if (notesRow) { notesRow.style.display = bkData.notes ? 'flex' : 'none'; set('sumNotes', bkData.notes); }

  var msg = 'Hello Tahura Plumbing Contractors,\n\nI would like to book an appointment.\n\nService: ' + bkData.service +
    '\nDate: ' + bkData.date + '\nTime: ' + bkData.time +
    '\n\nName: ' + bkData.name + '\nPhone: ' + bkData.phone +
    '\nAddress: ' + bkData.address + (bkData.landmark ? '\nLandmark: ' + bkData.landmark : '') +
    (bkData.notes ? '\nAdditional Notes: ' + bkData.notes : '') +
    '\n\nPlease confirm my appointment.\n\nThank you.';

  var waBtn = document.getElementById('bkWhatsapp');
  if (waBtn) {
    waBtn.href = 'https://wa.me/919867426238?text=' + encodeURIComponent(msg);
    waBtn.setAttribute('target', '_blank');
    waBtn.setAttribute('rel', 'noopener');
  }
}

// ============================================================
// CONTACT FORM — Send via WhatsApp
// ============================================================
function handleCF(e) {
  e.preventDefault();
  var name = (document.getElementById('cfName') || {value:''}).value.trim();
  var phone = (document.getElementById('cfPhone') || {value:''}).value.trim();
  var svc = (document.getElementById('cfSvc') || {value:''}).value;
  var msg = (document.getElementById('cfMsg') || {value:''}).value.trim();

  if (!name || !phone) { alert('Please fill in your name and phone number.'); return; }

  var waMsg = 'Hello Tahura Plumbing Contractors,\n\nName: ' + name +
    '\nPhone: ' + phone +
    (svc ? '\nService: ' + svc : '') +
    (msg ? '\nMessage: ' + msg : '') +
    '\n\nPlease get in touch with me.';

  window.open('https://wa.me/919867426238?text=' + encodeURIComponent(waMsg), '_blank');
}

window.handleCF = handleCF;
window.bkGoTo = bkGoTo;

// ============================================================
// DOM READY — init calendar
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
  renderCalendar();
});
