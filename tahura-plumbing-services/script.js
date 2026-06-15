document.addEventListener('DOMContentLoaded', function () {

  // ---- NAVBAR ----
  var navbar = document.getElementById('navbar');
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');

  function handleScroll() {
    if (!navbar) return;
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    var scrollY = window.scrollY + 100;
    document.querySelectorAll('section[id]').forEach(function (sec) {
      var top = sec.offsetTop;
      var height = sec.offsetHeight;
      var id = sec.getAttribute('id');
      var link = navLinks ? navLinks.querySelector('a[href="#' + id + '"]') : null;
      if (link) {
        link.style.color = scrollY >= top && scrollY < top + height ? '#D4AF37' : '';
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      if (navLinks) navLinks.classList.toggle('open');
    });
  }

  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger && hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // ---- HERO PARTICLES ----
  var container = document.getElementById('heroParticles');
  if (container) {
    for (var i = 0; i < 22; i++) {
      var p = document.createElement('div');
      var size = Math.random() * 3 + 1;
      var x = Math.random() * 100;
      var delay = Math.random() * 6;
      var dur = 6 + Math.random() * 8;
      var dir = Math.random() > 0.5 ? '' : '-';
      var px = 30 + Math.random() * 50;
      p.style.cssText =
        'position:absolute;width:' + size + 'px;height:' + size + 'px;' +
        'background:rgba(212,175,55,' + (0.15 + Math.random() * 0.3) + ');' +
        'border-radius:50%;left:' + x + '%;bottom:-10px;' +
        'animation:particleFloat ' + dur + 's ' + delay + 's linear infinite;';
      container.appendChild(p);
    }
    if (!document.getElementById('particleStyle')) {
      var style = document.createElement('style');
      style.id = 'particleStyle';
      style.textContent = '@keyframes particleFloat{0%{transform:translateY(0) translateX(0);opacity:0}10%{opacity:1}90%{opacity:0.5}100%{transform:translateY(-100vh) translateX(' + '-' + '30px);opacity:0}}';
      // Inline proper keyframe with dynamic values per particle
      style.textContent = '@keyframes particleFloat{0%{transform:translateY(0) translateX(0);opacity:0}10%{opacity:1}90%{opacity:0.5}100%{transform:translateY(-100vh);opacity:0}}';
      document.head.appendChild(style);
    }
  }

  // ---- SCROLL REVEAL ----
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var delay = Number(entry.target.dataset.delay) || 0;
        setTimeout(function () { entry.target.classList.add('visible'); }, delay);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function (el, i) {
    el.dataset.delay = String((i % 4) * 80);
    revealObserver.observe(el);
  });

  // ---- ANIMATED COUNTERS ----
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var el = entry.target;
      if (entry.isIntersecting && !el.dataset.counted) {
        el.dataset.counted = '1';
        var target = parseInt(el.dataset.target || '0');
        var suffix = el.dataset.suffix || '';
        var duration = 2000;
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
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.stat-num[data-target]').forEach(function (el) {
    counterObserver.observe(el);
  });

  // ---- GALLERY LIGHTBOX ----
  var galleryTrack = document.getElementById('galleryTrack');
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbClose = document.getElementById('lbClose');
  var lbPrev = document.getElementById('lbPrev');
  var lbNext = document.getElementById('lbNext');
  var lightboxImages = [];
  var lightboxIndex = 0;
  var GALLERY_COUNT = 28;

  if (galleryTrack) {
    var items = galleryTrack.querySelectorAll('.gallery-item');
    lightboxImages = Array.from(items).slice(0, GALLERY_COUNT).map(function (item) {
      return item.dataset.src || '';
    });
    items.forEach(function (item, idx) {
      item.addEventListener('click', function () {
        openLightbox(idx < GALLERY_COUNT ? idx : idx - GALLERY_COUNT);
      });
    });
  }

  function openLightbox(idx) {
    if (!lightbox || !lbImg) return;
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
  if (lbPrev) lbPrev.addEventListener('click', function () {
    lightboxIndex = (lightboxIndex - 1 + GALLERY_COUNT) % GALLERY_COUNT;
    if (lbImg) lbImg.src = lightboxImages[lightboxIndex];
  });
  if (lbNext) lbNext.addEventListener('click', function () {
    lightboxIndex = (lightboxIndex + 1) % GALLERY_COUNT;
    if (lbImg) lbImg.src = lightboxImages[lightboxIndex];
  });
  if (lightbox) lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lbPrev) lbPrev.click();
    if (e.key === 'ArrowRight' && lbNext) lbNext.click();
  });

  // ---- BEFORE & AFTER SLIDER ----
  function initBASlider(id) {
    var slider = document.getElementById(id);
    if (!slider) return;
    var after = slider.querySelector('.ba-after');
    var handle = slider.querySelector('.ba-handle');
    var dragging = false;

    function setPosition(pct) {
      pct = Math.max(2, Math.min(98, pct));
      if (after) after.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      if (handle) handle.style.left = pct + '%';
    }

    function getPercent(e) {
      var rect = slider.getBoundingClientRect();
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      return ((clientX - rect.left) / rect.width) * 100;
    }

    setPosition(50);
    slider.addEventListener('mousedown', function (e) { dragging = true; setPosition(getPercent(e)); });
    slider.addEventListener('touchstart', function (e) { dragging = true; setPosition(getPercent(e)); }, { passive: true });
    document.addEventListener('mousemove', function (e) { if (dragging) setPosition(getPercent(e)); });
    document.addEventListener('touchmove', function (e) { if (dragging) setPosition(getPercent(e)); }, { passive: true });
    document.addEventListener('mouseup', function () { dragging = false; });
    document.addEventListener('touchend', function () { dragging = false; });
  }

  initBASlider('ba1');
  initBASlider('ba2');

  // ---- FAQ ----
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.parentElement;
      var isOpen = item && item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (i) { i.classList.remove('open'); });
      if (!isOpen && item) item.classList.add('open');
    });
  });

  // ---- BOOKING FORM ----
  var bkData = { service: '', date: '', time: '', name: '', phone: '', email: '', address: '', landmark: '', notes: '' };
  var calYear = new Date().getFullYear();
  var calMonth = new Date().getMonth();

  function bkGoTo(step) {
    document.querySelectorAll('.bk-pane').forEach(function (p) { p.classList.remove('active'); });
    var pane = document.getElementById('bkStep' + step);
    if (pane) pane.classList.add('active');
    document.querySelectorAll('.bk-step').forEach(function (s) {
      var n = parseInt(s.dataset.step || '0');
      s.classList.remove('active', 'completed');
      if (n === step) s.classList.add('active');
      if (n < step) s.classList.add('completed');
    });
    if (step === 2) renderCalendar();
    if (step === 5) renderSummary();
    var bkSection = document.getElementById('booking');
    if (bkSection) setTimeout(function () { bkSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
  }
  window.bkGoTo = bkGoTo;

  document.querySelectorAll('.svc-opt').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.svc-opt').forEach(function (b) { b.classList.remove('selected'); });
      btn.classList.add('selected');
      bkData.service = btn.dataset.service || '';
      var bk1Next = document.getElementById('bk1Next');
      if (bk1Next) bk1Next.disabled = false;
    });
  });

  var bk1Next = document.getElementById('bk1Next');
  if (bk1Next) bk1Next.addEventListener('click', function () { bkGoTo(2); });

  function renderCalendar() {
    var daysEl = document.getElementById('calDays');
    var monthYearEl = document.getElementById('calMonthYear');
    if (!daysEl) return;
    var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    if (monthYearEl) monthYearEl.textContent = monthNames[calMonth] + ' ' + calYear;
    daysEl.innerHTML = '';
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var firstDay = new Date(calYear, calMonth, 1).getDay();
    var daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    for (var i2 = 0; i2 < firstDay; i2++) {
      var d = document.createElement('div'); d.classList.add('cal-day', 'other-month'); daysEl.appendChild(d);
    }
    for (var day = 1; day <= daysInMonth; day++) {
      (function (day) {
        var d = document.createElement('div'); d.classList.add('cal-day'); d.textContent = String(day);
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
  var calNext = document.getElementById('calNext');
  if (calPrev) calPrev.addEventListener('click', function () {
    calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderCalendar();
  });
  if (calNext) calNext.addEventListener('click', function () {
    calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderCalendar();
  });

  var bk2Next = document.getElementById('bk2Next');
  if (bk2Next) bk2Next.addEventListener('click', function () { bkGoTo(3); });

  document.querySelectorAll('.time-opt').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.time-opt').forEach(function (b) { b.classList.remove('selected'); });
      btn.classList.add('selected');
      bkData.time = btn.dataset.time || '';
      var bk3Next = document.getElementById('bk3Next');
      if (bk3Next) bk3Next.disabled = false;
    });
  });

  var bk3Next = document.getElementById('bk3Next');
  if (bk3Next) bk3Next.addEventListener('click', function () { bkGoTo(4); });

  function showFieldError(input, msg) {
    if (!input) return;
    input.style.borderColor = '#ff4444';
    input.focus();
    if (!input.parentElement.querySelector('.field-err')) {
      var err = document.createElement('span');
      err.classList.add('field-err');
      err.style.cssText = 'color:#ff4444;font-size:12px;margin-top:4px;display:block;';
      err.textContent = msg;
      input.parentElement.appendChild(err);
      setTimeout(function () { err.remove(); input.style.borderColor = ''; }, 3000);
    }
  }

  var bk4Next = document.getElementById('bk4Next');
  if (bk4Next) bk4Next.addEventListener('click', function () {
    var name = document.getElementById('bkName');
    var phone = document.getElementById('bkPhone');
    var address = document.getElementById('bkAddress');
    if (!name || !name.value.trim()) { showFieldError(name, 'Name is required'); return; }
    if (!phone || !phone.value.trim()) { showFieldError(phone, 'Phone number is required'); return; }
    if (!address || !address.value.trim()) { showFieldError(address, 'Service address is required'); return; }
    bkData.name = name.value.trim();
    bkData.phone = phone.value.trim();
    var email = document.getElementById('bkEmail');
    bkData.email = email ? email.value.trim() : '';
    bkData.address = address.value.trim();
    var landmark = document.getElementById('bkLandmark');
    bkData.landmark = landmark ? landmark.value.trim() : '';
    var notes = document.getElementById('bkNotes');
    bkData.notes = notes ? notes.value.trim() : '';
    bkGoTo(5);
  });

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
    var msg = 'Hello Tahura Plumbing Contractors,\n\nI would like to book an appointment.\n\nService: ' + bkData.service + '\nDate: ' + bkData.date + '\nTime: ' + bkData.time + '\n\nName: ' + bkData.name + '\nPhone: ' + bkData.phone + '\nAddress: ' + bkData.address + (bkData.landmark ? '\nLandmark: ' + bkData.landmark : '') + (bkData.notes ? '\nAdditional Notes: ' + bkData.notes : '') + '\n\nPlease confirm my appointment.\n\nThank you.';
    var waBtn = document.getElementById('bkWhatsapp');
    if (waBtn) { waBtn.href = 'https://wa.me/919867426238?text=' + encodeURIComponent(msg); waBtn.target = '_blank'; waBtn.rel = 'noopener'; }
  }

  // ---- CONTACT FORM ----
  function handleCF(e) {
    e.preventDefault();
    var name = document.getElementById('cfName');
    var phone = document.getElementById('cfPhone');
    var svc = document.getElementById('cfSvc');
    var msg = document.getElementById('cfMsg');
    var nameVal = name ? name.value.trim() : '';
    var phoneVal = phone ? phone.value.trim() : '';
    if (!nameVal || !phoneVal) { alert('Please fill in your name and phone number.'); return; }
    var svcVal = svc ? svc.value : '';
    var msgVal = msg ? msg.value.trim() : '';
    var waMsg = 'Hello Tahura Plumbing Contractors,\n\nName: ' + nameVal + '\nPhone: ' + phoneVal + (svcVal ? '\nService: ' + svcVal : '') + (msgVal ? '\nMessage: ' + msgVal : '') + '\n\nPlease get in touch with me.';
    window.open('https://wa.me/919867426238?text=' + encodeURIComponent(waMsg), '_blank');
  }
  window.handleCF = handleCF;
  var cfForm = document.getElementById('cf');
  if (cfForm) cfForm.addEventListener('submit', handleCF);

  // ---- SMOOTH SCROLL ----
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ---- HERO ANIMATE ----
  var heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    setTimeout(function () {
      heroContent.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 150);
  }

  renderCalendar();
});
