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
