(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const cakeCaptions = [
    "Стол ждёт основание…",
    "Нижний ярус встаёт на подставку.",
    "Кладём прослойку крема.",
    "Средний ярус — баланс формы.",
    "Верх замыкает силуэт.",
    "Ягоды, свеча — готово.",
  ];

  const houseCaptions = [
    "Разметка участка…",
    "Лента фундамента.",
    "Растут стены.",
    "Окна и дверь.",
    "Крыша и дым из трубы.",
    "Двор, дерево, свет — дом живёт.",
  ];

  function setSteps(list, index) {
    if (!list) return;
    [...list.children].forEach((li, i) => {
      li.classList.toggle("is-on", i <= index);
    });
  }

  function showAssembled() {
    gsap.set(".cake-part, .house-part", { clearProps: "all", opacity: 1, y: 0, x: 0, scale: 1, rotation: 0 });
    document.querySelectorAll("[data-cake-caption], [data-house-caption]").forEach((el, i) => {
      el.textContent = i === 0 ? cakeCaptions.at(-1) : houseCaptions.at(-1);
    });
    setSteps(document.querySelector("[data-cake-steps]"), 5);
    setSteps(document.querySelector("[data-house-steps]"), 5);
  }

  if (reduce || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    showAssembled();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.to("[data-scroll-hint]", {
    opacity: 0,
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "+=120",
      scrub: true,
    },
  });

  const cakeParts = [
    { sel: '[data-part="plate"]', from: { y: 40, opacity: 0 }, caption: 0 },
    { sel: '[data-part="tier1"]', from: { y: -120, opacity: 0, scale: 0.85 }, caption: 1 },
    { sel: '[data-part="cream1"]', from: { y: -40, opacity: 0, scaleX: 0.7 }, caption: 2 },
    { sel: '[data-part="tier2"]', from: { y: -140, opacity: 0, scale: 0.8 }, caption: 3 },
    { sel: '[data-part="cream2"]', from: { y: -36, opacity: 0 }, caption: 3 },
    { sel: '[data-part="tier3"]', from: { y: -160, opacity: 0, scale: 0.75 }, caption: 4 },
    { sel: '[data-part="topping"]', from: { y: -80, opacity: 0, scale: 0.6 }, caption: 5 },
  ];

  const cakeCaption = document.querySelector("[data-cake-caption]");
  const cakeSteps = document.querySelector("[data-cake-steps]");

  const cakeTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#cake",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.65,
      onUpdate: (self) => {
        const idx = Math.min(5, Math.floor(self.progress * 6));
        if (cakeCaption) cakeCaption.textContent = cakeCaptions[idx];
        setSteps(cakeSteps, idx);
      },
    },
  });

  cakeParts.forEach((part, i) => {
    gsap.set(part.sel, part.from);
    cakeTl.to(
      part.sel,
      {
        y: 0,
        x: 0,
        opacity: 1,
        scale: 1,
        scaleX: 1,
        duration: 1,
        ease: "power2.out",
      },
      i * 0.55
    );
  });

  cakeTl.to(
    ".flame, .flame-core",
    {
      scaleY: 1.15,
      transformOrigin: "50% 100%",
      yoyo: true,
      repeat: 1,
      duration: 0.4,
      ease: "sine.inOut",
    },
    "-=0.2"
  );

  const houseParts = [
    { sel: '.scene--house [data-part="sky"]', from: { opacity: 0 } },
    { sel: '.scene--house [data-part="ground"]', from: { y: 50, opacity: 0 } },
    { sel: '.scene--house [data-part="foundation"]', from: { y: 30, opacity: 0, scaleX: 0.4 } },
    { sel: '.scene--house [data-part="walls"]', from: { y: 80, opacity: 0, scaleY: 0.2 }, origin: "50% 100%" },
    { sel: '.scene--house [data-part="openings"]', from: { opacity: 0, scale: 0.7 } },
    { sel: '.scene--house [data-part="roof"]', from: { y: -90, opacity: 0, rotation: 1.1 } },
    { sel: '.scene--house [data-part="life"]', from: { opacity: 0, y: 20 } },
  ];

  const houseCaption = document.querySelector("[data-house-caption]");
  const houseSteps = document.querySelector("[data-house-steps]");

  const houseTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#house",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.7,
      onUpdate: (self) => {
        const idx = Math.min(5, Math.floor(self.progress * 6));
        if (houseCaption) houseCaption.textContent = houseCaptions[idx];
        setSteps(houseSteps, idx);
      },
    },
  });

  houseParts.forEach((part, i) => {
    const props = { ...part.from };
    if (part.origin) props.transformOrigin = part.origin;
    gsap.set(part.sel, props);
    houseTl.to(
      part.sel,
      {
        y: 0,
        opacity: 1,
        scale: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 1,
        ease: "power2.out",
      },
      i * 0.5
    );
  });

  houseTl.to(
    ".smoke circle",
    {
      y: -18,
      opacity: 0.15,
      stagger: 0.12,
      duration: 0.8,
      ease: "sine.out",
    },
    "-=0.3"
  );

  gsap.from(".bridge h2, .bridge p", {
    y: 28,
    opacity: 0,
    stagger: 0.12,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".bridge",
      start: "top 75%",
    },
  });
})();
