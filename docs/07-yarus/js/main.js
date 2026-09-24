(() => {
  const cakeCopy = [
    { title: "Пустая тарелка", text: "Стол и подставка. С этого кадра начинается фотореалистичная сборка." },
    { title: "Первый корж", text: "Бисквитная основа на месте — несущий ярус торта." },
    { title: "Крем", text: "Прослойка выравнивает поверхность и готовит следующий ярус." },
    { title: "Второй ярус", text: "Средний корж садится на крем — силуэт растёт вверх." },
    { title: "Третий ярус", text: "Верхний этаж собран. Дальше — финальный декор." },
    { title: "Готовый торт", text: "Крем, ягоды и свеча. Сборка завершена." },
  ];

  const houseCopy = [
    { title: "Пустой участок", text: "Площадка до старта. Дальше — фундамент и рост коробки." },
    { title: "Фундамент", text: "Бетонное основание. Без него стены не держатся." },
    { title: "Каркас", text: "Деревянный скелет дома поднимается над фундаментом." },
    { title: "Стены", text: "Коробка закрыта, проёмы под окна уже читаются." },
    { title: "Крыша", text: "Кровля и остекление — дом почти готов." },
    { title: "Сдача", text: "Финальный кадр: жилой дом на том же участке." },
  ];

  function pad(n) {
    return String(n + 1).padStart(2, "0");
  }

  function setTicks(root, index) {
    if (!root) return;
    [...root.children].forEach((li, i) => li.classList.toggle("is-on", i <= index));
  }

  function bindSequence(sectionId, copy, map) {
    const section = document.getElementById(sectionId);
    const stage = section && section.querySelector("[data-sequence]");
    if (!section || !stage) return;

    const frames = [...stage.querySelectorAll(".seq-frame")];
    const n = frames.length;
    if (!n) return;

    const apply = (progress) => {
      const max = n - 1;
      const f = Math.max(0, Math.min(max, progress * max));
      const i0 = Math.floor(f);
      const i1 = Math.min(max, i0 + 1);
      const t = f - i0;

      frames.forEach((img, i) => {
        let opacity = 0;
        if (i === i0) opacity = 1 - t;
        if (i === i1) opacity = t;
        if (i0 === i1 && i === i0) opacity = 1;
        img.style.opacity = String(opacity);
        img.classList.toggle("is-active", opacity > 0.05);
      });

      const idx = Math.round(f);
      if (map.num) map.num.textContent = pad(idx);
      if (map.bar) map.bar.style.width = `${progress * 100}%`;
      if (map.title) map.title.textContent = copy[idx].title;
      if (map.text) map.text.textContent = copy[idx].text;
      setTicks(map.ticks, idx);
    };

    apply(0);

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      apply(1);
      return;
    }

    const state = { p: 0 };
    gsap.to(state, {
      p: 1,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => apply(self.progress),
      },
    });
  }

  function init() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
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

      if (!reduce) {
        gsap.to("[data-scroll-hint]", {
          autoAlpha: 0,
          scrollTrigger: { trigger: "#hero", start: "top top", end: "+=120", scrub: true },
        });
        gsap.to(".hero__photo", {
          scale: 1.08,
          ease: "none",
          scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
        });
      }
    }

    if (reduce) {
      document.querySelectorAll("[data-sequence]").forEach((stage) => {
        const frames = stage.querySelectorAll(".seq-frame");
        frames.forEach((img, i) => {
          img.style.opacity = i === frames.length - 1 ? "1" : "0";
        });
      });
      return;
    }

    bindSequence("cake", cakeCopy, {
      num: document.querySelector("[data-cake-num]"),
      title: document.querySelector("[data-cake-title]"),
      text: document.querySelector("[data-cake-text]"),
      ticks: document.querySelector("[data-cake-ticks]"),
      bar: document.querySelector("[data-cake-bar]"),
    });

    bindSequence("house", houseCopy, {
      num: document.querySelector("[data-house-num]"),
      title: document.querySelector("[data-house-title]"),
      text: document.querySelector("[data-house-text]"),
      ticks: document.querySelector("[data-house-ticks]"),
      bar: document.querySelector("[data-house-bar]"),
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
