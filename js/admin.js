"use strict";
const AdminDash = {
  campers: [
    { name: "Maya Thompson", age: 9, camp: "Sports Camp", week: "Week 3", parent: "Daniel T.", status: "confirmed" },
    { name: "Leo Rodriguez", age: 11, camp: "Coding Camp", week: "Session B", parent: "Maria R.", status: "confirmed" },
    { name: "Ava Chen", age: 7, camp: "Arts & Crafts", week: "Week 2", parent: "Jing C.", status: "pending" },
    { name: "Noah Kim", age: 13, camp: "Adventure Trek", week: "Week 4", parent: "Soo K.", status: "confirmed" },
    { name: "Isla Murphy", age: 8, camp: "Nature Explorers", week: "Week 3", parent: "Fiona M.", status: "waitlist" },
    { name: "Ethan Walsh", age: 10, camp: "Sports Camp", week: "Week 3", parent: "Grace W.", status: "pending" },
    { name: "Zara Ahmed", age: 12, camp: "Coding Camp", week: "Session A", parent: "Omar A.", status: "confirmed" },
    { name: "Lucas Moreau", age: 6, camp: "Little Explorers", week: "Week 1", parent: "Elise M.", status: "confirmed" }
  ],
  init() {
    this.nav();
    this.table();
    this.composer();
    this.chart();
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
      document.querySelector(".dash-sidebar")?.classList.remove("open");
      document.querySelector(".drawer-overlay")?.classList.remove("show");
      document.body.style.overflow = "";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }));
    document.querySelector(".dash-burger")?.addEventListener("click", () => {
      document.querySelector(".dash-sidebar").classList.add("open");
      document.querySelector(".drawer-overlay")?.classList.add("show");
    });
    document.querySelector(".drawer-overlay")?.addEventListener("click", () => {
      document.querySelector(".dash-sidebar")?.classList.remove("open");
      document.querySelector(".drawer-overlay")?.classList.remove("show");
    });
  },
  table() {
    const body = document.getElementById("campersBody");
    const search = document.getElementById("camperSearch");
    const chipBtns = document.querySelectorAll("[data-camper-filter]");
    if (!body) return;
    const render = () => {
      const q = (search?.value || "").toLowerCase();
      const active = document.querySelector("[data-camper-filter].active");
      const f = active ? active.dataset.camperFilter : "all";
      const rows = this.campers.filter((c) =>
        (f === "all" || c.status === f) &&
        (!q || (c.name + c.camp + c.parent).toLowerCase().includes(q)));
      body.innerHTML = rows.length ? rows.map((c) => `
        <tr>
          <td style="display:flex;align-items:center;gap:11px">
            <img class="avatar" width="36" height="36" src="https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(c.name)}" alt="" loading="lazy">
            ${c.name}
          </td>
          <td>${c.age} yrs</td>
          <td>${c.camp}</td>
          <td>${c.week}</td>
          <td>${c.parent}</td>
          <td><span class="status-pill status-${c.status === "confirmed" ? "paid" : c.status === "pending" ? "pending" : "overdue"}">${c.status[0].toUpperCase() + c.status.slice(1)}</span></td>
          <td><button class="btn btn-ghost btn-sm" data-manage="${c.name}">Manage</button></td>
        </tr>`).join("")
        : '<tr><td colspan="7" style="text-align:center;color:var(--muted)">No campers match your filters.</td></tr>';
      body.querySelectorAll("[data-manage]").forEach((b) =>
        b.addEventListener("click", () => CampQuest.toast("info", "Camper profile", `Opening record for ${b.dataset.manage}.`)));
    };
    search?.addEventListener("input", render);
    chipBtns.forEach((c) => c.addEventListener("click", () => {
      chipBtns.forEach((x) => x.classList.remove("active"));
      c.classList.add("active");
      render();
    }));
    render();
  },
  composer() {
    const form = document.getElementById("announceForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = form.querySelector("#annTitle");
      const msg = form.querySelector("#annMsg");
      const audience = form.querySelector("#annAudience");
      if (!title.value.trim() || !msg.value.trim()) {
        CampQuest.toast("error", "Missing content", "Add a title and message before publishing.");
        return;
      }
      const list = document.getElementById("adminAnnounceList");
      const li = document.createElement("article");
      li.className = "announce-item";
      li.style.animation = "fade-up .5s var(--ease-out)";
      li.innerHTML = `
        <div class="announce-icon" style="background:var(--sky-soft);color:var(--sky)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 11 22 2 13 21l-2-8-8-2Z"/></svg>
        </div>
        <div><h3>${title.value.replace(/</g, "&lt;")}</h3><time>Just now · to ${audience.options[audience.selectedIndex].text}</time>
        <p>${msg.value.replace(/</g, "&lt;")}</p></div>`;
      list.prepend(li);
      form.reset();
      CampQuest.toast("success", "Announcement published", `Delivered to ${audience.options[audience.selectedIndex].text}.`);
    });
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
  }
};
document.addEventListener("DOMContentLoaded", () => AdminDash.init());
