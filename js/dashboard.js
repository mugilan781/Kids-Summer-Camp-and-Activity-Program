"use strict";
const ParentDash = {
  schedule: {
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
  invoices: [
    { id: "INV-2041", item: "Sports Camp · Week 3", due: "Jun 02, 2026", amount: "$289.00", status: "paid" },
    { id: "INV-2054", item: "Coding Camp · Session B", due: "Jun 16, 2026", amount: "$340.00", status: "paid" },
    { id: "INV-2067", item: "Arts & Crafts · Week 5", due: "Jul 07, 2026", amount: "$265.00", status: "pending" },
    { id: "INV-2072", item: "Late Pickup Fee · Jun 24", due: "Jul 01, 2026", amount: "$15.00", status: "pending" },
    { id: "INV-2033", item: "Adventure Trek Gear Kit", due: "May 20, 2026", amount: "$58.00", status: "overdue" }
  ],
  init() {
    this.nav();
    this.schedule();
    this.calendar();
    this.invoices();
    this.chart();
    this.settings();
    this.enrollForm();
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
    grid.innerHTML = Object.entries(this.schedule).map(([day, events]) => `
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
    body.innerHTML = this.invoices.map((inv) => `
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
        const inv = this.invoices.find((i) => i.id === b.dataset.invoice);
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
  enrollForm() {
    const form = document.getElementById("enrollForm");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const child = form.querySelector("#enrollChild");
      const camp = form.querySelector("#enrollCamp");
      if (!child.value || !camp.value) {
        CampQuest.toast("error", "Missing details", "Choose a child and a camp to continue.");
        return;
      }
      CampQuest.toast("success", "Enrollment requested", `${child.options[child.selectedIndex].text} is queued for ${camp.options[camp.selectedIndex].text}.`);
      form.reset();
    });
  }
};
document.addEventListener("DOMContentLoaded", () => ParentDash.init());
