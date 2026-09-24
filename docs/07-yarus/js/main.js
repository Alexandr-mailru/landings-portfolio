(() => {
  const cakeCopy = [
    { at: 0, title: "Станция готова", text: "Крутите скролл — крем ложится на торт в реальном процессе съёмки. Это не набор фото, а непрерывный таймлапс." },
    { at: 0.18, title: "Выравнивание корпуса", text: "Кондитер ведёт шпатель по вращающемуся торту. Каждый оборот = новый кадр процесса." },
    { at: 0.4, title: "Слой крема", text: "Покрытие нарастает на глазах. Остановите скролл — и торт застынет в середине сборки." },
    { at: 0.62, title: "Декор и финишная линия", text: "Второй ролик: детальная проработка. Так выглядит полноценный food-таймлапс для бренда." },
    { at: 0.85, title: "Готово к подаче", text: "Финальные кадры — продукт собран. Для клиента это аргумент качества сильнее статичного фото." },
  ];

  const houseCopy = [
    { at: 0, title: "Площадка до старта", text: "Дом собирается на глазах: скролл перематывает реальный таймлапс стройки. Остановитесь на любом кадре — конструкция застынет." },
    { at: 0.2, title: "Основание и первые опоры", text: "Появляется несущая конструкция. Это момент, когда заказчик впервые «видит» объём будущего дома." },
    { at: 0.45, title: "Каркас растёт", text: "Стены и перекрытия прибывают кадр за кадром — классический строительный таймлапс под управлением скролла." },
    { at: 0.7, title: "Коробка почти закрыта", text: "Силуэт дома читается целиком. Здесь хорошо ставить CTA на просмотр объекта или бронь." },
    { at: 0.9, title: "Сборка завершена", text: "Финальный кадр таймлапса. Дальше в боевом проекте — ваши сенсоры, даты очереди и форма заявки." },
  ];

  function pickCopy(list, progress) {
    let cur = list[0];
    for (const item of list) {
      if (progress >= item.at) cur = item;
    }
    return cur;
  }

  function setTicks(root, progress) {
    if (!root) return;
    const items = [...root.children];
    const idx = Math.min(items.length - 1, Math.floor(progress * items.length));
    items.forEach((li, i) => li.classList.toggle("is-on", i <= idx));
  }

  function waitMeta(video) {
    return new Promise((resolve) => {
      if (video.readyState >= 1 && video.duration && isFinite(video.duration)) {
        resolve();
        return;
      }
      const done = () => resolve();
      video.addEventListener("loadedmetadata", done, { once: true });
      video.addEventListener("error", done, { once: true });
    });
  }

  function bindSingleScrub({ section, video, pctEl, titleEl, textEl, ticks, bar, copy, endMul = 1 }) {
    const state = { time: 0 };

    const apply = (progress) => {
      const p = Math.max(0, Math.min(1, progress));
      if (video.duration && isFinite(video.duration)) {
        const t = p * video.duration * endMul;
        if (Math.abs(video.currentTime - t) > 0.04) {
          try { video.currentTime = Math.min(video.duration - 0.05, Math.max(0, t)); } catch (_) {}
        }
      }
      if (pctEl) pctEl.textContent = String(Math.round(p * 100));
      if (bar) bar.style.width = `${p * 100}%`;
      const c = pickCopy(copy, p);
      if (titleEl) titleEl.textContent = c.title;
      if (textEl) textEl.textContent = c.text;
      setTicks(ticks, p);
    };

    video.pause();
    video.currentTime = 0;
    apply(0);

    gsap.to(state, {
      time: 1,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.35,
        onUpdate: (self) => apply(self.progress),
      },
    });
  }

  /** Cake: two clips sequenced into one scroll runway (assembly timeline). */
  function bindCakeDual() {
    const section = document.getElementById("cake");
    const v1 = document.querySelector('[data-scrub-video="cake"]');
    const v2 = document.querySelector('[data-scrub-video-b="cake"]');
    if (!section || !v1 || !v2) return;

    const pctEl = document.querySelector("[data-cake-pct]");
    const titleEl = document.querySelector("[data-cake-title]");
    const textEl = document.querySelector("[data-cake-text]");
    const ticks = document.querySelector("[data-cake-ticks]");
    const bar = document.querySelector("[data-cake-bar]");

    v1.classList.add("is-front");
    v1.pause();
    v2.pause();

    const apply = (progress) => {
      const p = Math.max(0, Math.min(1, progress));
      const split = 0.48;

      if (p <= split) {
        const local = p / split;
        v1.classList.add("is-front");
        v2.classList.remove("is-front");
        if (v1.duration) {
          const t = local * Math.max(0.01, v1.duration - 0.05);
          if (Math.abs(v1.currentTime - t) > 0.03) {
            try { v1.currentTime = t; } catch (_) {}
          }
        }
      } else {
        const local = (p - split) / (1 - split);
        v2.classList.add("is-front");
        v1.classList.remove("is-front");
        if (v2.duration) {
          const t = local * Math.max(0.01, v2.duration - 0.05);
          if (Math.abs(v2.currentTime - t) > 0.03) {
            try { v2.currentTime = t; } catch (_) {}
          }
        }
      }

      if (pctEl) pctEl.textContent = String(Math.round(p * 100));
      if (bar) bar.style.width = `${p * 100}%`;
      const c = pickCopy(cakeCopy, p);
      if (titleEl) titleEl.textContent = c.title;
      if (textEl) textEl.textContent = c.text;
      setTicks(ticks, p);
    };

    apply(0);

    const state = { t: 0 };
    gsap.to(state, {
      t: 1,
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

  async function init() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      document.querySelectorAll("video").forEach((v) => {
        v.removeAttribute("autoplay");
        v.controls = true;
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const videos = [...document.querySelectorAll(".scrub__video")];
    await Promise.all(videos.map(waitMeta));

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
      scrollTrigger: { trigger: "#hero", start: "top top", end: "+=140", scrub: true },
    });

    bindCakeDual();

    const houseVideo = document.querySelector('[data-scrub-video="house"]');
    if (houseVideo) {
      bindSingleScrub({
        section: document.getElementById("house"),
        video: houseVideo,
        pctEl: document.querySelector("[data-house-pct]"),
        titleEl: document.querySelector("[data-house-title]"),
        textEl: document.querySelector("[data-house-text]"),
        ticks: document.querySelector("[data-house-ticks]"),
        bar: document.querySelector("[data-house-bar]"),
        copy: houseCopy,
      });
    }

    // Ensure videos don't autoplay audio/path
    videos.forEach((v) => {
      v.pause();
      v.muted = true;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
