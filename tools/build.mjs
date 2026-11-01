/* =========================================================
   tools/build.mjs ── GitHub 每次更新網站時自動執行（不用手動跑）
   ---------------------------------------------------------
   做三件事，結果放在 _site/（GitHub Pages 發布的就是這個資料夾）：
   1. 複製網站檔案
   2. 用瀏覽器把各分頁畫好，存成「內容已經在裡面」的 HTML
      → 搜尋引擎、LINE／FB／LinkedIn 預覽不用跑程式也看得到內容
   3. 產生正式 CV 的 PDF：cv/yuboan-cv-zh.pdf、cv/alan-yu-cv-en.pdf
      → 頁首「下載 CV」直接下載這兩個檔
   CV 超過一頁時不會擋住發布，但會在 GitHub Actions 紀錄裡出現警告。

   本機要試跑：npm install --no-save playwright && node tools/build.mjs
   ========================================================= */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const OUT = path.join(ROOT, "_site");
const SKIP = new Set([".git", ".github", "tools", "node_modules", "_site", "package.json", "package-lock.json"]);
const PAGES = ["index.html", "experience.html", "work.html", "media.html", "404.html"];
const CVS = [
  { lang: "zh", file: "cv/yuboan-cv-zh.pdf" },
  { lang: "en", file: "cv/alan-yu-cv-en.pdf" }
];

/* 1. 複製檔案 */
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT);
for (const name of fs.readdirSync(ROOT)) {
  if (SKIP.has(name)) continue;
  fs.cpSync(path.join(ROOT, name), path.join(OUT, name), { recursive: true });
}

/* 用一個小伺服器把原始檔案開起來給瀏覽器讀 */
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
                ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8" };
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = path.join(ROOT, p === "/" ? "index.html" : p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
let failed = false;

/* 資源網址加上內容雜湊（例：/site.js?v=3f9a1c2d），檔案一改網址就變，
   讀者的瀏覽器就不會拿暫存的舊版（GitHub Pages 預設暫存約 10 分鐘） */
const ASSETS = ["style.css", "content.js", "common.js", "site.js"];
const VER = Object.fromEntries(ASSETS.map(a => [a, crypto.createHash("sha1").update(fs.readFileSync(path.join(ROOT, a))).digest("hex").slice(0, 8)]));
function bust(html) {
  for (const a of ASSETS) html = html.split(`"/${a}"`).join(`"/${a}?v=${VER[a]}"`).split(`"${a}"`).join(`"${a}?v=${VER[a]}"`);
  return html;
}

/* 2. 預先產生各分頁（一律用中文版；英文版由瀏覽器即時切換） */
for (const f of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto(`${BASE}/${f}`, { waitUntil: "networkidle" });
  if (errors.length) { console.log(`::error file=${f}::頁面程式錯誤：${errors.join(" / ")}`); failed = true; }
  const html = await page.evaluate(() => {
    document.body.setAttribute("data-prerendered", "zh");
    /* 動畫狀態不要存進檔案：沒有 JavaScript 的讀者（搜尋引擎、社群預覽）要直接看到內容 */
    document.documentElement.classList.remove("anim");
    document.querySelectorAll(".is-in, .flash").forEach(el => el.classList.remove("is-in", "flash"));
    /* 頁尾原本被加在 <script> 後面；移到 <main> 後面，site.js 執行時才找得到並清掉 */
    const f = document.querySelector("footer.contact"), m = document.getElementById("main");
    if (f && m) m.after(f);
    return "<!doctype html>\n" + document.documentElement.outerHTML;
  });
  fs.writeFileSync(path.join(OUT, f), bust(html));
  console.log(`已產生 ${f}`);
  await ctx.close();
}

fs.writeFileSync(path.join(OUT, "cv.html"), bust(fs.readFileSync(path.join(ROOT, "cv.html"), "utf8")));

/* 3. 產生 CV PDF，並檢查是不是一頁 */
fs.mkdirSync(path.join(OUT, "cv"), { recursive: true });
for (const { lang, file } of CVS) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(`${BASE}/cv.html?lang=${lang}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const pdf = await page.pdf({ printBackground: true, preferCSSPageSize: true });
  fs.writeFileSync(path.join(OUT, file), pdf);
  const pages = (pdf.toString("latin1").match(/\/Type\s*\/Page(?!s)/g) || []).length;
  console.log(`已產生 ${file}（${pages} 頁）`);
  if (pages !== 1) console.log(`::warning file=content.js::${lang === "zh" ? "中文" : "英文"} CV 變成 ${pages} 頁，請精簡 content.js 的文字（CLAUDE.md 規定預設一頁）`);
  await ctx.close();
}

await browser.close();
server.close();
if (failed) process.exit(1);
