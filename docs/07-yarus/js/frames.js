/* Generated frame engine: cake + house timelines */
(function (global) {
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => t * t * (3 - 2 * t);
  const seg = (p, a, b) => clamp((p - a) / (b - a));

  function roundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function ellipse(ctx, x, y, rx, ry, fill) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
  }

  /** Soft studio background for cake */
  function paintCakeBackdrop(ctx, w, h) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#f3efe6");
    g.addColorStop(0.55, "#e8e2d6");
    g.addColorStop(1, "#d9d2c4");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const spot = ctx.createRadialGradient(w * 0.55, h * 0.25, 20, w * 0.5, h * 0.35, w * 0.55);
    spot.addColorStop(0, "rgba(255,255,255,0.55)");
    spot.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = spot;
    ctx.fillRect(0, 0, w, h);

    // table surface
    const tableY = h * 0.78;
    const tg = ctx.createLinearGradient(0, tableY, 0, h);
    tg.addColorStop(0, "#cbb9a0");
    tg.addColorStop(1, "#a89278");
    ctx.fillStyle = tg;
    ctx.fillRect(0, tableY, w, h - tableY);
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(0, tableY, w, 6);
  }

  function drawCakeTier(ctx, cx, top, width, height, spongeTop, spongeBot, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    const x = cx - width / 2;

    // side
    const side = ctx.createLinearGradient(x, top, x + width, top);
    side.addColorStop(0, spongeBot);
    side.addColorStop(0.45, spongeTop);
    side.addColorStop(1, spongeBot);
    roundRect(ctx, x, top, width, height, 14);
    ctx.fillStyle = side;
    ctx.fill();

    // top ellipse
    ellipse(ctx, cx, top + 4, width / 2 - 2, Math.max(8, height * 0.16), spongeTop);

    // soft shade under top
    ctx.globalAlpha = alpha * 0.22;
    ellipse(ctx, cx, top + height * 0.22, width / 2 - 6, 8, "#8a5a28");
    ctx.restore();
  }

  function drawCream(ctx, cx, y, width, alpha, drip = 0) {
    ctx.save();
    ctx.globalAlpha = alpha;
    const x = cx - width / 2;
    const g = ctx.createLinearGradient(0, y - 18, 0, y + 22);
    g.addColorStop(0, "#fffaf2");
    g.addColorStop(1, "#f0dcc4");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x + 8, y);
    for (let i = 0; i <= 8; i++) {
      const px = x + (width * i) / 8;
      const py = y - 10 - Math.sin(i * 1.1) * 7 - (i % 2) * drip * 6;
      ctx.lineTo(px, py);
    }
    ctx.lineTo(x + width - 8, y + 8);
    ctx.lineTo(x + 8, y + 8);
    ctx.closePath();
    ctx.fill();

    if (drip > 0.2) {
      for (let i = 0; i < 5; i++) {
        const dx = x + width * (0.18 + i * 0.16);
        const len = 10 + drip * 18 * (0.5 + (i % 3) * 0.2);
        ellipse(ctx, dx, y + 6 + len * 0.35, 5, len * 0.45, "#f7e6d2");
      }
    }
    ctx.restore();
  }

  function renderCakeFrame(ctx, w, h, p) {
    paintCakeBackdrop(ctx, w, h);
    const cx = w * 0.52;
    const baseY = h * 0.74;

    // shadow
    const sh = ease(seg(p, 0.02, 0.2));
    ctx.save();
    ctx.globalAlpha = 0.18 * sh;
    ellipse(ctx, cx, baseY + 18, 150 * sh + 20, 18, "#2a241c");
    ctx.restore();

    // plate
    const plate = ease(seg(p, 0.0, 0.12));
    if (plate > 0) {
      ctx.save();
      ctx.globalAlpha = plate;
      ctx.translate(0, (1 - plate) * 30);
      ellipse(ctx, cx, baseY + 8, 170, 22, "#d9dde0");
      ellipse(ctx, cx, baseY, 158, 16, "#f4f6f7");
      ellipse(ctx, cx, baseY - 2, 120, 8, "rgba(255,255,255,0.65)");
      ctx.restore();
    }

    const t1 = ease(seg(p, 0.1, 0.28));
    const c1 = ease(seg(p, 0.24, 0.4));
    const t2 = ease(seg(p, 0.36, 0.54));
    const c2 = ease(seg(p, 0.5, 0.64));
    const t3 = ease(seg(p, 0.6, 0.76));
    const top = ease(seg(p, 0.74, 0.92));

    if (t1 > 0) {
      ctx.save();
      ctx.translate(0, (1 - t1) * -90);
      drawCakeTier(ctx, cx, baseY - 78, 250, 78, "#f0c56b", "#c8883a", t1);
      ctx.restore();
    }
    if (c1 > 0) drawCream(ctx, cx, baseY - 78, 248, c1, c1);

    if (t2 > 0) {
      ctx.save();
      ctx.translate(0, (1 - t2) * -100);
      drawCakeTier(ctx, cx, baseY - 148, 190, 68, "#f2cb78", "#d09245", t2);
      ctx.restore();
    }
    if (c2 > 0) drawCream(ctx, cx, baseY - 148, 188, c2, c2 * 0.8);

    if (t3 > 0) {
      ctx.save();
      ctx.translate(0, (1 - t3) * -110);
      drawCakeTier(ctx, cx, baseY - 208, 130, 58, "#f5d28a", "#d9a04e", t3);
      ctx.restore();
    }

    if (top > 0) {
      ctx.save();
      ctx.globalAlpha = top;
      // berries
      const berries = [
        [-28, -8, 11],
        [0, -16, 13],
        [30, -6, 10],
        [-12, 6, 8],
        [16, 8, 9],
      ];
      berries.forEach(([dx, dy, r], i) => {
        const a = ease(seg(p, 0.76 + i * 0.02, 0.88 + i * 0.02));
        ctx.globalAlpha = top * a;
        const by = baseY - 214 + dy + (1 - a) * -40;
        const g = ctx.createRadialGradient(cx + dx - 3, by - 3, 2, cx + dx, by, r);
        g.addColorStop(0, "#ff7a6e");
        g.addColorStop(1, "#a3212c");
        ellipse(ctx, cx + dx, by, r, r * 0.9, g);
      });

      // leaf
      ctx.globalAlpha = top;
      ctx.fillStyle = "#3f7a48";
      ctx.beginPath();
      ctx.ellipse(cx + 4, baseY - 236, 7, 16, -0.4, 0, Math.PI * 2);
      ctx.fill();

      // candle
      const candle = ease(seg(p, 0.86, 0.98));
      if (candle > 0) {
        ctx.globalAlpha = candle;
        roundRect(ctx, cx - 5, baseY - 268, 10, 42, 3);
        ctx.fillStyle = "#f7f1e4";
        ctx.fill();
        ctx.fillStyle = "rgba(232, 197, 71, 0.55)";
        roundRect(ctx, cx - 3, baseY - 268, 6, 42, 2);
        ctx.fill();

        const flicker = 0.85 + Math.sin(p * 40) * 0.08;
        ctx.globalAlpha = candle * flicker;
        ellipse(ctx, cx, baseY - 278, 6, 11, "#ffb347");
        ellipse(ctx, cx, baseY - 276, 2.5, 5, "#fff3c8");
      }
      ctx.restore();
    }

    // fine grain
    ctx.save();
    ctx.globalAlpha = 0.035;
    for (let i = 0; i < 80; i++) {
      ctx.fillStyle = i % 2 ? "#fff" : "#000";
      ctx.fillRect((i * 97) % w, (i * 53) % h, 2, 2);
    }
    ctx.restore();
  }

  function paintHouseSky(ctx, w, h, p) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, lerpColor("#9eb6c8", "#b7c9d8", ease(seg(p, 0, 0.3))));
    g.addColorStop(1, "#e6ece7");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const sun = ease(seg(p, 0.75, 1));
    if (sun > 0) {
      ctx.save();
      ctx.globalAlpha = 0.75 * sun;
      ellipse(ctx, w * 0.82, h * 0.2, 28, 28, "#f0c35a");
      ctx.globalAlpha = 0.2 * sun;
      ellipse(ctx, w * 0.82, h * 0.2, 55, 55, "#f0c35a");
      ctx.restore();
    }
  }

  function lerpColor(a, b, t) {
    const pa = parseInt(a.slice(1), 16);
    const pb = parseInt(b.slice(1), 16);
    const ar = (pa >> 16) & 255, ag = (pa >> 8) & 255, ab = pa & 255;
    const br = (pb >> 16) & 255, bg = (pb >> 8) & 255, bb = pb & 255;
    const r = Math.round(lerp(ar, br, t));
    const g = Math.round(lerp(ag, bg, t));
    const bl = Math.round(lerp(ab, bb, t));
    return `rgb(${r},${g},${bl})`;
  }

  function renderHouseFrame(ctx, w, h, p) {
    paintHouseSky(ctx, w, h, p);

    const ground = ease(seg(p, 0.0, 0.14));
    const gy = h * 0.72;
    if (ground > 0) {
      ctx.save();
      ctx.globalAlpha = ground;
      ctx.translate(0, (1 - ground) * 40);
      const gg = ctx.createLinearGradient(0, gy, 0, h);
      gg.addColorStop(0, "#7f946c");
      gg.addColorStop(1, "#5f7352");
      ctx.fillStyle = gg;
      ctx.fillRect(0, gy, w, h - gy);
      ctx.fillStyle = "#93a87e";
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.quadraticCurveTo(w * 0.3, gy - 18, w * 0.55, gy - 6);
      ctx.quadraticCurveTo(w * 0.8, gy + 10, w, gy - 8);
      ctx.lineTo(w, gy + 30);
      ctx.lineTo(0, gy + 30);
      ctx.fill();
      ctx.restore();
    }

    const cx = w * 0.5;
    const houseW = 280;
    const left = cx - houseW / 2;

    const foundation = ease(seg(p, 0.12, 0.28));
    if (foundation > 0) {
      ctx.save();
      ctx.globalAlpha = foundation;
      ctx.translate(0, (1 - foundation) * 24);
      roundRect(ctx, left - 8, gy - 28, houseW + 16, 32, 4);
      ctx.fillStyle = "#6a737c";
      ctx.fill();
      ctx.fillStyle = "#8a949e";
      ctx.fillRect(left, gy - 34, houseW, 10);
      ctx.restore();
    }

    const walls = ease(seg(p, 0.26, 0.52));
    const wallH = 150 * walls;
    if (walls > 0.02) {
      ctx.save();
      const brick = ctx.createLinearGradient(left, gy - 28 - wallH, left, gy - 28);
      brick.addColorStop(0, "#d2b08a");
      brick.addColorStop(1, "#9a7352");
      ctx.fillStyle = brick;
      ctx.fillRect(left + 8, gy - 28 - wallH, houseW - 16, wallH);

      ctx.strokeStyle = "rgba(120, 84, 55, 0.35)";
      ctx.lineWidth = 2;
      const rows = Math.floor(wallH / 18);
      for (let r = 1; r <= rows; r++) {
        const yy = gy - 28 - r * 18;
        ctx.beginPath();
        ctx.moveTo(left + 8, yy);
        ctx.lineTo(left + houseW - 8, yy);
        ctx.stroke();
      }
      for (let c = 1; c < 5; c++) {
        const xx = left + 8 + c * ((houseW - 16) / 5);
        ctx.beginPath();
        ctx.moveTo(xx, gy - 28);
        ctx.lineTo(xx, gy - 28 - wallH);
        ctx.stroke();
      }
      ctx.restore();
    }

    const openings = ease(seg(p, 0.48, 0.64));
    if (openings > 0 && walls > 0.7) {
      ctx.save();
      ctx.globalAlpha = openings;
      // door
      roundRect(ctx, cx - 24, gy - 100, 48, 72, 4);
      ctx.fillStyle = "#2a353c";
      ctx.fill();
      // windows
      roundRect(ctx, left + 28, gy - 130, 40, 40, 3);
      ctx.fillStyle = "#9ec8e0";
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.fillRect(left + 32, gy - 126, 14, 14);
      roundRect(ctx, left + houseW - 68, gy - 130, 40, 40, 3);
      ctx.fillStyle = "#9ec8e0";
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.fillRect(left + houseW - 64, gy - 126, 14, 14);
      ctx.restore();
    }

    const roof = ease(seg(p, 0.6, 0.82));
    if (roof > 0) {
      ctx.save();
      ctx.globalAlpha = roof;
      ctx.translate(0, (1 - roof) * -70);
      ctx.beginPath();
      ctx.moveTo(left - 16, gy - 28 - wallH + 8);
      ctx.lineTo(cx, gy - 28 - wallH - 88);
      ctx.lineTo(left + houseW + 16, gy - 28 - wallH + 8);
      ctx.closePath();
      const rg = ctx.createLinearGradient(left, gy - 200, left + houseW, gy - 100);
      rg.addColorStop(0, "#4a6878");
      rg.addColorStop(1, "#1f3340");
      ctx.fillStyle = rg;
      ctx.fill();

      // chimney
      const chim = ease(seg(p, 0.72, 0.88));
      if (chim > 0) {
        ctx.globalAlpha = roof * chim;
        ctx.fillStyle = "#3d5a6c";
        ctx.fillRect(cx + 70, gy - 28 - wallH - 70, 26, 48);
        // smoke
        const smoke = ease(seg(p, 0.8, 1));
        if (smoke > 0) {
          ctx.globalAlpha = 0.35 * smoke;
          ellipse(ctx, cx + 82, gy - 28 - wallH - 82 - smoke * 10, 10, 8, "#dfe6ea");
          ellipse(ctx, cx + 88, gy - 28 - wallH - 100 - smoke * 16, 14, 11, "#dfe6ea");
          ellipse(ctx, cx + 78, gy - 28 - wallH - 118 - smoke * 20, 16, 13, "#dfe6ea");
        }
      }
      ctx.restore();
    }

    const life = ease(seg(p, 0.85, 1));
    if (life > 0) {
      ctx.save();
      ctx.globalAlpha = life;
      // tree
      ctx.fillStyle = "#5a3d28";
      ctx.fillRect(left - 90, gy - 40, 10, 40);
      ellipse(ctx, left - 85, gy - 70, 34, 36, "#3f6b45");
      ellipse(ctx, left - 70, gy - 55, 22, 20, "#4f7d52");
      // path
      ctx.strokeStyle = "#8a7a62";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx, gy - 2);
      ctx.quadraticCurveTo(cx + 40, gy + 28, cx + 120, gy + 40);
      ctx.stroke();
      ctx.restore();
    }
  }

  function fitCanvas(canvas) {
    const parent = canvas.parentElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = parent.getBoundingClientRect();
    const cssW = Math.max(320, Math.floor(rect.width));
    const cssH = Math.max(280, Math.floor(rect.height));
    canvas.style.width = cssW + "px";
    canvas.style.height = cssH + "px";
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w: cssW, h: cssH };
  }

  function makeStage(canvas, renderer) {
    let progress = 0;
    let size = fitCanvas(canvas);

    const draw = () => {
      size.ctx.clearRect(0, 0, size.w, size.h);
      renderer(size.ctx, size.w, size.h, progress);
    };

    const setProgress = (p) => {
      progress = clamp(p);
      draw();
    };

    const onResize = () => {
      size = fitCanvas(canvas);
      draw();
    };

    window.addEventListener("resize", onResize);
    draw();
    return { setProgress, draw, destroy: () => window.removeEventListener("resize", onResize) };
  }

  function renderHeroIdle(ctx, w, h, t) {
    // gentle morph preview: blend cake→house silhouette vibe
    const p = (Math.sin(t * 0.0004) + 1) / 2;
    paintCakeBackdrop(ctx, w, h);
    ctx.globalAlpha = 0.35;
    renderCakeFrame(ctx, w, h, 0.55 + p * 0.35);
    ctx.globalAlpha = 1;
  }

  global.YarusFrames = {
    renderCakeFrame,
    renderHouseFrame,
    makeStage,
    renderHeroIdle,
    fitCanvas,
    cakeSteps: [
      { at: 0, title: "Пустой стол", text: "Кадры генерируются в браузере. Листайте — появляется подставка, затем ярусы, крем и декор." },
      { at: 0.15, title: "Подставка и первый ярус", text: "Нижний корж опускается на тарелку — база всей конструкции." },
      { at: 0.35, title: "Крем и второй ярус", text: "Прослойка выравнивает форму. Средний ярус садится сверху." },
      { at: 0.6, title: "Верхний ярус", text: "Силуэт торта собирается целиком — как в таймлапсе кондитера." },
      { at: 0.82, title: "Декор и свеча", text: "Ягоды, лист и огонёк. Финальный кадр — готовый торт." },
    ],
    houseSteps: [
      { at: 0, title: "Участок", text: "Скролл поднимает дом слой за слоем: земля, фундамент, стены, кровля, жизнь во дворе." },
      { at: 0.18, title: "Фундамент", text: "Появляется основание — без него стены не держатся." },
      { at: 0.4, title: "Стены", text: "Коробка растёт вверх. Окна и дверь проявляются следом." },
      { at: 0.65, title: "Крыша", text: "Кровля закрывает объём, из трубы идёт дым." },
      { at: 0.88, title: "Дом живёт", text: "Дерево, дорожка и свет — стройка завершена." },
    ],
  };
})(window);
