(() => {
  const { makeStage, renderCakeFrame, renderHouseFrame, renderHeroIdle, cakeSteps, houseSteps, fitCanvas } =
    window.YarusFrames;

  function pick(steps, p) {
    let cur = steps[0];
    for (const s of steps) if (p >= s.at) cur = s;
    return cur;
  }

  function setTicks(el, p) {
    if (!el) return;
    const items = [...el.children];
    const idx = Math.min(items.length - 1, Math.floor(p * items.length));
    items.forEach((li, i) => li.classList.toggle("is-on", i <= idx));
  }

  function bindStage({ id, canvasSel, renderer, steps, pctSel, titleSel, textSel, ticksSel, barSel }) {
    const section = document.getElementById(id);
    const canvas = document.querySelector(canvasSel);
    if (!section || !canvas) return null;

    const stage = makeStage(canvas, renderer);
    const pct = document.querySelector(pctSel);
    const title = document.querySelector(titleSel);
    const text = document.querySelector(textSel);
    const ticks = document.querySelector(ticksSel);
    const bar = document.querySelector(barSel);

    const apply = (p) => {
      stage.setProgress(p);
      if (pct) pct.textContent = String(Math.round(p * 100));
      if (bar) bar.style.width = `${p * 100}%`;
      const s = pick(steps, p);
      if (title) title.textContent = s.title;
      if (text) text.textContent = s.text;
      setTicks(ticks, p);
    };

    apply(0);

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      apply(1);
      return stage;
    }

    const state = { p: 0 };
    gsap.to(state, {
      p: 1,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.45,
        onUpdate: (self) => apply(self.progress),
      },
    });

    return stage;
  }

  function initHero() {
    const canvas = document.querySelector("[data-hero-canvas]");
    if (!canvas) return;
    let size = fitCanvas(canvas);
    let raf = 0;
    const tick = (t) => {
      size.ctx.clearRect(0, 0, size.w, size.h);
      renderHeroIdle(size.ctx, size.w, size.h, t);
      // overlay soft house whisper
      size.ctx.save();
      size.ctx.globalAlpha = 0.22;
      renderHouseFrame(size.ctx, size.w, size.h, 0.7 + Math.sin(t * 0.00035) * 0.15);
      size.ctx.restore();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", () => {
      size = fitCanvas(canvas);
    });
    return () => cancelAnimationFrame(raf);
  }

  function init() {
    initHero();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const cake = document.querySelector('[data-canvas="cake"]');
      const house = document.querySelector('[data-canvas="house"]');
      if (cake) makeStage(cake, renderCakeFrame).setProgress(1);
      if (house) makeStage(house, renderHouseFrame).setProgress(1);
      return;
    }

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

      gsap.to("[data-scroll-hint]", {
        autoAlpha: 0,
        scrollTrigger: { trigger: "#hero", start: "top top", end: "+=120", scrub: true },
      });
    }

    bindStage({
      id: "cake",
      canvasSel: '[data-canvas="cake"]',
      renderer: renderCakeFrame,
      steps: cakeSteps,
      pctSel: "[data-cake-pct]",
      titleSel: "[data-cake-title]",
      textSel: "[data-cake-text]",
      ticksSel: "[data-cake-ticks]",
      barSel: "[data-cake-bar]",
    });

    bindStage({
      id: "house",
      canvasSel: '[data-canvas="house"]',
      renderer: renderHouseFrame,
      steps: houseSteps,
      pctSel: "[data-house-pct]",
      titleSel: "[data-house-title]",
      textSel: "[data-house-text]",
      ticksSel: "[data-house-ticks]",
      barSel: "[data-house-bar]",
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
