"use strict";
const ParentDash = {
  scheduleData: {
    Mon: [
      { t: "08:30", n: "Morning Circle", c: "var(--brand)" },
      { t: "10:00", n: "Soccer Skills", c: "var(--accent)" },
      { t: "13:00", n: "Robotics Lab", c: "var(--sky)" },
      { t: "15:30", n: "Lake Swim", c: "var(--berry)" }
    ],
    Tue: [
      { t: "08:30", n: "Yoga & Stretch", c: "var(--brand)" },
      { t: "10:00", n: "Canvas Painting", c: "var(--accent)" },
      { t: "13:00", n: "Trail Hike", c: "var(--sky)" },
      { t: "15:30", n: "Drama Games", c: "var(--berry)" }
    ],
    Wed: [
      { t: "08:30", n: "Team Sports", c: "var(--brand)" },
      { t: "10:00", n: "Scratch Coding", c: "var(--sky)" },
      { t: "13:00", n: "Nature Craft", c: "var(--accent)" },
      { t: "15:30", n: "Archery Basics", c: "var(--berry)" }
    ],
    Thu: [
      { t: "08:30", n: "Camp Olympics", c: "var(--brand)" },
      { t: "10:00", n: "Pottery Studio", c: "var(--accent)" },
      { t: "13:00", n: "Canoe Trip", c: "var(--sky)" },
      { t: "15:30", n: "Music Jam", c: "var(--berry)" }
    ],
    Fri: [
      { t: "08:30", n: "Adventure Race", c: "var(--brand)" },
      { t: "10:00", n: "Showcase Prep", c: "var(--accent)" },
      { t: "13:00", n: "Family Campfire", c: "var(--sun)" },
      { t: "15:30", n: "Awards Ceremony", c: "var(--brand)" }
    ]
  },
  invoicesData: [
    { id: "INV-2041", item: "Sports Camp · Week 3", due: "Jun 02, 2026", amount: "$289.00", status: "paid" },
    { id: "INV-2054", item: "Coding Camp · Session B", due: "Jun 16, 2026", amount: "$340.00", status: "paid" },
    { id: "INV-2067", item: "Arts & Crafts · Week 5", due: "Jul 07, 2026", amount: "$265.00", status: "pending" },
    { id: "INV-2072", item: "Late Pickup Fee · Jun 24", due: "Jul 01, 2026", amount: "$15.00", status: "pending" },
    { id: "INV-2033", item: "Adventure Trek Gear Kit", due: "May 20, 2026", amount: "$58.00", status: "overdue" }
  ],
  // ——— All 8 camps mentioned on website (4 signature + 4 specialty) ———
  camps: [
    { id: "sports", name: "Sports Academy", price: 289, age: "6–14", badge: "Athletics", desc: "Track, soccer, basketball & archery with video feedback Fridays.", img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80" },
    { id: "clay", name: "Clay & Canvas Studio", price: 265, age: "5–12", badge: "Fine Arts", desc: "Pottery wheel, acrylics & family gallery each session.", img: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80" },
    { id: "code", name: "Code & Robotics Lab", price: 340, age: "8–14", badge: "STEM.org", desc: "Scratch to Python, LEGO robotics & hack-day demo.", img: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=900&q=80" },
    { id: "wildlife", name: "Wildlife Rangers", price: 299, age: "7–14", badge: "Field Study", desc: "Track deer & kingfishers, shelter build & wilderness badges.", img: "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=900&q=80" },
    { id: "aqua", name: "Aqua Academy", price: 45, age: "Add-On", badge: "Red Cross", desc: "Daily Red-Cross swim levels + canoe & snorkel clinics.", img: "https://images.unsplash.com/photo-1560090995-01632a28895b?auto=format&fit=crop&w=900&q=80" },
    { id: "stage", name: "Stagecraft Squad", price: 39, age: "Add-On", badge: "Drama", desc: "Improv, set painting & Friday showcase under lights.", img: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=900&q=80" },
    { id: "discovery", name: "Discovery Lab", price: 42, age: "Add-On", badge: "Chemistry", desc: "Volcanoes, polymers & microscope safaris.", img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80" },
    { id: "leadership", name: "Leadership Ladder", price: 0, age: "11–14", badge: "CIT Track", desc: "Tween crew, mentoring & junior-counselor path.", img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80" }
  ],
  weeks: [
    { value: "2026-06-15", label: "Jun 15 — Session A · Weeks 1–2 (All camps) — Open" },
    { value: "2026-07-06", label: "Jul 06 — Session B · Weeks 3–4 (Robot Wars + Aqua) — Filling" },
    { value: "2026-07-20", label: "Jul 20 — Week 5 Overnight · Nature Summit Trek — Filling" },
    { value: "2026-08-03", label: "Aug 03 — Session C · Weeks 6–7 (Clay & Canvas, Stagecraft) — Open" },
    { value: "2026-08-17", label: "Aug 17 — Week 8 Grand Finale · Championship Friday — Hot" }
  ],
  enrollState: { camper: null, camperName: "", camperAge: "", campId: null, weekValue: "", weekLabel: "", price: 0 },
  currentEnrollStep: 1,
  init() {
    this.nav();
    this.schedule();
    this.calendar();
    this.invoices();
    this.chart();
    this.settings();
    this.enrollWizard();
    this.deepLinkEnroll();
  },
  nav() {
    const btns = document.querySelectorAll(".dash-nav [data-view]");
    const views = document.querySelectorAll(".view");
    const title = document.querySelector("[data-view-title]");
    btns.forEach((btn) => btn.addEventListener("click", () => {
      btns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      views.forEach((v) => v.classList.toggle("active", v.id === btn.dataset.view));
      if (title && btn.dataset.title) title.textContent = btn.dataset.title;
      this.closeSidebar();
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (btn.dataset.view === "schedule") this.animateBars();
      // update hash for deep linking without reload
      if (btn.dataset.view === "enrollment") {
        history.replaceState(null, "", "#enrollment");
      }
    }));
    document.querySelector(".dash-burger")?.addEventListener("click", () => {
      document.querySelector(".dash-sidebar").classList.add("open");
      document.querySelector(".drawer-overlay")?.classList.add("show");
    });
    document.querySelector(".drawer-overlay")?.addEventListener("click", () => this.closeSidebar());
  },
  closeSidebar() {
    document.querySelector(".dash-sidebar")?.classList.remove("open");
    document.querySelector(".drawer-overlay")?.classList.remove("show");
    document.body.style.overflow = "";
  },
  schedule() {
    const grid = document.getElementById("scheduleGrid");
    if (!grid) return;
    grid.innerHTML = Object.entries(this.scheduleData).map(([day, events]) => `
      <div class="schedule-day">
        <h3>${day}</h3>
        ${events.map((e) => `<div class="sched-event" style="--ev:${e.c}"><strong>${e.n}</strong><time>${e.t}</time></div>`).join("")}
      </div>`).join("");
  },
  calendar() {
    const cal = document.getElementById("miniCal");
    if (!cal) return;
    const heads = ["S", "M", "T", "W", "T", "F", "S"];
    let html = heads.map((h) => `<span class="cal-head">${h}</span>`).join("");
    for (let i = 0; i < 35; i++) {
      const d = i - 4;
      if (d < 1 || d > 30) html += '<span class="cal-day other">' + (d < 1 ? 29 + i : d - 30) + "</span>";
      else {
        const cls = d === 21 ? "today" : [8, 15, 22, 27].includes(d) ? "event" : "";
        html += `<span class="cal-day ${cls}" ${cls === "event" ? 'title="Camp day"' : ""}>${d}</span>`;
      }
    }
    cal.innerHTML = html;
  },
  invoices() {
    const body = document.getElementById("invoiceBody");
    if (!body) return;
    body.innerHTML = this.invoicesData.map((inv) => `
      <tr class="invoice-row">
        <td>${inv.id}</td>
        <td>${inv.item}</td>
        <td>${inv.due}</td>
        <td><strong>${inv.amount}</strong></td>
        <td><span class="status-pill status-${inv.status}">${inv.status[0].toUpperCase() + inv.status.slice(1)}</span></td>
        <td><button class="btn btn-ghost btn-sm" data-invoice="${inv.id}">${inv.status === "paid" ? "Receipt" : "Pay Now"}</button></td>
      </tr>`).join("");
    body.querySelectorAll("[data-invoice]").forEach((b) =>
      b.addEventListener("click", () => {
        const inv = this.invoicesData.find((i) => i.id === b.dataset.invoice);
        if (inv && inv.status !== "paid") {
          inv.status = "paid";
          this.invoices();
          CampQuest.toast("success", "Payment complete", `${inv.id} for ${inv.amount} has been paid.`);
        } else {
          CampQuest.toast("info", "Receipt ready", `Receipt for ${b.dataset.invoice} sent to your email.`);
        }
      }));
  },
  chart() {
    const bars = document.querySelectorAll(".bar-fill[data-h]");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.style.height = en.target.dataset.h + "%";
        io.unobserve(en.target);
      });
    }, { threshold: 0.4 });
    bars.forEach((b) => io.observe(b));
  },
  animateBars() {
    document.querySelectorAll(".bar-fill[data-h]").forEach((b) => {
      b.style.height = "0";
      requestAnimationFrame(() => setTimeout(() => b.style.height = b.dataset.h + "%", 60));
    });
  },
  settings() {
    document.querySelectorAll(".toggle-switch input").forEach((t) => {
      t.addEventListener("change", () => {
        const name = t.closest(".setting-row")?.querySelector("strong")?.textContent || "Setting";
        CampQuest.toast(t.checked ? "success" : "info", name, t.checked ? "Enabled successfully." : "Disabled.");
      });
    });
    const profileForm = document.getElementById("profileSettingsForm");
    profileForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      CampQuest.toast("success", "Profile updated", "Your family contact details were saved.");
    });
  },
  // ────────── ENROLL WIZARD ──────────
  enrollWizard() {
    const wizard = document.getElementById("enrollWizard");
    if (!wizard) return;
    this.renderCampPicker();
    this.bindEnrollEvents();
    this.updateEnrollStep(1);
    // restore from storage if any
    this.loadStoredEnrollments();
  },
  renderCampPicker() {
    const container = document.getElementById("campPicker");
    if (!container) return;
    container.innerHTML = this.camps.map((c) => `
      <label class="camp-option" data-camp="${c.id}" role="radio" aria-checked="false" tabindex="0">
        <input type="radio" name="enrollCampPick" value="${c.id}" class="sr-only">
        <img class="camp-option-thumb" src="${c.img}" alt="" loading="lazy">
        <div class="camp-option-info">
          <h4>${c.name}</h4>
          <p>${c.desc}</p>
          <div class="camp-option-price">${c.price === 0 ? "Certificate" : "$" + c.price + (c.price > 100 ? " / week" : " add-on")}</div>
        </div>
        <span class="camp-option-badge">${c.age}</span>
        <span class="camp-option-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>
      </label>
    `).join("");
    // bind camp selection
    container.querySelectorAll(".camp-option").forEach((opt) => {
      const select = () => {
        container.querySelectorAll(".camp-option").forEach((o) => { o.classList.remove("selected"); o.setAttribute("aria-checked","false"); o.querySelector("input").checked=false; });
        opt.classList.add("selected");
        opt.setAttribute("aria-checked","true");
        opt.querySelector("input").checked = true;
        this.enrollState.campId = opt.dataset.camp;
        const camp = this.camps.find((x) => x.id === this.enrollState.campId);
        this.enrollState.price = camp ? camp.price : 0;
        this.updatePricePreview();
        this.clearError("step2CampError");
      };
      opt.addEventListener("click", select);
      opt.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(); } });
    });
  },
  bindEnrollEvents() {
    // Camper picker
    document.querySelectorAll(".camper-option").forEach((opt) => {
      opt.addEventListener("click", () => {
        document.querySelectorAll(".camper-option").forEach((o) => o.classList.remove("selected"));
        opt.classList.add("selected");
        const val = opt.dataset.camper;
        const radio = opt.querySelector("input");
        if (radio) radio.checked = true;
        this.enrollState.camper = val;
        const newFields = document.getElementById("newCamperFields");
        if (val === "new") {
          newFields.style.display = "grid";
        } else {
          newFields.style.display = "none";
          if (val === "maya") { this.enrollState.camperName = "Maya Whitmore"; this.enrollState.camperAge = "9 yrs"; }
          if (val === "leo") { this.enrollState.camperName = "Leo Whitmore"; this.enrollState.camperAge = "11 yrs"; }
        }
        this.clearError("step1Error");
      });
    });
    // Week change
    document.getElementById("enrollWeek")?.addEventListener("change", (e) => {
      this.enrollState.weekValue = e.target.value;
      const sel = e.target.options[e.target.selectedIndex];
      this.enrollState.weekLabel = sel ? sel.text : "";
      this.updatePricePreview();
      this.clearError("step2WeekError");
    });
    // Card number formatting
    document.getElementById("payCard")?.addEventListener("input", (e) => {
      let v = e.target.value.replace(/\D/g, "").slice(0,16);
      e.target.value = v.replace(/(.{4})/g,"$1 ").trim();
    });
    document.getElementById("payExp")?.addEventListener("input", (e) => {
      let v = e.target.value.replace(/\D/g, "").slice(0,4);
      if (v.length >= 3) v = v.slice(0,2) + " / " + v.slice(2);
      e.target.value = v;
    });
    document.getElementById("payCvv")?.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0,4);
    });
    // Stepper click (allow going back)
    document.querySelectorAll("[data-stepper]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = parseInt(btn.dataset.stepper,10);
        if (target < this.currentEnrollStep) this.updateEnrollStep(target);
      });
    });
    // Next / Prev buttons
    document.querySelectorAll("[data-enroll-next]").forEach((b) => {
      b.addEventListener("click", () => {
        const step = parseInt(b.dataset.enrollNext,10);
        if (!this.validateEnrollStep(step)) return;
        if (step === 3) this.buildEnrollSummary();
        if (step === 2) this.buildEnrollSummary(); // also prepare summary early
        this.updateEnrollStep(step + 1);
        if (step + 1 === 4) this.buildPaymentSummary();
      });
    });
    document.querySelectorAll("[data-enroll-prev]").forEach((b) => {
      b.addEventListener("click", () => {
        const step = parseInt(b.dataset.enrollPrev,10);
        this.updateEnrollStep(step - 1);
      });
    });
    // Payment submit
    document.getElementById("enrollPaymentForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!this.validateEnrollStep(4)) return;
      this.completeEnrollment();
    });
    // Success actions
    document.querySelector("[data-enroll-view-camps]")?.addEventListener("click", () => {
      document.querySelector('.dash-nav [data-view="camps"]')?.click();
    });
    document.querySelector("[data-enroll-again]")?.addEventListener("click", () => {
      this.resetEnrollWizard();
    });
    // Health & contact live update
    document.getElementById("enrollHealth")?.addEventListener("input", (e) => this.enrollState.health = e.target.value);
    document.getElementById("enrollContact")?.addEventListener("input", (e) => this.enrollState.contact = e.target.value);
  },
  updateEnrollStep(step) {
    if (step === "success") {
      document.querySelectorAll(".enroll-step").forEach((s) => s.classList.remove("active"));
      const succ = document.querySelector('[data-enroll-step="success"]');
      if (succ) succ.classList.add("active");
      this.currentEnrollStep = 5;
      this.updateStepper(5);
      document.getElementById("enrollProgressFill").style.width = "100%";
      return;
    }
    this.currentEnrollStep = step;
    document.querySelectorAll(".enroll-step").forEach((s) => {
      s.classList.toggle("active", parseInt(s.dataset.enrollStep,10) === step);
    });
    this.updateStepper(step);
    const pct = step === 1 ? 25 : step === 2 ? 50 : step === 3 ? 75 : 90;
    document.getElementById("enrollProgressFill").style.width = pct + "%";
    // scroll to wizard top
    document.getElementById("enrollWizard")?.scrollIntoView({ behavior: "smooth", block: "start" });
  },
  updateStepper(step) {
    document.querySelectorAll("[data-stepper]").forEach((btn) => {
      const n = parseInt(btn.dataset.stepper,10);
      btn.classList.toggle("active", n === step);
      btn.classList.toggle("done", n < step);
      btn.setAttribute("aria-selected", n === step ? "true" : "false");
    });
    document.querySelectorAll(".stepper-line").forEach((line, idx) => {
      // line after step idx+1
      line.classList.toggle("done", idx + 1 < step);
    });
  },
  validateEnrollStep(step) {
    if (step === 1) {
      const camper = this.enrollState.camper;
      if (!camper) return this.showError("step1Error","Please select a camper to continue.");
      if (camper === "new") {
        const name = document.getElementById("newCamperName").value.trim();
        const age = document.getElementById("newCamperAge").value;
        if (!name) return this.showError("step1Error","Enter the new camper\u2019s name.");
        if (!age) return this.showError("step1Error","Select the camper\u2019s age group.");
        this.enrollState.camperName = name;
        this.enrollState.camperAge = age;
      }
      this.clearError("step1Error");
      return true;
    }
    if (step === 2) {
      if (!this.enrollState.campId) return this.showError("step2CampError","Please select a camp (all 8 programs are listed above).");
      const week = document.getElementById("enrollWeek").value;
      if (!week) return this.showError("step2WeekError","Please select a session week.");
      this.clearError("step2CampError");
      this.clearError("step2WeekError");
      return true;
    }
    if (step === 3) {
      const terms = document.getElementById("enrollTerms");
      if (!terms.checked) return this.showError("step3Error","Please agree to the Terms & Privacy Policy to continue.");
      this.clearError("step3Error");
      return true;
    }
    if (step === 4) {
      const name = document.getElementById("payName").value.trim();
      const email = document.getElementById("payEmail").value.trim();
      const card = document.getElementById("payCard").value.replace(/\s/g,"");
      const exp = document.getElementById("payExp").value.trim();
      const cvv = document.getElementById("payCvv").value.trim();
      if (!name) return this.showError("step4Error","Cardholder name is required.");
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return this.showError("step4Error","Enter a valid receipt email.");
      if (!/^\d{16}$/.test(card)) return this.showError("step4Error","Enter a valid 16-digit card number (use 4242 4242 4242 4242 for demo).");
      if (!/^\d{2}\s\/\s\d{2}$/.test(exp)) return this.showError("step4Error","Expiry must be MM / YY.");
      else {
        const [mm, yy] = exp.split("/").map((s)=>parseInt(s.trim(),10));
        if (mm < 1 || mm > 12) return this.showError("step4Error","Expiry month must be 01–12.");
        const now = new Date(); const curYY = now.getFullYear()%100; const curMM = now.getMonth()+1;
        if (yy < curYY || (yy===curYY && mm < curMM)) return this.showError("step4Error","Card has expired.");
      }
      if (!/^\d{3,4}$/.test(cvv)) return this.showError("step4Error","CVV must be 3 or 4 digits.");
      this.clearError("step4Error");
      return true;
    }
    return true;
  },
  showError(id, msg) {
    const el = document.getElementById(id);
    if (!el) { CampQuest.toast("error","Check this step",msg); return false; }
    const span = el.querySelector("span");
    if (span) span.textContent = msg;
    el.classList.add("show");
    el.style.display = "flex";
    CampQuest.toast("error","Check this step",msg);
    return false;
  },
  clearError(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove("show");
    el.style.display = "none";
    const span = el.querySelector("span");
    if (span) span.textContent = "";
  },
  updatePricePreview() {
    const box = document.getElementById("enrollPricePreview");
    if (!box) return;
    if (!this.enrollState.campId || !this.enrollState.weekValue) {
      box.innerHTML = '<span style="color:var(--muted);font-weight:600;font-size:.9rem">Select a camp and week to see pricing.</span>';
      return;
    }
    const camp = this.camps.find((c)=>c.id===this.enrollState.campId);
    const weekLabel = this.enrollState.weekLabel || document.getElementById("enrollWeek")?.options[document.getElementById("enrollWeek").selectedIndex]?.text || "";
    box.innerHTML = `
      <div>
        <strong style="display:block;font-family:var(--font-display)">${camp.name}</strong>
        <span style="color:var(--muted);font-size:.85rem;font-weight:600">${weekLabel}</span>
      </div>
      <div style="text-align:end">
        <strong>$${camp.price === 0 ? "—" : camp.price} ${camp.price>100?" / week":""}</strong>
        <span style="display:block;color:var(--muted);font-size:.82rem;font-weight:700">Deposit $50 due today</span>
      </div>
    `;
  },
  buildEnrollSummary() {
    const camp = this.camps.find((c)=>c.id===this.enrollState.campId);
    const weekLabel = this.enrollState.weekLabel;
    const camperLabel = this.enrollState.camper === "new" ? this.enrollState.camperName + " · " + this.enrollState.camperAge : (this.enrollState.camper === "maya" ? "Maya Whitmore · 9 yrs" : "Leo Whitmore · 11 yrs");
    const box = document.getElementById("enrollSummary");
    if (!box || !camp) return;
    box.innerHTML = `
      <dl class="enroll-summary">
        <div class="enroll-summary-row"><dt>Camper</dt><dd>${camperLabel}</dd></div>
        <div class="enroll-summary-row"><dt>Camp</dt><dd>${camp.name} <span style="color:var(--muted)">· ${camp.age} · ${camp.badge}</span></dd></div>
        <div class="enroll-summary-row"><dt>Week</dt><dd>${weekLabel}</dd></div>
        <div class="enroll-summary-row"><dt>Weekly rate</dt><dd>${camp.price===0?"Certificate incl.":"$" + camp.price}</dd></div>
        <div class="enroll-summary-row"><dt>Deposit today</dt><dd style="color:var(--brand)">$50.00</dd></div>
      </dl>
      <div style="display:flex;gap:10px;align-items:center;margin-top:12px;padding:12px;background:var(--brand-soft);border:1px solid var(--line);border-radius:12px">
        <img src="${camp.img}" alt="" style="width:56px;height:56px;border-radius:10px;object-fit:cover;flex:none">
        <div><strong style="font-family:var(--font-display)">${camp.name}</strong><span style="display:block;color:var(--muted);font-size:.85rem;font-weight:600">${camp.desc}</span></div>
      </div>
    `;
    // also update contact/health defaults if needed
    if (!this.enrollState.health) this.enrollState.health = document.getElementById("enrollHealth").value;
    if (!this.enrollState.contact) this.enrollState.contact = document.getElementById("enrollContact").value;
  },
  buildPaymentSummary() {
    const camp = this.camps.find((c)=>c.id===this.enrollState.campId);
    const weekLabel = this.enrollState.weekLabel;
    const camperLabel = this.enrollState.camper === "new" ? this.enrollState.camperName : (this.enrollState.camper === "maya" ? "Maya Whitmore" : "Leo Whitmore");
    const box = document.getElementById("enrollPaymentSummary");
    if (!box || !camp) return;
    box.innerHTML = `
      <div class="summary-line"><span>Camper</span><strong>${camperLabel}</strong></div>
      <div class="summary-line"><span>Camp</span><strong>${camp.name}</strong></div>
      <div class="summary-line"><span>Week</span><strong>${weekLabel}</strong></div>
      <div class="summary-line"><span>Weekly rate</span><strong>${camp.price===0?"Certificate":"$" + camp.price + ".00"}</strong></div>
      <div class="summary-line total"><span>Deposit charged today</span><strong>$50.00</strong></div>
      <span style="color:var(--muted);font-size:.82rem;font-weight:600">Remaining balance charged Jun 30. Receipt sent to your email.</span>
    `;
  },
  completeEnrollment() {
    const camp = this.camps.find((c)=>c.id===this.enrollState.campId);
    const weekLabel = this.enrollState.weekLabel;
    const camperName = this.enrollState.camper === "new" ? this.enrollState.camperName : (this.enrollState.camper === "maya" ? "Maya Whitmore" : "Leo Whitmore");
    const enrollment = {
      id: "ENR-" + Date.now().toString(36).toUpperCase(),
      camper: camperName,
      camperAge: this.enrollState.camperAge,
      campId: camp.id,
      campName: camp.name,
      week: this.enrollState.weekValue,
      weekLabel: weekLabel,
      price: camp.price,
      date: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),
      status: "pending"
    };
    // persist
    try {
      const key = "cq-enrollments";
      const arr = JSON.parse(localStorage.getItem(key) || "[]");
      arr.push(enrollment);
      localStorage.setItem(key, JSON.stringify(arr));
    } catch(e) {}
    // add to Activity Camps view
    this.addCampRow(enrollment, camp);
    // add invoice
    const invId = "INV-" + Math.floor(1000+Math.random()*9000);
    this.invoicesData.unshift({
      id: invId,
      item: camp.name + " · " + weekLabel.split("—")[0].trim(),
      due: "Jun 30, 2026",
      amount: "$" + (camp.price || 50) + ".00",
      status: "pending"
    });
    this.invoices();
    // update camps count badge
    const countEl = document.querySelector('.dash-nav [data-view="camps"] .nav-count');
    if (countEl) {
      const cur = parseInt(countEl.textContent,10) || 6;
      countEl.textContent = cur + 1;
    }
    // show success
    document.getElementById("enrollSuccessText").textContent = `${camperName} is queued for ${camp.name} — ${weekLabel}. We’ll confirm within 24h and your $50 deposit is secured.`;
    document.getElementById("enrollSuccessDetails").innerHTML = `
      <dl style="display:grid;gap:8px">
        <div class="detail-row"><dt>Enrollment ID</dt><dd>${enrollment.id}</dd></div>
        <div class="detail-row"><dt>Camper</dt><dd>${camperName}</dd></div>
        <div class="detail-row"><dt>Camp</dt><dd>${camp.name}</dd></div>
        <div class="detail-row"><dt>Week</dt><dd>${weekLabel}</dd></div>
        <div class="detail-row"><dt>Invoice</dt><dd>${invId} — pending $50 deposit</dd></div>
      </dl>
    `;
    this.updateEnrollStep("success");
    CampQuest.toast("success","Enrollment confirmed!", `${camp.name} for ${camperName} — $50 deposit processed.`);
    // fire confetti-like toast for status
    setTimeout(()=> {
      // auto-create status entry preview? just toast
    }, 300);
  },
  addCampRow(enrollment, camp) {
    const grid = document.querySelector("#camps .grid");
    if (!grid) return;
    const row = document.createElement("article");
    row.className = "camp-row";
    row.style.animation = "view-in .5s var(--ease-out)";
    // pick thumb color based on camp
    const colors = { sports:"g-accent", clay:"g-brand", code:"g-sky", wildlife:"g-brand", aqua:"g-sky", stage:"g-berry", discovery:"g-accent", leadership:"g-brand" };
    const tileClass = colors[camp.id] || "g-brand";
    const iconSvg = {
      sports: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3a15 15 0 0 1 0 18M3 12h18"/></svg>',
      clay: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19 5 12l7-7 7 7Z"/><path d="m19 12 3 3-3 3-3-3ZM2 15l3-3 3 3-3 3Z"/></svg>',
      code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/></svg>',
      wildlife: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/></svg>',
      aqua: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20c2-4 6-4 8 0m2-12c2-4 6-4 8 0M6 15c2-4 6-4 8 0"/></svg>',
      stage: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 15 8l7 1-5 4.86L18.18 21 12 17.77 5.82 21 7 13.86 2 9l7-1Z"/></svg>',
      discovery: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3H15l-3 9H9z"/><path d="M12 12v8"/></svg>',
      leadership: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>'
    };
    row.innerHTML = `
      <div class="thumb-tile ${tileClass}">${iconSvg[camp.id] || iconSvg.sports}</div>
      <div class="camp-row-info"><h3>${camp.name} · ${enrollment.camper}</h3><p>${enrollment.weekLabel} · $${camp.price || 0}${camp.price>100?" / week":""} · Enrolled ${enrollment.date}</p></div>
      <div class="camp-row-meta">
        <span class="meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>8am–5pm</span>
        <span class="status-pill status-pending">Pending review</span>
      </div>
    `;
    grid.prepend(row);
  },
  loadStoredEnrollments() {
    try {
      const arr = JSON.parse(localStorage.getItem("cq-enrollments") || "[]");
      arr.forEach((enr) => {
        const camp = this.camps.find((c)=>c.id===enr.campId) || this.camps[0];
        this.addCampRow(enr, camp);
      });
      if (arr.length) {
        const countEl = document.querySelector('.dash-nav [data-view="camps"] .nav-count');
        if (countEl) countEl.textContent = (6 + arr.length).toString();
      }
    } catch(e) {}
  },
  resetEnrollWizard() {
    this.enrollState = { camper: null, camperName: "", camperAge: "", campId: null, weekValue: "", weekLabel: "", price: 0 };
    this.currentEnrollStep = 1;
    // reset UI
    document.querySelectorAll(".camper-option").forEach((o)=>o.classList.remove("selected"));
    document.querySelectorAll(".camper-option input").forEach((i)=>i.checked=false);
    document.getElementById("newCamperFields").style.display="none";
    document.getElementById("newCamperName").value="";
    document.getElementById("newCamperAge").value="";
    document.querySelectorAll(".camp-option").forEach((o)=>{ o.classList.remove("selected"); o.setAttribute("aria-checked","false"); });
    document.getElementById("enrollWeek").value="";
    document.getElementById("enrollHealth").value="";
    document.getElementById("enrollContact").value="Sarah Whitmore · +1 (555) 010-2288";
    document.getElementById("enrollTerms").checked=false;
    document.getElementById("enrollPaymentForm").reset();
    document.querySelectorAll(".field-error").forEach((e)=>{ e.classList.remove("show"); e.style.display="none"; });
    document.getElementById("enrollPricePreview").innerHTML='<span style="color:var(--muted);font-weight:600;font-size:.9rem">Select a camp and week to see pricing.</span>';
    this.updateEnrollStep(1);
    CampQuest.toast("info","Wizard reset","Start a new enrollment when ready.");
  },
  deepLinkEnroll() {
    // Handle ?camp=sports#enrollment or #enrollment?camp=sports or #enrollment-sports
    const hash = location.hash || "";
    const search = new URLSearchParams(location.search);
    let campParam = search.get("camp");
    // also parse hash query
    if (!campParam && hash.includes("camp=")) {
      const hParams = new URLSearchParams(hash.split("?")[1] || hash.split("&").slice(1).join("&"));
      campParam = hParams.get("camp");
    }
    if (!campParam && hash.startsWith("#enrollment-")) {
      campParam = hash.replace("#enrollment-","").split("?")[0].split("&")[0];
    }
    // If hash is enrollment, activate that view
    if (hash.includes("enrollment")) {
      const btn = document.querySelector('.dash-nav [data-view="enrollment"]');
      if (btn) btn.click();
      // pre-select camp if param
      if (campParam) {
        // normalize: sports-academy -> sports, clay-canvas -> clay, etc.
        const norm = campParam.toLowerCase().replace(/[^a-z]/g,"");
        const map = { sports:"sports", sportsacademy:"sports", clay:"clay", claycanvas:"clay", canvas:"clay", code:"code", robotics:"code", coderobotics:"code", wildlife:"wildlife", nature:"wildlife", ranger:"wildlife", aqua:"aqua", swim:"aqua", stage:"stage", stagecraft:"stage", discovery:"discovery", lab:"discovery", leadership:"leadership", ladder:"leadership" };
        let found = null;
        for (const k in map) if (norm.includes(k)) { found = map[k]; break; }
        if (!found) {
          // try direct id match
          if (this.camps.some((c)=>c.id===campParam.toLowerCase())) found = campParam.toLowerCase();
        }
        if (found) {
          setTimeout(()=> {
            const opt = document.querySelector(`.camp-option[data-camp="${found}"]`);
            if (opt) { opt.click(); this.updateEnrollStep(1); /* keep at step1, camper still needs selection, but hint camp */ 
              // also toast hint
              CampQuest.toast("info","Camp pre-selected", `${this.camps.find(c=>c.id===found).name} is ready — choose a camper to continue.`);
            }
          }, 350);
        }
      }
    }
    // Also listen for future hash changes
    window.addEventListener("hashchange", () => {
      if (location.hash.includes("enrollment")) {
        document.querySelector('.dash-nav [data-view="enrollment"]')?.click();
      }
    });
  }
};
document.addEventListener("DOMContentLoaded", () => ParentDash.init());
