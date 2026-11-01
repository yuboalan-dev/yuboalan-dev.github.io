# CLAUDE.md｜游博安個人網站

這份檔案給所有 AI 助理讀（ChatGPT／Codex 從 `AGENTS.md` 被導到這裡）。**請一律用繁體中文回答。**

## 這是什麼

游博安（Alan Yu）的個人網站。`main` 每次更新，GitHub Actions（`.github/workflows/pages.yml`）就跑 `tools/build.mjs` 建置並發布到 GitHub Pages（Settings → Pages → Source 必須是「GitHub Actions」）：
<https://yuboalan-dev.github.io/>

- 目的：求職政治幕僚用的個人介紹，主角是「游博安這個人」，不是議長職位。
- 讀者：國會／地方議會辦公室、政黨、智庫的招募者，多半只看 30 秒。
- 設計淵源：視覺語言來自政大學生議會官網〈現任議長〉頁（深藍黑 `#000024`＋標誌紅 `#e60012`）。
- 目前設計（v4，2026-11-02）：「議會桌牌」概念——首屏唯一大膽的元素是深藍底直排白字姓名桌牌，其餘版面安靜留白；標題用 Noto Serif TC、內文 Noto Sans TC；區塊為左欄標題、右欄內容。標誌紅只用在桌牌底邊、條列記號與少數重點。

## 正本與待辦

- 程式與內容一律以本 repo 的 `main` 為準；其他地方（對話、專案檔案、壓縮檔）的副本都視為失效。
- **進行中的工作與待辦記在 GitHub Issue**，不寫在本檔。開工前先看開著的 Issue。
- 使用者已經做過的決定記在下面「已決定的事」；要推翻先問。

## 檔案分工

| 檔案 | 內容 | 誰改 |
|---|---|---|
| `content.js` | 網站和 CV 上的**所有文字與資料**（唯一一份） | 使用者自己會在 GitHub 網頁上改 |
| `index.html`、`experience.html`、`work.html`、`media.html` | 各分頁的 `<head>`（標題、描述、canonical）；內容由 `site.js` 依 `data-page` 畫出 | AI |
| `site.js` | 所有分頁共用的版面程式：頁首導覽、各區塊、頁尾聯絡；分頁清單 `PAGES` 只在這裡 | AI |
| `cv.html` | 正式 CV（A4、中英切換、列印存 PDF） | AI |
| `style.css` | 樣式；顏色、尺寸等參數只在第 0 段 | AI |
| `common.js` | 共用工具、語言切換、社群圖示 | AI |
| `tools/build.mjs` | 建置：預先產生各分頁 HTML（給搜尋引擎與社群預覽）、產生 CV PDF（`cv/yuboan-cv-zh.pdf`、`cv/alan-yu-cv-en.pdf`）、檢查 CV 頁數 | AI |
| `404.html` | 找不到頁面；資源路徑一律 `/` 開頭 | AI |
| `assets/` | 照片 `photo.jpg`（900×1200）、分享圖 `og.jpg`（1200×630）、圖示授權 | — |

## 規則

- **同一個資料只維護一份**：文字只放 `content.js`，不要寫死在 HTML。必須重複時（例：網域出現在 `sitemap.xml`、`robots.txt`、`index.html` 開頭），寫註解說明要一起改哪幾處。
- **`content.js` 要讓不懂程式的人改得動**：欄位名稱不改、每段有中文註解；新增欄位要在檔頭說明，並更新 `README.md`。
- **個資**：repo 是公開的。電話、住址、身分證號不得進 repo。Email、社群帳號使用者已同意公開。
- **CV 預設要剛好一頁 A4**（中、英文都是）。動到 `content.js` 文字量或 `cv.html` 樣式後要實測：用 Playwright 以 `preferCSSPageSize` 輸出 PDF，確認頁數。
- **圖示**用 Bootstrap Icons（MIT，內嵌在 `common.js`，授權在 `assets/LICENSE-bootstrap-icons.txt`），不要自己畫，也不要改成外部 CDN。
- **照片**上傳前要縮圖並移除 EXIF（可能含拍攝地點）。
- **commit 作者**使用 `游博安 <yuboalan@gmail.com>`（使用者同意公開）。

## 已決定的事（推翻前先問使用者）

- 職稱統一寫「國立政治大學學生議會 議長」（不用「學生會議長」）。
- 校學士寫「哲學、政治學與經濟學專長」，不用「跨域彈性修業試辦計畫」。
- 媒體：TVBS 三則不放；2023 年與侯友宜相關片段不放；政論節目在網站上只列節目名與集數（`mediaList: "summary"`）；「通告」YouTube 播放清單連結不公開（含上述片段）。
- 首頁不放「數字證據列」（使用者覺得沒意義，2026-11-02 移除）。
- 頁首按鈕直接下載 CV PDF；可勾選照片等選項的 `cv.html` 只從頁尾小連結進入（2026-11-02）。
- 網站分頁（2026-11-02）：首頁＝桌牌首屏＋關注領域＋近況；經歷、代表作、媒體各自一頁。避免重複：CV 按鈕只在頁首導覽；社群圖示只在頁尾；首屏不放和導覽重複的連結；已在精選出現的新聞不在清單重複。
- IG／FB／Threads／LINE 只放網站，不印在正式 CV（`cv: false`）。
- 建中：網站顯示、CV 不放。

## 改完怎麼驗收

1. 本機：`python3 -m http.server` 開起來，用 Playwright 看桌機（1280）與手機（390）寬度，確認沒有 console 錯誤、沒有水平捲軸。
2. CV：中英文各輸出一次 PDF，確認一頁。
3. 本機試跑建置：`npm install --no-save playwright && node tools/build.mjs`，確認 `_site/` 各頁只有一份頁首頁尾、CV PDF 都是一頁。`_site/` 不要提交。
4. 推上 `main` 後，等「建置並發布網站」workflow 跑完（`gh api repos/yuboalan-dev/yuboalan-dev.github.io/actions/runs`）；CV 超過一頁會在紀錄裡出現警告。
5. 用瀏覽器開正式網址確認。GitHub Pages 會快取約 10 分鐘，要強制重新載入（`fetch(url, {cache:'reload'})` 後再 reload）。
6. **沒在瀏覽器實際看過正式網址，就寫「未驗證」**，不要寫「已上線」。
