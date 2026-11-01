# 游博安 Alan Yu｜個人網站

設計：「圓點路線圖」——經歷畫成捷運路線，圓點是站點也是水滴；三個關注領域各一條路線色，紅點代表現在位置。詳見 `CLAUDE.md`。

## 檔案

| 檔案 | 用途 | 要不要改 |
|---|---|---|
| `content.js` | **所有文字、經歷、連結** | ✅ 平常只改這個 |
| `assets/photo.jpg` | 大頭照（直式 3:4） | ✅ 換照片就上傳同名檔覆蓋 |
| `index.html`、`experience.html`、`work.html`、`media.html` | 首頁與三個分頁（內容由 `site.js` 畫出） | 不用 |
| `site.js` | 各分頁共用的版面 | 不用 |
| `cv.html` | 正式 CV（A4，可列印／存 PDF，中英切換） | 不用 |
| `style.css` | 外觀；想換顏色只改第 0 段 | 很少 |
| `common.js` | 首頁與 CV 共用的小程式；社群圖示（Bootstrap Icons，MIT 授權）也在這裡 | 不用 |

網站和 CV 讀的是同一份 `content.js`，改一次兩邊一起更新。

## 發布設定

網站已經上線，平常不用動。萬一要重設：repo 的 **Settings → Pages → Source** 必須選 **GitHub Actions**（不是 *Deploy from a branch*），否則 CV PDF 和預先產生的網頁不會出現。每次 `main` 有更新，Actions 會自動建置並發布，約 2～3 分鐘。

AI 的改動會開成 PR（Pull request），PR 裡會自動出現一則「前後對照」留言：改了哪些字、CV 幾頁、哪些畫面變了（新舊並排）。看完沒問題，跟 AI 說「可以」由它合併，或自己按 **Merge**，才會上線。你自己改 `content.js` 直接 Commit 到 `main` 就好。

## 之後要更新

- **改文字**：在 repo 點 `content.js` → 右上角鉛筆 → 改完 **Commit changes**。1～2 分鐘後生效。
  看起來沒變就強制重新整理（Windows `Ctrl+Shift+R`／Mac `Cmd+Shift+R`）。
- **加一筆經歷**：複製同一區裡的一整筆 `{ ... },`，貼在下面再改字。同一個組織有新職務，在那一筆的 `roles` 最上面加一行就好。
- **先藏起來不刪**：在那一筆加 `show: false,`。
- **網站有、CV 不放**：加 `cv: false,`；反過來用 `web: false,`。標 `cv: false` 的經歷仍會出現在「完整版 CV」（頁尾連結，不限一頁）。
- **加一筆媒體**：在 `media` 複製一行，改 `date`、`title`，`id` 填 YouTube 網址 `watch?v=` 後面那 11 碼；非 YouTube 的改用 `url: "..."`。
  `featured: true` 會放進網站最上面的精選影片（建議維持 3～4 支）。CV 會自動統計每個節目的集數和年份，不用另外改。
- **媒體清單的列法**：`mediaList: "summary"` 時，政論節目只列節目名、集數、年份；改成 `"full"` 會逐集列出。逐集資料一律保留在 `media`，CV 的集數統計照算。
- **經歷**在 `groups`：每組是經歷頁的一段，也是 CV 的一段。CV 段落順序在 `cv.html` 的 `CV_ORDER`。
- **首頁定位句**在 `tagline`，留空就不顯示。
- **圓點顏色**：每筆經歷的 `line` 決定圓點顏色（`gov` 藍、`china` 金、`transport` 綠，不寫是灰色）；期間有「今」的自動畫成實心點。
- **首頁路線圖**：經歷加 `station: { zh: "短站名", en: "" }` 就會出現在首頁的職涯路線上，依開始年份排序，最後一站標成「現在位置」。點站點會跳到經歷頁那一筆。
- **組織標誌**：把標誌圖檔（正方形、去背 PNG）上傳到 `assets/logos/`，再把那一筆的 `logo` 填成 `"assets/logos/檔名.png"`。沒填就顯示 `mark` 簡稱。
- **分享預覽圖** `assets/og.jpg` 每次發布時依 `content.js` 自動重畫（姓名、照片、路線站點），不用手動改。
- **近況**在 `news`：一行一件事，網站自動照日期排、先顯示 5 筆。建議每月補一行。
- **其他經歷**標了 `collapsed: true`，首頁只先顯示前 3 筆；拿掉就全部展開。

## 讓 Google 搜得到

- 網站已經有 `sitemap.xml`、`robots.txt`，首頁會自動產生 schema.org 的個人資料（取自 `content.js`）。
- 到 [Google Search Console](https://search.google.com/search-console) 新增資源 → 網址前置字元填 `https://yuboalan-dev.github.io/` → 驗證方式選「HTML 標記」，把那行 `<meta name="google-site-verification" ...>` 給 Claude 放進 `index.html`，驗證後在「Sitemap」提交 `sitemap.xml`。
- 換網域時，`sitemap.xml`、`robots.txt`、`index.html` 開頭的 canonical／og:url／og:image 要一起改。
- **改完整頁空白**：多半是少了逗號或引號。到 `content.js` 的 **History** 找上一版，或把檔案貼給 AI 問「哪裡語法錯了」。

## 正式 CV

- 頁首「下載 CV」直接下載 PDF。PDF 是 GitHub 每次更新網站時自動產生的，改完 `content.js` 不用另外做什麼。
- CV 如果因為文字變多而超過一頁，網站照樣會更新，但 repo 會自動開一個 Issue「CV 超過一頁」提醒你；精簡到一頁後會自動關掉。

## 自己客製 CV（附照片、代表作等）

打開 `cv.html`（網站頁尾的「CV 網頁版」小連結）：

1. 上方選 **中文／English**，勾要不要附照片、關注領域、代表作、媒體。
2. 按 **列印／存成 PDF** → 目的地選 **另存為 PDF**，紙張 **A4**，勾 **背景圖形**。
3. 選項會記在網址裡（例如 `cv.html?lang=en&photo=1`），可以直接把這個網址傳給別人。

預設（附媒體，不附照片／關注領域／代表作）中英文都剛好一頁 A4。

## ⚠️ 注意

- repo 是公開的：**電話、地址、身分證字號不要寫進 `content.js`**。CV 要電話的話，列印前在本機臨時加、印完別上傳。
- 社群連結 `url` 留空就不顯示，填了才出現。
- 英文翻譯是草稿，送出英文 CV 前請再確認各組織的正式英文名稱。
