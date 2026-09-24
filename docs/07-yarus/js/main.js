(() => {
  const CAKE_COUNT = 24;
  const HOUSE_COUNT = 24;

  const cakeCopy = [
    { at: 0, title: "Старт съёмки", text: "Тот же стол и ракурс. Листайте — крем ложится кадр за кадром." },
    { at: 0.2, title: "Нанесение крема", text: "Кондитер ведёт массу по корпусу. Камера не меняется." },
    { at: 0.45, title: "Выравнивание", text: "Поверхность становится ровной — этап за этапом в одном кадре." },
    { at: 0.7, title: "Финальный декор", text: "Детали проявляются ближе к концу таймлапса." },
    { at: 0.9, title: "Готово", text: "Последний кадр серии. Сборка без наслоения других фото." },
  ];

  const houseCopy = [
    { at: 0, title: "Площадка", text: "Реальный таймлапс сборки. Скролл перематывает только этот ролик." },
    { at: 0.2, title: "Основание", text: "Появляется нижний контур дома — всё с одной точки съёмки." },
    { at: 0.4, title: "Каркас растёт", text: "Стойки и перекрытия прибывают в кадре." },
    { at: 0.65, title: "Коробка", text: "Стены закрываются. Ракурс прежний." },
    { at: 0.88, title: "Собран", text: "Финальные кадры prefab-дома." },
  ];

  function pad(n) {
    return String(n).padStart(2, "0");
  }

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

  function loadReel(folder, count) {
    const images = [];
    const jobs = [];
    for (let i = 1; i <= count; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = `frames/${folder}/${pad(i)}.jpg`;
      images.push(img);
      jobs.push(
        img.decode
          ? img.decode().catch(() => {})
          : new Promise((res) => {
              img.onload = res;
              img.onerror = res;
            })
      );
    }
    return Promise.all(jobs).then(() => images);
  }

  function fitCanvas(canvas) {
    const parent = canvas.parentElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = parent.getBoundingClientRect();
    const w = Math.max(320, Math.floor(rect.width));
    const h = Math.max(240, Math.floor(rect.height));
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h };
  }

  /** Draw exactly one frame — no blending/layering. */
  function drawFrame(canvas, images, index) {
    const { ctx, w, h } = fitCanvas(canvas);
    const img = images[Math.max(0, Math.min(images.length - 1, index))];
    if (!img || !img.naturalWidth) {
      ctx.fillStyle = "#0c0f0d";
      ctx.fillRect(0, 0, w, h);
      return;
    }
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;
    ctx.fillStyle = "#0c0f0d";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function bindReel({ sectionId, folder, count, copy, numSel, totalSel, titleSel, textSel, ticksSel, barSel }) {
    const section = document.getElementById(sectionId);
    const canvas = section && section.querySelector("canvas[data-reel]");
    if (!section || !canvas) return Promise.resolve();

    const num = document.querySelector(numSel);
    const total = document.querySelector(totalSel);
    const title = document.querySelector(titleSel);
    const text = document.querySelector(textSel);
    const ticks = document.querySelector(ticksSel);
    const bar = document.querySelector(barSel);
    if (total) total.textContent = pad(count);

    let frameIndex = 0;

    return loadReel(folder, count).then((images) => {
      const apply = (progress) => {
        const p = Math.max(0, Math.min(1, progress));
        const idx = Math.round(p * (count - 1));
        if (idx !== frameIndex || true) {
          frameIndex = idx;
          drawFrame(canvas, images, idx);
        }
        if (num) num.textContent = pad(idx + 1);
        if (bar) bar.style.width = `${p * 100}%`;
        const c = pick(copy, p);
        if (title) title.textContent = c.title;
        if (text) text.textContent = c.text;
        setTicks(ticks, p);
      };

      apply(0);
      window.addEventListener("resize", () => drawFrame(canvas, images, frameIndex));

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
          scrub: 0.35,
          onUpdate: (self) => apply(self.progress),
        },
      });
    });
  }

  async function init() {
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
      }
    }

    if (reduce) {
      await Promise.all([
        loadReel("cake", CAKE_COUNT).then((imgs) => {
          const c = document.querySelector('[data-reel="cake"]');
          if (c) drawFrame(c, imgs, CAKE_COUNT - 1);
        }),
        loadReel("house", HOUSE_COUNT).then((imgs) => {
          const c = document.querySelector('[data-reel="house"]');
          if (c) drawFrame(c, imgs, HOUSE_COUNT - 1);
        }),
      ]);
      return;
    }

    await Promise.all([
      bindReel({
        sectionId: "cake",
        folder: "cake",
        count: CAKE_COUNT,
        copy: cakeCopy,
        numSel: "[data-cake-num]",
        totalSel: "[data-cake-total]",
        titleSel: "[data-cake-title]",
        textSel: "[data-cake-text]",
        ticksSel: "[data-cake-ticks]",
        barSel: "[data-cake-bar]",
      }),
      bindReel({
        sectionId: "house",
        folder: "house",
        count: HOUSE_COUNT,
        copy: houseCopy,
        numSel: "[data-house-num]",
        totalSel: "[data-house-total]",
        titleSel: "[data-house-title]",
        textSel: "[data-house-text]",
        ticksSel: "[data-house-ticks]",
        barSel: "[data-house-bar]",
      }),
    ]);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
