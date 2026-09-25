(() => {
  const COUNT = 36;

  const copy = [
    { at: 0, title: "Пустой стол", text: "Поворотный диск готов. Дальше появятся коржи, крем, джем и финишная глазурь." },
    { at: 0.12, title: "Первый корж", text: "Основание торта на диске — несущий слой." },
    { at: 0.28, title: "Крем и джем", text: "Начинка ложится ровным слоем между коржами." },
    { at: 0.45, title: "Сборка ярусов", text: "Коржи нарастают вверх — силуэт торта собирается." },
    { at: 0.62, title: "Обтяжка кремом", text: "Бока закрываются белым кремом." },
    { at: 0.78, title: "Глазурь", text: "Шоколадные подтёки фиксируют финиш." },
    { at: 0.92, title: "Готово", text: "Инжир и розмарин. Сборка завершена." },
  ];

  const pad = (n) => String(n).padStart(2, "0");

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

  function loadFrames() {
    const images = [];
    const jobs = [];
    for (let i = 1; i <= COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = `frames/cake/${pad(i)}.jpg`;
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

  function drawFrame(canvas, images, index) {
    const { ctx, w, h } = fitCanvas(canvas);
    const img = images[Math.max(0, Math.min(images.length - 1, index))];
    ctx.fillStyle = "#0c0f0d";
    ctx.fillRect(0, 0, w, h);
    if (!img || !img.naturalWidth) return;
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  }

  async function init() {
    const section = document.getElementById("cake");
    const canvas = document.querySelector('[data-reel="cake"]');
    if (!section || !canvas) return;

    const num = document.querySelector("[data-cake-num]");
    const total = document.querySelector("[data-cake-total]");
    const title = document.querySelector("[data-cake-title]");
    const text = document.querySelector("[data-cake-text]");
    const ticks = document.querySelector("[data-cake-ticks]");
    const bar = document.querySelector("[data-cake-bar]");
    if (total) total.textContent = pad(COUNT);

    const images = await loadFrames();
    let frameIndex = 0;

    const apply = (progress) => {
      const p = Math.max(0, Math.min(1, progress));
      const idx = Math.round(p * (COUNT - 1));
      frameIndex = idx;
      drawFrame(canvas, images, idx);
      if (num) num.textContent = pad(idx + 1);
      if (bar) bar.style.width = `${p * 100}%`;
      const c = pick(copy, p);
      if (title) title.textContent = c.title;
      if (text) text.textContent = c.text;
      setTicks(ticks, p);
    };

    apply(0);
    window.addEventListener("resize", () => drawFrame(canvas, images, frameIndex));

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      apply(1);
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
      scrollTrigger: { trigger: "#hero", start: "top top", end: "+=120", scrub: true },
    });

    const state = { p: 0 };
    gsap.to(state, {
      p: 1,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        onUpdate: (self) => apply(self.progress),
      },
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
