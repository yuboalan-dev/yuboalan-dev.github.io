# CLAUDE.md｜游博安個人網站

這份檔案給所有 AI 助理讀（ChatGPT／Codex 從 `AGENTS.md` 被導到這裡）。**請一律用繁體中文回答。**

## 這是什麼

游博安（Alan Yu）的個人網站。`main` 每次更新，GitHub Actions（`.github/workflows/pages.yml`）就跑 `tools/build.mjs` 建置並發布到 GitHub Pages（Settings → Pages → Source 必須是「GitHub Actions」）：
<https://yuboalan-dev.github.io/>

- 目的：求職政治幕僚用的個人介紹，主角是「游博安這個人」，不是議長職位。
- 讀者：國會／地方議會辦公室、政黨、智庫的招募者，多半只看 30 秒。
- 設計淵源：視覺語言來自政大學生議會官網〈現任議長〉頁（深藍黑 `#000024`＋標誌紅 `#e60012`）。
- 目前設計（v6，2026-11-02）：「圓點路線圖＋水滴」——經歷畫成捷運路線，圓點是站點也是水滴（實心＝現在、空心＝過去）；三個關注領域是三條路線色（gov 藍、china 金、transport 綠，`content.js` 的 `line`）；紅點只代表「現在位置」；首頁職涯路線圖依年份排列（`station`）、分段上色、每站連到經歷頁該筆；經歷每筆有組織圓章（`logo` 圖檔或 `mark` 簡稱）並附路線文字標籤（色弱也看得懂）；媒體頁一集一個點；字型昭源圓黑，按鈕膠囊形；CV PDF 維持黑體。使用者明確要求以圓點為 UI 核心、圓點寓意水滴、要更多動畫。
- 動畫（style.css 第 10 段、10-2 段）：站點水滴落下＋漣漪、路線分段畫出、捲動浮現（`data-reveal`）、集數點依序滴出、點擊水波；10-2 段是「活起來」的循環效果（10-3 段：畫面外的區塊由 `site.js` 加 `is-off` 暫停，省電）：虛線往現在流動、進行中的圓點與圓章呼吸、現在位置持續泛波、照片漂浮、點陣底紋漂移、簡介逐行淡入、連結底線滑入。全部以 `html.anim` 為前提，「減少動態效果」時不播、內容直接顯示；`tools/build.mjs` 存檔前會拿掉動畫狀態。
- 連線一律用虛線（使用者 2026-11-02 要求），不用實線。

## 正本與待辦

- 程式與內容一律以本 repo 的 `main` 為準；其他地方（對話、專案檔案、壓縮檔）的副本都視為失效。
- **進行中的工作與待辦記在 GitHub Issue**，不寫在本檔。開工前先看開著的 Issue。
- 使用者已經做過的決定記在下面「已決定的事」；要推翻先問。

## 工作流程（2026-11-02 使用者同意）

- **AI 一律開分支、發 PR，不直接推 `main`**；合併由使用者本人按。PR 會自動跑建置當檢查（頁面程式出錯或預設 CV 超過一頁就失敗），檢查沒過不要請使用者合併。
- **使用者自己在 GitHub 網頁上小改 `content.js`，照舊直接改 `main`**，不用走 PR。
- **一個 commit 只做一件事**（改內容、改動畫、改 CV 版面分開），方便日後單獨退回。PR 也盡量一個主題一個。
- **同一時間只讓一個 AI 動手**（Claude、ChatGPT／Codex 擇一）；開工前先 `git fetch` 看 `main` 和開著的 PR，有別人的 PR 還沒合併就先問使用者。
- 推上 `main` 後預設 CV 超過一頁：網站照樣發布，workflow 自動開 Issue「CV 超過一頁」；回到一頁會自動關掉。

## 檔案分工

| 檔案 | 內容 | 誰改 |
|---|---|---|
| `content.js` | 網站和 CV 上的**所有文字與資料**（唯一一份） | 使用者自己會在 GitHub 網頁上改 |
| `index.html`、`experience.html`、`work.html`、`media.html` | 各分頁的 `<head>`（標題、描述、canonical）；內容由 `site.js` 依 `data-page` 畫出 | AI |
| `site.js` | 所有分頁共用的版面程式：頁首導覽、各區塊、頁尾聯絡；分頁清單 `PAGES` 只在這裡 | AI |
| `cv.html` | 正式 CV（A4、中英切換、列印存 PDF） | AI |
| `style.css` | 樣式；顏色、尺寸等參數只在第 0 段 | AI |
| `common.js` | 共用工具、語言切換、社群圖示 | AI |
| `tools/build.mjs` | 建置：預先產生各分頁 HTML（給搜尋引擎與社群預覽）、資源網址加內容版本號（`?v=雜湊`，避免讀者瀏覽器拿到舊檔）、產生 CV PDF（`cv/yuboan-cv-zh.pdf`、`cv/alan-yu-cv-en.pdf`，及完整版 `*-full.pdf`）、檢查 CV 頁數（完整版不檢查）、依 `tools/og.html` 產生分享圖 `assets/og.jpg` | AI |
| `tools/og.html` | 分享圖版型（讀 `content.js` 的姓名、照片、站點）；路線色要與 `style.css` 第 0 段一致 | AI |
| `404.html` | 找不到頁面；資源路徑一律 `/` 開頭 | AI |
| `assets/` | 照片 `photo.jpg`（900×1200）、分享圖 `og.jpg`（1200×630；建置時依 `content.js` 自動重畫，repo 裡那份只是備用）、組織標誌 `logos/`、圖示授權 | — |

## 規則

- **同一個資料只維護一份**：文字只放 `content.js`，不要寫死在 HTML。必須重複時（例：網域出現在 `sitemap.xml`、`robots.txt`、`index.html` 開頭），寫註解說明要一起改哪幾處。
- **`content.js` 要讓不懂程式的人改得動**：欄位名稱不改、每段有中文註解；新增欄位要在檔頭說明，並更新 `README.md`。
- **個資**：repo 是公開的。電話、住址、身分證號不得進 repo。Email、社群帳號使用者已同意公開。
- **CV 預設要剛好一頁 A4**（中、英文都是）。完整版（`cv.html?full=1`）會列出 `cv: false` 的次要經歷，不限頁數；聯絡方式仍照 `cv: false`。動到 `content.js` 文字量或 `cv.html` 樣式後要實測：用 Playwright 以 `preferCSSPageSize` 輸出 PDF，確認頁數。
- **圖示**用 Bootstrap Icons（MIT，內嵌在 `common.js`，授權在 `assets/LICENSE-bootstrap-icons.txt`），不要自己畫，也不要改成外部 CDN。
- **照片**上傳前要縮圖並移除 EXIF（可能含拍攝地點）。
- **組織標誌**只用使用者提供的圖檔（放 `assets/logos/`，於 `content.js` 的 `logo` 指定）；AI 不自己畫，也不從網路抓別人的標誌。
- **commit 作者**使用 `游博安 <yuboalan@gmail.com>`（使用者同意公開）。

## 已決定的事（推翻前先問使用者）

- 職稱統一寫「國立政治大學學生議會 議長」（不用「學生會議長」）。
- 校學士寫「哲學、政治學與經濟學專長」，不用「跨域彈性修業試辦計畫」。
- 媒體：TVBS 三則不放；2023 年與侯友宜相關片段不放；政論節目在網站上只列節目名與集數（`mediaList: "summary"`）；「通告」YouTube 播放清單連結不公開（含上述片段）。
- 首頁不放「數字證據列」（使用者覺得沒意義，2026-11-02 移除）。
- 頁首按鈕直接下載 CV PDF（一頁版）；可勾選照片等選項的 `cv.html` 與完整版 CV 只從頁尾小連結進入（2026-11-02）。
- 經歷資料（2026-11-02 依使用者 CV.pdf、FB 與聘函整理）：一個組織一筆、職務放 `roles`；同組織的屆次（如學聯第六、七屆）、政治系的學歷與獎學金合在同一組織；參與式預算三案集中在「臺北市政府參與式預算」，指南路小組只寫小組本身並指向它。
- 網站分頁（2026-11-02）：首頁＝首屏（姓名、照片、身分）→ 關注領域 → 一路走來（路線圖）→ 近況；經歷、代表作、媒體各自一頁。首頁每一區結尾有連到對應分頁的按鈕（關注領域→代表作、一路走來→經歷、近況→媒體），使用者明確要求。避免重複：CV 下載只在頁首；社群圖示只在頁尾；首屏不放連結；已在精選出現的新聞不在清單重複。
- 組織名稱一律用正式全名、同一個組織全站同一個寫法（使用者 2026-11-02 指出「學聯」兩處名稱不同）：例如「社團法人臺灣學生聯合會」「社團法人下一代人本交通促進會」「國立政治大學野火陣線社」；首頁身分、近況也用同樣的名稱。
- IG／FB／Threads／LINE 只放網站，不印在正式 CV（`cv: false`）。
- 建中：網站顯示、CV 不放。

## 改完怎麼驗收

1. 本機：`python3 -m http.server` 開起來，用 Playwright 看桌機（1280）與手機（390）寬度，確認沒有 console 錯誤、沒有水平捲軸。
2. CV：中英文各輸出一次 PDF，確認一頁。
3. 本機試跑建置：`npm install --no-save playwright@1.48.2 && npx playwright install chromium && node tools/build.mjs`（Playwright 版本要和 `.github/workflows/pages.yml` 一致，否則排版有細微差異、CV 頁數可能對不上），確認 `_site/` 各頁只有一份頁首頁尾、CV PDF 都是一頁。`_site/` 不要提交。
4. 發 PR 後等 PR 上的建置檢查通過，再請使用者合併；合併後等「建置並發布網站」workflow 跑完（`gh api repos/yuboalan-dev/yuboalan-dev.github.io/actions/runs`）。
5. 用瀏覽器開正式網址確認。GitHub Pages 會快取約 10 分鐘，要強制重新載入（`fetch(url, {cache:'reload'})` 後再 reload）。
6. **沒在瀏覽器實際看過正式網址，就寫「未驗證」**，不要寫「已上線」。
