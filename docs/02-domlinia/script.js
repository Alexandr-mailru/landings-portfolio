const menuBtn = document.querySelector("[data-menu]");
const nav = document.querySelector("[data-nav]");
const cookie = document.querySelector("[data-cookie]");
const cookieOk = document.querySelector("[data-cookie-ok]");
const cookieKey = "domlinia-cookie-consent-v3";

function storageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* file:// или приватный режим */
  }
}

function openCookie() {
  cookie?.classList.add("is-open");
}

function closeCookie() {
  cookie?.classList.remove("is-open");
  storageSet(cookieKey, "1");
}

function hideCookieOnly() {
  cookie?.classList.remove("is-open");
}

function setMenuOpen(open) {
  nav?.classList.toggle("open", open);
  menuBtn?.setAttribute("aria-expanded", open ? "true" : "false");
}

menuBtn?.setAttribute("aria-expanded", "false");
menuBtn?.addEventListener("click", () => setMenuOpen(!nav?.classList.contains("open")));
nav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenuOpen(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenuOpen(false);
});
document.addEventListener("click", (e) => {
  if (!nav?.classList.contains("open")) return;
  if (nav.contains(e.target) || menuBtn?.contains(e.target)) return;
  setMenuOpen(false);
});
window.addEventListener("resize", () => {
  if (window.matchMedia("(min-width: 860px)").matches) setMenuOpen(false);
});

if (storageGet(cookieKey)) {
  hideCookieOnly();
} else {
  openCookie();
}

cookieOk?.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  closeCookie();
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const rates = {
  cosmetic: [9000, 12000],
  capital: [15000, 18000],
  turnkey: [22000, 28000],
};

const form = document.querySelector("[data-form]");
const estimate = document.querySelector("[data-estimate]");
const status = document.querySelector("[data-status]");

function formatMoney(value) {
  return new Intl.NumberFormat("ru-RU").format(Math.round(value));
}

function updateEstimate() {
  if (!form || !estimate) return;
  const data = new FormData(form);
  const area = Number(data.get("area")) || 0;
  const type = String(data.get("type") || "capital");
  const [min, max] = rates[type] || rates.capital;
  estimate.innerHTML = `Ориентир: <strong>${formatMoney(area * min)} – ${formatMoney(area * max)} ₽</strong>`;
}

form?.addEventListener("input", updateEstimate);
updateEstimate();

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  if (!data.get("pdn")) {
    if (status) {
      status.hidden = false;
      status.textContent = "Нужно согласие на обработку персональных данных.";
    }
    return;
  }
  if (status) {
    status.hidden = false;
    status.textContent = "Заявка принята. Согласуем замер в рабочее время.";
  }
  form.reset();
  updateEstimate();
});
