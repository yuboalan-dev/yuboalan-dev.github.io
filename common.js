/* =========================================================
   common.js ── 網站與 CV 共用的小工具（平常不用改）
   ========================================================= */
(function () {
  var S = window.SITE;

  /* --- 語言：網址 ?lang=en 優先，其次是上次選的，預設中文 --- */
  function getLang() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q === "en" || q === "zh") return q;
    try { var s = localStorage.getItem("lang"); if (s === "en" || s === "zh") return s; } catch (e) {}
    return "zh";
  }
  function setLang(l) {
    try { localStorage.setItem("lang", l); } catch (e) {}
    var u = new URL(location.href);
    u.searchParams.set("lang", l);
    location.href = u.toString();
  }

  /* 取某個 {zh, en} 欄位；英文沒填就退回中文 */
  function t(obj, lang) {
    if (obj == null) return "";
    if (typeof obj === "string") return obj;
    return (lang === "en" && obj.en) ? obj.en : (obj.zh || obj.en || "");
  }

  /* 期間：英文版把「今」「（預計）」換掉 */
  function period(p, lang) {
    if (!p) return "";
    if (lang !== "en") return p;
    return p.replace(/今/g, "Present").replace(/（預計）/g, " (expected)");
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* 過濾：show:false 一律不顯示；where = "web" 或 "cv" */
  function visible(list, where) {
    return (list || []).filter(function (x) {
      if (x.show === false) return false;
      if (where === "web" && x.web === false) return false;
      if (where === "cv" && x.cv === false) return false;
      return true;
    });
  }

  /* 連結網址：email 自動加 mailto: */
  function href(link) {
    if (link.type === "email" && link.url.indexOf("mailto:") !== 0) return "mailto:" + link.url;
    return link.url;
  }
  /* CV 上顯示的文字：去掉 https://、www. */
  function prettyUrl(link) {
    return link.url.replace(/^mailto:/, "").replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  }

  /* --- 圖示（線條風格，跟著文字顏色變色） --- */
  var P = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  var ICONS = {
    email:     '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
    facebook:  '<path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z"/>',
    threads:   '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.9 7.9"/>',
    linkedin:  '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    github:    '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3.1-.3 6.4-1.5 6.4-7A5.4 5.4 0 0 0 20 4.8 5.1 5.1 0 0 0 19.9 1S18.7.6 16 2.5a13.4 13.4 0 0 0-7 0C6.3.6 5.1 1 5.1 1A5.1 5.1 0 0 0 5 4.8a5.4 5.4 0 0 0-1.5 3.8c0 5.4 3.3 6.6 6.4 7A3.4 3.4 0 0 0 9 18.1V22"/>',
    x:         '<path d="M4 4l16 16M20 4 4 20"/>',
    youtube:   '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>',
    medium:    '<path d="M4 7h2l6 10 6-10h2M4 17h4M16 17h4"/>',
    website:   '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
    phone:     '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    location:  '<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>'
  };
  function icon(type) {
    return '<svg viewBox="0 0 24 24" ' + P + ' aria-hidden="true">' + (ICONS[type] || ICONS.website) + "</svg>";
  }

  function activeLinks() {
    return (S.links || []).filter(function (l) { return l.url && l.show !== false; });
  }

  window.UTIL = {
    S: S, getLang: getLang, setLang: setLang, t: t, period: period, esc: esc,
    visible: visible, href: href, prettyUrl: prettyUrl, icon: icon, activeLinks: activeLinks
  };
})();
