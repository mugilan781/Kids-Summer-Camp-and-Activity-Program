"use strict";
const CampQuest = {
  init() {
    this.transitions();
    this.theme();
    this.rtl();
    this.header();
    this.drawer();
    this.dropdowns();
    this.reveal();
    this.sliders();
    this.counters();
    this.faq();
    this.lightbox();
    this.forms();
    this.backToTop();
    this.year();
    this.activeNav();
    this.countdown();
    this.favButtons();
  },
  countdown() {
    document.querySelectorAll("[data-countdown]").forEach((root) => {
      const target = new Date(root.dataset.countdown).getTime();
      if (isNaN(target)) return;
      const els = {
        d: root.querySelector("[data-cd-days]"),
        h: root.querySelector("[data-cd-hours]"),
        m: root.querySelector("[data-cd-mins]"),
        s: root.querySelector("[data-cd-secs]")
      };
      const pad = (n) => String(n).padStart(2, "0");
      const tick = () => {
        let diff = Math.max(0, target - Date.now());
        const d = Math.floor(diff / 864e5); diff -= d * 864e5;
        const h = Math.floor(diff / 36e5); diff -= h * 36e5;
        const m = Math.floor(diff / 6e4); diff -= m * 6e4;
        const s = Math.floor(diff / 1e3);
        if (els.d) els.d.textContent = pad(d);
        if (els.h) els.h.textContent = pad(h);
        if (els.m) els.m.textContent = pad(m);
        if (els.s) els.s.textContent = pad(s);
      };
      tick();
      setInterval(tick, 1000);
    });
  },
  favButtons() {
    document.querySelectorAll(".camp-fav").forEach((btn) =>
      btn.addEventListener("click", () => {
        const active = btn.classList.toggle("active");
        CampQuest.toast(active ? "success" : "info",
          active ? "Saved to favorites" : "Removed from favorites",
          active ? "We saved this camp to your shortlist." : "This camp was removed from your shortlist.");
      }));
  },
  transitions() {
    if (!document.querySelector(".page-transition")) return;
    const overlay = document.querySelector(".page-transition");
    requestAnimationFrame(() => overlay.classList.remove("active"));
    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href]');
      if (!link || link.target === "_blank" || e.metaKey || e.ctrlKey) return;
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || /\.(pdf|jpg|png|webp)$/i.test(href)) return;
      if (link.origin !== location.origin) return;
      e.preventDefault();
      overlay.classList.add("active");
      setTimeout(() => location.href = href, 380);
    });
  },
  theme() {
    const btns = document.querySelectorAll("[data-theme-toggle]");
    const apply = (mode) => {
      document.documentElement.setAttribute("data-theme", mode);
      try { localStorage.setItem("cq-theme", mode); } catch (_) {}
    };
    let saved = null;
    try { saved = localStorage.getItem("cq-theme"); } catch (_) {}
    if (!saved) saved = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    apply(saved);
    btns.forEach((b) => b.addEventListener("click", () => {
      apply(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
    }));
  },
  rtl() {
    const btns = document.querySelectorAll("[data-rtl-toggle]");
    const apply = (dir) => {
      document.documentElement.setAttribute("dir", dir);
      document.documentElement.setAttribute("lang", dir === "rtl" ? "ar" : "en");
      document.querySelectorAll("[data-rtl-label]").forEach((el) => el.textContent = dir === "rtl" ? "LTR" : "RTL");
      try { localStorage.setItem("cq-dir", dir); } catch (_) {}
    };
    let saved = null;
    try { saved = localStorage.getItem("cq-dir"); } catch (_) {}
    if (saved) apply(saved);
    btns.forEach((b) => b.addEventListener("click", () => {
      apply(document.documentElement.getAttribute("dir") === "rtl" ? "ltr" : "rtl");
    }));
  },
  header() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("scrolled", scrollY > 12);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
  },
  drawer() {
    const drawer = document.querySelector(".mobile-drawer");
    const overlay = document.querySelector(".drawer-overlay");
    if (!drawer || !overlay) return;
    const open = () => { drawer.classList.add("open"); overlay.classList.add("show"); document.body.style.overflow = "hidden"; };
    const close = () => { drawer.classList.remove("open"); overlay.classList.remove("show"); document.body.style.overflow = ""; };
    document.querySelectorAll("[data-drawer-open]").forEach((b) => b.addEventListener("click", open));
    document.querySelectorAll("[data-drawer-close]").forEach((b) => b.addEventListener("click", close));
    overlay.addEventListener("click", close);
    addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  },
  dropdowns() {
    document.querySelectorAll(".nav-drop, .profile-menu").forEach((drop) => {
      const btn = drop.querySelector("button");
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll(".nav-drop.open").forEach((d) => d !== drop && d.classList.remove("open"));
        drop.classList.toggle("open");
        btn.setAttribute("aria-expanded", drop.classList.contains("open"));
      });
    });
    document.addEventListener("click", () => document.querySelectorAll(".nav-drop.open").forEach((d) => d.classList.remove("open")));
  },
  reveal() {
    const els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("revealed");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => {
      const parent = el.closest("[data-reveal-stagger]");
      if (parent) {
        const kids = [...parent.querySelectorAll(":scope > [data-reveal]")];
        el.style.setProperty("--reveal-delay", `${kids.indexOf(el) * 110}ms`);
      }
      io.observe(el);
    });
  },
  sliders() {
    document.querySelectorAll("[data-slider]").forEach((root) => {
      const slides = [...root.querySelectorAll("[data-slide]")];
      if (slides.length < 2) return;
      const dotsWrap = root.querySelector("[data-dots]");
      const prev = root.querySelector("[data-prev]");
      const next = root.querySelector("[data-next]");
      let index = 0, timer = null;
      const interval = parseInt(root.dataset.sliderInterval || "6000", 10);
      const go = (i) => {
        index = (i + slides.length) % slides.length;
        slides.forEach((s, n) => s.classList.toggle("active", n === index));
        if (dotsWrap) [...dotsWrap.children].forEach((d, n) => d.classList.toggle("active", n === index));
      };
      const play = () => { stop(); timer = setInterval(() => go(index + 1), interval); };
      const stop = () => timer && clearInterval(timer);
      if (dotsWrap) {
        slides.forEach((_, n) => {
          const d = document.createElement("button");
          d.type = "button";
          d.setAttribute("aria-label", `Go to slide ${n + 1}`);
          d.addEventListener("click", () => { go(n); play(); });
          dotsWrap.appendChild(d);
        });
      }
      prev && prev.addEventListener("click", () => { go(index - 1); play(); });
      next && next.addEventListener("click", () => { go(index + 1); play(); });
      root.addEventListener("mouseenter", stop);
      root.addEventListener("mouseleave", play);
      let startX = null;
      root.addEventListener("touchstart", (e) => startX = e.touches[0].clientX, { passive: true });
      root.addEventListener("touchend", (e) => {
        if (startX === null) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 48) go(index + (dx < 0 ? 1 : -1));
        startX = null; play();
      }, { passive: true });
      go(0); play();
    });
  },
  counters() {
    const nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const dur = 1800;
        const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min((t - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach((n) => io.observe(n));
  },
  faq() {
    document.querySelectorAll(".faq-item").forEach((item) => {
      const q = item.querySelector(".faq-q");
      const a = item.querySelector(".faq-a");
      q.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        item.closest(".faq-list")?.querySelectorAll(".faq-item.open").forEach((o) => {
          o.classList.remove("open");
          o.querySelector(".faq-a").style.maxHeight = null;
          o.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("open");
          a.style.maxHeight = a.scrollHeight + "px";
          q.setAttribute("aria-expanded", "true");
        }
      });
      if (item.classList.contains("open")) {
        a.style.maxHeight = a.scrollHeight + "px";
        q.setAttribute("aria-expanded", "true");
      }
    });
  },
  lightbox() {
    const items = [...document.querySelectorAll("[data-lightbox] img, img[data-lightbox], .gallery-item img")];
    if (!items.length) return;
    const box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", "Image viewer");
    box.innerHTML = `
      <button class="icon-btn lightbox-close" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
      <button class="icon-btn lightbox-nav lightbox-prev" aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
      <img src="" alt="">
      <button class="icon-btn lightbox-nav lightbox-next" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>`;
    document.body.appendChild(box);
    const img = box.querySelector("img");
    let idx = 0;
    const show = (i) => {
      idx = (i + items.length) % items.length;
      img.src = items[idx].currentSrc || items[idx].src;
      img.alt = items[idx].alt || "";
      box.classList.add("open");
      document.body.style.overflow = "hidden";
    };
    const hide = () => { box.classList.remove("open"); document.body.style.overflow = ""; };
    items.forEach((el, i) => el.closest("[data-lightbox], .gallery-item")?.addEventListener("click", (e) => { e.preventDefault(); show(i); }));
    box.querySelector(".lightbox-close").addEventListener("click", hide);
    box.querySelector(".lightbox-prev").addEventListener("click", () => show(idx - 1));
    box.querySelector(".lightbox-next").addEventListener("click", () => show(idx + 1));
    box.addEventListener("click", (e) => { if (e.target === box) hide(); });
    addEventListener("keydown", (e) => {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") hide();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  },
  forms() {
    const validateField = (field) => {
      const wrap = field.closest(".form-field");
      if (!wrap) return true;
      const err = wrap.querySelector(".field-error");
      let msg = "";
      const v = field.value.trim();
      if (field.required && !v) msg = field.dataset.requiredMsg || "This field is required.";
      else if (field.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = "Please enter a valid email address.";
      else if (field.type === "tel" && v && !/^[+\d][\d\s\-()]{6,}$/.test(v)) msg = "Please enter a valid phone number.";
      else if (field.minLength > 0 && v.length < field.minLength) msg = `Must be at least ${field.minLength} characters.`;
      else if (field.type === "checkbox" && field.required && !field.checked) msg = field.dataset.requiredMsg || "Please check this box.";
      if (err) {
        err.querySelector("span") && (err.querySelector("span").textContent = msg);
        err.classList.toggle("show", !!msg);
      }
      field.classList.toggle("invalid", !!msg);
      return !msg;
    };
    document.querySelectorAll("form[data-validate]").forEach((form) => {
      form.setAttribute("novalidate", "");
      form.querySelectorAll("input,select,textarea").forEach((f) => {
        f.addEventListener("blur", () => validateField(f));
        f.addEventListener("input", () => { if (f.classList.contains("invalid")) validateField(f); });
      });
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const fields = [...form.querySelectorAll("input,select,textarea")];
        const ok = fields.map(validateField).every(Boolean);
        if (!ok) {
          form.querySelector(".invalid")?.focus();
          this.toast("error", "Check the form", "Please fix the highlighted fields.");
          return;
        }
        const btn = form.querySelector('[type="submit"]');
        const original = btn ? btn.innerHTML : "";
        if (btn) { btn.disabled = true; btn.innerHTML = '<svg class="spin-slow" style="animation-duration:1s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Sending…'; }
        setTimeout(() => {
          if (btn) { btn.disabled = false; btn.innerHTML = original; }
          form.reset();
          const evt = new CustomEvent("form:success", { detail: { form } });
          form.dispatchEvent(evt);
          this.toast("success", form.dataset.successTitle || "Success!", form.dataset.successMsg || "Your submission has been received.");
        }, 1200);
      });
    });
    document.querySelectorAll("[data-password-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const input = btn.closest(".input-wrap").querySelector("input");
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
        btn.innerHTML = show
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>';
      });
    });
    const meter = document.querySelector("[data-strength]");
    if (meter) {
      const input = document.querySelector(meter.dataset.strength);
      const label = meter.parentElement.querySelector(".strength-text");
      input.addEventListener("input", () => {
        const v = input.value;
        let score = 0;
        if (v.length >= 8) score++;
        if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
        if (/\d/.test(v)) score++;
        if (/[^A-Za-z0-9]/.test(v)) score++;
        meter.className = "strength-meter " + (score <= 1 ? "weak" : score <= 3 ? "medium" : "strong");
        label.textContent = v ? (score <= 1 ? "Weak password" : score <= 3 ? "Getting stronger…" : "Strong password") : "Use 8+ characters with letters, numbers & symbols";
      });
    }
  },
  toast(type, title, msg) {
    let stack = document.querySelector(".toast-stack");
    if (!stack) { stack = document.createElement("div"); stack.className = "toast-stack"; document.body.appendChild(stack); }
    const icons = {
      success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
      error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>'
    };
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.setAttribute("role", "status");
    el.innerHTML = `<div class="toast-icon">${icons[type] || icons.info}</div><div><strong>${title}</strong><span>${msg}</span></div>`;
    stack.appendChild(el);
    setTimeout(() => { el.classList.add("hide"); setTimeout(() => el.remove(), 400); }, 4200);
  },
  backToTop() {
    const btn = document.querySelector(".back-to-top");
    if (!btn) return;
    addEventListener("scroll", () => btn.classList.toggle("show", scrollY > 600), { passive: true });
    btn.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
  },
  year() {
    document.querySelectorAll("[data-year]").forEach((el) => el.textContent = new Date().getFullYear());
  },
  activeNav() {
    const page = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll('.main-nav a, .mobile-drawer a.drawer-link').forEach((a) => {
      const href = a.getAttribute("href");
      if (href === page || (page === "" && href === "index.html")) a.classList.add("active");
    });
  }
};
document.addEventListener("DOMContentLoaded", () => CampQuest.init());
