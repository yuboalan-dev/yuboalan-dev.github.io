# CLAUDE.md｜游博安個人網站

這份檔案給所有 AI 助理讀（ChatGPT／Codex 從 `AGENTS.md` 被導到這裡）。**請一律用繁體中文回答。**

## 這是什麼

游博安（Alan Yu）的個人網站。`main` 每次更新，GitHub Actions（`.github/workflows/pages.yml`）就跑 `tools/build.mjs` 建置並發布到 GitHub Pages（Settings → Pages → Source 必須是「GitHub Actions」）：
<https://yuboalan-dev.github.io/>

- 目的：求職政治幕僚用的個人介紹，主角是「游博安這個人」，不是議長職位。
- 讀者：國會／地方議會辦公室、政黨、智庫的招募者，多半只看 30 秒。
- 設計淵源：視覺語言來自政大學生議會官網〈現任議長〉頁（深藍黑 `#000024`＋標誌紅 `#e60012`）。
- 設計與互動的細節（圓點路線圖、首頁版面、動畫、互動效果）記在 [`docs/design.md`](docs/design.md)；動到 `site.js`、`style.css`、`motion.js` 前必讀。一句話：以圓點為 UI 核心（圓點寓意水滴），經歷畫成捷運路線；首頁是信念句＋可互動的頭像。

## 正本與待辦

- 程式與內容一律以本 repo 的 `main` 為準；其他地方（對話、專案檔案、壓縮檔）的副本都視為失效。
- **進行中的工作與待辦記在 GitHub Issue**，不寫在本檔。開工前先看開著的 Issue。
- 使用者已經做過的決定記在 [`docs/decisions.md`](docs/decisions.md)；**動手前必讀，要推翻先問**。
- 經歷怎麼分段、怎麼寫，記在 [`docs/experience-rules.md`](docs/experience-rules.md)；動到經歷資料、CV 分段或經歷頁前必讀。
- 改版的分期與順序記在釘選的「改版路線圖」Issue（#30）；一期一個 Issue、一個 PR，各期的 Issue 掛在同名的 Milestone（第 2 期～第 6 期）上，進度看 Milestone。
- Issue 標籤：`內容`、`程式`、`設計`、`等使用者`。**使用者只需要看 `等使用者`**（[這個連結](https://github.com/yuboalan-dev/yuboalan-dev.github.io/issues?q=is%3Aopen+label%3A%E7%AD%89%E4%BD%BF%E7%94%A8%E8%80%85)）：下一步要使用者決定或提供素材的 Issue 才貼，使用者做完就拿掉；使用者已經說「先不急」的不貼。開新 Issue 時一定要貼標籤、掛 Milestone。

## 工作流程（2026-11-02 使用者同意；確認的重點是看前後差異，不是按合併）

- **AI 一律開分支、發 PR，不直接推 `main`**。PR 會自動跑兩件事：
  - 建置檢查：頁面程式出錯或預設 CV 超過一頁就失敗；沒過就先修，不要請使用者確認。
  - **前後對照**（`tools/preview.mjs`）：自動在 PR 貼一則留言，列出 `content.js` 的文字差異、CV 頁數、有變的畫面（各分頁桌機／手機、中英文 CV）新舊並排。截圖存在 `previews` 分支（不進 `main`、不發布），PR 關閉後自動刪除。新增分頁時，`tools/preview.mjs` 的 `PAGES` 要一起改；`content.js` 新增頂層欄位時，順便補 `KEY_NAMES` 的中文名稱。
- **使用者看過前後對照、表示同意才合併**。使用者在對話裡明確說可以時，AI 可以代為合併（`gh api -X PUT repos/yuboalan-dev/yuboalan-dev.github.io/pulls/<編號>/merge`）；使用者也可以自己按 Merge。請使用者確認時，附上 PR 連結並用一兩句話說明對照裡最該看的地方。
- **使用者自己在 GitHub 網頁上小改 `content.js`，照舊直接改 `main`**，不用走 PR。
- **一個 commit 只做一件事**（改內容、改動畫、改 CV 版面分開），方便日後單獨退回。PR 也盡量一個主題一個。
- **同一時間只讓一個 AI 動手**（Claude、ChatGPT／Codex 擇一）；開工前先 `git fetch` 看 `main` 和開著的 PR（含草稿），有別人的 PR 還沒合併就先問使用者。
- **開工先佔位**（2026-11-17）：動手改檔案前，先推分支、開**草稿 PR**（標題寫要做什麼），等於告訴其他 AI「這裡有人在做」；做完、自己看過前後對照，再轉成正式 PR 請使用者確認。放棄不做就把 PR 關掉。
- 推上 `main` 後預設 CV 超過一頁：網站照樣發布，workflow 自動開 Issue「CV 超過一頁」；回到一頁會自動關掉。

## 誰做什麼（2026-11-11 使用者要求）

| 工作 | 交給誰 |
|---|---|
| 架構規劃、跨檔重構、視覺改版、建置工具（`site.js`、`style.css`、`motion.js`、`tools/`） | Claude 最強的模型 |
| 照既有格式加經歷、改 `content.js`、小修版面 | Claude 中階模型（Sonnet） |
| 錯字、日期格式、連結失效檢查 | Claude 輕量模型（Haiku），或使用者自己在 GitHub 網頁改 |
| 訪談使用者、故事與自傳的文字初稿 | ChatGPT |
| 複查 PR | 不是寫的那一個（Claude 寫就給 ChatGPT 查，反之亦然）；複查留言不寫他人姓名 |
| 決定方向、提供照片與佐證、取得他人同意、合併 | 使用者 |

- 寫的和審的不同家；文字先定稿再進 repo；同一時間只有一個 AI 動手（見上方工作流程）。
- 模型名稱會換代，這張表看的是等級，不是特定版本。

## 檔案分工

| 檔案 | 內容 | 誰改 |
|---|---|---|
| `content.js` | 網站和 CV 上的**所有文字與資料**（唯一一份） | 使用者自己會在 GitHub 網頁上改 |
| `index.html`、`experience.html`、`work.html`、`media.html` | 各分頁的 `<head>`（標題、描述、canonical）；內容由 `site.js` 依 `data-page` 畫出 | AI |
| `site.js` | 所有分頁共用的版面程式：頁首導覽、各區塊、頁尾聯絡；分頁清單 `PAGES` 只在這裡 | AI |
| `cv.html` | 產生正式 CV 的工具（A4、可勾選選項、列印存 PDF）；網站不連結，正式 CV 是建置產生的 PDF | AI |
| `style.css` | 樣式；顏色、尺寸等參數只在第 0 段 | AI |
| `common.js` | 共用工具、語言切換、社群圖示 | AI |
| `motion.js` | 互動效果（路線隨捲動畫出、首屏點陣水面、站點預覽小卡、求職輪播、數字累加、螢光筆、頁尾識別證）；減少動態效果與自動化瀏覽器時不執行，樣式在 `style.css` 第 12 段 | AI |
| `tools/build.mjs` | 建置：預先產生各分頁 HTML（給搜尋引擎與社群預覽）、資源網址加內容版本號（`?v=雜湊`，避免讀者瀏覽器拿到舊檔）、產生 CV PDF（`cv/yuboan-cv-zh.pdf`；英文版開關打開時另有 `cv/alan-yu-cv-en.pdf`）、檢查 CV 頁數、依 `tools/og.html` 產生分享圖 `assets/og.jpg` | AI |
| `tools/og.html` | 分享圖版型（讀 `content.js` 的姓名、照片、站點）；路線色要與 `style.css` 第 0 段一致 | AI |
| `404.html` | 找不到頁面；資源路徑一律 `/` 開頭 | AI |
| `docs/` | 給維護者與 AI 看的文件：`decisions.md` 已決定的事、`design.md` 設計與互動的細節、`experience-rules.md` 經歷的整理準則；不發布到網站 | AI（使用者同意後） |
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

## 改完怎麼驗收

1. 本機：`python3 -m http.server` 開起來，用 Playwright 看桌機（1280）與手機（390）寬度，確認沒有 console 錯誤、沒有水平捲軸。
2. CV：中英文各輸出一次 PDF，確認一頁。
3. 本機試跑建置：`npm install --no-save playwright@1.48.2 && npx playwright install chromium && node tools/build.mjs`（Playwright 版本要和 `.github/workflows/pages.yml` 一致，否則排版有細微差異、CV 頁數可能對不上），確認 `_site/` 各頁只有一份頁首頁尾、CV PDF 都是一頁。`_site/` 不要提交。
4. 發 PR 後等建置檢查通過、前後對照留言出來，自己先看過對照（確認改到的就是要改的、沒有誤傷別頁），再請使用者確認；合併後等「建置並發布網站」workflow 跑完（`gh api repos/yuboalan-dev/yuboalan-dev.github.io/actions/runs`）。
5. 用瀏覽器開正式網址確認。GitHub Pages 會快取約 10 分鐘，要強制重新載入（`fetch(url, {cache:'reload'})` 後再 reload）。
6. **沒在瀏覽器實際看過正式網址，就寫「未驗證」**，不要寫「已上線」。
