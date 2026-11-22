/* =========================================================
   tools/check.mjs ── 公開前的安全檢查（GitHub 在每次建置前自動執行，不用手動跑）
   ---------------------------------------------------------
   repo 是公開的。這裡擋三種不該出現的東西，有任何一項就讓建置失敗、不發布：
   1. 不該放的檔案類型：PDF、Word、Excel、壓縮檔、手機原始照片等
      （佐證原件、申請書、證明文件一律不進 repo；CV 的 PDF 是建置時產生的，不存在 repo）
   2. 圖片裡的 EXIF（可能含拍攝地點、裝置）：上傳前要先移除
   3. 文字檔裡像手機號碼、身分證字號的字串

   誤判時：把那一行寫進下面的 ALLOW（寫明原因），不要關掉整個檢查。
   本機試跑：node tools/check.mjs（不需要安裝任何東西）
   ========================================================= */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
/* 只檢查 git 管理的檔案（也就是會公開的檔案） */
const files = execSync("git ls-files -z", { cwd: ROOT }).toString().split("\0").filter(Boolean);

const BAD_EXT = new Set([".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".zip", ".rar", ".7z", ".heic", ".heif", ".psd", ".ai"]);
const IMG_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const TEXT_EXT = new Set([".js", ".mjs", ".html", ".css", ".md", ".txt", ".xml", ".json", ".yml", ".yaml", ".svg"]);
/* 確認過不是個資的字串（一行一個，寫原因） */
const ALLOW = [
];

const problems = [];
const say = (file, msg) => problems.push({ file, msg });

for (const f of files) {
  const ext = path.extname(f).toLowerCase();
  const abs = path.join(ROOT, f);
  if (!fs.existsSync(abs)) continue;

  if (BAD_EXT.has(ext)) say(f, `不該放進公開 repo 的檔案類型（${ext}）。佐證原件、文件請留在自己電腦`);

  if (IMG_EXT.has(ext)) {
    const buf = fs.readFileSync(abs);
    /* JPEG／WebP 的 EXIF 區塊開頭是「Exif\0\0」；PNG 是 eXIf 區塊 */
    if (buf.includes(Buffer.from("Exif\0\0")) || (ext === ".png" && buf.includes(Buffer.from("eXIf"))))
      say(f, "圖片帶有 EXIF（可能含拍攝地點）。請先移除再上傳（例：用截圖重存，或請 AI 處理）");
  }

  if (TEXT_EXT.has(ext) && f !== "package-lock.json") {
    const lines = fs.readFileSync(abs, "utf8").split("\n");
    lines.forEach((line, i) => {
      if (ALLOW.some(a => line.includes(a))) return;
      /* 手機：09 開頭共 10 碼，中間可有空格或連字號；前後不能再接數字（避免誤判長數字） */
      if (/(?<![\d.])09\d{2}[- ]?\d{3}[- ]?\d{3}(?!\d)/.test(line) || /\+886[- ]?9\d{2}[- ]?\d{3}[- ]?\d{3}(?!\d)/.test(line))
        say(`${f}:${i + 1}`, "像是手機號碼。電話不得進公開 repo");
      /* 身分證字號：一個大寫英文＋1 或 2 或 8 或 9 開頭的 9 碼數字 */
      if (/(?<![A-Za-z0-9])[A-Z][1289]\d{8}(?![A-Za-z0-9])/.test(line))
        say(`${f}:${i + 1}`, "像是身分證或居留證字號。不得進公開 repo");
    });
  }
}

if (problems.length) {
  for (const p of problems) {
    const [file, line] = p.file.split(":");
    console.log(`::error file=${file}${line ? `,line=${line}` : ""}::${p.msg}`);
  }
  console.log(`\n公開前檢查沒過：${problems.length} 個問題（見上）。確定是誤判的話，寫進 tools/check.mjs 的 ALLOW。`);
  process.exit(1);
}
console.log(`公開前檢查通過（${files.length} 個檔案）`);
