/* =========================================================
   motion.js ── 互動效果（2026-11-02，平常不用改）
   ---------------------------------------------------------
   site.js 畫好頁面之後才執行；樣式在 style.css 第 12 段。
     1. 路線隨捲動畫出：捲到哪，路線就走到哪一站
     2. 首屏點陣水面：滑鼠推開圓點、點一下盪開漣漪（只在有滑鼠的桌機）
     3. 站點預覽小卡：手機第一次點站點先打開小卡，再點一次才進經歷頁
     4. 求職那一行：職缺類型輪播
     5. 代表作、媒體的數字：捲到時從 0 累加
     6. 簡介關鍵字：進畫面時螢光筆依序劃過
     7. 頁尾掛繩識別證：可以拖著甩（只在寬螢幕）
   原則：只在訪客捲動、移動、點擊時才動。
   ・系統設定「減少動態效果」時（<html> 沒有 .anim），第 3 項以外全部不做，內容照樣完整。
   ・自動化瀏覽器（tools/build.mjs 預先產生網頁、tools/preview.mjs 拍前後對照）也不做，
     存下來的 HTML 與截圖才會是完整的靜態內容。
   ========================================================= */
(function () {
  var html = document.documentElement;
  var U = window.UTIL, S = U && U.S;
  if (!U) return;
  var L = U.getLang(), EN = L === "en";
  function tx(zh, en) { return EN ? en : zh; }
  var fine = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;
  var route = document.querySelector(".route");
  var stations = route ? [].slice.call(route.querySelectorAll(".station")) : [];

  /* ---------- 3. 站點預覽小卡（觸控）：不算動畫，減少動態效果時也要能用 ---------- */
  if (route && !fine) {
    route.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest(".station:not(.is-event) a");
      if (!a) return;
      var li = a.parentElement;
      if (!li.classList.contains("is-open")) {
        e.preventDefault();
        stations.forEach(function (s) { s.classList.remove("is-open"); });
        li.classList.add("is-open");
      }
    });
    document.addEventListener("click", function (e) {
      if (!(e.target.closest && e.target.closest(".station"))) stations.forEach(function (s) { s.classList.remove("is-open"); });
    });
  }

  if (!html.classList.contains("anim") || navigator.webdriver) return;
  var raf = window.requestAnimationFrame.bind(window);

  /* ---------- 1. 路線隨捲動畫出 ---------- */
  if (route && stations.length) {
    var track = route.querySelector(".route-track");
    route.classList.add("is-scroll");
    var front = -2;
    var updateRoute = function () {
      var vh = window.innerHeight, reached;
      if (getComputedStyle(track).flexDirection === "column") {
        /* 手機直式：每一站的上緣過了畫面 78% 就算走到 */
        reached = stations.filter(function (s) { return s.getBoundingClientRect().top < vh * 0.78; }).length - 1;
      } else {
        /* 桌機橫式：路線從畫面 90% 處捲到 35% 處，依比例走完全程 */
        var p = (vh * 0.9 - route.getBoundingClientRect().top) / (vh * 0.55);
        reached = p <= 0 ? -1 : Math.round(Math.min(1, p) * (stations.length - 1));
      }
      stations.forEach(function (s, i) { s.classList.toggle("is-reached", i <= reached); });
      if (reached !== front) {
        stations.forEach(function (s) { s.classList.remove("is-front"); });
        if (reached >= 0) { void stations[reached].offsetWidth; stations[reached].classList.add("is-front"); }
        front = reached;
      }
    };
    var routeQueued = false;
    var queueRoute = function () { if (!routeQueued) { routeQueued = true; raf(function () { routeQueued = false; updateRoute(); }); } };
    window.addEventListener("scroll", queueRoute, { passive: true });
    window.addEventListener("resize", queueRoute);
    updateRoute();
  }

  /* ---------- 2. 首屏點陣水面 ---------- */
  var hero = document.querySelector(".hero");
  if (hero && fine) {
    var cv = document.createElement("canvas");
    cv.className = "hero-dots"; cv.setAttribute("aria-hidden", "true");
    hero.insertBefore(cv, hero.firstChild);
    hero.classList.add("has-dots");
    var ctx = cv.getContext("2d");
    var G = 22, R = 110;               /* 點的間距（與 style.css 的點陣底紋相同）、滑鼠影響半徑 */
    var dots = [], W = 0, H = 0, mx = -1e4, my = -1e4, ripples = [], running = false;
    var cs = getComputedStyle(html);
    var base = cs.getPropertyValue("--line").trim() || "#dcdce2";
    var setupDots = function () {
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      W = hero.clientWidth; H = hero.clientHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      var x0 = ((W / 2 - G / 2) % G + G) % G + G / 2;   /* 對齊 CSS 的 background-position: center top */
      for (var y = G / 2; y < H; y += G) for (var x = x0 - G; x < W + G; x += G) dots.push({ x: x, y: y, dx: 0, dy: 0, vx: 0, vy: 0 });
      draw(false);
    };
    var draw = function (animate) {
      var now = performance.now(), moving = false;
      ctx.clearRect(0, 0, W, H);
      ripples = ripples.filter(function (r) { return now - r.t < 1500; });
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i], tx0 = 0, ty0 = 0, near = 0;
        var ex = d.x - mx, ey = d.y - my, dist = Math.sqrt(ex * ex + ey * ey);
        if (dist < R && dist > 0.1) { near = 1 - dist / R; var f = near * near * 14; tx0 += ex / dist * f; ty0 += ey / dist * f; }
        for (var k = 0; k < ripples.length; k++) {
          var r = ripples[k], age = now - r.t, ring = age * 0.42;
          var rx = d.x - r.x, ry = d.y - r.y, rd = Math.sqrt(rx * rx + ry * ry) || 1, band = Math.abs(rd - ring);
          if (band < 26) { var amp = (1 - band / 26) * 7 * (1 - age / 1500); tx0 += rx / rd * amp; ty0 += ry / rd * amp; near = Math.max(near, amp / 9); }
        }
        if (animate) {
          d.vx = (d.vx + (tx0 - d.dx) * 0.18) * 0.72; d.vy = (d.vy + (ty0 - d.dy) * 0.18) * 0.72;
          d.dx += d.vx; d.dy += d.vy;
          if (Math.abs(d.vx) + Math.abs(d.vy) > 0.02) moving = true;
        }
        ctx.beginPath();
        ctx.arc(d.x + d.dx, d.y + d.dy, 1.3 + near * 1.1, 0, 6.2832);
        ctx.fillStyle = near > 0.04 ? "rgba(43, 58, 140, " + (0.25 + near * 0.55).toFixed(2) + ")" : base;
        ctx.fill();
      }
      return moving || ripples.length > 0;
    };
    var loop = function () { if (draw(true)) raf(loop); else running = false; };
    var kick = function () { if (!running) { running = true; raf(loop); } };
    var pos = function (e) { var r = hero.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    hero.addEventListener("pointermove", function (e) { pos(e); kick(); });
    hero.addEventListener("pointerleave", function () { mx = my = -1e4; kick(); });
    hero.addEventListener("pointerdown", function (e) { pos(e); ripples.push({ x: mx, y: my, t: performance.now() }); kick(); });
    var resizeTimer;
    window.addEventListener("resize", function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(setupDots, 150); });
    setupDots();
  }

  /* ---------- 4. 求職那一行：職缺類型輪播 ---------- */
  [].forEach.call(document.querySelectorAll(".rot"), function (rot) {
    var ws = rot.querySelectorAll(".rot-w");
    if (ws.length < 2) return;
    var i = 0;
    var fit = function () { rot.style.width = ws[i].offsetWidth + "px"; };
    fit();
    setInterval(function () {
      if (document.hidden) return;
      var cur = ws[i];
      i = (i + 1) % ws.length;
      cur.classList.remove("is-on"); cur.classList.add("is-out");
      ws[i].classList.remove("is-out"); ws[i].classList.add("is-on");
      fit();
      setTimeout(function () { cur.classList.remove("is-out"); }, 500);
    }, 2600);
  });

  /* ---------- 5. 數字從 0 累加 / 6. 螢光筆 ---------- */
  var summary = document.querySelector(".hero .summary");
  if (summary && summary.querySelector("mark.hl")) summary.classList.add("hl-ready");
  var counts = [].slice.call(document.querySelectorAll(".count[data-count-to]"));
  counts.forEach(function (el) { el.textContent = "0"; });
  var countUp = function (el) {
    var to = +el.getAttribute("data-count-to") || 0, t0 = performance.now(), dur = 1100;
    var step = function (now) {
      var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e).toLocaleString("en-US");   /* 千分位：9,843 */
      if (p < 1) raf(step);
    };
    raf(step);
  };
  if ("IntersectionObserver" in window) {
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        if (e.target.classList.contains("count")) countUp(e.target); else e.target.classList.add("is-lit");
        seen.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -12% 0px" });
    counts.forEach(function (el) { seen.observe(el); });
    if (summary && summary.classList.contains("hl-ready")) seen.observe(summary);
  } else {
    counts.forEach(function (el) { el.textContent = (+el.getAttribute("data-count-to") || 0).toLocaleString("en-US"); });
    if (summary) summary.classList.add("is-lit");
  }

  /* ---------- 8. 首頁頭像：由 N 個點組成（2026-11-11 使用者要求頭像要能互動） ----------
     N＝content.js 的 avatarDots（指南路兩場投票的總票數）。把頭像圖縮成小格子取色，取最靠近圓心的 N 格，一格一個點。
     平常顯示原圖；進場時點從四周聚成頭像；滑鼠滑過會把點推開，按下（手機按住）會炸開，放開後聚回來、換回原圖。
     座標一律用「頭像邊長＝1」的單位，視窗改大小不用重算。 */
  var avBox = document.querySelector(".avatar-big[data-dots]");
  if (avBox && avBox.querySelector("img")) (function () {
    var img = avBox.querySelector("img"), N = Math.round(+avBox.getAttribute("data-dots") || 0);
    if (!N) return;
    var boot = function () {
      var G = Math.ceil(Math.sqrt(N / Math.PI) * 2) + 2;
      var oc = document.createElement("canvas"); oc.width = oc.height = G;
      var data;
      try { var og = oc.getContext("2d"); og.drawImage(img, 0, 0, G, G); data = og.getImageData(0, 0, G, G).data; } catch (e) { return; }
      var cells = [], x, y;
      for (y = 0; y < G; y++) for (x = 0; x < G; x++) { var cx = x + 0.5 - G / 2, cy = y + 0.5 - G / 2; cells.push({ x: x, y: y, d: cx * cx + cy * cy }); }
      cells.sort(function (a, b) { return a.d - b.d; });
      if (cells.length < N) return;
      cells.length = N;
      /* 顏色：照原圖，量化成少數幾種好一次畫完；接近白色的改成淺灰，白底上才看得到每一個點 */
      cells.forEach(function (c) {
        var o = (c.y * G + c.x) * 4, r = data[o], g = data[o + 1], b = data[o + 2], al = data[o + 3];
        if (al < 60 || (r + g + b) / 3 > 228) c.c = "#d3d3df";
        else c.c = "rgb(" + (r >> 4 << 4) + "," + (g >> 4 << 4) + "," + (b >> 4 << 4) + ")";
      });
      cells.sort(function (a, b) { return a.c < b.c ? -1 : a.c > b.c ? 1 : 0; });
      var groups = [], i;
      for (i = 0; i < N; i++) { if (!groups.length || groups[groups.length - 1].c !== cells[i].c) groups.push({ c: cells[i].c, from: i, to: i }); groups[groups.length - 1].to = i + 1; }
      var hx = new Float32Array(N), hy = new Float32Array(N), px = new Float32Array(N), py = new Float32Array(N), vx = new Float32Array(N), vy = new Float32Array(N);
      for (i = 0; i < N; i++) {
        hx[i] = (cells[i].x + 0.5) / G; hy[i] = (cells[i].y + 0.5) / G;
        var an = Math.random() * 6.2832, rr = 0.55 + Math.random() * 0.25;      /* 進場：從頭像外面一圈飛進來 */
        px[i] = 0.5 + Math.cos(an) * rr; py[i] = 0.5 + Math.sin(an) * rr;
      }
      var PAD = 0.3, cv = document.createElement("canvas"), g2 = cv.getContext("2d");
      cv.setAttribute("aria-hidden", "true"); avBox.appendChild(cv);
      var S0 = 0, dpr = 1;
      var size = function () {
        S0 = avBox.clientWidth; dpr = Math.min(2, window.devicePixelRatio || 1);
        cv.width = cv.height = Math.round(S0 * (1 + 2 * PAD) * dpr);
      };
      size(); window.addEventListener("resize", size);
      var mx = -9, my = -9, over = false, running = false, calm = 0;
      var R = 0.17, R2 = R * R;
      var frame = function () {
        var maxD = 0, k = S0 * dpr, off = PAD * k, rad = Math.max(0.6 * dpr, k / G * 0.36);
        for (var i = 0; i < N; i++) {
          var ax = (hx[i] - px[i]) * 0.07, ay = (hy[i] - py[i]) * 0.07;
          if (over) {
            var dx = px[i] - mx, dy = py[i] - my, d2 = dx * dx + dy * dy;
            if (d2 < R2) { var d = Math.sqrt(d2) || 0.001, f = (1 - d / R) * 0.016; ax += dx / d * f; ay += dy / d * f; }
          }
          vx[i] = (vx[i] + ax) * 0.84; vy[i] = (vy[i] + ay) * 0.84;
          px[i] += vx[i]; py[i] += vy[i];
          var e = Math.abs(hx[i] - px[i]) + Math.abs(hy[i] - py[i]); if (e > maxD) maxD = e;
        }
        g2.setTransform(1, 0, 0, 1, 0, 0); g2.clearRect(0, 0, cv.width, cv.height);
        for (var j = 0; j < groups.length; j++) {
          var gr = groups[j]; g2.fillStyle = gr.c; g2.beginPath();
          for (var q = gr.from; q < gr.to; q++) { var X = off + px[q] * k, Y = off + py[q] * k; g2.moveTo(X + rad, Y); g2.arc(X, Y, rad, 0, 6.2832); }
          g2.fill();
        }
        /* 都回到原位、滑鼠也離開了：換回原圖，停止計算 */
        calm = (!over && maxD < 0.004) ? calm + 1 : 0;
        if (calm > 12) { running = false; avBox.classList.remove("is-dots"); return; }
        raf(frame);
      };
      var wake = function () { calm = 0; avBox.classList.add("is-dots"); if (!running) { running = true; raf(frame); } };
      var at = function (e) { var r = avBox.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width; my = (e.clientY - r.top) / r.height; };
      avBox.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") { over = true; at(e); wake(); } });
      avBox.addEventListener("pointermove", function (e) { if (over) { at(e); wake(); } });
      avBox.addEventListener("pointerdown", function (e) {
        at(e); over = true;
        for (var i = 0; i < N; i++) {                                              /* 按下：從按的地方炸開 */
          var dx = px[i] - mx, dy = py[i] - my, d = Math.sqrt(dx * dx + dy * dy) || 0.001, f = Math.max(0, 1 - d / 0.9) * 0.07 * (0.5 + Math.random());
          vx[i] += dx / d * f; vy[i] += dy / d * f;
        }
        wake();
      });
      var out = function () { over = false; mx = my = -9; };
      avBox.addEventListener("pointerleave", out); avBox.addEventListener("pointerup", function (e) { if (e.pointerType !== "mouse") out(); }); avBox.addEventListener("pointercancel", out);
      wake();                                                                     /* 進場：聚成頭像 */
    };
    if (img.complete && img.naturalWidth) boot(); else img.addEventListener("load", boot);
  })();

  /* ---------- 7. 頁尾掛繩識別證 ---------- */
  var footWrap = document.querySelector("footer.contact .wrap");
  if (footWrap && S) {
    var rig = document.createElement("div");
    rig.className = "badge-rig"; rig.setAttribute("aria-hidden", "true");
    var esc = U.esc, photo = S.photo ? "/" + String(S.photo).replace(/^\//, "") : "";
    rig.innerHTML = '<div class="badge-swing"><span class="badge-strap"></span><div class="badge-card">' +
      (photo ? '<div class="badge-photo"><img src="' + esc(photo) + '" alt="" draggable="false"></div>' : "") +
      '<div class="badge-name">' + esc(EN ? S.name.en : S.name.zh) + '</div><div class="badge-en">' + esc(EN ? S.name.zh : S.name.en) + "</div>" +
      '<div class="badge-line"></div><div class="badge-org">' + esc(U.t(S.headline, L)) + "</div>" +
      '<span class="badge-tag">' + tx("求職中", "Open to work") + "</span></div></div>";
    footWrap.appendChild(rig);
    var swing = rig.querySelector(".badge-swing"), card = rig.querySelector(".badge-card");
    var ang = 0, vel = 0, dragging = false, offset = 0, lastAng = 0, swinging = false, last = 0;
    var apply = function () { swing.style.transform = "rotate(" + ang.toFixed(2) + "deg)"; };
    var tick = function (now) {
      var dt = Math.min(3, (now - last) / 16.67 || 1); last = now;
      if (!dragging) {
        vel += -0.0045 * ang * dt;            /* 擺盪：約 1.5 秒一個來回 */
        vel *= Math.pow(0.975, dt);           /* 阻尼：慢慢停下來 */
        ang += vel * dt;
      }
      apply();
      if (dragging || Math.abs(vel) > 0.01 || Math.abs(ang) > 0.05) raf(tick); else { swinging = false; ang = 0; vel = 0; apply(); }
    };
    var start = function () { if (!swinging) { swinging = true; last = performance.now(); raf(tick); } };
    var pointerAngle = function (e) {
      var r = rig.getBoundingClientRect(), px = r.left + r.width / 2, py = r.top;
      return -Math.atan2(e.clientX - px, e.clientY - py) * 180 / Math.PI;
    };
    card.addEventListener("pointerdown", function (e) {
      dragging = true; offset = ang - pointerAngle(e); lastAng = ang;
      card.setPointerCapture(e.pointerId); start(); e.preventDefault();
    });
    card.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var a = Math.max(-75, Math.min(75, pointerAngle(e) + offset));
      vel = (a - lastAng) * 0.6; lastAng = a; ang = a;
    });
    var release = function () { dragging = false; };
    card.addEventListener("pointerup", release);
    card.addEventListener("pointercancel", release);
    /* 捲進畫面時輕輕晃一下；捲動越快晃越大 */
    var lastY = window.scrollY;
    window.addEventListener("scroll", function () {
      var dy = window.scrollY - lastY; lastY = window.scrollY;
      if (rig.offsetParent && Math.abs(dy) > 2) { vel += Math.max(-1.2, Math.min(1.2, dy * 0.02)); start(); }
    }, { passive: true });
  }
})();
