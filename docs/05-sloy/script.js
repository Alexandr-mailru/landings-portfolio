const menuBtn = document.querySelector("[data-menu]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const cookie = document.querySelector("[data-cookie]");
const cookieOk = document.querySelector("[data-cookie-ok]");
const cookieKey = "sloy-cookie-consent-v1";
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  if (window.matchMedia("(min-width: 880px)").matches) setMenuOpen(false);
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

function onScrollChrome() {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
}
onScrollChrome();
window.addEventListener("scroll", onScrollChrome, { passive: true });

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

const stackItems = [...document.querySelectorAll("[data-stack-item]")];
if (stackItems.length) {
  const stackObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-active", entry.isIntersecting && entry.intersectionRatio > 0.45);
      });
    },
    { threshold: [0.45, 0.7] }
  );
  stackItems.forEach((el) => stackObserver.observe(el));
}

const layers = [...document.querySelectorAll("[data-layer]")];
const hero = document.querySelector("[data-hero]");

function updateParallax() {
  if (reduceMotion || !hero || !layers.length) return;
  const rect = hero.getBoundingClientRect();
  const view = window.innerHeight || 1;
  const progress = Math.min(1, Math.max(0, (view - rect.top) / (view + rect.height)));
  const shift = (progress - 0.35) * 120;

  layers.forEach((layer) => {
    const depth = Number(layer.dataset.layer) || 0.2;
    layer.style.transform = `translate3d(0, ${shift * depth}px, 0)`;
  });
}

if (!reduceMotion && layers.length) {
  let ticking = false;
  const requestParallax = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateParallax();
      ticking = false;
    });
  };
  updateParallax();
  window.addEventListener("scroll", requestParallax, { passive: true });
  window.addEventListener("resize", requestParallax);
}

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
    status.textContent = `${name}, бриф принят. Мы свяжемся в течение дня.`;
  }
  form.reset();
});
