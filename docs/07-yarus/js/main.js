(() => {
  const cakeSteps = [
    {
      title: "Подготовка станции",
      text: "Чистый стол, инструменты и база. С этого кадра начинается любая серия для кондитерского бренда или сети кафе.",
    },
    {
      title: "Коржи на столе",
      text: "Би imediatamente и выпечка уже готовы. Здесь видно фактуру — клиент понимает, из чего собран продукт.",
    },
    {
      title: "Сборка ярусов",
      text: "Нижний ярус задаёт опору. Каждый следующий слой читается как этап производства, а не как «магия».",
    },
    {
      title: "Крем и выравнивание",
      text: "Гладкая поверхность = контроль качества. Сильный кадр для премиальных desserts и private label.",
    },
    {
      title: "Декор и финиш",
      text: "Детали крупным планом: ягоды, шоколад, рисунок. Здесь закрывается эмоция покупки.",
    },
    {
      title: "Подача гостю",
      text: "Готовый торт в сервировке. Финальный кадр можно заменить на ваш флагманский SKU.",
    },
  ];

  const houseSteps = [
    {
      title: "Участок до старта",
      text: "Пустой холст проекта. Здесь заказчик понимает масштаб ещё до котлована — сильный первый кадр для лендинга ЖК или подрядчика.",
    },
    {
      title: "Котлован и основание",
      text: "Земляные работы и фундамент. Показываем, что стройка уже идёт — без перегруза чертежами.",
    },
    {
      title: "Каркас и инженерия",
      text: "Несущий скелет дома. Для B2B это аргумент компетентности быстрее, чем таблица сроков.",
    },
    {
      title: "Коробка здания",
      text: "Стены и объём. Клиент впервые «узнаёт» будущий объект в реальном масштабе.",
    },
    {
      title: "Фасад и кровля",
      text: "Внешний контур почти готов. Здесь хорошо работают до/после и сравнение очередей корпусов.",
    },
    {
      title: "Дом сдан",
      text: "Жилой кадр с архитектурой и светом. Точка конверсии: заявка на просмотр или бронь.",
    },
  ];

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function applyStep(sectionRoot, steps, index, opts) {
    const frames = sectionRoot.querySelectorAll(".frame");
    frames.forEach((frame, i) => {
      frame.classList.toggle("is-active", i === index);
    });

    const step = steps[index];
    if (opts.title) opts.title.textContent = step.title;
    if (opts.text) opts.text.textContent = step.text;
    if (opts.num) opts.num.textContent = pad(index + 1);

    if (opts.rail) {
      [...opts.rail.children].forEach((li, i) => {
        li.classList.toggle("is-on", i <= index);
      });
    }
  }

  function bindRunway(sectionId, steps, map) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const state = { frame: 0 };
    applyStep(section, steps, 0, map);

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      applyStep(section, steps, steps.length - 1, map);
      return;
    }

    gsap.to(state, {
      frame: steps.length - 1,
      ease: "none",
      snap: "frame",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.55,
      },
      onUpdate: () => {
        applyStep(section, steps, Math.round(state.frame), map);
      },
    });
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    const cake = document.getElementById("cake");
    const house = document.getElementById("house");
    if (cake) {
      applyStep(cake, cakeSteps, cakeSteps.length - 1, {
        title: document.querySelector("[data-cake-title]"),
        text: document.querySelector("[data-cake-text]"),
        num: document.querySelector("[data-cake-num]"),
        rail: document.querySelector("[data-cake-rail]"),
      });
    }
    if (house) {
      applyStep(house, houseSteps, houseSteps.length - 1, {
        title: document.querySelector("[data-house-title]"),
        text: document.querySelector("[data-house-text]"),
        num: document.querySelector("[data-house-num]"),
        rail: document.querySelector("[data-house-rail]"),
      });
    }
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
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "+=160",
        scrub: true,
      },
    });

    gsap.to(".hero__photo", {
      scale: 1.12,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  bindRunway("cake", cakeSteps, {
    title: document.querySelector("[data-cake-title]"),
    text: document.querySelector("[data-cake-text]"),
    num: document.querySelector("[data-cake-num]"),
    rail: document.querySelector("[data-cake-rail]"),
  });

  bindRunway("house", houseSteps, {
    title: document.querySelector("[data-house-title]"),
    text: document.querySelector("[data-house-text]"),
    num: document.querySelector("[data-house-num]"),
    rail: document.querySelector("[data-house-rail]"),
  });
})();
