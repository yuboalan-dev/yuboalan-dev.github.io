/* =========================================================
   site.js ── 各分頁共用的版面程式（平常不用改；文字請改 content.js）
   ---------------------------------------------------------
   每個分頁的 <body data-page="..."> 決定要畫哪些區塊：
     home        首頁：桌牌首屏、關注領域、近況
     experience  經歷
     work        代表作
     media       媒體與評論
     notfound    找不到頁面（404.html）
   頁首（導覽、語言、CV）與頁尾（聯絡）所有分頁共用，只寫在這裡一份。

   ★ 分頁清單只維護在下面的 PAGES。新增分頁時：
     1. 在 PAGES 加一行
     2. 複製一個 *.html，改 <title>、description、canonical 和 data-page
     3. sitemap.xml 加一行

   ★ 預先產生的頁面（tools/build.mjs 在 GitHub 上建置時，把畫好的內容直接寫進 HTML，
     讓搜尋引擎和社群預覽不用跑程式也看得到）：這裡一開始會把那份內容清掉、
     再照目前語言重畫一次，所以結果一樣，只是英文模式會換成英文。

   ★ 站內連結一律用「/」開頭，404 頁在任何網址下才不會壞。
   ========================================================= */
(function () {
  var U = window.UTIL, S = U.S, L = U.getLang(), t = U.t, esc = U.esc;
  var page = document.body.getAttribute("data-page") || "home";

  /* 清掉預先產生的內容，避免重畫後出現兩份頁首頁尾 */
  document.querySelectorAll("header.topbar, footer.contact, script[type='application/ld+json']").forEach(function (el) { el.remove(); });
  var EN = L === "en";
  function tx(zh, en) { return EN ? en : zh; }
  document.documentElement.lang = EN ? "en" : "zh-Hant";

  var PAGES = [
    { id: "experience", href: "/experience.html", zh: "經歷",     en: "Experience" },
    { id: "work",       href: "/work.html",       zh: "代表作",   en: "Work" },
    { id: "media",      href: "/media.html",      zh: "媒體",     en: "Media" }
  ];

  /* 正式 CV 的 PDF：GitHub 每次建置時自動產生（tools/build.mjs）。
     download 是對方存檔時看到的檔名。 */
  var CV_PDF = EN ? { href: "/cv/alan-yu-cv-en.pdf", name: "Alan_Yu_CV.pdf" }
                  : { href: "/cv/yuboan-cv-zh.pdf", name: "游博安_CV.pdf" };

  /* ---------- 頁首 ---------- */
  var nav = PAGES.map(function (p) {
    return '<a class="navlink' + (p.id === page ? " is-current" : "") + '" href="' + p.href + '"' +
      (p.id === page ? ' aria-current="page"' : "") + ">" + esc(EN ? p.en : p.zh) + "</a>";
  }).join("");
  var header = document.createElement("header");
  header.className = "topbar";
  header.innerHTML =
    '<div class="wrap"><a class="brand" href="/">' + esc(S.name.zh) + "<span>" + esc(S.name.en) + "</span></a>" +
    '<nav class="topnav" aria-label="' + tx("主選單", "Main") + '">' + nav +
    '<button class="lang-btn" type="button" id="langBtn">' + (EN ? "中文" : "EN") + "</button>" +
    '<a class="btn" href="' + CV_PDF.href + '" download="' + esc(CV_PDF.name) + '">' + tx("下載 CV", "Download CV") + "</a></nav></div>";
  document.body.insertBefore(header, document.body.firstChild);
  document.getElementById("langBtn").onclick = function () { U.setLang(EN ? "zh" : "en"); };

  var main = document.getElementById("main");

  /* ---------- 小工具 ---------- */
  function block(id, title, inner, washed) {
    return '<section class="block' + (washed ? " washed" : "") + '" id="' + id + '"><div class="wrap">' +
      '<div class="block-head"><h2 class="block-title">' + esc(title) + "</h2></div>" + inner + "</div></section>";
  }
  function setTitle(title) { document.title = (title ? title + "｜" : "") + S.name.zh + " " + S.name.en; }
  /* 路線與站點：line 決定顏色；期間有「今」＝實心（現在進行中） */
  function lineOf(x) { return (x && x.line) || "none"; }
  function isNow(x) { return /今/.test((x && x.period) || ""); }
  function dot(x, now) { return '<span class="dot' + (now ? " is-now" : "") + '" data-line="' + lineOf(x) + '" aria-hidden="true"></span>'; }
  /* 期間開頭的年月，用來排序：「2023.09 – 2026.01」→ 202309 */
  function startKey(p) { var m = String(p || "").match(/(\d{4})(?:\.(\d{1,2}))?/); return m ? (+m[1]) * 100 + (+(m[2] || 0)) : 0; }
  /* 圖例：三條路線的名稱取自 content.js 的 focus */
  function legend(cls) {
    var items = U.visible(S.focus, "web").filter(function (f) { return f.line; }).map(function (f) {
      return '<span data-line="' + f.line + '">' + (cls === "route-legend" ? "" : dot(f, true)) + esc(t(f.title, L)) + "</span>";
    }).join("");
    return items ? '<div class="' + cls + '">' + items + (cls === "route-legend" ? '<span class="now">' + tx("現在位置", "Now") + "</span>" : "") + "</div>" : "";
  }

  /* ---------- 首頁 ---------- */
  function renderHome() {
    setTitle("");
    var roles = U.visible(S.roles, "web").map(function (r) {
      var s = t(r, L), org = s, role = "";
      if (EN) { var i = s.indexOf(", "); if (i > 0) { role = s.slice(0, i); org = s.slice(i + 2); } }
      else { var j = s.lastIndexOf("　"); if (j > 0) { org = s.slice(0, j).trim(); role = s.slice(j + 1).trim(); } }
      return "<li>" + dot(r, true) + '<span class="org">' + esc(org) + '</span><span class="role">' + esc(role) + "</span></li>";
    }).join("");
    var tl = t(S.tagline, L);

    /* 職涯路線圖：經歷裡有 station 的條目，依開始年月排列；最後一站是「現在位置」 */
    var stations = [];
    (S.groups || []).forEach(function (g) {
      if (g.show === false || g.web === false) return;
      U.visible(g.items, "web").forEach(function (it) { if (it.station) stations.push(it); });
    });
    stations.sort(function (a, b) { return startKey(a.period) - startKey(b.period); });
    var route = stations.length ? '<div class="route" aria-label="' + tx("經歷路線圖", "Career route") + '">' + legend("route-legend") +
      '<ol class="route-track">' + stations.map(function (it, i) {
        var here = i === stations.length - 1;
        return '<li class="station' + (here ? " is-here" : "") + '" style="--i:' + i + '">' + dot(it, isNow(it)) +
          '<span class="y">' + String(startKey(it.period)).slice(0, 4) + '</span><span class="n">' + esc(t(it.station, L)) + "</span></li>";
      }).join("") + "</ol></div>" : "";

    var html =
      '<section class="hero"><div class="wrap">' +
        '<div class="hero-grid"><div>' +
          '<div class="hero-name"><h1>' + esc(EN ? S.name.en : S.name.zh) + '</h1><span class="en">' + esc(EN ? S.name.zh : S.name.en) + "</span></div>" +
          '<div class="intro">' +
            (tl ? '<p class="tagline">' + esc(tl) + "</p>" : "") +
            '<p class="summary">' + esc(t(S.summary, L)) + "</p>" +
            (roles ? '<ul class="roles">' + roles + "</ul>" : "") +
          "</div></div>" +
          '<div class="photo" id="photoWrap"></div>' +
        "</div>" + route +
      "</div></section>";

    /* 關注領域：三條路線 */
    var focus = U.visible(S.focus, "web");
    if (focus.length) html += block("focus", t(S.focusHeading, L), '<div class="focus">' + focus.map(function (i) {
      return '<div class="focus-item" data-line="' + lineOf(i) + '"><h3>' + esc(t(i.title, L)) + "</h3><p>" + esc(t(i.text, L)) + "</p></div>";
    }).join("") + "</div>", true);

    /* 近況：先顯示 5 筆；最新一筆是紅點 */
    var news = U.visible(S.news, "web").slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
    if (news.length) {
      html += block("news", tx("近況", "Latest"), '<ul class="news" id="newsBody">' + news.map(function (n, i) {
        var txt = esc(t(n.text, L));
        if (n.url) txt = '<a href="' + esc(n.url) + '" target="_blank" rel="noopener">' + txt + "</a>";
        return "<li" + (i >= 5 ? ' class="is-more"' : "") + ">" + dot(n, false) + '<span class="d">' + esc(n.date || "") + "</span><span>" + txt + "</span></li>";
      }).join("") + "</ul>" +
      (news.length > 5 ? '<button class="more-btn" type="button" id="newsMore">' + tx("顯示全部", "Show all") + "</button>" : ""));
    }
    main.innerHTML = html;

    var nm = document.getElementById("newsMore");
    if (nm) nm.onclick = function () { document.getElementById("newsBody").classList.add("show-all"); nm.remove(); };

    /* 相片：找不到檔案就換成姓氏字樣 */
    var pw = document.getElementById("photoWrap");
    var fallback = function () { pw.innerHTML = '<div class="photo-fallback">' + esc(S.name.zh.charAt(0)) + "</div>"; };
    if (S.photo) { var img = new Image(); img.alt = S.name.zh; img.onerror = fallback; img.src = "/" + S.photo.replace(/^\//, ""); pw.appendChild(img); }
    else fallback();

    addPersonData();
  }

  /* ---------- 經歷：每一組是一段路線，條目是站點 ---------- */
  function renderExperience() {
    var title = tx("經歷", "Experience");
    setTitle(title);
    var SHOW_FIRST = 3;
    var groups = (S.groups || []).filter(function (g) { return g.show !== false && g.web !== false && U.visible(g.items, "web").length; });
    var inner = legend("legend") + '<div class="exp-grid">' + groups.map(function (g, gi) {
      var items = U.visible(g.items, "web");
      return '<div class="exp-group" id="g' + gi + '"><h3 class="exp-title">' + esc(t(g.title, L)) + '</h3><ul class="exp-list">' + items.map(function (it, i) {
        var p = U.period(it.period, L), role = t(it.role, L);
        var pts = (it.points || []).filter(function (x) { return x.show !== false && x.web !== false; })
          .map(function (x) { return "<li>" + esc(t(x, L)) + "</li>"; }).join("");
        return '<li class="exp-item' + (g.collapsed && i >= SHOW_FIRST ? " is-more" : "") + '" data-line="' + lineOf(it) + '">' + dot(it, isNow(it)) +
          '<div><div class="exp-head"><div><div class="item-main">' + esc(t(it.org, L)) + "</div>" +
          (role ? '<div class="item-sub">' + esc(role) + "</div>" : "") + "</div>" +
          (p ? '<div class="exp-period">' + esc(p) + "</div>" : "") + "</div>" +
          (pts ? '<ul class="item-points">' + pts + "</ul>" : "") + "</div></li>";
      }).join("") + "</ul>" +
      (g.collapsed && items.length > SHOW_FIRST
        ? '<button class="more-btn" type="button" data-g="g' + gi + '">' + tx("顯示全部 " + items.length + " 筆", "Show all " + items.length) + "</button>" : "") +
      "</div>";
    }).join("") + "</div>";
    main.innerHTML = block("experience", title, inner);
    main.querySelectorAll(".more-btn[data-g]").forEach(function (b) {
      b.onclick = function () { document.getElementById(b.dataset.g).classList.add("show-all"); b.remove(); };
    });
  }

  /* ---------- 代表作 ---------- */
  function renderWork() {
    var title = tx("代表作", "Selected Work");
    setTitle(title);
    var inner = '<div class="works">' + U.visible(S.works, "web").map(function (w) {
      var links = (w.links || []).filter(function (l) { return l.url; }).map(function (l) {
        return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(t(l.label, L)) + "</a>";
      }).join("");
      var steps = (w.steps || []).map(function (s) { return "<li>" + esc(t(s, L)) + "</li>"; }).join("");
      return '<article class="work" data-line="' + lineOf(w) + '"><div><h3>' + dot(w, true) + esc(t(w.title, L)) + '</h3><p class="desc">' + esc(t(w.text, L)) + "</p>" +
        (links ? '<div class="proof">' + links + "</div>" : "") + "</div>" +
        (steps ? '<ol class="steps">' + steps + "</ol>" : "") + "</article>";
    }).join("") + "</div>";
    main.innerHTML = block("works", title, inner);
  }

  /* ---------- 媒體 ----------
     政論節目依 content.js 的 mediaList：
       "summary" 每個節目一行（名稱、年份、一集一個點），"full" 逐集列出。
     新聞受訪逐則列出；已在上方精選出現的不重複。 */
  function renderMedia() {
    var title = tx("媒體與評論", "Media");
    setTitle(title);
    var media = U.visible(S.media, "web"), full = S.mediaList === "full";
    function src(m) { return t(m.kind === "show" ? m.program : m.outlet, L); }
    function vurl(m) { return m.url || ("https://www.youtube.com/watch?v=" + m.id); }
    function byDate(a, b) { return String(b.date).localeCompare(String(a.date)); }
    function row(m, label) {
      return '<li><a href="' + esc(vurl(m)) + '" target="_blank" rel="noopener"><span class="d">' + esc(m.date || "") +
        "</span><span>" + (label ? "<b>" + esc(label) + "</b>　" : "") + esc(t(m.title, L)) + "</span></a></li>";
    }
    var feat = media.filter(function (m) { return m.featured; });
    var html = feat.length ? '<div class="media-feat">' + feat.map(function (m) {
      var thumb = m.id ? '<img loading="lazy" alt="" onerror="this.remove()" src="https://i.ytimg.com/vi/' + esc(m.id) + '/hqdefault.jpg">' : "";
      return '<a class="vid" href="' + esc(vurl(m)) + '" target="_blank" rel="noopener"><div class="thumb">' + thumb + "</div>" +
        '<div class="src">' + esc(src(m)) + '</div><div class="vt">' + esc(t(m.title, L)) + '</div><div class="vd">' + esc(m.date || "") + "</div></a>";
    }).join("") + "</div>" : "";

    var shows = {}, order = [], news = [];
    media.forEach(function (m) {
      if (m.kind === "show") { var k = src(m); if (!shows[k]) { shows[k] = []; order.push(k); } shows[k].push(m); }
      else if (!m.featured || full) news.push(m);
    });
    var groups = "";
    if (order.length && !full) {
      var total = 0;
      groups += '<div class="mgroup"><h3>' + tx("政論節目來賓", "TV talk shows") + "<small>__TOTAL__</small></h3><ul>" + order.map(function (k) {
        var ys = shows[k].map(function (m) { return String(m.date || "").slice(0, 4); }).filter(Boolean).sort();
        var span = ys.length ? (ys[0] === ys[ys.length - 1] ? ys[0] : ys[0] + "–" + ys[ys.length - 1]) : "";
        total += shows[k].length;
        return '<li class="show"><div class="show-top"><span class="show-name">' + esc(k) + '</span><span class="show-meta">' + esc(span) + "　" +
          shows[k].length + tx(" 集", " episodes") + '</span></div><div class="ep-dots" aria-hidden="true">' + new Array(shows[k].length + 1).join("<i></i>") + "</div></li>";
      }).join("") + "</ul></div>";
      groups = groups.replace("__TOTAL__", total + tx(" 集", " episodes"));
    }
    if (order.length && full) groups += order.map(function (k) {
      return '<div class="mgroup"><h3>' + esc(k) + "<small>" + shows[k].length + tx(" 集", "") + "</small></h3><ul>" +
        shows[k].slice().sort(byDate).map(function (m) { return row(m); }).join("") + "</ul></div>";
    }).join("");
    if (news.length) groups += '<div class="mgroup"><h3>' + tx("新聞受訪", "News interviews") + "<small>" + news.length + tx(" 則", "") + "</small></h3><ul>" +
      news.sort(byDate).map(function (m) { return row(m, src(m)); }).join("") + "</ul></div>";
    if (groups) html += '<div class="media-groups">' + groups + "</div>";
    main.innerHTML = block("media", title, html);
  }

  /* ---------- 404 ---------- */
  function renderNotFound() {
    setTitle(tx("找不到這個頁面", "Page not found"));
    main.innerHTML = block("notfound", tx("找不到這個頁面", "Page not found"),
      '<p class="summary">' + tx("網址可能打錯了，或這個頁面已經移除。", "The address may be mistyped, or the page has moved.") + "</p>" +
      '<p class="nf-links"><a href="/">' + tx("回首頁", "Go to the homepage") + "</a></p>");
  }

  /* ---------- 頁尾：聯絡（所有分頁共用） ---------- */
  function renderFooter() {
    var links = U.activeLinks();
    var mail = links.filter(function (l) { return l.type === "email"; })[0];
    var social = links.filter(function (l) { return l.type !== "email"; }).map(function (l) {
      return '<a href="' + esc(U.href(l)) + '" target="_blank" rel="noopener" aria-label="' + esc(l.label) + '" title="' + esc(l.label) + '">' + U.icon(l.type) + "</a>";
    }).join("");
    var f = document.createElement("footer");
    f.className = "contact"; f.id = "contact";
    f.innerHTML = '<div class="wrap"><div class="block-head"><h2 class="block-title">' + tx("聯絡", "Contact") + "</h2></div>" +
      (mail ? '<a class="contact-mail" href="' + esc(U.href(mail)) + '">' + esc(mail.url.replace(/^mailto:/, "")) + "</a>" : "") +
      (social ? '<div class="social">' + social + "</div>" : "") +
      '<p class="footnote">' + esc(S.name.zh + " " + S.name.en) + "　" + tx("最後更新 ", "Last updated ") + esc(S.updated || "") +
      '　<a href="/cv.html?lang=' + L + '">' + tx("CV 網頁版（可選附照片等）", "CV builder") + "</a></p></div>";
    document.body.appendChild(f);
  }

  /* ---------- 結構化資料（schema.org Person），只放首頁 ----------
     Google 用來辨識「游博安」這個人；內容全部取自 content.js。
     換網域時要改 SITE_URL（另見 sitemap.xml、robots.txt、各 html 的 canonical）。 */
  var SITE_URL = "https://yuboalan-dev.github.io/";
  function addPersonData() {
    try {
      var em = U.activeLinks().filter(function (l) { return l.type === "email"; })[0];
      var ld = {
        "@context": "https://schema.org", "@type": "Person",
        name: S.name.zh, alternateName: S.name.en, url: SITE_URL, image: SITE_URL + (S.photo || ""),
        description: t(S.summary, "zh"), jobTitle: t(U.visible(S.roles, "web")[0] || "", "zh"),
        alumniOf: { "@type": "CollegeOrUniversity", name: "國立政治大學", alternateName: "National Chengchi University" },
        knowsAbout: U.visible(S.expertise, "web").map(function (e) { return e.zh; }),
        sameAs: U.activeLinks().filter(function (l) { return l.type !== "email"; }).map(function (l) { return l.url; })
      };
      if (em) ld.email = "mailto:" + em.url.replace(/^mailto:/, "");
      var sc = document.createElement("script");
      sc.type = "application/ld+json"; sc.textContent = JSON.stringify(ld);
      document.head.appendChild(sc);
    } catch (e) {}
  }

  ({ home: renderHome, experience: renderExperience, work: renderWork, media: renderMedia, notfound: renderNotFound }[page] || renderHome)();
  renderFooter();
})();
