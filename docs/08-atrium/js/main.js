(() => {
  const top = document.querySelector("[data-top]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const mobile = document.querySelector("[data-mobile-nav]");
  const heroImg = document.querySelector(".hero__media img");

  if (top) {
    const onScroll = () => {
      top.classList.toggle("is-solid", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (toggle && mobile) {
    toggle.addEventListener("click", () => {
      const open = mobile.hasAttribute("hidden");
      if (open) mobile.removeAttribute("hidden");
      else mobile.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobile.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        mobile.setAttribute("hidden", "");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* Soft hero parallax */
  if (heroImg && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener(
      "scroll",
      () => {
        const y = Math.min(80, window.scrollY * 0.12);
        heroImg.style.transform = `scale(1.04) translateY(${y}px)`;
      },
      { passive: true }
    );
  }

  /* Reveal on view */
  const nodes = document.querySelectorAll(".intro, .steps li, .project-card, .statement, .contact__copy, .contact__form");
  nodes.forEach((el) => el.setAttribute("data-reveal", ""));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    nodes.forEach((el) => io.observe(el));
  } else {
    nodes.forEach((el) => el.classList.add("is-in"));
  }

  /* WP AJAX form or static mailto fallback */
  const form = document.querySelector("[data-lead-form]");
  if (!form) return;

  const status = form.querySelector("[data-lead-status]");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const consent = form.querySelector('[name="consent"]');
    if (consent && !consent.checked) {
      if (status) {
        status.hidden = false;
        status.classList.add("is-error");
        status.textContent = "Отметьте согласие на обработку персональных данных.";
      }
      return;
    }

    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    if (typeof atriumData !== "undefined" && atriumData.ajaxUrl) {
      data.append("action", "atrium_lead");
      data.append("nonce", atriumData.nonce);
      try {
        const res = await fetch(atriumData.ajaxUrl, { method: "POST", body: data, credentials: "same-origin" });
        const json = await res.json();
        if (status) {
          status.hidden = false;
          status.classList.toggle("is-error", !json.success);
          status.textContent = (json.data && json.data.message) || (json.success ? "Отправлено." : "Ошибка отправки.");
        }
        if (json.success) form.reset();
      } catch (_) {
        if (status) {
          status.hidden = false;
          status.classList.add("is-error");
          status.textContent = "Сеть недоступна. Позвоните нам.";
        }
      }
      return;
    }

    /* Static demo fallback */
    const mail = "hello@atrium.demo";
    const subject = encodeURIComponent("Заявка ATRIUM: " + (payload.name || ""));
    const body = encodeURIComponent(
      `Имя: ${payload.name || ""}\nТелефон: ${payload.phone || ""}\nE-mail: ${payload.email || ""}\n\n${payload.message || ""}`
    );
    window.location.href = `mailto:${mail}?subject=${subject}&body=${body}`;
    if (status) {
      status.hidden = false;
      status.classList.remove("is-error");
      status.textContent = "Открылось окно почты — отправьте письмо.";
    }
  });
})();
