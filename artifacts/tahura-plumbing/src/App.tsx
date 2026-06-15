import { useEffect, useRef } from "react";
import "./tahura.css";

export default function App() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // ---- NAVBAR ----
    const navbar = document.getElementById("navbar");
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");

    const handleScroll = () => {
      if (!navbar) return;
      if (window.scrollY > 40) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");

      const scrollY = window.scrollY + 100;
      document.querySelectorAll<HTMLElement>("section[id]").forEach((sec) => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute("id");
        const link = navLinks?.querySelector<HTMLElement>(`a[href="#${id}"]`);
        if (link) {
          link.style.color = scrollY >= top && scrollY < top + height ? "#D4AF37" : "";
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    hamburger?.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      navLinks?.classList.toggle("open");
    });

    navLinks?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger?.classList.remove("open");
        navLinks?.classList.remove("open");
      });
    });

    // ---- HERO PARTICLES ----
    const container = document.getElementById("heroParticles");
    if (container) {
      for (let i = 0; i < 22; i++) {
        const p = document.createElement("div");
        const size = Math.random() * 3 + 1;
        const x = Math.random() * 100;
        const delay = Math.random() * 6;
        const dur = 6 + Math.random() * 8;
        const dir = Math.random() > 0.5 ? "" : "-";
        const px = 30 + Math.random() * 50;
        p.style.cssText = `
          position:absolute;width:${size}px;height:${size}px;
          background:rgba(212,175,55,${0.15 + Math.random() * 0.3});
          border-radius:50%;left:${x}%;bottom:-10px;
          animation:particleFloat ${dur}s ${delay}s linear infinite;
        `;
        container.appendChild(p);
        if (!document.getElementById("particleStyle")) {
          const style = document.createElement("style");
          style.id = "particleStyle";
          style.textContent = `@keyframes particleFloat{0%{transform:translateY(0) translateX(0);opacity:0}10%{opacity:1}90%{opacity:0.5}100%{transform:translateY(-100vh) translateX(${dir}${px}px);opacity:0}}`;
          document.head.appendChild(style);
        }
      }
    }

    // ---- SCROLL REVEAL ----
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = Number((entry.target as HTMLElement).dataset.delay) || 0;
            setTimeout(() => entry.target.classList.add("visible"), delay);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el, i) => {
      (el as HTMLElement).dataset.delay = String((i % 4) * 80);
      revealObserver.observe(el);
    });

    // ---- ANIMATED COUNTERS ----
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting && !el.dataset.counted) {
            el.dataset.counted = "1";
            const target = parseInt(el.dataset.target || "0");
            const suffix = el.dataset.suffix || "";
            const duration = 2000;
            const start = performance.now();
            const update = (now: number) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = Math.floor(eased * target).toLocaleString("en-IN") + suffix;
              if (progress < 1) requestAnimationFrame(update);
              else el.textContent = target.toLocaleString("en-IN") + suffix;
            };
            requestAnimationFrame(update);
          }
        });
      },
      { threshold: 0.3 }
    );
    document.querySelectorAll<HTMLElement>(".stat-num[data-target]").forEach((el) =>
      counterObserver.observe(el)
    );

    // ---- GALLERY LIGHTBOX ----
    const galleryTrack = document.getElementById("galleryTrack");
    const lightbox = document.getElementById("lightbox");
    const lbImg = document.getElementById("lbImg") as HTMLImageElement | null;
    const lbClose = document.getElementById("lbClose");
    const lbPrev = document.getElementById("lbPrev");
    const lbNext = document.getElementById("lbNext");
    let lightboxImages: string[] = [];
    let lightboxIndex = 0;
    const GALLERY_COUNT = 28;

    if (galleryTrack) {
      const items = galleryTrack.querySelectorAll<HTMLElement>(".gallery-item");
      lightboxImages = Array.from(items)
        .slice(0, GALLERY_COUNT)
        .map((item) => item.dataset.src || "");

      items.forEach((item, idx) => {
        item.addEventListener("click", () => {
          openLightbox(idx < GALLERY_COUNT ? idx : idx - GALLERY_COUNT);
        });
      });
    }

    function openLightbox(idx: number) {
      if (!lightbox || !lbImg) return;
      lightboxIndex = idx;
      lbImg.src = lightboxImages[lightboxIndex] || lightboxImages[0];
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }

    lbClose?.addEventListener("click", closeLightbox);
    lbPrev?.addEventListener("click", () => {
      lightboxIndex = (lightboxIndex - 1 + GALLERY_COUNT) % GALLERY_COUNT;
      if (lbImg) lbImg.src = lightboxImages[lightboxIndex];
    });
    lbNext?.addEventListener("click", () => {
      lightboxIndex = (lightboxIndex + 1) % GALLERY_COUNT;
      if (lbImg) lbImg.src = lightboxImages[lightboxIndex];
    });
    lightbox?.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (!lightbox?.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lbPrev?.click();
      if (e.key === "ArrowRight") lbNext?.click();
    });

    // ---- BEFORE & AFTER SLIDER ----
    function initBASlider(id: string) {
      const slider = document.getElementById(id);
      if (!slider) return;
      const after = slider.querySelector<HTMLElement>(".ba-after");
      const handle = slider.querySelector<HTMLElement>(".ba-handle");
      let dragging = false;

      function setPosition(pct: number) {
        pct = Math.max(2, Math.min(98, pct));
        if (after) after.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
        if (handle) handle.style.left = pct + "%";
      }

      function getPercent(e: MouseEvent | TouchEvent) {
        const rect = slider.getBoundingClientRect();
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        return ((clientX - rect.left) / rect.width) * 100;
      }

      setPosition(50);
      slider.addEventListener("mousedown", (e) => { dragging = true; setPosition(getPercent(e)); });
      slider.addEventListener("touchstart", (e) => { dragging = true; setPosition(getPercent(e)); }, { passive: true });
      document.addEventListener("mousemove", (e) => { if (dragging) setPosition(getPercent(e)); });
      document.addEventListener("touchmove", (e) => { if (dragging) setPosition(getPercent(e as TouchEvent)); }, { passive: true });
      document.addEventListener("mouseup", () => (dragging = false));
      document.addEventListener("touchend", () => (dragging = false));
    }

    initBASlider("ba1");
    initBASlider("ba2");

    // ---- REVIEWS SLIDER ----
    const reviewsTrack = document.getElementById("reviewsTrack");
    const dotsContainer = document.getElementById("rvDots");
    const rvPrev = document.getElementById("rvPrev");
    const rvNext = document.getElementById("rvNext");
    if (reviewsTrack) {
      const cards = reviewsTrack.querySelectorAll<HTMLElement>(".rv-card");
      const count = cards.length;
      let current = 0;
      let autoTimer: ReturnType<typeof setInterval>;

      for (let i = 0; i < count; i++) {
        const dot = document.createElement("div");
        dot.classList.add("rv-dot");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goTo(i));
        dotsContainer?.appendChild(dot);
      }

      function updateDots() {
        dotsContainer?.querySelectorAll(".rv-dot").forEach((d, i) => {
          d.classList.toggle("active", i === current);
        });
      }

      function goTo(idx: number) {
        current = (idx + count) % count;
        reviewsTrack.style.transform = `translateX(-${current * 100}%)`;
        updateDots();
      }

      function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 4500); }
      function stopAuto() { clearInterval(autoTimer); }

      rvPrev?.addEventListener("click", () => { stopAuto(); goTo(current - 1); startAuto(); });
      rvNext?.addEventListener("click", () => { stopAuto(); goTo(current + 1); startAuto(); });
      reviewsTrack.style.width = count * 100 + "%";
      cards.forEach((card) => { card.style.width = 100 / count + "%"; });
      startAuto();
    }

    // ---- FAQ ----
    document.querySelectorAll(".faq-q").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.parentElement;
        const isOpen = item?.classList.contains("open");
        document.querySelectorAll(".faq-item.open").forEach((i) => i.classList.remove("open"));
        if (!isOpen) item?.classList.add("open");
      });
    });

    // ---- BOOKING FORM ----
    const bkData = {
      service: "", date: "", time: "", name: "", phone: "",
      email: "", address: "", landmark: "", notes: "",
    };
    let calYear = new Date().getFullYear();
    let calMonth = new Date().getMonth();

    function bkGoTo(step: number) {
      document.querySelectorAll(".bk-pane").forEach((p) => p.classList.remove("active"));
      document.getElementById("bkStep" + step)?.classList.add("active");
      document.querySelectorAll<HTMLElement>(".bk-step").forEach((s) => {
        const n = parseInt(s.dataset.step || "0");
        s.classList.remove("active", "completed");
        if (n === step) s.classList.add("active");
        if (n < step) s.classList.add("completed");
      });
      if (step === 2) renderCalendar();
      if (step === 5) renderSummary();
      const bkSection = document.getElementById("booking");
      if (bkSection) setTimeout(() => bkSection.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
    (window as any).bkGoTo = bkGoTo;

    document.querySelectorAll<HTMLElement>(".svc-opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".svc-opt").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        bkData.service = btn.dataset.service || "";
        const bk1Next = document.getElementById("bk1Next") as HTMLButtonElement | null;
        if (bk1Next) bk1Next.disabled = false;
      });
    });

    document.getElementById("bk1Next")?.addEventListener("click", () => bkGoTo(2));

    function renderCalendar() {
      const daysEl = document.getElementById("calDays");
      const monthYearEl = document.getElementById("calMonthYear");
      if (!daysEl) return;
      const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      if (monthYearEl) monthYearEl.textContent = monthNames[calMonth] + " " + calYear;
      daysEl.innerHTML = "";
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const firstDay = new Date(calYear, calMonth, 1).getDay();
      const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
      for (let i = 0; i < firstDay; i++) {
        const d = document.createElement("div"); d.classList.add("cal-day", "other-month"); daysEl.appendChild(d);
      }
      for (let day = 1; day <= daysInMonth; day++) {
        const d = document.createElement("div"); d.classList.add("cal-day"); d.textContent = String(day);
        const cellDate = new Date(calYear, calMonth, day);
        if (cellDate < today) {
          d.classList.add("past");
        } else {
          if (cellDate.toDateString() === today.toDateString()) d.classList.add("today");
          const dateStr = `${day} ${monthNames[calMonth]} ${calYear}`;
          if (bkData.date === dateStr) d.classList.add("selected");
          d.addEventListener("click", () => {
            daysEl.querySelectorAll(".cal-day").forEach((x) => x.classList.remove("selected"));
            d.classList.add("selected");
            bkData.date = dateStr;
            const dispEl = document.getElementById("selectedDate");
            if (dispEl) dispEl.textContent = "Selected: " + dateStr;
            const bk2Next = document.getElementById("bk2Next") as HTMLButtonElement | null;
            if (bk2Next) bk2Next.disabled = false;
          });
        }
        daysEl.appendChild(d);
      }
    }

    document.getElementById("calPrev")?.addEventListener("click", () => {
      calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderCalendar();
    });
    document.getElementById("calNext")?.addEventListener("click", () => {
      calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderCalendar();
    });
    document.getElementById("bk2Next")?.addEventListener("click", () => bkGoTo(3));

    document.querySelectorAll<HTMLElement>(".time-opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".time-opt").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        bkData.time = btn.dataset.time || "";
        const bk3Next = document.getElementById("bk3Next") as HTMLButtonElement | null;
        if (bk3Next) bk3Next.disabled = false;
      });
    });
    document.getElementById("bk3Next")?.addEventListener("click", () => bkGoTo(4));

    function showFieldError(input: HTMLInputElement | null, msg: string) {
      if (!input) return;
      input.style.borderColor = "#ff4444";
      input.focus();
      if (!input.parentElement?.querySelector(".field-err")) {
        const err = document.createElement("span");
        err.classList.add("field-err");
        err.style.cssText = "color:#ff4444;font-size:12px;margin-top:4px;display:block;";
        err.textContent = msg;
        input.parentElement?.appendChild(err);
        setTimeout(() => { err.remove(); input.style.borderColor = ""; }, 3000);
      }
    }

    document.getElementById("bk4Next")?.addEventListener("click", () => {
      const name = document.getElementById("bkName") as HTMLInputElement | null;
      const phone = document.getElementById("bkPhone") as HTMLInputElement | null;
      const address = document.getElementById("bkAddress") as HTMLInputElement | null;
      if (!name?.value.trim()) { showFieldError(name, "Name is required"); return; }
      if (!phone?.value.trim()) { showFieldError(phone, "Phone number is required"); return; }
      if (!address?.value.trim()) { showFieldError(address, "Service address is required"); return; }
      bkData.name = name.value.trim();
      bkData.phone = phone.value.trim();
      bkData.email = (document.getElementById("bkEmail") as HTMLInputElement)?.value.trim() || "";
      bkData.address = address.value.trim();
      bkData.landmark = (document.getElementById("bkLandmark") as HTMLInputElement)?.value.trim() || "";
      bkData.notes = (document.getElementById("bkNotes") as HTMLTextAreaElement)?.value.trim() || "";
      bkGoTo(5);
    });

    function renderSummary() {
      const set = (id: string, val: string) => { const el = document.getElementById(id); if (el) el.textContent = val || "—"; };
      set("sumSvc", bkData.service);
      set("sumDate", bkData.date);
      set("sumTime", bkData.time);
      set("sumName", bkData.name);
      set("sumPhone", bkData.phone);
      set("sumAddr", bkData.address + (bkData.landmark ? ", Near " + bkData.landmark : ""));
      const notesRow = document.getElementById("sumNotesRow");
      if (notesRow) { notesRow.style.display = bkData.notes ? "flex" : "none"; set("sumNotes", bkData.notes); }
      const msg = `Hello Tahura Plumbing Contractors,\n\nI would like to book an appointment.\n\nService: ${bkData.service}\nDate: ${bkData.date}\nTime: ${bkData.time}\n\nName: ${bkData.name}\nPhone: ${bkData.phone}\nAddress: ${bkData.address}${bkData.landmark ? "\nLandmark: " + bkData.landmark : ""}\n${bkData.notes ? "Additional Notes: " + bkData.notes : ""}\n\nPlease confirm my appointment.\n\nThank you.`;
      const waBtn = document.getElementById("bkWhatsapp") as HTMLAnchorElement | null;
      if (waBtn) { waBtn.href = "https://wa.me/919867426238?text=" + encodeURIComponent(msg); waBtn.target = "_blank"; waBtn.rel = "noopener"; }
    }

    // ---- CONTACT FORM ----
    function handleCF(e: Event) {
      e.preventDefault();
      const name = (document.getElementById("cfName") as HTMLInputElement)?.value.trim();
      const phone = (document.getElementById("cfPhone") as HTMLInputElement)?.value.trim();
      const svc = (document.getElementById("cfSvc") as HTMLSelectElement)?.value;
      const msg = (document.getElementById("cfMsg") as HTMLTextAreaElement)?.value.trim();
      if (!name || !phone) { alert("Please fill in your name and phone number."); return; }
      const waMsg = `Hello Tahura Plumbing Contractors,\n\nName: ${name}\nPhone: ${phone}\n${svc ? "Service: " + svc : ""}\n${msg ? "Message: " + msg : ""}\n\nPlease get in touch with me.`;
      window.open("https://wa.me/919867426238?text=" + encodeURIComponent(waMsg), "_blank");
    }
    (window as any).handleCF = handleCF;
    document.getElementById("cf")?.addEventListener("submit", handleCF);

    // ---- SMOOTH SCROLL ----
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const target = document.querySelector(link.getAttribute("href") || "");
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: "smooth" });
        }
      });
    });

    // ---- HERO ANIMATE ----
    const heroContent = document.querySelector<HTMLElement>(".hero-content");
    if (heroContent) {
      heroContent.style.opacity = "0";
      heroContent.style.transform = "translateY(30px)";
      setTimeout(() => {
        heroContent.style.transition = "opacity 0.9s ease, transform 0.9s ease";
        heroContent.style.opacity = "1";
        heroContent.style.transform = "translateY(0)";
      }, 150);
    }

    renderCalendar();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  const imgPath = (name: string) => `${basePath}/assets/images/${name}`;

  const images = [
    { src: "Screenshot_20260604-014557_Maps_1780521632418.jpg", alt: "Shower system", label: "Shower System" },
    { src: "Screenshot_20260604-014620_Maps_1780521632386.jpg", alt: "Toilet installation", label: "Toilet Installation" },
    { src: "Screenshot_20260604-014623_Maps_1780521632357.jpg", alt: "Luxury bathroom", label: "Luxury Bathroom" },
    { src: "Screenshot_20260604-014626_Maps_1780521632334.jpg", alt: "Designer basin", label: "Designer Basin" },
    { src: "Screenshot_20260604-014648_Maps_1780521632315.jpg", alt: "Premium sink", label: "Premium Sink" },
    { src: "Screenshot_20260604-014657_Maps_1780521632290.jpg", alt: "Rain shower", label: "Rain Shower" },
    { src: "Screenshot_20260604-014702_Maps_1780521632262.jpg", alt: "Custom shower", label: "Custom Shower" },
    { src: "Screenshot_20260604-014708_Maps_1780521632238.jpg", alt: "Shower enclosure", label: "Shower Enclosure" },
    { src: "Screenshot_20260604-014723_Maps_1780521632199.jpg", alt: "Modern shower", label: "Modern Shower" },
    { src: "Screenshot_20260604-014729_Maps_1780521632163.jpg", alt: "Designer shower", label: "Designer Shower" },
    { src: "Screenshot_20260604-014739_Maps_1780521632131.jpg", alt: "Toilet fitting", label: "Toilet Fitting" },
    { src: "Screenshot_20260604-014744_Maps_1780521632105.jpg", alt: "Full bathroom", label: "Full Bathroom" },
    { src: "Screenshot_20260604-014748_Maps_1780521632079.jpg", alt: "Vessel sink", label: "Vessel Sink" },
    { src: "Screenshot_20260604-014759_Maps_1780521631992.jpg", alt: "Wall-hung WC", label: "Wall-Hung WC" },
    { src: "IMG-20260611-WA0015_1781493897117.jpg", alt: "Shower valve controls", label: "Shower Controls" },
    { src: "IMG-20260611-WA0026_1781493897142.jpg", alt: "Shower panel with handheld", label: "Shower Panel" },
    { src: "IMG-20260611-WA0033_1781493897196.jpg", alt: "Shower system installation", label: "Shower Installation" },
    { src: "IMG-20260612-WA0015_1781493897218.jpg", alt: "Luxury bathroom with basin", label: "Luxury Bathroom" },
    { src: "IMG-20260612-WA0023_1781493897236.jpg", alt: "Grey marble basin", label: "Marble Basin" },
    { src: "IMG-20260611-WA0038_1781493897254.jpg", alt: "Wall-hung toilet installation", label: "Wall-Hung Toilet" },
    { src: "IMG-20260612-WA0021_1781493897287.jpg", alt: "Rain shower system", label: "Rain Shower" },
    { src: "IMG-20260612-WA0028_1781493897316.jpg", alt: "Premium bathroom suite", label: "Premium Bathroom" },
    { src: "IMG-20260612-WA0020_1781493897341.jpg", alt: "Complete bathroom fitout", label: "Bathroom Fitout" },
    { src: "IMG-20260612-WA0027_1781493897367.jpg", alt: "Designer vessel basin", label: "Vessel Basin" },
    { src: "IMG-20260611-WA0065_1781493897405.jpg", alt: "Grohe shower valve", label: "Shower Valve" },
    { src: "IMG-20260611-WA0004_1781493897438.jpg", alt: "Marble rain shower ceiling", label: "Rain Shower Ceiling" },
    { src: "IMG-20260611-WA0003_1781493897461.jpg", alt: "Overhead rain shower", label: "Overhead Shower" },
    { src: "IMG-20260611-WA0005_1781493897487.jpg", alt: "Oval basin with tap", label: "Oval Basin" },
  ];

  const heroImg = images[11].src;
  const aboutImg1 = images[11].src;
  const aboutImg2 = images[4].src;

  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* FABs */}
      <div className="fab-container">
        <a href="tel:+919867426238" className="fab fab-call" aria-label="Call Now">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        </a>
        <a href="https://wa.me/919867426238?text=Hello%20Tahura%20Plumbing%20Contractors%2C%20I%20need%20plumbing%20services." className="fab fab-whatsapp" target="_blank" rel="noopener" aria-label="WhatsApp">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.113.549 4.096 1.508 5.818L.05 24l6.32-1.657A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.821 0-3.532-.484-5.013-1.33l-.36-.214-3.733.979.997-3.642-.235-.375A9.964 9.964 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
        </a>
      </div>

      {/* NAVBAR */}
      <nav className="navbar" id="navbar">
        <div className="container nav-container">
          <a href="#home" className="nav-logo">
            <span className="logo-t">T</span>ahura<span className="logo-sub">Plumbing Contractors</span>
          </a>
          <ul className="nav-links" id="navLinks">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#booking">Book Now</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <a href="tel:+919867426238" className="btn-nav-call">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            +91 9867426238
          </a>
          <button className="hamburger" id="hamburger" aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-bg">
          <img src={imgPath(heroImg)} alt="Premium plumbing work" className="hero-bg-img" />
          <div className="hero-overlay"></div>
          <div className="hero-grid-overlay"></div>
        </div>
        <div className="hero-particles" id="heroParticles"></div>
        <div className="container hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            Available 24/7 &nbsp;·&nbsp; 4.9 ★ Rated
          </div>
          <h1 className="hero-title">
            Professional<br />
            <span className="hero-gold">Plumbing Services</span><br />
            Available 24/7
          </h1>
          <p className="hero-subtitle">Expert Plumbing Solutions For Homes, Offices And Commercial Properties.</p>
          <div className="hero-actions">
            <a href="#booking" className="btn btn-gold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Book Appointment
            </a>
            <a href="https://wa.me/919867426238?text=Hello%20Tahura%20Plumbing%20Contractors%2C%20I%20need%20plumbing%20services." className="btn btn-whatsapp" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.113.549 4.096 1.508 5.818L.05 24l6.32-1.657A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.821 0-3.532-.484-5.013-1.33l-.36-.214-3.733.979.997-3.642-.235-.375A9.964 9.964 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              WhatsApp Now
            </a>
            <a href="tel:+919867426238" className="btn btn-outline-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Call Now
            </a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><span className="hero-stat-num">1200+</span><span className="hero-stat-label">Projects Done</span></div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat"><span className="hero-stat-num">4.9★</span><span className="hero-stat-label">Customer Rating</span></div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat"><span className="hero-stat-num">24/7</span><span className="hero-stat-label">Available</span></div>
          </div>
        </div>
        <a href="#trust" className="hero-scroll-hint">
          <div className="scroll-line"></div>
          <span>Scroll</span>
        </a>
      </section>

      {/* TRUST BAR */}
      <section className="trust-bar" id="trust">
        <div className="container">
          <div className="trust-items">
            <div className="trust-item reveal"><span className="trust-check">✓</span><span>Open 24 Hours</span></div>
            <div className="trust-sep"></div>
            <div className="trust-item reveal"><span className="trust-check">✓</span><span>Professional Plumbing Experts</span></div>
            <div className="trust-sep"></div>
            <div className="trust-item reveal"><span className="trust-check">✓</span><span>Fast Response</span></div>
            <div className="trust-sep"></div>
            <div className="trust-item reveal"><span className="trust-check">✓</span><span>Quality Workmanship</span></div>
            <div className="trust-sep"></div>
            <div className="trust-item reveal"><span className="trust-check">✓</span><span>Customer Satisfaction</span></div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about section-dark" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-images reveal-left">
              <div className="about-img-main">
                <img src={imgPath(aboutImg1)} alt="Luxury bathroom by Tahura Plumbing" loading="lazy" />
              </div>
              <div className="about-img-sec">
                <img src={imgPath(aboutImg2)} alt="Premium basin installation" loading="lazy" />
              </div>
              <div className="about-exp-badge">
                <span className="badge-num">15+</span>
                <span className="badge-text">Years Experience</span>
              </div>
            </div>
            <div className="about-content reveal-right">
              <div className="section-label">About Us</div>
              <h2 className="section-title">Maharashtra's Most Trusted <span className="gold">Plumbing Experts</span></h2>
              <p className="about-lead">Tahura Plumbing Contractors is a premier plumbing service company based in MIDC Industrial Area, Chilkalthana — delivering precision, reliability, and craftsmanship to homes, offices, and commercial properties across Chhatrapati Sambhajinagar.</p>
              <p className="about-body">With over 15 years of expertise, our certified team handles everything from emergency repairs to complete bathroom renovations. We take pride in using only the finest materials and industry-leading techniques.</p>
              <div className="about-features">
                <div className="about-feat">
                  <div className="about-feat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
                  <div><strong>Licensed &amp; Certified</strong><p>All technicians professionally trained and certified.</p></div>
                </div>
                <div className="about-feat">
                  <div className="about-feat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
                  <div><strong>24/7 Emergency Service</strong><p>Round-the-clock availability for urgent needs.</p></div>
                </div>
                <div className="about-feat">
                  <div className="about-feat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                  <div><strong>Transparent Pricing</strong><p>Honest upfront quotes with no hidden charges.</p></div>
                </div>
              </div>
              <a href="#booking" className="btn btn-gold">Schedule a Visit</a>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services section-black" id="services">
        <div className="container">
          <div className="section-header reveal">
            <div className="section-label">What We Do</div>
            <h2 className="section-title">Our Premium <span className="gold">Services</span></h2>
            <p className="section-desc">Comprehensive plumbing solutions delivered with precision and professionalism.</p>
          </div>
          <div className="services-grid">
            {[
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/></svg>, title: "Plumbing Leak Detection", desc: "Advanced technology to locate and fix hidden leaks before they cause damage." },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>, title: "Plumbing Pipe Repair", desc: "Fast and durable pipe repairs using quality materials and expert techniques." },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: "Drain Cleaning", desc: "Professional drain cleaning to restore flow and prevent future blockages." },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, title: "Toilet Installation", desc: "Seamless toilet installation with proper sealing and functionality checks." },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>, title: "Toilet Repair", desc: "Expert repair of running, leaking, or malfunctioning toilets of all models." },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>, title: "Tap Installation", desc: "Premium tap installation for kitchens, bathrooms and outdoor fixtures." },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>, title: "Tap Repair", desc: "Quick fixing of dripping, leaking, or damaged taps of all brands and types." },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16v7a8 8 0 0 1-16 0V4z"/><line x1="12" y1="11" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>, title: "Shower Installation", desc: "Complete shower system installation — overhead, handheld, or rain systems." },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 20h20M5 20V10m14 10V10M5 10a7 7 0 0 1 14 0"/></svg>, title: "Water Heater Installation", desc: "Safe installation and connection of geysers and water heating systems." },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 22v-2.17A6 6 0 0 1 7.83 14H16a6 6 0 0 1 6 6v2"/><circle cx="12" cy="7" r="4"/></svg>, title: "Bathroom Plumbing", desc: "Complete bathroom plumbing — from rough-in to final fixtures." },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg>, title: "Kitchen Plumbing", desc: "Kitchen sink, pipe, and drainage installation and repair services." },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/></svg>, title: "Outdoor Plumbing Repair", desc: "Garden tap, yard drainage, and exterior pipe repair and maintenance." },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, title: "Emergency Plumbing", desc: "Rapid 24/7 emergency response — we're there when you need us most.", isEmg: true, callLink: true },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, title: "Pipeline Installation", desc: "Full-scale pipeline installation for residential and commercial projects." },
            ].map(({ icon, title, desc, isEmg, callLink }) => (
              <div className={`svc-card reveal${isEmg ? " svc-card-emg" : ""}`} key={title}>
                <div className="svc-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
                {callLink ? (
                  <a href="tel:+919867426238" className="svc-link">Call Now →</a>
                ) : (
                  <a href="#booking" className="svc-link">Book Now →</a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="why-us section-dark" id="why">
        <div className="container">
          <div className="section-header reveal">
            <div className="section-label">Why Tahura</div>
            <h2 className="section-title">Why Choose <span className="gold">Us</span></h2>
            <p className="section-desc">We set the standard for premium plumbing in Maharashtra.</p>
          </div>
          <div className="why-grid">
            {[
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, title: "Fast Response", desc: "We arrive within 60 minutes for emergency calls, day or night." },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, title: "Professional Team", desc: "Certified technicians with years of hands-on field experience." },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: "Quality Materials", desc: "We use only brand-certified, durable materials on every project." },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, title: "Transparent Pricing", desc: "Detailed upfront quotes — what you see is exactly what you pay." },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, title: "Emergency Support", desc: "24/7 hotline — real humans answer, every time you call." },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>, title: "Customer Satisfaction", desc: "4.9 star average — we don't leave until you're completely satisfied." },
            ].map(({ icon, title, desc }) => (
              <div className="why-card reveal" key={title}>
                <div className="why-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="stats section-gold-accent" id="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item reveal"><span className="stat-num" data-target="1200" data-suffix="+">0</span><span className="stat-label">Projects Completed</span></div>
            <div className="stat-item reveal"><span className="stat-num" data-target="950" data-suffix="+">0</span><span className="stat-label">Happy Customers</span></div>
            <div className="stat-item reveal"><span className="stat-num" data-target="300" data-suffix="+">0</span><span className="stat-label">Emergency Repairs</span></div>
            <div className="stat-item reveal"><span className="stat-num" data-target="25" data-suffix="+">0</span><span className="stat-label">Service Areas</span></div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="gallery section-black" id="gallery">
        <div className="container">
          <div className="section-header reveal">
            <div className="section-label">Our Work</div>
            <h2 className="section-title">Project <span className="gold">Gallery</span></h2>
            <p className="section-desc">Real projects. Real craftsmanship. Real results.</p>
          </div>
        </div>
        <div className="gallery-wrapper">
          <div className="gallery-track" id="galleryTrack">
            {[...images, ...images.slice(0, 3)].map(({ src, alt, label }, idx) => (
              <div className="gallery-item" data-src={imgPath(src)} key={idx}>
                <img src={imgPath(src)} alt={alt} loading="lazy" />
                <div className="gallery-overlay"><span>{label}</span></div>
              </div>
            ))}
          </div>
        </div>
        <div className="lightbox" id="lightbox">
          <button className="lb-close" id="lbClose">✕</button>
          <button className="lb-prev" id="lbPrev">‹</button>
          <button className="lb-next" id="lbNext">›</button>
          <div className="lb-img-wrap"><img src="data:," alt="" id="lbImg" /></div>
        </div>
      </section>

      {/* BEFORE & AFTER */}
      <section className="before-after section-dark" id="beforeafter">
        <div className="container">
          <div className="section-header reveal">
            <div className="section-label">Transformations</div>
            <h2 className="section-title">Before &amp; <span className="gold">After</span></h2>
            <p className="section-desc">Drag the slider to see the incredible difference our work makes.</p>
          </div>
          <div className="ba-grid">
            <div className="ba-wrap reveal">
              <div className="ba-slider" id="ba1">
                <div className="ba-before"><img src={imgPath(images[10].src)} alt="Before" loading="lazy" /><span className="ba-tag">Before</span></div>
                <div className="ba-after"><img src={imgPath(images[13].src)} alt="After" loading="lazy" /><span className="ba-tag ba-tag-after">After</span></div>
                <div className="ba-handle">
                  <div className="ba-line"></div>
                  <div className="ba-circle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="ba-wrap reveal">
              <div className="ba-slider" id="ba2">
                <div className="ba-before"><img src={imgPath(images[4].src)} alt="Before" loading="lazy" /><span className="ba-tag">Before</span></div>
                <div className="ba-after"><img src={imgPath(images[2].src)} alt="After" loading="lazy" /><span className="ba-tag ba-tag-after">After</span></div>
                <div className="ba-handle">
                  <div className="ba-line"></div>
                  <div className="ba-circle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORK PROCESS */}
      <section className="process section-dark" id="process">
        <div className="container">
          <div className="section-header reveal">
            <div className="section-label">How We Work</div>
            <h2 className="section-title">Our Work <span className="gold">Process</span></h2>
            <p className="section-desc">A simple, transparent process from your first call to project completion.</p>
          </div>
          <div className="process-steps">
            {[
              { num: "01", title: "Contact Us", desc: "Call, WhatsApp, or fill our booking form to describe your plumbing issue.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, connector: true },
              { num: "02", title: "Inspection", desc: "Our expert visits your property to assess the issue with precision diagnostics.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>, connector: true },
              { num: "03", title: "Quotation", desc: "You receive a transparent, itemized quote — no surprises, no hidden costs.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>, connector: true },
              { num: "04", title: "Repair / Install", desc: "Our team executes the work with precision using quality materials.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>, connector: true },
              { num: "05", title: "Quality Check", desc: "Final inspection ensures everything works perfectly before we leave.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, connector: false },
            ].map(({ num, title, desc, icon, connector }) => (
              <div className="proc-step reveal" key={num}>
                <div className="proc-num">{num}</div>
                <div className="proc-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
                {connector && <div className="proc-connector"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING FORM */}
      <section className="booking section-black" id="booking">
        <div className="container">
          <div className="section-header reveal">
            <div className="section-label">Book An Appointment</div>
            <h2 className="section-title">Schedule Your <span className="gold">Service</span></h2>
            <p className="section-desc">Complete the form below and we'll confirm your appointment via WhatsApp.</p>
          </div>
          <div className="booking-wrap reveal">
            <div className="bk-progress">
              {[1,2,3,4,5].map((n, i) => (
                <div key={n} style={{display:"contents"}}>
                  <div className={`bk-step${n===1?" active":""}`} data-step={n}>
                    <div className="bk-circle">{n}</div>
                    <span>{["Service","Date","Time","Details","Confirm"][i]}</span>
                  </div>
                  {n < 5 && <div className="bk-line"></div>}
                </div>
              ))}
            </div>

            <div className="bk-pane active" id="bkStep1">
              <h3 className="bk-step-title">Select Your Service</h3>
              <div className="svc-opts-grid">
                {["Plumbing Leak Detection","Pipe Repair","Drain Cleaning","Toilet Installation","Toilet Repair","Tap Installation","Tap Repair","Shower Installation","Water Heater Installation","Bathroom Plumbing","Kitchen Plumbing","Emergency Plumbing","Pipeline Installation","Other"].map(s => (
                  <button className="svc-opt" data-service={s} key={s}>{s}</button>
                ))}
              </div>
              <div className="bk-nav"><button className="btn btn-gold" id="bk1Next" disabled>Next: Select Date →</button></div>
            </div>

            <div className="bk-pane" id="bkStep2">
              <h3 className="bk-step-title">Select Appointment Date</h3>
              <div className="cal-wrap">
                <div className="cal-header">
                  <button className="cal-btn" id="calPrev">‹</button>
                  <span id="calMonthYear" className="cal-title"></span>
                  <button className="cal-btn" id="calNext">›</button>
                </div>
                <div className="cal-weekdays"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div>
                <div className="cal-days" id="calDays"></div>
              </div>
              <div className="selected-date" id="selectedDate"></div>
              <div className="bk-nav">
                <button className="btn btn-outline" onClick={() => (window as any).bkGoTo(1)}>← Back</button>
                <button className="btn btn-gold" id="bk2Next" disabled>Next: Select Time →</button>
              </div>
            </div>

            <div className="bk-pane" id="bkStep3">
              <h3 className="bk-step-title">Select Time Slot</h3>
              <div className="time-grid">
                {["08:00 AM","09:00 AM","10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM","06:00 PM"].map(t => (
                  <button className="time-opt" data-time={t} key={t}>{t}</button>
                ))}
                <button className="time-opt time-emg" data-time="Emergency Service">⚡ Emergency Service</button>
              </div>
              <div className="bk-nav">
                <button className="btn btn-outline" onClick={() => (window as any).bkGoTo(2)}>← Back</button>
                <button className="btn btn-gold" id="bk3Next" disabled>Next: Your Details →</button>
              </div>
            </div>

            <div className="bk-pane" id="bkStep4">
              <h3 className="bk-step-title">Your Details</h3>
              <div className="form-grid">
                <div className="fg"><label>Full Name *</label><input type="text" id="bkName" placeholder="Enter your full name" /></div>
                <div className="fg"><label>Phone Number *</label><input type="tel" id="bkPhone" placeholder="+91 XXXXXXXXXX" /></div>
                <div className="fg"><label>Email (Optional)</label><input type="email" id="bkEmail" placeholder="your@email.com" /></div>
                <div className="fg fg-full"><label>Service Address *</label><input type="text" id="bkAddress" placeholder="House No, Street, Area, City" /></div>
                <div className="fg"><label>Landmark</label><input type="text" id="bkLandmark" placeholder="Nearby landmark" /></div>
                <div className="fg fg-full"><label>Additional Notes</label><textarea id="bkNotes" rows={3} placeholder="Describe the issue or special instructions..."></textarea></div>
              </div>
              <div className="bk-nav">
                <button className="btn btn-outline" onClick={() => (window as any).bkGoTo(3)}>← Back</button>
                <button className="btn btn-gold" id="bk4Next">Review Booking →</button>
              </div>
            </div>

            <div className="bk-pane" id="bkStep5">
              <h3 className="bk-step-title">Booking Summary</h3>
              <div className="bk-summary">
                <div className="bk-row"><span className="bk-lbl">Service</span><span className="bk-val" id="sumSvc">—</span></div>
                <div className="bk-row"><span className="bk-lbl">Date</span><span className="bk-val" id="sumDate">—</span></div>
                <div className="bk-row"><span className="bk-lbl">Time</span><span className="bk-val" id="sumTime">—</span></div>
                <div className="bk-row"><span className="bk-lbl">Name</span><span className="bk-val" id="sumName">—</span></div>
                <div className="bk-row"><span className="bk-lbl">Phone</span><span className="bk-val" id="sumPhone">—</span></div>
                <div className="bk-row"><span className="bk-lbl">Address</span><span className="bk-val" id="sumAddr">—</span></div>
                <div className="bk-row" id="sumNotesRow"><span className="bk-lbl">Notes</span><span className="bk-val" id="sumNotes">—</span></div>
              </div>
              <div className="bk-confirm-actions">
                <a href="#" className="btn btn-whatsapp btn-lg" id="bkWhatsapp">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.113.549 4.096 1.508 5.818L.05 24l6.32-1.657A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.821 0-3.532-.484-5.013-1.33l-.36-.214-3.733.979.997-3.642-.235-.375A9.964 9.964 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                  Book via WhatsApp
                </a>
                <a href="tel:+919867426238" className="btn btn-gold btn-lg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Call Now
                </a>
              </div>
              <div className="bk-nav"><button className="btn btn-outline" onClick={() => (window as any).bkGoTo(4)}>← Edit Details</button></div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="areas section-dark" id="areas">
        <div className="container">
          <div className="section-header reveal">
            <div className="section-label">Coverage</div>
            <h2 className="section-title">Areas We <span className="gold">Serve</span></h2>
            <p className="section-desc">Serving Chhatrapati Sambhajinagar and surrounding regions.</p>
          </div>
          <div className="areas-grid">
            {["MIDC Chikalthana","Cidco Colony","Garkheda","Waluj","Satara Road","Prozone Area","Jalna Road","Beed Bypass","Osmanpura","Cantonment Area","Padegaon","Mukundwadi","Harsul","Aurangpura","Nirala Bazaar","Gulmandi","Paithan Road","Bajajnagar","Kranti Chowk","N-8, N-9, N-12 Area","Hudco Colony","Vedant Nagar","Gajanan Colony","Shivaji Nagar"].map(a => (
              <div className="area-card reveal" key={a}>📍 {a}</div>
            ))}
            <div className="area-card area-more reveal">+ More Areas On Request</div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq section-black" id="faq">
        <div className="container">
          <div className="section-header reveal">
            <div className="section-label">FAQ</div>
            <h2 className="section-title">Frequently Asked <span className="gold">Questions</span></h2>
          </div>
          <div className="faq-list">
            {[
              { q: "Do you provide emergency plumbing services 24/7?", a: "Yes, absolutely. Tahura Plumbing Contractors is available 24 hours a day, 7 days a week, including public holidays. For emergency calls, we typically arrive within 45–60 minutes in the Chhatrapati Sambhajinagar area." },
              { q: "How do I get a price quote?", a: "Call us or WhatsApp on +91 9867426238 to describe your issue. We'll give you an estimate over the phone and send a certified technician to confirm the exact scope before any work begins. All quotes are transparent and itemized." },
              { q: "What areas do you cover?", a: "We cover Chhatrapati Sambhajinagar (Aurangabad) and all major surrounding localities including MIDC Chikalthana, Cidco, Garkheda, Waluj, Jalna Road, Beed Bypass, and 25+ other areas. Contact us for coverage confirmation in your locality." },
              { q: "Are your plumbers certified and insured?", a: "Yes. All our technicians are professionally trained, certified, and insured. They carry ID cards and arrive in branded uniforms. Your safety and security are our priority on every job." },
              { q: "What payment methods do you accept?", a: "We accept cash, UPI (PhonePe, Google Pay, Paytm), and bank transfer. Payment is collected after the job is complete and you are fully satisfied with the work." },
              { q: "Do you offer any warranty on your work?", a: "Yes. We provide a service warranty on all work completed. If any issue arises due to our workmanship within the warranty period, we will fix it at no additional cost. Warranty periods vary by service type." },
              { q: "How long does a typical repair take?", a: "Simple repairs like tap replacement or drain unblocking typically take 30–90 minutes. More complex jobs such as pipeline installation or full bathroom plumbing may take 1–3 days. We will give you a realistic time estimate before starting." },
            ].map(({ q, a }) => (
              <div className="faq-item reveal" key={q}>
                <button className="faq-q"><span>{q}</span><span className="faq-icon">+</span></button>
                <div className="faq-a"><p>{a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EMERGENCY CTA */}
      <section className="emg-cta">
        <div className="emg-bg"></div>
        <div className="container emg-content reveal">
          <div className="emg-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <h2>Plumbing Emergency? <span className="gold">We're Here Now.</span></h2>
          <p>Don't let a plumbing problem get worse. Our emergency team is available 24/7 — ready to respond within the hour.</p>
          <div className="emg-actions">
            <a href="tel:+919867426238" className="btn btn-gold btn-xl">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Call Now — +91 9867426238
            </a>
            <a href="https://wa.me/919867426238?text=EMERGENCY:%20I%20need%20urgent%20plumbing%20assistance." className="btn btn-whatsapp btn-xl" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.113.549 4.096 1.508 5.818L.05 24l6.32-1.657A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.821 0-3.532-.484-5.013-1.33l-.36-.214-3.733.979.997-3.642-.235-.375A9.964 9.964 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              WhatsApp Emergency
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact section-dark" id="contact">
        <div className="container">
          <div className="section-header reveal">
            <div className="section-label">Get In Touch</div>
            <h2 className="section-title">Contact <span className="gold">Us</span></h2>
          </div>
          <div className="contact-grid">
            <div className="contact-info reveal-left">
              <div className="ct-card">
                <div className="ct-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
                <div><h4>Phone</h4><a href="tel:+919867426238">+91 9867426238</a></div>
              </div>
              <div className="ct-card">
                <div className="ct-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
                <div><h4>Location</h4><p>MIDC Industrial Area, Chilkalthana,<br />Chhatrapati Sambhajinagar, Maharashtra</p></div>
              </div>
              <div className="ct-card">
                <div className="ct-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                <div><h4>Working Hours</h4><p>Open 24 Hours, 7 Days a Week<br /><span className="gold">Including Emergencies &amp; Holidays</span></p></div>
              </div>
              <div className="ct-card">
                <div className="ct-icon" style={{color:"#25D366"}}><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.113.549 4.096 1.508 5.818L.05 24l6.32-1.657A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.821 0-3.532-.484-5.013-1.33l-.36-.214-3.733.979.997-3.642-.235-.375A9.964 9.964 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg></div>
                <div><h4>WhatsApp</h4><a href="https://wa.me/919867426238" target="_blank" rel="noopener">+91 9867426238</a></div>
              </div>
              <div className="map-wrap">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3752.5!2d75.3433!3d19.8762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdb98f0e2c6de51%3A0x4ae5e6a57c574e52!2sMIDC%20Chikalthana%2C%20Chhatrapati%20Sambhajinagar%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000" width="100%" height="240" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Tahura Plumbing Location"></iframe>
              </div>
            </div>
            <div className="contact-form-wrap reveal-right">
              <form className="cf" id="cf">
                <h3>Send Us A Message</h3>
                <div className="fg"><label>Your Name *</label><input type="text" id="cfName" placeholder="Full Name" required /></div>
                <div className="fg"><label>Phone Number *</label><input type="tel" id="cfPhone" placeholder="+91 XXXXXXXXXX" required /></div>
                <div className="fg"><label>Service Required</label>
                  <select id="cfSvc">
                    <option value="">Select a service...</option>
                    {["Plumbing Leak Detection","Pipe Repair","Drain Cleaning","Toilet Installation","Toilet Repair","Tap Installation","Tap Repair","Shower Installation","Water Heater Installation","Bathroom Plumbing","Kitchen Plumbing","Emergency Plumbing","Pipeline Installation","Other"].map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="fg"><label>Message</label><textarea id="cfMsg" rows={4} placeholder="Describe your issue or requirements..."></textarea></div>
                <button type="submit" className="btn btn-gold btn-block">Send via WhatsApp</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-col footer-brand">
                <div className="footer-logo"><span className="logo-t">T</span>ahura<div className="footer-logo-sub">Plumbing Contractors</div></div>
                <p>Maharashtra's most trusted plumbing service — professional, reliable, and available 24 hours a day for your peace of mind.</p>
                <div className="footer-rating"><span className="gold-stars">★★★★★</span><span>4.9 / 5 — Rated by 850+ customers</span></div>
              </div>
              <div className="footer-col">
                <h4 className="footer-h">Quick Links</h4>
                <ul className="footer-links">
                  {[["#home","Home"],["#about","About Us"],["#services","Services"],["#gallery","Gallery"],["#booking","Book Appointment"],["#contact","Contact"]].map(([href, label]) => (
                    <li key={href}><a href={href}>{label}</a></li>
                  ))}
                </ul>
              </div>
              <div className="footer-col">
                <h4 className="footer-h">Services</h4>
                <ul className="footer-links">
                  {["Leak Detection","Pipe Repair","Drain Cleaning","Toilet Installation","Shower Installation","Water Heater","Emergency Plumbing","Pipeline Installation"].map(s => (
                    <li key={s}><a href="#booking">{s}</a></li>
                  ))}
                </ul>
              </div>
              <div className="footer-col">
                <h4 className="footer-h">Contact Details</h4>
                <div className="footer-contact">
                  <div className="fct-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="15" height="15"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg><a href="tel:+919867426238">+91 9867426238</a></div>
                  <div className="fct-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="15" height="15"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><span>MIDC Industrial Area, Chilkalthana, Chhatrapati Sambhajinagar</span></div>
                  <div className="fct-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="15" height="15"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>Open 24 Hours, 7 Days</span></div>
                </div>
                <div className="footer-btns">
                  <a href="tel:+919867426238" className="btn btn-gold btn-sm">Call Now</a>
                  <a href="https://wa.me/919867426238" className="btn btn-whatsapp btn-sm" target="_blank" rel="noopener">WhatsApp</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <p>© 2025 Tahura Plumbing Contractors. All Rights Reserved.</p>
            <p>MIDC Industrial Area, Chilkalthana, Chhatrapati Sambhajinagar, Maharashtra | <a href="tel:+919867426238">+91 9867426238</a></p>
          </div>
        </div>
      </footer>
    </>
  );
}
