(() => {
  const stages = [
    {
      id: "stol",
      at: 0,
      end: 0.14,
      index: "01",
      title: "Стол",
      kicker: "Пустая сцена",
      text: "Пустой поворотный диск. Чистая сцена кондитера — нулевая высота, студийный свет, момент до первой детали.",
      facts: ["Металл", "Студийный свет", "Нулевая высота"],
      badge: "Страница 01 · Стол",
      top: "01 · Стол",
      seek: 0,
    },
    {
      id: "korzhi",
      at: 0.14,
      end: 0.3,
      index: "02",
      title: "Коржи",
      kicker: "Несущие слои",
      text: "Бисквитные диски задают высоту и геометрию. Без ровных коржей ярус не держит форму и вкус.",
      facts: ["Бисквит", "Пористость", "Геометрия"],
      badge: "Страница 02 · Коржи",
      top: "02 · Коржи",
      seek: 0.14,
    },
    {
      id: "nachinka",
      at: 0.3,
      end: 0.48,
      index: "03",
      title: "Начинка",
      kicker: "Крем + джем",
      text: "Между слоями появляется вкус: крем и ягодный джем. Этого не видно снаружи — ради этого берут торт.",
      facts: ["Крем", "Ягодный джем", "Равномерный слой"],
      badge: "Страница 03 · Начинка",
      top: "03 · Начинка",
      seek: 0.3,
    },
    {
      id: "krem",
      at: 0.48,
      end: 0.66,
      index: "04",
      title: "Крем",
      kicker: "Обтяжка боков",
      text: "Бока закрываются белым кремом. Появляется чистый цилиндр — холст под глазурь и финальный силуэт.",
      facts: ["Обтяжка", "Шпатель", "Ровный край"],
      badge: "Страница 04 · Крем",
      top: "04 · Крем",
      seek: 0.48,
    },
    {
      id: "glazur",
      at: 0.66,
      end: 0.84,
      index: "05",
      title: "Глазурь",
      kicker: "Шоколадные подтёки",
      text: "Шоколад стекает подтёками. Контраст белого крема и тёмного глянца — момент «вау» в кадре.",
      facts: ["Ганаш", "Подтёки", "Глянец"],
      badge: "Страница 05 · Глазурь",
      top: "05 · Глазурь",
      seek: 0.66,
    },
    {
      id: "gotovo",
      at: 0.84,
      end: 1,
      index: "06",
      title: "Готово",
      kicker: "Инжир и розмарин",
      text: "Инжир и розмарин закрывают композицию. Торт собран — точка, где хочется заказать такой же.",
      facts: ["Инжир", "Розмарин", "Финальный кадр"],
      badge: "Страница 06 · Готово",
      top: "06 · Готово",
      seek: 0.84,
    },
  ];

  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  function stageAt(p) {
    let cur = stages[0];
    for (const s of stages) if (p >= s.at) cur = s;
    return cur;
  }

  function waitMeta(video) {
    return new Promise((resolve) => {
      if (video.readyState >= 1 && video.duration && isFinite(video.duration)) {
        resolve();
        return;
      }
      video.addEventListener("loadedmetadata", () => resolve(), { once: true });
      video.addEventListener("error", () => resolve(), { once: true });
    });
  }

  async function init() {
    const section = document.getElementById("cake");
    const video = document.querySelector("[data-scrub-video]");
    if (!section || !video) return;

    const pageRoot = document.querySelector("[data-page-root]");
    const title = document.querySelector("[data-page-title]");
    const text = document.querySelector("[data-page-text]");
    const kicker = document.querySelector("[data-page-kicker]");
    const indexEl = document.querySelector("[data-page-index]");
    const factsEl = document.querySelector("[data-page-facts]");
    const badge = document.querySelector("[data-stage-badge]");
    const giant = document.querySelector("[data-giant]");
    const topStage = document.querySelector("[data-top-stage]");
    const bar = document.querySelector("[data-cake-bar]");
    const pages = [...document.querySelectorAll("[data-pager] button")];
    const segments = document.querySelector("[data-segments]");

    if (segments) {
      segments.innerHTML = stages.map(() => "<span></span>").join("");
    }

    video.pause();
    video.muted = true;
    video.playsInline = true;
    try {
      video.load();
    } catch (_) {}
    await waitMeta(video);
    const duration = Math.max(0.01, video.duration || 1);

    let target = 0;
    let current = 0;
    let lastId = "";
    let lastSet = -1;
    let turnTimer = 0;

    const renderFacts = (facts) => {
      if (!factsEl) return;
      factsEl.innerHTML = facts.map((f) => `<li>${f}</li>`).join("");
    };

    const applyStageUi = (p) => {
      const s = stageAt(p);
      document.body.dataset.stage = s.id;
      document.body.dataset.page = String(Number(s.index));
      if (bar) bar.style.width = `${p * 100}%`;

      pages.forEach((btn) => {
        const on = btn.dataset.id === s.id;
        btn.classList.toggle("is-active", on);
        if (on) btn.setAttribute("aria-current", "page");
        else btn.removeAttribute("aria-current");
      });

      if (s.id === lastId) return;

      document.body.classList.add("is-turning");
      window.clearTimeout(turnTimer);
      turnTimer = window.setTimeout(() => {
        document.body.classList.remove("is-turning");
      }, 420);

      lastId = s.id;

      if (indexEl) indexEl.textContent = s.index;
      if (giant) giant.textContent = s.index;
      if (title) title.textContent = s.title;
      if (kicker) kicker.textContent = s.kicker;
      if (text) text.textContent = s.text;
      if (badge) badge.textContent = s.badge;
      if (topStage) topStage.textContent = s.top;
      renderFacts(s.facts);

      if (pageRoot) {
        pageRoot.style.opacity = "0";
        pageRoot.style.filter = "blur(4px)";
        requestAnimationFrame(() => {
          pageRoot.style.transition = "opacity 0.5s cubic-bezier(0.22,1,0.36,1), filter 0.5s ease";
          pageRoot.style.opacity = "1";
          pageRoot.style.filter = "blur(0)";
        });
      }
    };

    const applyTime = (p) => {
      const t = clamp(p) * Math.max(0, duration - 0.05);
      if (Math.abs(t - lastSet) < 0.008) return;
      lastSet = t;
      try {
        video.currentTime = t;
      } catch (_) {}
    };

    const tick = () => {
      current = lerp(current, target, 0.22);
      if (Math.abs(current - target) < 0.00004) current = target;
      applyTime(current);
      applyStageUi(current);
      requestAnimationFrame(tick);
    };

    video.currentTime = 0;
    applyStageUi(0);
    requestAnimationFrame(tick);

    const seekTo = (seek) => {
      target = clamp(seek);
      current = lerp(current, target, 0.45);
    };

    pages.forEach((btn) => {
      btn.addEventListener("click", () => seekTo(Number(btn.dataset.seek || 0)));
    });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      target = 1;
      current = 1;
      applyTime(1);
      applyStageUi(1);
      video.controls = true;
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const top = document.querySelector("[data-top]");
    if (top) {
      ScrollTrigger.create({
        trigger: "#hero",
        start: "bottom top+=64",
        onEnter: () => top.classList.add("is-solid"),
        onLeaveBack: () => top.classList.remove("is-solid"),
      });
    }

    gsap.to(".hero__photo", {
      scale: 1.1,
      ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
    });

    /* Non-linear scroll: denser dwell on each of 6 "pages" */
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.15,
      onUpdate: (self) => {
        const raw = self.progress;
        const n = stages.length;
        const slot = raw * n;
        const i = Math.min(n - 1, Math.floor(slot));
        const local = slot - i;
        /* Ease into each page, hold in the middle of the chapter */
        const held = local < 0.18 ? local / 0.18 * 0.12 : local > 0.82 ? 0.88 + ((local - 0.82) / 0.18) * 0.12 : 0.12 + ((local - 0.18) / 0.64) * 0.76;
        const s = stages[i];
        const nextEnd = i < n - 1 ? stages[i + 1].at : 1;
        target = lerp(s.at, nextEnd, held);
      },
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
