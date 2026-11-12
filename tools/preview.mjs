/* =========================================================
   tools/preview.mjs ── PR 的「前後對照」（GitHub 在每個 PR 自動執行，不用手動跑）
   ---------------------------------------------------------
   比較「改之前」（main）和「改之後」（PR）兩份網站：
   1. 文字：讀兩邊 content.js 的 window.SITE，列出新增、修改、刪除的文字
   2. CV：中英文預設版各幾頁
   3. 畫面：各分頁桌機（1280）與手機（390）、中英文 CV 各拍一張；
      只保留有變的，新舊兩張都存下來
   結果放在輸出資料夾：*.png 與 comment.md（PR 留言內容）。
   comment.md 裡的圖片網址用 {{IMG}} 代替，由 workflow 換成實際位置。

   用法：node tools/preview.mjs <改之前的資料夾> <改之後的資料夾> <輸出資料夾>
   本機試跑：先 git worktree add /tmp/base main，再
            node tools/preview.mjs /tmp/base . /tmp/preview-out
   ========================================================= */
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { chromium } from "playwright";
import { PNG } from "pngjs";

const [BASE_DIR, HEAD_DIR, OUT] = process.argv.slice(2).map(p => p && path.resolve(p));
if (!OUT) { console.error("用法：node tools/preview.mjs <改之前> <改之後> <輸出資料夾>"); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });

/* 要拍的畫面。分頁清單改了（site.js 的 PAGES）要一起改這裡 */
const PAGES = [
  { file: "index.html", name: "首頁" },
  { file: "experience.html", name: "經歷" },
  { file: "work.html", name: "代表作" },
  { file: "media.html", name: "媒體" }
];
const SIZES = [{ key: "desktop", name: "桌機", width: 1280 }, { key: "mobile", name: "手機", width: 390 }];
const CVS = [{ lang: "zh", name: "中文 CV" }, { lang: "en", name: "英文 CV" }];

/* ---------- 兩份網站都假裝在正式網址上開（CV 會印出網址，用假埠號會讓每張 CV 都被當成「有變」）。
   請求正式網址的檔案時直接從資料夾讀；Google 字型等外部資源照常連線 ---------- */
const ORIGIN = "https://yuboalan-dev.github.io";
const before = { dir: BASE_DIR, url: ORIGIN }, after = { dir: HEAD_DIR, url: ORIGIN };
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
async function mount(ctx, root) {
  await ctx.route(u => u.origin === ORIGIN, route => {
    const p = decodeURIComponent(new URL(route.request().url()).pathname);
    const file = path.join(root, p === "/" ? "index.html" : p);
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return route.fulfill({ status: 404, body: "" });
    return route.fulfill({ path: file });
  });
}

/* 不播動畫（減少動態效果），兩次拍出來才會一樣 */
async function open(site, url, width, media) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce", deviceScaleFactor: 1 });
  await mount(ctx, site.dir);
  const page = await ctx.newPage();
  if (media) await page.emulateMedia({ media });
  const res = await page.goto(site.url + url, { waitUntil: "networkidle" }).catch(() => null);
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  return { ctx, page, ok: !!res && res.ok() };
}

/* ---------- 1. 文字差異 ---------- */
/* 直接讀 content.js 檔案本身（不經過網頁程式，網頁程式會替資料補上 group 等內部欄位，比較時變成雜訊） */
function siteData(site) {
  try {
    const sandbox = { window: {} };
    vm.runInNewContext(fs.readFileSync(path.join(site.dir, "content.js"), "utf8"), sandbox, { timeout: 2000 });
    return sandbox.window.SITE ? JSON.parse(JSON.stringify(sandbox.window.SITE)) : null;
  } catch (e) { return null; }
}
/* 陣列裡的一筆用它自己的名稱當標籤（例如組織名），新增一筆在最上面時才不會整串都被當成「改了」 */
function labelOf(x) {
  if (x == null || typeof x !== "object") return null;
  for (const k of ["org", "title", "role", "name", "label", "text", "outlet", "show"]) {
    const v = x[k];
    if (typeof v === "string" && v) return v;
    if (v && typeof v === "object" && typeof v.zh === "string" && v.zh) return v.zh;
  }
  if (typeof x.zh === "string" && x.zh) return x.zh.length > 24 ? x.zh.slice(0, 24) + "…" : x.zh;
  if (typeof x.date === "string") return x.date;
  if (typeof x.id === "string") return x.id;
  return null;
}
/* content.js 頂層欄位的中文名稱（新增欄位時順便補；沒補就顯示英文欄位名） */
const KEY_NAMES = { updated: "更新日期", avatar: "首頁頭像", avatarDots: "頭像點數", avatarNote: "頭像說明", routeStart: "歷程起點", belief: "首頁主句", evidence: "首頁證據", evidenceHeading: "證據區標題", nowHeading: "現職區標題", english: "英文版開關", name: "姓名", tagline: "首頁定位句", seeking: "求職狀態", seekingRotate: "求職輪播", highlights: "簡介螢光筆", headline: "身分一句", roles: "首頁身分", photo: "照片", summary: "簡介",
  expertise: "專長", links: "社群與連結", cvContact: "CV 聯絡方式", news: "近況", groups: "經歷", focusHeading: "關注領域標題",
  focus: "關注領域", works: "代表作", mediaList: "媒體清單列法", media: "媒體", zh: "中文", en: "英文", period: "期間",
  points: "條列說明", url: "連結", date: "日期" };
const TECH = new Set(["line", "key", "collapsed"]);
const SUB_NAMES = { items: "", roles: "", text: "", zh: "", en: "英文", role: "職稱", period: "期間", points: "條列說明",
  line: "路線色", minor: "收進「顯示其他」", also: "另見", more: "代表作連結", title: "標題", org: "組織", station: "路線圖站點",
  cv: "放進 CV", web: "放上網站", show: "顯示", mark: "圓章簡稱", logo: "標誌", url: "連結", date: "日期", key: "代號", note: "一句話說明", thumb: "用縮圖", image: "作品圖", stats: "數字", num: "數值", unit: "單位", label: "說明", words: "輪播詞", caption: "圖說", alt: "替代文字", src: "圖檔" };
const show = v => typeof v === "string" ? `「${v}」` : JSON.stringify(v);
const changes = [];
function diff(a, b, trail) {
  const where = trail.join(" › ") || "（整份）";
  if (JSON.stringify(a) === JSON.stringify(b)) return;
  if (a === undefined || b === undefined) {
    const v = a === undefined ? b : a, l = v && typeof v === "object" ? labelOf(v) : null;
    /* 一整筆新增／刪除：標籤已經在內容裡，路徑就不再重複 */
    const at = l && trail[trail.length - 1] === l ? trail.slice(0, -1).join(" › ") || "（整份）" : where;
    return changes.push({ kind: a === undefined ? "新增" : "刪除", where: at, text: summarize(v) });
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    const key = (x, i) => labelOf(x) ?? `第 ${i + 1} 筆`;
    const ka = a.map(key), kb = b.map(key);
    const unique = new Set(ka).size === ka.length && new Set(kb).size === kb.length;
    if (!unique) { const n = Math.max(a.length, b.length); for (let i = 0; i < n; i++) diff(a[i], b[i], [...trail, `第 ${i + 1} 筆`]); return; }
    for (let i = 0; i < b.length; i++) diff(a[ka.indexOf(kb[i])], b[i], [...trail, kb[i]]);
    for (let i = 0; i < a.length; i++) if (!kb.includes(ka[i])) diff(a[i], undefined, [...trail, ka[i]]);
    if (ka.filter(k => kb.includes(k)).join("\n") !== kb.filter(k => ka.includes(k)).join("\n"))
      changes.push({ kind: "順序", where, text: "排列順序改了" });
    return;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (TECH.has(k)) continue;  /* 只影響顏色或內部代號的欄位，看畫面截圖就好，不列在文字差異 */
      /* 頂層欄位用 KEY_NAMES；裡面一層用 SUB_NAMES；items、roles 這種容器名稱不顯示，路徑才短 */
      const name = trail.length === 0 ? (KEY_NAMES[k] || k) : SUB_NAMES[k];
      diff(a[k], b[k], name === "" ? trail : [...trail, name || k]);
    }
    return;
  }
  changes.push({ kind: "修改", where, text: `${show(a)} → ${show(b)}` });
}
function summarize(v) {
  if (v == null || typeof v !== "object") return show(v);
  const l = labelOf(v);
  return l ? `「${l}」一整筆` : "一整筆";
}

const dataBefore = siteData(before), dataAfter = siteData(after);
if (dataBefore && dataAfter) diff(dataBefore, dataAfter, []);

/* ---------- 2. 畫面與 CV 頁數 ---------- */
/* 一列像素是否相同（反鋸齒之類的零星雜點不算） */
function rowSame(x, ya, y, yb) {
  const w = x.width * 4, oa = ya * w, ob = yb * w;
  let off = 0;
  for (let i = 0; i < w; i += 4)
    if (Math.abs(x.data[oa + i] - y.data[ob + i]) + Math.abs(x.data[oa + i + 1] - y.data[ob + i + 1]) + Math.abs(x.data[oa + i + 2] - y.data[ob + i + 2]) > 48 && ++off > 2) return false;
  return true;
}
/* 找出有變的區段：從上往下第一列不同、從下往上第一列不同（中間插入一段也找得到）。沒變回傳 null */
function changedBand(a, b) {
  const x = PNG.sync.read(a), y = PNG.sync.read(b);
  if (x.width !== y.width) return { x, y, same: false };
  const h = Math.min(x.height, y.height);
  let top = 0; while (top < h && rowSame(x, top, y, top)) top++;
  if (top === h && x.height === y.height) return null;
  let bot = 0; while (bot < h - top && rowSame(x, x.height - 1 - bot, y, y.height - 1 - bot)) bot++;
  return { x, y, same: true, top, endA: x.height - bot, endB: y.height - bot };
}
function crop(img, from, to) {
  const out = new PNG({ width: img.width, height: Math.max(1, to - from) });
  img.data.copy(out.data, 0, from * img.width * 4, to * img.width * 4);
  return PNG.sync.write(out);
}
const PAD = 160;  /* 裁切時上下多留的像素，看得出位置 */

async function shot(site, url, width, media) {
  const { ctx, page, ok } = await open(site, url, width, media);
  const png = ok ? await page.screenshot({ fullPage: true }) : null;
  await ctx.close();
  return png;
}
async function cvPages(site, lang) {
  const { ctx, page, ok } = await open(site, `/cv.html?lang=${lang}`, 1280);
  const pdf = ok ? await page.pdf({ printBackground: true, preferCSSPageSize: true }) : null;
  await ctx.close();
  return pdf ? (pdf.toString("latin1").match(/\/Type\s*\/Page(?!s)/g) || []).length : null;
}

const shots = [];
for (const p of PAGES) for (const s of SIZES) shots.push({ id: `${p.file.replace(".html", "")}-${s.key}`, title: `${p.name}（${s.name}）`, url: `/${p.file}`, width: s.width });
/* content.js 的 english: false（英文版先關掉）時，英文 CV 跟中文一樣，不重複拍 */
const CVS_ON = CVS.filter(c => c.lang === "zh" || !dataAfter || dataAfter.english !== false);
for (const c of CVS_ON) shots.push({ id: `cv-${c.lang}`, title: c.name, url: `/cv.html?lang=${c.lang}`, width: 794, media: "print" });

const changed = [];
for (const s of shots) {
  const a = await shot(before, s.url, s.width, s.media), b = await shot(after, s.url, s.width, s.media);
  const band = a && b ? changedBand(a, b) : undefined;
  if (band === null) continue;
  if (a) fs.writeFileSync(path.join(OUT, `${s.id}-before.png`), a);
  if (b) fs.writeFileSync(path.join(OUT, `${s.id}-after.png`), b);
  /* 長頁面另存「只有變動那一段」的裁切圖，留言裡先看這個，點了再看整頁 */
  let cropped = false;
  if (band && band.same && (band.x.height > 1400 || band.y.height > 1400)) {
    const from = Math.max(0, band.top - PAD);
    fs.writeFileSync(path.join(OUT, `${s.id}-before-crop.png`), crop(band.x, from, Math.min(band.x.height, Math.max(band.endA, band.top) + PAD)));
    fs.writeFileSync(path.join(OUT, `${s.id}-after-crop.png`), crop(band.y, from, Math.min(band.y.height, Math.max(band.endB, band.top) + PAD)));
    cropped = true;
  }
  changed.push({ ...s, a: !!a, b: !!b, cropped });
  console.log(`畫面有變：${s.title}`);
}
const pages = [];
for (const c of CVS_ON) pages.push({ name: c.name, a: await cvPages(before, c.lang), b: await cvPages(after, c.lang) });

await browser.close();

/* ---------- 3. 寫出 PR 留言 ---------- */
const md = [];
md.push(`## 前後對照`, ``, `左邊是現在網站上的（\`main\`），右邊是這個 PR 合併後會變成的樣子。看完沒問題，在對話裡說「可以」或直接按 Merge。`, ``);
md.push(`### 文字`);
if (!dataBefore || !dataAfter) md.push(`⚠️ 讀不到${!dataAfter ? "改之後" : "改之前"}的 content.js（可能有語法錯誤），無法比較文字。`);
else if (!changes.length) md.push(`content.js 的文字沒有變。`);
else {
  const MAX = 60;
  for (const c of changes.slice(0, MAX)) md.push(`- **${c.kind}**　${c.where}：${c.text}`);
  if (changes.length > MAX) md.push(`- ……另有 ${changes.length - MAX} 處，請看 PR 的 Files changed`);
}
md.push(``, `### CV 頁數（預設版，應該都是 1 頁）`, ``, `| | 改之前 | 改之後 |`, `|---|---|---|`);
for (const p of pages) md.push(`| ${p.name} | ${p.a ?? "—"} | ${p.b ?? "—"}${p.b !== 1 ? " ⚠️" : ""} |`);
md.push(``, `### 畫面`);
if (!changed.length) md.push(`各分頁（桌機、手機）和 CV 的畫面都沒有變。`);
else {
  md.push(`只列出有變的畫面；點標題展開。`, ``);
  for (const c of changed) {
    md.push(`<details${changed.length <= 3 ? " open" : ""}><summary><b>${c.title}</b></summary>`, ``);
    md.push(`| 改之前 | 改之後 |`, `|---|---|`);
    const w = c.width > 800 ? 420 : 300, sfx = c.cropped ? "-crop" : "";
    const cell = (has, side, none) => has ? `<a href="{{IMG}}/${c.id}-${side}.png"><img src="{{IMG}}/${c.id}-${side}${sfx}.png" width="${w}"></a>` : none;
    md.push(`| ${cell(c.a, "before", "（沒有這一頁）")} | ${cell(c.b, "after", "（打不開）")} |`);
    if (c.cropped) md.push(``, `只截有變動的那一段；點圖片看整頁。`);
    md.push(``, `</details>`, ``);
  }
}
fs.writeFileSync(path.join(OUT, "comment.md"), md.join("\n") + "\n");
console.log(`文字差異 ${changes.length} 處、畫面有變 ${changed.length} 張`);
