(() => {
  const stages = [
    {
      id: "stol",
      at: 0,
      end: 0.14,
      index: "01",
      title: "Стол",
      kicker: "Основа сцены",
      text: "Пустой поворотный диск. Здесь начинается любая кондитерская сборка — чистая сцена без декора.",
      detail: "Металл · студийный свет · нулевая высота",
      badge: "01 · Стол",
      seek: 0,
    },
    {
      id: "korzhi",
      at: 0.14,
      end: 0.3,
      index: "02",
      title: "Коржи",
      kicker: "Несущая конструкция",
      text: "Бисквитные диски задают высоту и текстуру. Без ровных коржей ярус не держит форму.",
      detail: "Бисквит · пористость · геометрия круга",
      badge: "02 · Коржи",
      seek: 0.14,
    },
    {
      id: "nachinka",
      at: 0.3,
      end: 0.48,
      index: "03",
      title: "Начинка",
      kicker: "Вкус между слоями",
      text: "Крем и джем заполняют пространство между коржами — то, чего не видно снаружи, но ради чего берут торт.",
      detail: "Крем · ягодный джем · равномерный слой",
      badge: "03 · Начинка",
      seek: 0.3,
    },
    {
      id: "krem",
      at: 0.48,
      end: 0.66,
      index: "04",
      title: "Крем",
      kicker: "Обтяжка и силуэт",
      text: "Бока закрываются белым кремом. Появляется чистый цилиндр — холст под глазурь.",
      detail: "Обтяжка · шпатель · ровный край",
      badge: "04 · Крем",
      seek: 0.48,
    },
    {
      id: "glazur",
      at: 0.66,
      end: 0.84,
      index: "05",
      title: "Глазурь",
      kicker: "Драматургия финиша",
      text: "Шоколад стекает подтёками. Это момент «вау» — контраст белого крема и тёмного глянца.",
      detail: "Ганаш · подтёки · глянец",
      badge: "05 · Глазурь",
      seek: 0.66,
    },
    {
      id: "gotovo",
      at: 0.84,
      end: 1,
      index: "06",
      title: "Готово",
      kicker: "Подача",
      text: "Инжир и розмарин закрывают композицию. Торт собран — точка, где хочется заказать такой же.",
      detail: "Инжир · розмарин · финальный кадр",
      badge: "06 · Готово",
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

    const title = document.querySelector("[data-cake-title]");
    const text = document.querySelector("[data-cake-text]");
    const detail = document.querySelector("[data-stage-detail]");
    const kicker = document.querySelector("[data-stage-kicker]");
    const indexEl = document.querySelector("[data-stage-index]");
    const badge = document.querySelector("[data-stage-badge]");
    const bar = document.querySelector("[data-cake-bar]");
    const chapters = [...document.querySelectorAll("[data-chapters] button")];
    const segments = document.querySelector("[data-segments]");

    if (segments) {
      segments.innerHTML = stages.map(() => "<span></span>").join("");
    }

    video.pause();
    video.muted = true;
    video.playsInline = true;
    try { video.load(); } catch (_) {}
    await waitMeta(video);
    const duration = Math.max(0.01, video.duration || 1);

    let target = 0;
    let current = 0;
    let lastId = "";
    let lastSet = -1;

    const applyStageUi = (p) => {
      const s = stageAt(p);
      document.body.dataset.stage = s.id;
      if (bar) bar.style.width = `${p * 100}%`;

      chapters.forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.id === s.id);
      });

      if (s.id === lastId) return;
      lastId = s.id;

      const swap = (el, value) => {
        if (!el) return;
        el.style.opacity = "0";
        el.style.transform = "translateY(8px)";
        requestAnimationFrame(() => {
          el.textContent = value;
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        });
      };

      swap(title, s.title);
      if (text) {
        text.style.opacity = "0";
        requestAnimationFrame(() => {
          text.textContent = s.text;
          text.style.opacity = "1";
        });
      }
      if (detail) detail.textContent = s.detail;
      if (kicker) kicker.textContent = s.kicker;
      if (indexEl) indexEl.textContent = s.index;
      if (badge) badge.textContent = s.badge;
    };

    const applyTime = (p) => {
      const t = clamp(p) * Math.max(0, duration - 0.05);
      if (Math.abs(t - lastSet) < 0.008) return;
      lastSet = t;
      try { video.currentTime = t; } catch (_) {}
    };

    const tick = () => {
      current = lerp(current, target, 0.26);
      if (Math.abs(current - target) < 0.00005) current = target;
      applyTime(current);
      applyStageUi(current);
      requestAnimationFrame(tick);
    };

    video.currentTime = 0;
    applyStageUi(0);
    requestAnimationFrame(tick);

    chapters.forEach((btn) => {
      btn.addEventListener("click", () => {
        const seek = Number(btn.dataset.seek || 0);
        target = clamp(seek);
        current = lerp(current, target, 0.55);
      });
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
      scale: 1.08,
      ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
    });

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.05,
      onUpdate: (self) => {
        target = self.progress;
      },
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
