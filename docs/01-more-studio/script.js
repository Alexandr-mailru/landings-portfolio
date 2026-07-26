const menuBtn = document.querySelector("[data-menu]");
const nav = document.querySelector("[data-nav]");
const glow = document.querySelector("[data-glow]");
const cookie = document.querySelector("[data-cookie]");
const cookieOk = document.querySelector("[data-cookie-ok]");
const cookieKey = "more-cookie-consent-v3";

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

// не записываем согласие при простом скрытии уже принятого
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
  if (window.matchMedia("(min-width: 880px)").matches) setMenuOpen(false);
});

if (glow && matchMedia("(hover: hover) and (pointer: fine)").matches) {
  window.addEventListener("pointermove", (e) => {
    glow.classList.add("active");
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
}

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
  { threshold: 0.14 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const form = document.querySelector("[data-form]");
const status = document.querySelector("[data-status]");

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
  const name = String(data.get("name") || "").trim();
  if (status) {
    status.hidden = false;
    status.textContent = `${name}, заявка принята. Мы свяжемся в течение дня.`;
  }
  form.reset();
});
