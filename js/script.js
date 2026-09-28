"use strict";

const SERVICES = [
  { icon: "ph-scissors", title: "Стрижка + укладка", desc: "Женская или мужская стрижка с укладкой.", price: "от 2 200 ₽" },
  { icon: "ph-paint-brush", title: "Окрашивание", desc: "Однотонное окрашивание, омбре, балаяж.", price: "от 4 500 ₽" },
  { icon: "ph-hand-heart", title: "Маникюр + покрытие", desc: "Маникюр с гель-лаком и укреплением.", price: "от 1 800 ₽" },
  { icon: "ph-flower-lotus", title: "Уходовая процедура", desc: "Уход за лицом, массаж, SPA для рук.", price: "от 2 900 ₽" },
];

const MASTERS = [
  { name: "Алина", role: "Стилист-парикмахер", tags: ["Стрижки", "Укладки", "Окрашивание"], photo: "assets/master-1.jpg" },
  { name: "Марина", role: "Колорист", tags: ["Балаяж", "Омбре", "Тонирование"], photo: "assets/master-2.jpg" },
  { name: "Ольга", role: "Мастер маникюра", tags: ["Гель-лак", "Дизайн", "Укрепление"], photo: "assets/master-3.jpg" },
];

const REVIEWS = [
  { text: "Записалась онлайн за 2 минуты, слоты видно сразу — очень удобно.", author: "Виктория" },
  { text: "Окрашивание у Марины — цвет держится уже 2 месяца, супер!", author: "Елена" },
  { text: "Маникюр держится 3 недели без сколов. Обязательно вернусь.", author: "Светлана" },
];

const SLOTS = [
  { time: "10:00", taken: false },
  { time: "11:30", taken: true },
  { time: "13:00", taken: false },
  { time: "14:30", taken: false },
  { time: "16:00", taken: true },
  { time: "17:30", taken: false },
  { time: "19:00", taken: false },
  { time: "20:00", taken: true },
];

function renderList(id, items, render) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = items.map((item, i) => render(item, i)).join("");
}

function renderServices() {
  renderList("servicesGrid", SERVICES, (s, i) => `
    <div class="card reveal" role="listitem" style="--reveal-delay:${i * 0.08}s">
      <span class="card__icon"><i class="ph ${s.icon}" aria-hidden="true"></i></span>
      <h3 class="card__title">${s.title}</h3>
      <p class="card__desc">${s.desc}</p>
      <span class="card__price">${s.price}</span>
    </div>`);
}

function renderMasters() {
  renderList("mastersGrid", MASTERS, (m, i) => `
    <div class="master-card reveal" role="listitem" style="--reveal-delay:${i * 0.08}s">
      <div class="master-card__avatar"><img src="${m.photo}" alt="${m.name}" loading="lazy" /></div>
      <h3 class="master-card__name">${m.name}</h3>
      <p class="master-card__role">${m.role}</p>
      <div class="master-card__tags">${m.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
    </div>`);
}

function renderReviews() {
  renderList("reviewsGrid", REVIEWS, (r, i) => `
    <div class="review-card reveal" role="listitem" style="--reveal-delay:${i * 0.08}s">
      <div class="review-card__stars">★★★★★</div>
      <p class="review-card__text">${r.text}</p>
      <p class="review-card__author">${r.author}</p>
    </div>`);
}

function populateBookingSelects() {
  const serviceSelect = document.getElementById("bookService");
  const masterSelect = document.getElementById("bookMaster");
  if (serviceSelect) {
    serviceSelect.innerHTML = SERVICES.map((s) => `<option value="${s.title}" data-price="${s.price}">${s.title} — ${s.price}</option>`).join("");
  }
  if (masterSelect) {
    masterSelect.innerHTML = MASTERS.map((m) => `<option value="${m.name}">${m.name} — ${m.role}</option>`).join("");
  }
}

function renderSlots() {
  const grid = document.getElementById("slotsGrid");
  const hiddenInput = document.getElementById("bookSlot");
  if (!grid) return;

  grid.innerHTML = SLOTS.map((s) => `
    <button type="button" class="slot ${s.taken ? "slot--taken" : ""}" data-time="${s.time}" ${s.taken ? "disabled" : ""} role="option" aria-selected="false">
      ${s.time}
    </button>`).join("");

  grid.querySelectorAll(".slot:not(.slot--taken)").forEach((btn) => {
    btn.addEventListener("click", () => {
      grid.querySelectorAll(".slot").forEach((b) => { b.classList.remove("slot--selected"); b.setAttribute("aria-selected", "false"); });
      btn.classList.add("slot--selected");
      btn.setAttribute("aria-selected", "true");
      hiddenInput.value = btn.dataset.time;
      document.getElementById("slotError").textContent = "";
    });
  });
}

function updateSummary() {
  const serviceSelect = document.getElementById("bookService");
  const price = document.getElementById("bookingPrice");
  if (!serviceSelect || !price) return;
  const opt = serviceSelect.options[serviceSelect.selectedIndex];
  price.textContent = opt ? opt.dataset.price : "—";
}

function initBookingForm() {
  const form = document.getElementById("bookingForm");
  if (!form) return;
  const serviceSelect = document.getElementById("bookService");
  serviceSelect.addEventListener("change", updateSummary);
  updateSummary();

  const status = document.getElementById("formStatus");
  const fields = {
    clientName: { input: document.getElementById("clientName"), error: document.getElementById("clientNameError") },
    clientPhone: { input: document.getElementById("clientPhone"), error: document.getElementById("clientPhoneError") },
  };
  const setError = (key, msg) => {
    const { input, error } = fields[key];
    input.closest(".form-field").classList.toggle("has-error", Boolean(msg));
    error.textContent = msg || "";
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    if (!fields.clientName.input.value.trim()) { setError("clientName", "Укажите имя."); valid = false; } else setError("clientName", "");
    const phonePattern = /^[+\d][\d\s()-]{6,}$/;
    if (!phonePattern.test(fields.clientPhone.input.value.trim())) { setError("clientPhone", "Укажите корректный телефон."); valid = false; } else setError("clientPhone", "");

    const slot = document.getElementById("bookSlot").value;
    if (!slot) { document.getElementById("slotError").textContent = "Выберите время."; valid = false; }

    if (!valid) { status.textContent = ""; return; }

    status.textContent = `Готово! Вы записаны на ${slot} к мастеру ${document.getElementById("bookMaster").value}.`;
    form.reset();
    document.querySelectorAll(".slot").forEach((b) => b.classList.remove("slot--selected"));
    updateSummary();
  });
}

function initRevealObserver() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { items.forEach((el) => el.classList.add("is-visible")); return; }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  items.forEach((el) => observer.observe(el));
}

function initHeaderScroll() {
  const header = document.getElementById("header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function initActiveNav() {
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".nav__link");
  const linkFor = (id) => document.querySelector(`.nav__link[href="#${id}"]`);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const link = linkFor(entry.target.id);
      if (link && entry.isIntersecting) { links.forEach((l) => l.classList.remove("is-active")); link.classList.add("is-active"); }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => observer.observe(s));
}

function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  if (!menuToggle || !nav) return;
  const closeMenu = () => {
    nav.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  nav.querySelectorAll(".nav__link").forEach((l) => l.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
}

function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  renderServices();
  renderMasters();
  renderReviews();
  populateBookingSelects();
  renderSlots();
  initBookingForm();
  initHeaderScroll();
  initActiveNav();
  initMobileMenu();
  initBackToTop();
  initRevealObserver();
});
