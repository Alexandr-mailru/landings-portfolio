(() => {
  const COUNT = 60;

  const copy = [
    { at: 0, title: "Пустой стол", text: "Поворотный диск готов. Дальше появятся коржи, крем, джем и финишная глазурь." },
    { at: 0.1, title: "Первый корж", text: "Основание торта на диске — несущий слой." },
    { at: 0.25, title: "Крем и джем", text: "Начинка ложится ровным слоем между коржами." },
    { at: 0.42, title: "Сборка ярусов", text: "Коржи нарастают вверх — силуэт торта собирается." },
    { at: 0.58, title: "Обтяжка кремом", text: "Бока закрываются белым кремом." },
    { at: 0.75, title: "Глазурь", text: "Шоколадные подтёки фиксируют финиш." },
    { at: 0.9, title: "Готово", text: "Инжир и розмарин. Сборка завершена." },
  ];

  const pad = (n) => String(n).padStart(2, "0");
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
    if (canvas._cssW !== w || canvas._cssH !== h) {
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas._cssW = w;
      canvas._cssH = h;
    }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h };
  }

  function coverDraw(ctx, img, w, h, zoom = 1) {
    if (!img || !img.naturalWidth) return;
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight) * zoom;
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  }

  /** Blend only neighbouring frames of the same shot → butter-smooth scrub. */
  function drawBlended(canvas, images, frameFloat, progress) {
    const { ctx, w, h } = fitCanvas(canvas);
    const max = images.length - 1;
    const f = clamp(frameFloat, 0, max);
    const i0 = Math.floor(f);
    const i1 = Math.min(max, i0 + 1);
    const t = f - i0;
    const zoom = 1.02 + progress * 0.03;

    ctx.fillStyle = "#0a0c0b";
    ctx.fillRect(0, 0, w, h);

    coverDraw(ctx, images[i0], w, h, zoom);
    if (t > 0.001 && images[i1]) {
      ctx.globalAlpha = t;
      coverDraw(ctx, images[i1], w, h, zoom);
      ctx.globalAlpha = 1;
    }

    // soft vignette for polish
    const g = ctx.createRadialGradient(w * 0.5, h * 0.45, h * 0.2, w * 0.5, h * 0.5, h * 0.78);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.28)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
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

    let target = 0;
    let current = 0;
    let lastCopyKey = "";
    let raf = 0;

    const updateCopy = (p) => {
      const rounded = Math.round(p * (COUNT - 1)) + 1;
      if (num) num.textContent = pad(rounded);
      if (bar) bar.style.width = `${p * 100}%`;
      const c = pick(copy, p);
      const key = c.title;
      if (key !== lastCopyKey) {
        lastCopyKey = key;
        if (title) {
          title.style.opacity = "0";
          title.style.transform = "translateY(6px)";
          requestAnimationFrame(() => {
            title.textContent = c.title;
            text && (text.textContent = c.text);
            title.style.opacity = "1";
            title.style.transform = "translateY(0)";
          });
        } else if (text) {
          text.textContent = c.text;
        }
      }
      setTicks(ticks, p);
    };

    const tick = () => {
      // exponential smooth chase — liquid scrub without losing reverse
      current = lerp(current, target, 0.14);
      if (Math.abs(current - target) < 0.00015) current = target;
      const frameFloat = current * (COUNT - 1);
      drawBlended(canvas, images, frameFloat, current);
      updateCopy(current);
      raf = requestAnimationFrame(tick);
    };

    const setProgress = (p) => {
      target = clamp(p);
    };

    setProgress(0);
    drawBlended(canvas, images, 0, 0);
    updateCopy(0);
    raf = requestAnimationFrame(tick);

    window.addEventListener("resize", () => {
      drawBlended(canvas, images, current * (COUNT - 1), current);
    });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      setProgress(1);
      current = 1;
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
      scale: 1.08,
      ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
    });

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.85,
      onUpdate: (self) => setProgress(self.progress),
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
