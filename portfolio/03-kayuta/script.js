const menuBtn = document.querySelector("[data-menu]");
const nav = document.querySelector("[data-nav]");
const cookie = document.querySelector("[data-cookie]");
const cookieOk = document.querySelector("[data-cookie-ok]");
const cookieKey = "kayuta-cookie-consent-v3";

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

menuBtn?.addEventListener("click", () => nav?.classList.toggle("open"));
nav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));

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
const dateInput = form?.querySelector('input[name="date"]');

if (dateInput) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.min = tomorrow.toISOString().slice(0, 10);
  dateInput.value = dateInput.min;
}

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
  const guests = data.get("guests");
  const date = data.get("date");
  const time = data.get("time");

  if (status) {
    status.hidden = false;
    status.textContent = `${name}, бронь на ${guests} гостей (${date}, ${time}) принята. Ждите подтверждение.`;
  }

  form.reset();
  if (dateInput) dateInput.value = dateInput.min;
});
