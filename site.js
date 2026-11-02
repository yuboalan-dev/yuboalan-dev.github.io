/* =========================================================
   site.js ── 各分頁共用的版面程式（平常不用改；文字請改 content.js）
   ---------------------------------------------------------
   每個分頁的 <body data-page="..."> 決定要畫哪些區塊：
     home        首頁：首屏、關注領域、歷程（路線圖＋最新近況）
     experience  經歷
     work        代表作
     media       媒體
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

  /* 動畫：系統設定「減少動態效果」的人不播。
     .anim 掛在 <html> 上，所有「先藏起來、進畫面才浮現」的樣式都以它為前提，
     沒有 JavaScript 或關掉動畫時內容一律直接顯示。 */
  var ANIM = !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  document.documentElement.classList.toggle("anim", ANIM);

  var PAGES = [
    { id: "experience", href: "/experience.html", zh: "經歷",     en: "Experience" },
    { id: "work",       href: "/work.html",       zh: "代表作",   en: "Work" },
    { id: "media",      href: "/media.html",      zh: "媒體",     en: "Media" }
  ];

  /* 正式 CV 的 PDF：GitHub 每次建置時自動產生（tools/build.mjs）。
     download 是對方存檔時看到的檔名。 */
  var CV_PDF = EN ? { href: "/cv/alan-yu-cv-en.pdf", name: "Alan_Yu_CV.pdf" }
                  : { href: "/cv/yuboan-cv-zh.pdf", name: "游博安_CV.pdf" };
  /* CV 的定位（2026-11-02）：CV 就是投履歷時附的那份 PDF，網站只提供最新版（經歷頁上方「下載正式 CV」）。
     可勾選選項的 cv.html 是使用者自己的工具，網站上不連結（網址 /cv.html 仍可用，不給搜尋引擎收錄）。 */

  /* ---------- 頁首 ---------- */
  var nav = PAGES.map(function (p) {
    return '<a class="navlink' + (p.id === page ? " is-current" : "") + '" href="' + p.href + '"' +
      (p.id === page ? ' aria-current="page"' : "") + ">" + esc(EN ? p.en : p.zh) + "</a>";
  }).join("");
  var header = document.createElement("header");
  header.className = "topbar";
  header.innerHTML =
    '<a class="skip" href="#main">' + tx("跳到主要內容", "Skip to content") + "</a>" +
    '<div class="wrap"><a class="brand" href="/">' + esc(S.name.zh) + "<span>" + esc(S.name.en) + "</span></a>" +
    '<nav class="topnav" aria-label="' + tx("主選單", "Main") + '">' + nav +
    (U.ENGLISH ? '<button class="lang-btn" type="button" id="langBtn">' + (EN ? "中文" : "EN") + "</button>" : "") +
    "</nav></div>";
  document.body.insertBefore(header, document.body.firstChild);
  if (U.ENGLISH) document.getElementById("langBtn").onclick = function () { U.setLang(EN ? "zh" : "en"); };

  var main = document.getElementById("main");

  /* ---------- 小工具 ---------- */
  function block(id, title, inner, washed) {
    return '<section class="block' + (washed ? " washed" : "") + '" id="' + id + '"><div class="wrap">' +
      '<div class="block-head" data-reveal><h2 class="block-title">' + esc(title) + "</h2></div>" + inner + "</div></section>";
  }
  function setTitle(title) { document.title = (title ? title + "｜" : "") + S.name.zh + " " + S.name.en; }
  /* 路線與站點：line 決定顏色；期間有「今」＝實心（現在進行中） */
  function lineOf(x) { return (x && x.line) || "none"; }
  /* 一筆經歷可以有多個職務（roles）；舊格式（直接寫 role/period）也照樣能用 */
  function rolesOf(it) { return it.roles ? U.visible(it.roles, "web") : [{ role: it.role, period: it.period, points: it.points, station: it.station }]; }
  function isNow(x) {
    if (x && x.roles) return x.roles.some(function (r) { return r.show !== false && /今/.test(r.period || ""); });
    return /今/.test((x && x.period) || "");
  }
  function dot(x, now) { return '<span class="dot' + (now ? " is-now" : "") + '" data-line="' + lineOf(x) + '" aria-hidden="true"></span>'; }
  /* 期間開頭的年月，用來排序：「2023.09 – 2026.01」→ 202309 */
  function startKey(p) { var m = String(p || "").match(/(\d{4})(?:\.(\d{1,2}))?/); return m ? (+m[1]) * 100 + (+(m[2] || 0)) : 0; }
  /* 每筆經歷的錨點 id（路線圖站點連過去用）：依組織中文名產生，名字不變 id 就不變 */
  function idOf(it) {
    var str = t(it.org, "zh"), h = 0;
    for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return "e" + h.toString(36);
  }
  /* 路線名稱（色弱也看得懂：顏色之外一定有文字） */
  function lineName(line) {
    var f = U.visible(S.focus, "web").filter(function (x) { return x.line === line; })[0];
    return f ? t(f.title, L) : "";
  }
  /* 組織圓章：有 logo 用標誌圖檔，沒有就顯示 mark 簡稱 */
  function orgMark(it) {
    var inner = it.logo
      ? '<img src="/' + esc(String(it.logo).replace(/^\//, "")) + '" alt="" loading="lazy">'
      : '<span>' + esc(it.mark || t(it.org, "zh").charAt(0)) + "</span>";
    var long = !it.logo && String(it.mark || "").length > 2;
    return '<span class="org-mark' + (isNow(it) ? " is-now" : "") + (it.logo ? " has-logo" : "") + (long ? " is-long" : "") + '" data-line="' + lineOf(it) + '" aria-hidden="true">' + inner + "</span>";
  }

  /* 圖例：三條路線的名稱取自 content.js 的 focus */
  function legend(cls) {
    var items = U.visible(S.focus, "web").filter(function (f) { return f.line; }).map(function (f) {
      return '<span data-line="' + f.line + '">' + (cls === "route-legend" ? "" : dot(f, true)) + esc(t(f.title, L)) + "</span>";
    }).join("");
    return items ? '<div class="' + cls + '">' + items + (cls === "route-legend" ? '<span class="now">' + tx("最新一站", "Latest") + "</span>" : "") + "</div>" : "";
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
    var seek = t(S.seeking, L);

    /* 職涯路線圖：經歷裡有 station 的條目，依開始年月排列；最後一站是「現在位置」 */
    /* 站點：每個職務上有 station 的，都是一站（用那個職務的期間） */
    var stations = [];
    (S.groups || []).forEach(function (g) {
      if (g.show === false || g.web === false) return;
      U.visible(g.items, "web").forEach(function (it) {
        rolesOf(it).forEach(function (r) {
          if (r.station) stations.push({ org: it.org, line: it.line, item: it, station: r.station, period: r.period });
        });
      });
    });
    stations.sort(function (a, b) { return startKey(a.period) - startKey(b.period); });
    /* 路線分段上色：通往某一站的那一段，用那一站的路線色（像捷運圖）。
       每一站都連到經歷頁的那一筆。 */
    var route = stations.length ? '<div class="route" data-reveal aria-label="' + tx("經歷路線圖", "Career route") + '">' + legend("route-legend") +
      '<ol class="route-track">' + stations.map(function (it, i) {
        var here = i === stations.length - 1;
        return '<li class="station' + (here ? " is-here" : "") + '" style="--i:' + i + '">' +
          (i ? '<span class="seg" data-line="' + lineOf(it) + '"></span>' : "") +
          '<a href="/experience.html#' + idOf(it.item) + '" title="' + esc(t(it.org, L) + (lineName(it.line) ? "（" + lineName(it.line) + "）" : "")) + '">' +
          dot(it, /今/.test(it.period || "")) + '<span class="y">' + String(startKey(it.period)).slice(0, 4) + '</span><span class="n">' + esc(t(it.station, L)) + "</span></a></li>";
      }).join("") + "</ol></div>" : "";

    var html =
      '<section class="hero"><div class="wrap">' +
        '<div class="hero-grid"><div>' +
          '<div class="hero-name"><h1>' + esc(EN ? S.name.en : S.name.zh) + '</h1><span class="en">' + esc(EN ? S.name.zh : S.name.en) + "</span></div>" +
          '<div class="intro">' +
            (tl ? '<p class="tagline">' + esc(tl) + "</p>" : "") +
            (seek ? '<p class="seeking"><span class="seeking-dot" aria-hidden="true"></span>' + esc(seek) + "</p>" : "") +
            '<p class="summary">' + esc(t(S.summary, L)) + "</p>" +
            (roles ? '<ul class="roles">' + roles + "</ul>" : "") +
          "</div></div>" +
          '<div class="photo" id="photoWrap"></div>' +
        "</div>" +
      "</div></section>";

    /* 頁面內的連結按鈕：每一區看完，接到對應的分頁 */
    function goto(href, zh, en) {
      return '<p class="go" data-reveal><a class="go-btn" href="' + href + '"><span class="go-dot" aria-hidden="true"></span>' + esc(tx(zh, en)) + "</a></p>";
    }

    /* 首頁順序：關注領域 → 歷程（路線圖＋最新三則近況） */
    var focus = U.visible(S.focus, "web");
    if (focus.length) html += block("focus", t(S.focusHeading, L), '<div class="focus">' + focus.map(function (i) {
      return '<div class="focus-item" data-reveal data-line="' + lineOf(i) + '"><h3>' + esc(t(i.title, L)) + "</h3><p>" + esc(t(i.text, L)) + "</p></div>";
    }).join("") + "</div>" + goto("/work.html", "看代表作", "See selected work"), true);

    /* 歷程：上面是路線圖（從起點到現在位置），下面接最新三則近況，當成路線的延續。
       近況只顯示最新 NEWS_SHOWN 則；更早的留在 content.js 不刪 */
    var NEWS_SHOWN = 3;
    var news = U.visible(S.news, "web").slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); }).slice(0, NEWS_SHOWN);
    var newsHtml = news.length ? '<div class="history-news" data-reveal><h3 class="history-sub">' + tx("最近", "Latest") + '</h3><ul class="news">' + news.map(function (n, i) {
      var txt = esc(t(n.text, L));
      if (n.url) txt = '<a href="' + esc(n.url) + '" target="_blank" rel="noopener">' + txt + "</a>";
      return '<li data-reveal style="--i:' + i + '">' + dot(n, false) + '<span class="d">' + esc(n.date || "") + "</span><span>" + txt + "</span></li>";
    }).join("") + "</ul></div>" : "";
    if (route || newsHtml) html += block("history", tx("歷程", "Journey"), route + newsHtml + goto("/experience.html", "看完整經歷", "See full experience"));

    main.innerHTML = html;

    /* 相片：找不到檔案就換成姓氏字樣 */
    var pw = document.getElementById("photoWrap");
    var fallback = function () { pw.innerHTML = '<div class="photo-fallback">' + esc(S.name.zh.charAt(0)) + "</div>"; };
    if (S.photo) { var img = new Image(); img.alt = S.name.zh; img.onerror = fallback; img.src = "/" + S.photo.replace(/^\//, ""); pw.appendChild(img); }
    else fallback();

    addPersonData();
  }

  /* ---------- 經歷：每一組是一段路線，條目是站點 ----------
     段落＝content.js 的 groups（學生自治、研究與教學、人本交通、學歷、其他）。
     每段內：主要經歷在前、次要（minor）在後；同一類「現職在前、過去在後」，其餘照 content.js 的順序。
     次要經歷先收起來，按「顯示其他」才出現。現職／過去用實心／空心圓章表示，不另加標籤。 */
  function renderExperience() {
    var title = tx("經歷", "Experience");
    setTitle(title);
    var groups = (S.groups || []).filter(function (g) { return g.show !== false && g.web !== false && U.visible(g.items, "web").length; });
    function ordered(items) {
      return items.map(function (it, i) { return { it: it, i: i }; }).sort(function (a, b) {
        return (a.it.minor ? 1 : 0) - (b.it.minor ? 1 : 0) || (isNow(a.it) ? 0 : 1) - (isNow(b.it) ? 0 : 1) || a.i - b.i;
      }).map(function (x) { return x.it; });
    }
    function roleLine(r) { return esc(t(r.role, L)) + (r.period ? "　" + esc(U.period(r.period, L)) : ""); }
    function item(it, i) {
      /* 一個組織職務超過三個時，先顯示三個，其餘收合；content.js 寫 fold: false 的全部展開 */
      var rs = rolesOf(it), ROLES_SHOWN = it.fold === false ? 99 : 3;
      var rolesHtml = rs.map(function (r, ri) {
        var p = U.period(r.period, L), now = /今/.test(r.period || "");
        var pts = (r.points || []).filter(function (x) { return x.show !== false && x.web !== false; })
          .map(function (x) { return "<li>" + esc(t(x, L)) + "</li>"; }).join("");
        return '<li class="exp-role' + (now ? " is-now" : "") + (ri >= ROLES_SHOWN ? " is-extra" : "") + '"><div class="exp-role-head"><span class="role-name">' + esc(t(r.role, L)) + "</span>" +
          (p ? '<span class="exp-period">' + esc(p) + "</span>" : "") + "</div>" +
          (pts ? '<ul class="item-points">' + pts + "</ul>" : "") + "</li>";
      }).join("");
      var more = it.more ? '<a class="exp-more" href="' + esc(it.more) + '">' + tx("完整過程見代表作", "See the full story") + " →</a>" : "";
      return '<li class="exp-item' + (it.minor ? " is-more is-minor" : "") + '" id="' + idOf(it) + '" data-reveal data-line="' + lineOf(it) + '" style="--i:' + i + '">' + orgMark(it) +
        '<div><div class="exp-head"><div class="item-main">' + esc(t(it.org, L)) + "</div></div>" +
        /* 只有一個職務也用同樣的圓點樣式，全頁每一行職務看起來一致 */
        '<ul class="exp-roles is-multi">' + rolesHtml + "</ul>" +
        (rs.length > ROLES_SHOWN ? '<button class="roles-more" type="button">' + tx("顯示其他 " + (rs.length - ROLES_SHOWN) + " 個職務", "Show " + (rs.length - ROLES_SHOWN) + " more roles") + "</button>" : "") +
        more + "</div></li>";
    }
    /* 橫跨兩段的經歷（also）：正式放在自己那段，另一段只放一行連結 */
    function alsoLines(g) {
      var out = [];
      groups.forEach(function (h) {
        if (h === g) return;
        U.visible(h.items, "web").forEach(function (it) {
          if (it.also !== g.key) return;
          var r = rolesOf(it)[0];
          out.push('<li class="exp-also" data-line="' + lineOf(it) + '"><a href="#' + idOf(it) + '">' + esc(t(it.org, L)) + "　" + (r ? roleLine(r) : "") + "</a>" +
            '<span class="exp-also-note">' + tx("見「" + t(h.title, L) + "」", "see " + t(h.title, L)) + "</span></li>");
        });
      });
      return out.join("");
    }
    /* 正式 CV 的下載只放在經歷頁（2026-11-02 使用者決定，頁首不放） */
    var cvBtn = '<p class="exp-cv"><a class="go-btn" href="' + CV_PDF.href + '" download="' + esc(CV_PDF.name) + '"><span class="go-dot" aria-hidden="true"></span>' + tx("下載正式 CV（PDF）", "Download CV (PDF)") + "</a></p>";
    var inner = cvBtn + '<div class="exp-grid">' + groups.map(function (g) {
      var items = ordered(U.visible(g.items, "web"));
      /* 整段都是次要經歷（例：其他經歷與研習）時直接展開，不然那一段只剩一顆按鈕、看起來是空的 */
      var minorN = items.filter(function (it) { return it.minor; }).length, allMinor = minorN === items.length;
      return '<div class="exp-group' + (allMinor ? " show-all" : "") + '" id="g-' + esc(g.key || "") + '" data-line="' + esc(g.line || "") + '">' +
        '<h3 class="exp-title">' + esc(t(g.title, L)) + '</h3><ul class="exp-list">' + items.map(item).join("") + alsoLines(g) + "</ul>" +
        (minorN && !allMinor ? '<button class="more-btn" type="button" data-g="g-' + esc(g.key || "") + '">' +
          tx("顯示其他 " + minorN + " 筆", "Show " + minorN + " more") + "</button>" : "") +
      "</div>";
    }).join("") + "</div>";
    main.innerHTML = block("experience", title, inner);
    main.querySelectorAll(".more-btn[data-g]").forEach(function (b) {
      b.onclick = function () { document.getElementById(b.dataset.g).classList.add("show-all"); b.remove(); };
    });
    main.querySelectorAll(".roles-more").forEach(function (b) {
      b.onclick = function () { b.previousElementSibling.classList.add("show-extra"); b.remove(); };
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
      return '<article class="work" data-reveal data-line="' + lineOf(w) + '"><div><h3>' + dot(w, true) + esc(t(w.title, L)) + '</h3><p class="desc">' + esc(t(w.text, L)) + "</p>" +
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
    var title = tx("媒體", "Media");
    setTitle(title);
    var media = U.visible(S.media, "web"), full = S.mediaList === "full";
    function src(m) { return t(m.kind === "show" ? m.program : m.outlet, L); }
    function vurl(m) { return m.url || ("https://www.youtube.com/watch?v=" + m.id); }
    function byDate(a, b) { return String(b.date).localeCompare(String(a.date)); }
    /* 日期顯示和全站一致：「2025-05-05」→「2025.05」；只知道年份就只寫年份 */
    function day(m) { return String(m.date || "").replace(/^(\d{4})-(\d{2}).*$/, "$1.$2"); }
    function row(m, label) {
      return '<li><a href="' + esc(vurl(m)) + '" target="_blank" rel="noopener"><span class="d">' + esc(day(m)) +
        "</span><span>" + (label ? "<b>" + esc(label) + "</b>　" : "") + esc(t(m.title, L)) + "</span></a></li>";
    }
    var feat = media.filter(function (m) { return m.featured; });
    var html = feat.length ? '<div class="media-feat">' + feat.map(function (m) {
      var thumb = m.id ? '<img loading="lazy" alt="" onerror="this.remove()" src="https://i.ytimg.com/vi/' + esc(m.id) + '/hqdefault.jpg">' : "";
      return '<a class="vid" data-reveal href="' + esc(vurl(m)) + '" target="_blank" rel="noopener"><div class="thumb">' + thumb + "</div>" +
        '<div class="src">' + esc(src(m)) + '</div><div class="vt">' + esc(t(m.title, L)) + '</div><div class="vd">' + esc(day(m)) + "</div></a>";
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
          shows[k].length + tx(" 集", " episodes") + '</span></div><div class="ep-dots" data-reveal aria-hidden="true">' + shows[k].map(function (m, n) { return '<i style="--k:' + n + '"></i>'; }).join("") + "</div></li>";
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
      '<p class="footnote">' + esc(S.name.zh + " " + S.name.en) + "　" + tx("最後更新 ", "Last updated ") + esc(S.updated || "") + "</p></div>";
    document.body.appendChild(f);
  }

  /* ---------- 結構化資料（schema.org Person），只放首頁 ----------
     Google 用來辨識「游博安」這個人；內容全部取自 content.js。
     網址用 common.js 的 SITE_URL（換網域只改那裡和 sitemap.xml、robots.txt、各 html 的 canonical）。 */
  var SITE_URL = U.SITE_URL;
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

  /* ---------- 動畫：進畫面才浮現（像水滴落下） ---------- */
  var targets = document.querySelectorAll("[data-reveal]");
  if (ANIM && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (el) { io.observe(el); });
  } else targets.forEach(function (el) { el.classList.add("is-in"); });

  /* ---------- 動畫：畫面外的區塊暫停循環動畫（省電、捲動順） ----------
     看不到的區塊加 is-off，style.css 第 10-3 段把裡面的動畫暫停；捲回來就繼續 */
  if (ANIM && "IntersectionObserver" in window) {
    var off = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.classList.toggle("is-off", !e.isIntersecting); });
    }, { rootMargin: "120px 0px" });
    document.querySelectorAll("#main > section, footer.contact").forEach(function (el) { off.observe(el); });
  }

  /* ---------- 動畫：點按鈕時，從點的位置盪開一圈水波 ---------- */
  if (ANIM) document.addEventListener("pointerdown", function (ev) {
    var el = ev.target.closest && ev.target.closest(".btn, .lang-btn, .more-btn, .proof a, .contact .social a");
    if (!el) return;
    var r = el.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2;
    var w = document.createElement("span");
    w.className = "tap-ripple";
    w.style.cssText = "width:" + d + "px;height:" + d + "px;left:" + (ev.clientX - r.left - d / 2) + "px;top:" + (ev.clientY - r.top - d / 2) + "px";
    el.appendChild(w);
    setTimeout(function () { w.remove(); }, 700);
  });

  /* ---------- 從首頁路線圖點過來：捲到那一筆並閃一下 ---------- */
  if (location.hash.length > 1) {
    var hit = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (hit) {
      hit.classList.add("is-in");
      var grp = hit.closest(".exp-group");
      if (grp) { grp.classList.add("show-all"); var mb = grp.querySelector(".more-btn"); if (mb) mb.remove(); }
      setTimeout(function () { hit.scrollIntoView({ block: "center", behavior: ANIM ? "smooth" : "auto" }); hit.classList.add("flash"); }, 60);
    }
  }
})();
