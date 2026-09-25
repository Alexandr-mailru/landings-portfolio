(() => {
  const copy = [
    { at: 0, title: "Пустой стол", text: "Поворотный диск готов. Листайте — торт соберётся как в видео." },
    { at: 0.1, title: "Первый корж", text: "Основание торта на диске — несущий слой." },
    { at: 0.25, title: "Крем и джем", text: "Начинка ложится ровным слоем между коржами." },
    { at: 0.42, title: "Сборка ярусов", text: "Коржи нарастают вверх — силуэт торта собирается." },
    { at: 0.58, title: "Обтяжка кремом", text: "Бока закрываются белым кремом." },
    { at: 0.75, title: "Глазурь", text: "Шоколадные подтёки фиксируют финиш." },
    { at: 0.9, title: "Готово", text: "Инжир и розмарин. Сборка завершена." },
  ];

  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  function pick(list, p) {
    let cur = list[0];
    for (const item of list) if (p >= item.at) cur = item;
    return cur;
  }

  function setTicks(el, p) {
    if (!el) return;
    const items = [...el.children];
    const idx = Math.min(items.length - 1, Math.floor(p * items.length));
    items.forEach((li, i) => li.classList.toggle("is-on", i <= idx));
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

    const timeEl = document.querySelector("[data-cake-time]");
    const title = document.querySelector("[data-cake-title]");
    const text = document.querySelector("[data-cake-text]");
    const ticks = document.querySelector("[data-cake-ticks]");
    const bar = document.querySelector("[data-cake-bar]");

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
    let lastCopy = "";
    let lastSet = -1;

    const updateUi = (p) => {
      if (timeEl) timeEl.textContent = (p * duration).toFixed(1);
      if (bar) bar.style.width = `${p * 100}%`;
      const c = pick(copy, p);
      if (c.title !== lastCopy) {
        lastCopy = c.title;
        if (title) {
          title.style.opacity = "0";
          title.style.transform = "translateY(6px)";
          requestAnimationFrame(() => {
            title.textContent = c.title;
            if (text) text.textContent = c.text;
            title.style.opacity = "1";
            title.style.transform = "translateY(0)";
          });
        } else if (text) {
          text.textContent = c.text;
        }
      }
      setTicks(ticks, p);
    };

    const applyTime = (p) => {
      const t = clamp(p) * Math.max(0, duration - 0.05);
      // skip tiny seeks to avoid decoder thrash
      if (Math.abs(t - lastSet) < 0.008) return;
      lastSet = t;
      try {
        video.currentTime = t;
      } catch (_) {}
    };

    // RAF loop: smooth chase — feels like watching / scrubbing a timeline
    const tick = () => {
      current = lerp(current, target, 0.28);
      if (Math.abs(current - target) < 0.00005) current = target;
      applyTime(current);
      updateUi(current);
      requestAnimationFrame(tick);
    };

    video.pause();
    video.currentTime = 0;
    updateUi(0);
    requestAnimationFrame(tick);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      target = 1;
      current = 1;
      applyTime(1);
      updateUi(1);
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

    gsap.to("[data-scroll-hint]", {
      autoAlpha: 0,
      scrollTrigger: { trigger: "#hero", start: "top top", end: "+=160", scrub: true },
    });

    gsap.to(".hero__photo", {
      scale: 1.06,
      ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
    });

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.1,
      onUpdate: (self) => {
        target = self.progress;
      },
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
