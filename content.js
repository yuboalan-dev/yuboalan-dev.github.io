/* =========================================================
   content.js ── 網站與 CV 上所有文字都在這裡（v2）
   ---------------------------------------------------------
   ★ 平常只改這一個檔案。index.html、cv.html、style.css 不用動。
     改完在 GitHub 按 Commit changes，1～2 分鐘後網站和 CV 一起更新。

   ★ 改的規則（違反了網頁會整片空白，不會報錯）：
     1. 文字一律包在英文雙引號 "..." 裡；文字裡要引號請用「」。
     2. 每一筆後面要有英文逗號 ,
     3. 大括號 { } 和中括號 [ ] 要成對。
     改壞了：到 GitHub 的 History 找上一版還原。

   ★ 每一筆共用的欄位
     zh / en       中文、英文（en 留空 "" 時，英文版會顯示中文）
     period        期間，例如 "2025 – 今"；英文版自動把「今」換成 Present
     url           連結，留空 "" 就不顯示
     show: false   整筆藏起來（網站和 CV 都不顯示），資料留著
     cv: false     網站顯示、CV 不放        web: false   CV 放、網站不顯示
     points        條列說明（網站卡片不顯示，CV 和代表作會用）
     line          路線（決定圓點顏色）："gov" 議事與治理（藍）、"china" 兩岸與中國政治（金）、
                   "transport" 人本交通與地方提案（綠）；不寫就是灰色
     mark          經歷旁圓章裡的簡稱（一兩個字），沒有標誌圖檔時顯示
     logo          組織標誌圖檔，例如 "assets/logos/nccusc.png"（建議正方形、去背 PNG，
                   放進 assets/logos/ 資料夾）；有填就用標誌、不顯示 mark
     station       放上首頁「路線圖」的站名（短短兩三個字）；不寫就不上路線圖
                   站點依期間的開始年份排列；期間有「今」的會畫成實心點

   ★ 標了【待確認】的是 Claude 依現有資料起的草稿，請改成你要的說法。
   ========================================================= */

window.SITE = {

  updated: "2026-11-01",

  /* ---------- 1. 基本資料 ---------- */
  name: { zh: "游博安", en: "Alan Yu" },

  /* 首頁大標下面那一句定位。留空 "" 就不顯示。【待決定】 */
  tagline: { zh: "", en: "" },

  /* 首頁姓名下方的三個身分（對應議長頁的 roles-area） */
  roles: [
    { line: "gov", zh: "國立政治大學學生議會　議長",       en: "Speaker, NCCU Student Congress" },
    { line: "transport", zh: "下一代人本交通促進會　副秘書長", en: "Deputy Secretary-General, Next Generation People-Oriented Transport Association" },
    { line: "gov", zh: "臺灣學生聯合會　理事",             en: "Board Member, National Students' Union of Taiwan" }
  ],

  /* 照片：命名 photo.jpg 放進 assets 資料夾。沒放時顯示姓氏字樣。 */
  photo: "assets/photo.jpg",

  /* 自我介紹（網站上方與 CV 簡介共用）【待確認】 */
  summary: {
    zh: "政大政治系學生，主修之外修讀哲學、政治學與經濟學專長。現任學生議會議長，曾在政大國際關係研究中心參與陸委會與國科會的中共政治研究；也從校門口的行人穿越道開始，以參與式預算推動指南路的人本交通改善。",
    en: "Political science student (PPE track) at National Chengchi University; Speaker of the NCCU Student Congress; former research assistant on CCP elite politics; transport advocate whose participatory-budget proposals led to pedestrian works on Zhinan Road."
  },

  /* 專長（首頁小標籤 + CV） */
  expertise: [
    { zh: "海峽兩岸關係",   en: "Cross-Strait Relations" },
    { zh: "地緣政治經濟",   en: "Geopolitical Economy" },
    { zh: "公共政策分析",   en: "Public Policy Analysis" },
    { zh: "人本交通政策",   en: "People-Oriented Transport Policy" }
  ],

  /* ---------- 2. 聯絡與社群 ----------
     url 留空就不顯示。type 可用：email, instagram, facebook, threads,
     linkedin, line, github, x, youtube, medium, website
     （圖示來自開源的 Bootstrap Icons，在 common.js）
     cv: false 的只放網站、不印在正式 CV 上                    */
  links: [
    { type: "email",     label: "Email",     url: "yuboalan@gmail.com" },
    { type: "instagram", label: "Instagram", url: "https://www.instagram.com/ckfc_yu/", cv: false },
    { type: "facebook",  label: "Facebook",  url: "https://www.facebook.com/yuboalan/", cv: false },
    { type: "threads",   label: "Threads",   url: "https://www.threads.com/@ckfc_yu", cv: false },
    { type: "linkedin",  label: "LinkedIn",  url: "https://www.linkedin.com/in/yuboalan/" },
    { type: "line",      label: "LINE",      url: "https://line.me/ti/p/OHQbYFXC-N", cv: false },
    /* 「通告」播放清單含 TVBS 與侯友宜片段，精簡後先不公開連結；要放回就把網址填回來：
       https://www.youtube.com/playlist?list=PLLqs_xDeTEg37zm0b7fS2qQ03WcbV-ucn */
    { type: "youtube",   label: "YouTube",   url: "" }
  ],

  /* 只放 CV 的聯絡資料。⚠️ 這個檔案是公開的，電話不要寫在這裡上傳。 */
  cvContact: {
    phone: "",
    location: { zh: "臺北市", en: "Taipei, Taiwan" }
  },

  /* ---------- 2-3. 近況（新的寫在最上面，網站自動照日期排） ----------
     url 可以留空。建議每月補一行，網站看起來才是活的。 */
  news: [
    { date: "2026-11", text: { zh: "接任臺灣學生聯合會第七屆理事", en: "Joined the board of the National Students' Union of Taiwan (7th term)" } },
    { date: "2026-02", text: { zh: "擔任下一代人本交通促進會副秘書長", en: "Became Deputy Secretary-General, Next Generation People-Oriented Transport Association" } },
    { date: "2026-02", text: { zh: "就任國立政治大學學生議會議長", en: "Took office as Speaker of the NCCU Student Congress" } }
  ],

  /* ---------- 3. 經歷（首頁經歷區 + CV 各段） ----------
     每一組是首頁一張卡、也是 CV 的一個段落。順序就是畫面順序。
     collapsed: true 的組，首頁只先顯示前 3 筆。 */
  groups: [

    { key: "current", title: { zh: "現職", en: "Current Positions" }, items: [
      { line: "gov", station: { zh: "議長", en: "Speaker" },
        mark: "議會", logo: "",
        org: { zh: "國立政治大學學生議會", en: "NCCU Student Congress" },
        role: { zh: "議長", en: "Speaker" }, period: "2026.02 – 今",
        points: [
          { zh: "兼任學生會校務諮詢委員會總召集人",
            en: "Chief Convener, Student Association Advisory Committee on University Affairs" },
          { zh: "校務、教務、學務、總務會議學生代表",
            en: "Student representative to four university councils (University, Academic, Student and General Affairs)" },
          { zh: "歷任學生議員、預算委員會召集委員",
            en: "Formerly student legislator and Convener of the Budget Committee" }
        ] },
      { line: "transport", station: { zh: "人本交通", en: "Transport NGO" },
        mark: "人本", logo: "",
        org: { zh: "社團法人下一代人本交通促進會", en: "Next Generation People-Oriented Transport Association" },
        role: { zh: "副秘書長、北部分會會長", en: "Deputy Secretary-General; Chair, Northern Chapter" }, period: "2026.02 – 今" },
      { line: "gov", station: { zh: "學聯理事", en: "Student Union board" },
        mark: "學聯", logo: "",
        org: { zh: "社團法人臺灣學生聯合會", en: "National Students' Union of Taiwan" },
        role: { zh: "第七屆理事", en: "Board Member (7th term)" }, period: "2026.11 – 今" },
      { line: "transport", station: { zh: "指南路", en: "Zhinan Road" },
        mark: "指南", logo: "",
        org: { zh: "指南路交通改善小組", en: "Zhinan Road Traffic Improvement Task Force" },
        role: { zh: "召集人", en: "Convener" }, period: "2025 – 今",
        points: [
          { zh: "文山區參與式預算「指南路二段周遭道路改善計畫」提案人代表（通過）",
            en: "Lead proposer, Zhinan Rd. Sec. 2 street improvement (Wenshan participatory budget, adopted)" },
          { zh: "文山區參與式預算「政大至萬興國小周遭交通改善計畫」提案人（通過）",
            en: "Proposer, NCCU–Wanxing Elementary traffic improvement (Wenshan participatory budget, adopted)" }
        ] }
    ] },

    { key: "research", title: { zh: "研究與教學", en: "Research & Teaching" }, items: [
      { line: "china", station: { zh: "國關中心", en: "IIR research" },
        mark: "國關", logo: "",
        org: { zh: "國立政治大學國際關係研究中心", en: "Institute of International Relations, NCCU" },
        role: { zh: "研究計畫助理", en: "Research Assistant" }, period: "2023.09 – 2026.01",
        points: [
          { zh: "大陸委員會委託研究「習近平反貪腐鬥爭之策略、成效與影響」",
            en: "Mainland Affairs Council study on Xi Jinping’s anti-corruption campaign" },
          { zh: "國科會研究「中共二十大後政治菁英甄補：趨勢、預測與結構變遷」",
            en: "NSTC project on CCP elite recruitment after the 20th Party Congress" }
        ] },
      { line: "china",
        mark: "助教", logo: "",
        org: { zh: "地政學系、傳播學院、國際關係研究中心", en: "NCCU (Land Economics, Communication, IIR)" },
        role: { zh: "課程教學助理", en: "Teaching Assistant" }, period: "2024 – 2026" }
    ] },

    { key: "education", title: { zh: "學歷", en: "Education" }, items: [
      { station: { zh: "政大", en: "NCCU" },
        mark: "政大", logo: "",
        org: { zh: "國立政治大學", en: "National Chengchi University" },
        role: { zh: "政治學系學士班", en: "B.A. in Political Science" },
        period: "2022.09 – 2027（預計）",
        points: [
          { zh: "校學士：哲學、政治學與經濟學專長", en: "University Bachelor track: Philosophy, Politics and Economics" },
          { zh: "輔修經濟學系、哲學系", en: "Minors in Economics and Philosophy" },
          { zh: "人文領袖榮譽學分學程", en: "Humanities Leadership Honors Program" },
          { zh: "中國大陸與兩岸關係研究跨領域學分學程", en: "Interdisciplinary Program in China and Cross-Strait Studies" }
        ] },
      /* 建中：網站顯示、CV 不放 */
      { cv: false,
        station: { zh: "建中", en: "Jianguo HS" },
        mark: "建中", logo: "",
        org: { zh: "臺北市立建國高級中學", en: "Taipei Municipal Jianguo High School" },
        role: { zh: "畢業", en: "Graduated" }, period: "2019 – 2022" }
    ] },

    { key: "experience", collapsed: true, title: { zh: "其他經歷", en: "Other Experience" }, items: [
      { line: "gov",
        mark: "學聯", logo: "",
        org: { zh: "臺灣學生聯合會", en: "National Students' Union of Taiwan" },
        role: { zh: "第六屆公關副祕書長", en: "Deputy Secretary-General, PR (6th term)" }, period: "2025.11 – 2026.10" },
      { mark: "獎", logo: "",
        org: { zh: "政治學系馮麗華傑出系友獎學金", en: "Feng Li-hua Distinguished Alumni Scholarship" },
        role: { zh: "獲獎", en: "Recipient" }, period: "2025" },
      { line: "gov",
        mark: "市府", logo: "",
        org: { zh: "臺北市政府", en: "Taipei City Government" },
        role: { zh: "大專青年學生公部門暑期工讀", en: "Public Sector Summer Intern" }, period: "2025" },
      { line: "transport",
        mark: "中正", logo: "",
        org: { zh: "臺北市中正區參與式預算", en: "Zhongzheng District Participatory Budgeting, Taipei" },
        role: { zh: "「您行我也行」提案人", en: "Proposer" }, period: "2024" },
      { line: "gov", station: { zh: "野火", en: "Wildfire Front" },
        mark: "野火", logo: "",
        org: { zh: "政大野火陣線社", en: "NCCU Wildfire Front Club" },
        role: { zh: "副社長", en: "Vice President" }, period: "2023.02 – 2024.07" },
      { line: "gov",
        mark: "權益", logo: "",
        org: { zh: "政大學生會權益部", en: "Student Rights Department, NCCU Student Association" },
        role: { zh: "部員", en: "Member" }, period: "" }
    ] }
  ],

  /* ---------- 4. 關注領域（取代原本的「理念白皮書」）【待確認】 ---------- */
  focusHeading: { zh: "關注領域", en: "Focus Areas" },
  focus: [
    { line: "gov",
      title: { zh: "議事與治理", en: "Legislatures & Governance" },
      text:  { zh: "擔任學生議會議長與四大校務會議學生代表，處理議事、預算與校務協商；推動議事影音紀錄與直播，讓學生自治更透明。",
               en: "As Speaker and student representative on four university councils, I work on procedure, budgets and negotiation, and pushed for recorded and live-streamed sessions." } },
    { line: "china",
      title: { zh: "兩岸與中國政治", en: "China & Cross-Strait Politics" },
      text:  { zh: "在國關中心參與陸委會與國科會研究，關注中共菁英政治、反貪腐與兩岸關係，並修讀中國大陸與兩岸關係研究學程。",
               en: "Research on CCP elite politics and anti-corruption for the Mainland Affairs Council and NSTC at the Institute of International Relations." } },
    { line: "transport",
      title: { zh: "人本交通與地方提案", en: "Transport & Local Policy" },
      text:  { zh: "從政大校門口的行人穿越道出發，透過參與式預算讓指南路的人行環境改善進入市府工程；現任下一代人本交通促進會北部分會會長。",
               en: "Starting from a crosswalk at the campus gate, used participatory budgeting to get pedestrian improvements on Zhinan Road into city works." } }
  ],

  /* ---------- 5. 代表作 ----------
     steps 是時間軸（一步一行）；links 是佐證連結。 */
  works: [
    { line: "transport",
      title: { zh: "指南路人本交通改善", en: "Making Zhinan Road Walkable" },
      text:  { zh: "從學生自發導護、媒體報導，到參與式預算提案通過、市府辦理人行道改善工程。",
               en: "From student volunteers directing traffic to adopted participatory-budget proposals and city pedestrian works." },
      steps: [
        { zh: "政大行穿道人車爭道，學生自發導護（華視新聞報導）", en: "Students volunteer as crossing guards at the campus gate (CTS News)" },
        { zh: "成立指南路交通改善小組，擔任召集人", en: "Founded and convened the Zhinan Road task force" },
        { zh: "文山區參與式預算兩案提案並通過", en: "Two Wenshan participatory-budget proposals adopted" },
        { zh: "新工處辦理指南路二段雙號側人行道改善工程", en: "City launches sidewalk improvement works on Zhinan Rd. Sec. 2" }
      ],
      links: [
        { label: { zh: "華視新聞報導", en: "CTS News report" }, url: "https://www.youtube.com/watch?v=9rRAOUwd23w" },
        { label: { zh: "參與式預算提案頁", en: "Proposal page" }, url: "https://taipei.join.gov.tw/pb/proposal/detail/976fc32f-0556-45b2-bf56-fd3e64851789" },
        { label: { zh: "工程地區說明會", en: "Public works briefing" }, url: "https://nco.gov.taipei/News_Content.aspx?n=F36AA8E9D896DF42&sms=59AD6E6606F6002F&s=EEC0122512A38BD8" }
      ] },
    { line: "gov",
      title: { zh: "學生議會官網改版與透明議會", en: "Student Congress Website & Transparency" },
      text:  { zh: "主導議會官網從 Google 協作平台遷移到學校平台，建立法規資料庫、歷史沿革與會議資訊，讓議事資料可查、可追溯。",
               en: "Led the migration of the Congress website to the university CMS, with a regulations database, history and meeting records." },
      links: [
        { label: { zh: "學生議會官網", en: "Website" }, url: "https://sc.video.nccu.edu.tw/" },
        { label: { zh: "議長介紹頁", en: "Speaker profile" }, url: "https://sc.video.nccu.edu.tw/p/speaker-now" }
      ] },
    { line: "china",
      title: { zh: "中共菁英政治研究", en: "Research on CCP Elite Politics" },
      text:  { zh: "在國關中心擔任研究計畫助理三年，參與陸委會委託研究與國科會計畫。",
               en: "Three years as research assistant on a Mainland Affairs Council study and an NSTC project." } }
  ],

  /* ---------- 6. 媒體 ----------
     kind: "show" 政論節目 / "news" 新聞受訪
     featured: true 會出現在網站最上面、可以直接點開播放
     YouTube 影片只要填 id（網址 watch?v= 後面那 11 碼）
     date 不確定日的只寫年份或年月                                    */
  /* 網站下方媒體清單的列法："summary" 政論節目只列節目名與集數；"full" 逐集列出 */
  mediaList: "summary",

  media: [
    { kind: "news", featured: true, outlet: "ABC News", date: "2024",
      title: { zh: "台灣選民：沒有人想要戰爭", en: "Taiwan’s voters: ‘Nobody wants war’" }, id: "lfQg3_ChrEM" },
    { kind: "news", featured: true, outlet: { zh: "美國之音", en: "Voice of America" }, date: "2024",
      title: { zh: "習近平在台灣立法院佔據橋頭堡了嗎？", en: "Has Xi gained a foothold in Taiwan’s legislature?" }, id: "KfLoCbna1nk" },
    { kind: "news", featured: true, outlet: { zh: "華視新聞", en: "CTS News" }, date: "2025-05-05",
      title: { zh: "政大行穿道人車爭道　學生自發導護爭經費", en: "NCCU students volunteer as crossing guards" }, id: "9rRAOUwd23w" },

    { kind: "show", program: { zh: "三立《54陪審團》", en: "SET News “54 Jury”" }, date: "2026-10-04",
      title: { zh: "2026 大熱戰", en: "2026 local elections" }, id: "s5CmK5--VxU" },
    { kind: "show", program: { zh: "三立《54陪審團》", en: "SET News “54 Jury”" }, date: "2026-09-12", title: { zh: "沈伯洋專訪破圈、北市營養午餐", en: "" }, id: "bPsPOraUK_0" },
    { kind: "show", program: { zh: "三立《54陪審團》", en: "SET News “54 Jury”" }, date: "2026-08-01", title: { zh: "北市市政爭議", en: "" }, id: "2Jy7kpLOogo" },
    { kind: "show", program: { zh: "三立《54陪審團》", en: "SET News “54 Jury”" }, date: "2026-06-20", title: { zh: "北市府爭議", en: "" }, id: "owdgFmAhiiY" },
    { kind: "show", program: { zh: "三立《54陪審團》", en: "SET News “54 Jury”" }, date: "2026-03-14", title: { zh: "網路論戰與入境爭議", en: "" }, id: "98Uykh_hEtc" },
    { kind: "show", program: { zh: "三立《54陪審團》", en: "SET News “54 Jury”" }, date: "2026",       title: { zh: "京華城案宣判前", en: "" }, id: "IRPD86t9OO8" },
    { kind: "show", program: { zh: "三立《54陪審團》", en: "SET News “54 Jury”" }, date: "2025-12-06", title: { zh: "小紅書禁令", en: "" }, id: "_xhsUjrG9gc" },
    { kind: "show", program: { zh: "三立《54陪審團》", en: "SET News “54 Jury”" }, date: "2025-11-15", title: { zh: "「一中保台」與兩岸對話", en: "" }, id: "0lEkBI7kYOE" },
    { kind: "show", program: { zh: "三立《54陪審團》", en: "SET News “54 Jury”" }, date: "2025-08-23", title: { zh: "延會與國會攻防", en: "" }, id: "E6AnlBMd0ew" },
    { kind: "show", program: { zh: "三立《54陪審團》", en: "SET News “54 Jury”" }, date: "2024-02-04", title: { zh: "立法院長選舉（大選陪審團）", en: "" }, id: "8haavPcY3SY" },
    { kind: "show", program: { zh: "三立《54陪審團》", en: "SET News “54 Jury”" }, date: "2023-09-24", title: { zh: "侯友宜請假參選（大選陪審團）", en: "" }, id: "C7tvOd8ZInc" },

    { kind: "show", program: { zh: "《政治狠狠問》", en: "“Political Grill”" }, date: "2026", title: { zh: "EP176 青年世代與政治溝通", en: "" }, id: "NAzN79j5EQY" },
    { kind: "show", program: { zh: "《政治狠狠問》", en: "“Political Grill”" }, date: "2025", title: { zh: "EP125 日中緊張與國籍法", en: "" }, id: "-KkcXrDAF-c" },
    { kind: "show", program: { zh: "《政治狠狠問》", en: "“Political Grill”" }, date: "2025", title: { zh: "EP114 初選、豬瘟與兩岸", en: "" }, id: "LiroFRt01VQ" },
    { kind: "show", program: { zh: "《政治狠狠問》", en: "“Political Grill”" }, date: "2025", title: { zh: "EP82 大罷免", en: "" }, id: "f3iD0QARDAM" },
    { kind: "show", program: { zh: "《政治狠狠問》", en: "“Political Grill”" }, date: "2025", title: { zh: "罷免最後衝刺：年輕人的真心話", en: "" }, id: "ISrKit8K88Y" },
    { kind: "show", program: { zh: "《政治狠狠問》", en: "“Political Grill”" }, date: "2025", title: { zh: "EP72 國安簡報爭議", en: "" }, id: "NbdBgp9OLGg" },

    { kind: "show", program: { zh: "華視《呂氏戰國BATTLE》", en: "CTS “Lu’s Battle”" }, date: "2024-07-21", title: { zh: "職場態度與年輕世代", en: "" }, id: "dO7GxKr4-a4" },
    { kind: "show", program: { zh: "華視《呂氏戰國BATTLE》", en: "CTS “Lu’s Battle”" }, date: "2024-07-20", title: { zh: "台灣半導體與日本失落三十年", en: "" }, id: "Qilbemvt7p8" },
    { kind: "show", program: { zh: "華視《呂氏戰國BATTLE》", en: "CTS “Lu’s Battle”" }, date: "2024-05-12", title: { zh: "台灣青年海外就職", en: "" }, id: "F4xKsLn3Uxk" },
    { kind: "show", featured: true, program: { zh: "華視《呂氏戰國BATTLE》", en: "CTS “Lu’s Battle”" }, date: "2024-03-31", title: { zh: "美國禁 TikTok 令，青年怎麼看", en: "Young people on the US TikTok ban" }, id: "A7rCde51fr4" }
  ]
};
