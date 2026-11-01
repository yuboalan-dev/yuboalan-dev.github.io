/* =========================================================
   site.js ── 各分頁共用的版面程式（平常不用改；文字請改 content.js）
   ---------------------------------------------------------
   每個分頁的 <body data-page="..."> 決定要畫哪些區塊：
     home        首頁：桌牌首屏、關注領域、近況
     experience  經歷
     work        代表作
     media       媒體與評論
   頁首（導覽、語言、CV）與頁尾（聯絡）所有分頁共用，只寫在這裡一份。

   ★ 分頁清單只維護在下面的 PAGES。新增分頁時：
     1. 在 PAGES 加一行
     2. 複製一個 *.html，改 <title>、description、canonical 和 data-page
     3. sitemap.xml 加一行
   ========================================================= */
(function () {
  var U = window.UTIL, S = U.S, L = U.getLang(), t = U.t, esc = U.esc;
  var page = document.body.getAttribute("data-page") || "home";
  var EN = L === "en";
  function tx(zh, en) { return EN ? en : zh; }
  document.documentElement.lang = EN ? "en" : "zh-Hant";

  var PAGES = [
    { id: "experience", href: "experience.html", zh: "經歷",     en: "Experience" },
    { id: "work",       href: "work.html",       zh: "代表作",   en: "Work" },
    { id: "media",      href: "media.html",      zh: "媒體",     en: "Media" }
  ];

  /* ---------- 頁首 ---------- */
  var nav = PAGES.map(function (p) {
    return '<a class="navlink' + (p.id === page ? " is-current" : "") + '" href="' + p.href + '"' +
      (p.id === page ? ' aria-current="page"' : "") + ">" + esc(EN ? p.en : p.zh) + "</a>";
  }).join("");
  var header = document.createElement("header");
  header.className = "topbar";
  header.innerHTML =
    '<div class="wrap"><a class="brand" href="index.html">' + esc(S.name.zh) + "<span>" + esc(S.name.en) + "</span></a>" +
    '<nav class="topnav" aria-label="' + tx("主選單", "Main") + '">' + nav +
    '<button class="lang-btn" type="button" id="langBtn">' + (EN ? "中文" : "EN") + "</button>" +
    '<a class="btn" href="cv.html?lang=' + L + '">' + tx("正式 CV", "CV") + "</a></nav></div>";
  document.body.insertBefore(header, document.body.firstChild);
  document.getElementById("langBtn").onclick = function () { U.setLang(EN ? "zh" : "en"); };

  var main = document.getElementById("main");

  /* ---------- 小工具 ---------- */
  function block(id, title, inner, washed) {
    return '<section class="block' + (washed ? " washed" : "") + '" id="' + id + '"><div class="wrap block-grid">' +
      '<h2 class="block-title">' + esc(title) + "</h2><div>" + inner + "</div></div></section>";
  }

  /* ---------- 首頁 ---------- */
  function renderHome() {
    document.title = S.name.zh + " " + S.name.en;
    var roles = U.visible(S.roles, "web").map(function (r) {
      var s = t(r, L), org = s, role = "";
      if (EN) { var i = s.indexOf(", "); if (i > 0) { role = s.slice(0, i); org = s.slice(i + 2); } }
      else { var j = s.lastIndexOf("　"); if (j > 0) { org = s.slice(0, j).trim(); role = s.slice(j + 1).trim(); } }
      return '<li><span class="org">' + esc(org) + '</span><span class="role">' + esc(role) + "</span></li>";
    }).join("");
    var tl = t(S.tagline, L);

    var html =
      '<section class="hero"><div class="wrap hero-grid">' +
        '<div class="hero-visual"><div class="plate-wrap">' +
          '<h1 class="nameplate" aria-label="' + esc(S.name.zh + " " + S.name.en) + '">' + esc(S.name.zh) + "</h1>" +
          '<span class="plate-en" aria-hidden="true">' + esc(S.name.en) + "</span></div>" +
          '<div class="photo" id="photoWrap"></div></div>' +
        '<div class="intro">' +
          (EN ? '<p class="intro-name">' + esc(S.name.en) + "</p>" : "") +
          (tl ? '<p class="tagline">' + esc(tl) + "</p>" : "") +
          '<p class="summary">' + esc(t(S.summary, L)) + "</p>" +
          (roles ? '<ul class="roles">' + roles + "</ul>" : "") +
        "</div></div></section>";

    /* 關注領域：每一項連到代表作 */
    var focus = U.visible(S.focus, "web");
    if (focus.length) html += block("focus", t(S.focusHeading, L), '<div class="focus">' + focus.map(function (i) {
      return '<div class="focus-item"><h3>' + esc(t(i.title, L)) + "</h3><p>" + esc(t(i.text, L)) + "</p></div>";
    }).join("") + "</div>", true);

    /* 近況：先顯示 5 筆 */
    var news = U.visible(S.news, "web").slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
    if (news.length) {
      html += block("news", tx("近況", "Latest"), '<ul class="news" id="newsBody">' + news.map(function (n, i) {
        var txt = esc(t(n.text, L));
        if (n.url) txt = '<a href="' + esc(n.url) + '" target="_blank" rel="noopener">' + txt + "</a>";
        return "<li" + (i >= 5 ? ' class="is-more"' : "") + '><span class="d">' + esc(n.date || "") + "</span><span>" + txt + "</span></li>";
      }).join("") + "</ul>" +
      (news.length > 5 ? '<button class="more-btn" type="button" id="newsMore">' + tx("顯示全部", "Show all") + "</button>" : ""));
    }
    main.innerHTML = html;

    var nm = document.getElementById("newsMore");
    if (nm) nm.onclick = function () { document.getElementById("newsBody").classList.add("show-all"); nm.remove(); };

    /* 相片：找不到檔案就換成姓氏字樣 */
    var pw = document.getElementById("photoWrap");
    var fallback = function () { pw.innerHTML = '<div class="photo-fallback">' + esc(S.name.zh.charAt(0)) + "</div>"; };
    if (S.photo) { var img = new Image(); img.alt = S.name.zh; img.onerror = fallback; img.src = S.photo; pw.appendChild(img); }
    else fallback();

    addPersonData();
  }

  /* ---------- 經歷 ---------- */
  function renderExperience() {
    var title = tx("經歷", "Experience");
    document.title = title + "｜" + S.name.zh + " " + S.name.en;
    var SHOW_FIRST = 3;
    var groups = (S.groups || []).filter(function (g) { return g.show !== false && g.web !== false && U.visible(g.items, "web").length; });
    var inner = '<div class="exp-grid">' + groups.map(function (g, gi) {
      var items = U.visible(g.items, "web");
      return '<div class="exp-group" id="g' + gi + '"><h3 class="exp-title">' + esc(t(g.title, L)) + "</h3>" + items.map(function (it, i) {
        var p = U.period(it.period, L), role = t(it.role, L);
        var pts = (it.points || []).filter(function (x) { return x.show !== false && x.web !== false; })
          .map(function (x) { return "<li>" + esc(t(x, L)) + "</li>"; }).join("");
        return '<div class="exp-item' + (g.collapsed && i >= SHOW_FIRST ? " is-more" : "") + '"><div class="exp-head"><div>' +
          '<div class="item-main">' + esc(t(it.org, L)) + "</div>" + (role ? '<div class="item-sub">' + esc(role) + "</div>" : "") + "</div>" +
          (p ? '<div class="exp-period">' + esc(p) + "</div>" : "") + "</div>" +
          (pts ? '<ul class="item-points">' + pts + "</ul>" : "") + "</div>";
      }).join("") +
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
    document.title = title + "｜" + S.name.zh + " " + S.name.en;
    var inner = '<div class="works">' + U.visible(S.works, "web").map(function (w) {
      var links = (w.links || []).filter(function (l) { return l.url; }).map(function (l) {
        return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(t(l.label, L)) + "</a>";
      }).join("");
      var steps = (w.steps || []).map(function (s) { return "<li>" + esc(t(s, L)) + "</li>"; }).join("");
      return '<article class="work"><div><h3>' + esc(t(w.title, L)) + '</h3><p class="desc">' + esc(t(w.text, L)) + "</p>" +
        (links ? '<div class="proof">' + links + "</div>" : "") + "</div>" +
        (steps ? '<ol class="steps">' + steps + "</ol>" : "") + "</article>";
    }).join("") + "</div>";
    main.innerHTML = block("works", title, inner);
  }

  /* ---------- 媒體 ----------
     政論節目依 content.js 的 mediaList：
       "summary" 每個節目一行（節目名、集數、年份），"full" 逐集列出。
     新聞受訪逐則列出；已在上方精選出現的不重複。 */
  function renderMedia() {
    var title = tx("媒體與評論", "Media");
    document.title = title + "｜" + S.name.zh + " " + S.name.en;
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
    if (news.length) groups += '<div class="mgroup"><h3>' + tx("新聞受訪", "News interviews") + "<small>" + news.length + tx(" 則", "") + "</small></h3><ul>" +
      news.sort(byDate).map(function (m) { return row(m, src(m)); }).join("") + "</ul></div>";
    if (order.length && !full) {
      var total = 0;
      groups += '<div class="mgroup"><h3>' + tx("政論節目來賓", "TV talk shows (guest commentator)") + "<small>__TOTAL__</small></h3><ul>" + order.map(function (k) {
        var ys = shows[k].map(function (m) { return String(m.date || "").slice(0, 4); }).filter(Boolean).sort();
        var span = ys.length ? (ys[0] === ys[ys.length - 1] ? ys[0] : ys[0] + "–" + ys[ys.length - 1]) : "";
        total += shows[k].length;
        return '<li><span class="mline"><span class="d">' + esc(span) + "</span><span><b>" + esc(k) + "</b>　" +
          shows[k].length + tx(" 集", " episodes") + "</span></span></li>";
      }).join("") + "</ul></div>";
      groups = groups.replace("__TOTAL__", total + tx(" 集", ""));
    }
    if (order.length && full) groups += order.map(function (k) {
      return '<div class="mgroup"><h3>' + esc(k) + "<small>" + shows[k].length + tx(" 集", "") + "</small></h3><ul>" +
        shows[k].slice().sort(byDate).map(function (m) { return row(m); }).join("") + "</ul></div>";
    }).join("");
    if (groups) html += '<div class="media-groups">' + groups + "</div>";
    main.innerHTML = block("media", title, html);
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
    f.innerHTML = '<div class="wrap"><div class="contact-grid"><h2 class="block-title">' + tx("聯絡", "Contact") + "</h2><div>" +
      (mail ? '<a class="contact-mail" href="' + esc(U.href(mail)) + '">' + esc(mail.url.replace(/^mailto:/, "")) + "</a>" : "") +
      (social ? '<div class="social">' + social + "</div>" : "") + "</div></div>" +
      '<p class="footnote">' + esc(S.name.zh + " " + S.name.en) + "　" + tx("最後更新 ", "Last updated ") + esc(S.updated || "") + "</p></div>";
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

  ({ home: renderHome, experience: renderExperience, work: renderWork, media: renderMedia }[page] || renderHome)();
  renderFooter();
})();
