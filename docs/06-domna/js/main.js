(function () {
  const toggle = document.querySelector("[data-nav-open]");
  const panel = document.querySelector("[data-nav-panel]");
  const closeBtn = document.querySelector("[data-nav-close]");

  function openNav() {
    panel?.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeNav() {
    panel?.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  toggle?.addEventListener("click", openNav);
  closeBtn?.addEventListener("click", closeNav);
  panel?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  const form = document.querySelector("[data-demo-form]");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const note = form.querySelector("[data-form-note]");
    if (note) {
      note.textContent = "Демо: данные не отправлены на сервер. В Tilda сюда подключают Form / почту / Telegram.";
    }
    form.reset();
  });
})();
