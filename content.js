/* =========================================================
   content.js ── 網站與 CV 上所有文字都在這裡（v3）
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
     line          路線（決定圓點顏色）："student" 學生自治（藍）、"research" 研究與教學（金）、
                   "transport" 人本交通（綠）；不寫就是灰色。經歷的每一筆自動用所屬那一組的 line
     mark          經歷旁圓章裡的簡稱（一兩個字），沒有標誌圖檔時顯示
     logo          組織標誌圖檔，例如 "assets/logos/nccusc.png"（建議正方形、去背 PNG，
                   放進 assets/logos/ 資料夾）；有填就用標誌、不顯示 mark
     roles         同一組織的各個職務（經歷用），每個職務有 role、period、points
     station       寫在職務上：放上首頁「路線圖」的站名（短短兩三個字）；不寫就不上路線圖
                   站點依期間的開始年份排列；期間有「今」的會畫成實心點

   ★ 標了【待確認】的是 Claude 依現有資料起的草稿，請改成你要的說法。
   ========================================================= */

window.SITE = {

  updated: "2026-11-02",

  /* 英文版開關：false＝網站和 CV 只有中文（頁首不顯示 EN 按鈕、不產生英文 CV）。
     英文內容（各處的 en）照樣留著，英文校對完改成 true 就恢復。 */
  english: false,

  /* ---------- 1. 基本資料 ---------- */
  name: { zh: "游博安", en: "Alan Yu" },

  /* 首頁大標下面那一句定位。留空 "" 就不顯示。【待決定】 */
  tagline: { zh: "", en: "" },

  /* 首頁姓名下方的身分。首頁用好讀的簡稱（不寫「社團法人」等）；
     formal 是正式全名，CV 標題用它（沒寫就用 zh） */
  roles: [
    { line: "student", zh: "政大學生議會　議長", formal: "國立政治大學學生會學生議會　議長", en: "Speaker, NCCU Student Congress" },
    { line: "transport", zh: "下一代人本交通促進會　副秘書長", en: "Deputy Secretary-General, Next Generation People-Oriented Transport Association" },
    { line: "student", zh: "臺灣學生聯合會　理事", en: "Board Member, National Students' Union of Taiwan" },
    { line: "transport", zh: "政大指南路交通改善小組　召集人", en: "Convener, NCCU Zhinan Road Traffic Task Force" }
  ],

  /* 照片：命名 photo.jpg 放進 assets 資料夾。沒放時顯示姓氏字樣。 */
  photo: "assets/photo.jpg",

  /* 自我介紹（網站上方與 CV 簡介共用）【待確認】 */
  summary: {
    zh: "國立政治大學政治學系學生，修讀哲學、政治學與經濟學專長。現任學生議會議長、臺灣學生聯合會理事與下一代人本交通促進會副秘書長；曾任國關中心研究計畫助理，參與陸委會與國科會的中共政治研究，並以參與式預算推動指南路的人本交通改善。",
    en: "Political science (PPE) student at NCCU; Speaker of its Student Congress; board member, National Students' Union of Taiwan; former research assistant on CCP elite politics; won participatory-budget funding for safer streets."
  },

  /* 專長（首頁小標籤 + CV） */
  expertise: [
    { zh: "海峽兩岸關係",   en: "Cross-Strait Relations" },
    { zh: "地緣政治經濟",   en: "Geopolitical Economy" },
    { zh: "公共政策分析",   en: "Public Policy Analysis" },
    { zh: "人本交通政策",   en: "Transport Policy" }
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

  /* ---------- 2-3. 近況（新的寫在最上面，網站自動照日期排；用簡稱） ----------
     url 可以留空。建議每月補一行，網站看起來才是活的。 */
  news: [
    { date: "2026-11", text: { zh: "接任臺灣學生聯合會理事", en: "Joined the board of the National Students' Union of Taiwan" } },
    { date: "2026-02", text: { zh: "擔任下一代人本交通促進會副秘書長", en: "Became Deputy Secretary-General, Next Generation People-Oriented Transport Association" } },
    { date: "2026-02", text: { zh: "就任政大學生議會議長", en: "Took office as Speaker of the NCCU Student Congress" } }
  ],

  /* ---------- 3. 經歷（經歷頁＋CV） ----------
     每一組（group）是經歷頁的一段，也是一條路線：
       student 學生自治（藍）、research 研究與教學（金）、transport 人本交通（綠）、
       education 學歷、honors 榮譽與獎學金、other 其他（灰）
     組裡每一筆的圓點顏色自動用該組的 line，不用每筆寫。
     一個組織一筆，同一組織的不同職務放在 roles 裡（新的寫上面）：
       { org, mark, logo, minor, also, more,
         roles: [ { role, period, points, station }, ... ] }
     排序：網站上每段自動「現職在前、過去在後」，同一類照這裡寫的順序。
     minor: true   次要經歷：網站上收在「顯示其他」後面；CV 放在「其他經歷與研習」
     also: "transport"  這筆也跟另一段有關：正式放在這段，另一段只顯示一行連結
     more: "/work.html" 在這筆下面加「完整過程見代表作」連結
     fold: false   職務超過三個也全部展開（預設只先顯示三個）
     職稱不寫屆次與會期；日期一律 YYYY.MM – YYYY.MM，現職寫「今」。
     整理準則見 GitHub repo 的 CLAUDE.md「經歷的整理準則」。 */
  groups: [

    { key: "student", line: "student", title: { zh: "學生自治", en: "Student Government" }, items: [
      { mark: "議會", logo: "",
        org: { zh: "國立政治大學學生會學生議會", en: "NCCU Student Congress" },
        roles: [
          { role: { zh: "議長", en: "Speaker" }, period: "2026.02 – 今",
            station: { zh: "議長", en: "Speaker" } },
          { role: { zh: "預算委員會召集委員", en: "Convener, Budget Committee" }, period: "2025.02 – 2025.07" },
          { role: { zh: "學生議員", en: "Student Legislator" }, period: "2024.08 – 今",
            station: { zh: "議員", en: "Legislator" } }
        ] },
      { mark: "學生會", logo: "",
        org: { zh: "國立政治大學學生會", en: "NCCU Student Association" },
        roles: [
          { role: { zh: "校務諮詢委員會總召集人", en: "Chief Convener, Advisory Committee on University Affairs" }, period: "2026.02 – 今" },
          { role: { zh: "校務諮詢委員會副召集人", en: "Deputy Convener, Advisory Committee on University Affairs" }, period: "2025.09 – 2026.01", cv: false },
          { role: { zh: "權益部部員", en: "Member, Student Rights Department" }, period: "2022.09 – 2023.07", cv: false }
        ] },
      /* 以學生代表身分參加的學校校級、院級會議與委員會 */
      { mark: "代表", logo: "",
        org: { zh: "國立政治大學各級會議學生代表", en: "Student Representative, NCCU University Councils" },
        roles: [
          { role: { zh: "校務會議（兼任學生議員）", en: "University Council (ex officio Student Legislator)" }, period: "2024.08 – 今" },
          { role: { zh: "校務基金管理委員會", en: "University Endowment Fund Management Committee" }, period: "2026.11 – 今" },
          { role: { zh: "總務會議", en: "General Affairs Council" }, period: "2026.01 – 今", cv: false },
          { role: { zh: "學務會議", en: "Student Affairs Council" }, period: "2025.09 – 今", cv: false },
          { role: { zh: "社會科學學院院務會議", en: "College of Social Sciences Council" }, period: "2025.08 – 今", cv: false },
          { role: { zh: "校園規劃與建設委員會", en: "Campus Planning & Construction Committee" }, period: "2025.08 – 今", cv: false },
          { role: { zh: "教務會議（學院代表）", en: "Academic Affairs Council (college representative)" }, period: "2025.02 – 2025.07", cv: false },
          { role: { zh: "校務考核委員會", en: "University Evaluation Committee" }, period: "2024.09 – 2025.07", cv: false }
        ] },
      { mark: "學聯", logo: "",
        org: { zh: "社團法人臺灣學生聯合會", en: "National Students' Union of Taiwan" },
        roles: [
          { role: { zh: "理事", en: "Board Member" }, period: "2026.11 – 今",
            station: { zh: "學聯理事", en: "NSUT board" } },
          { role: { zh: "公關副秘書長", en: "Deputy Secretary-General for Public Relations" }, period: "2025.11 – 2026.10" }
        ] }
    ] },

    { key: "research", line: "research", title: { zh: "研究與教學", en: "Research & Teaching" }, items: [
      { mark: "國關", logo: "",
        org: { zh: "國立政治大學國際關係研究中心", en: "Institute of International Relations, NCCU" },
        roles: [
          { role: { zh: "研究計畫助理", en: "Research Assistant" }, period: "2023.09 – 2026.01",
            station: { zh: "國關中心", en: "IIR" },
            points: [
              { zh: "大陸委員會委託研究「習近平反貪腐鬥爭之策略、成效與影響」", en: "Mainland Affairs Council study on Xi Jinping’s anti-corruption campaign" },
              { zh: "國科會研究「中共二十大後政治菁英甄補：趨勢、預測與結構變遷」", en: "NSTC project on CCP elite recruitment after the 20th Party Congress" }
            ] },
          { role: { zh: "教學助理：「經濟全球化與台商大陸投資」（陳德昇教授）", en: "Teaching Assistant: Economic Globalisation & Taiwanese Investment in China (Prof. Chen Te-sheng)" }, period: "2024.01 – 2026.01", cv: false },
          { role: { zh: "政治大學夏令研習營副召集人", en: "Deputy Convener, NCCU Summer Institute" }, period: "2024.08", cv: false }
        ] },
      { minor: true, also: "transport", mark: "地政", logo: "",
        org: { zh: "國立政治大學地政學系", en: "Department of Land Economics, NCCU" },
        roles: [
          { role: { zh: "教學助理：「人本交通與永續校園規劃」", en: "Teaching Assistant: People-Oriented Transport & Sustainable Campus Planning" }, period: "2026.02 – 2026.07" }
        ] },
      { minor: true, cv: false, mark: "傳院", logo: "",
        org: { zh: "國立政治大學傳播學院", en: "College of Communication, NCCU" },
        roles: [
          { role: { zh: "教學助理：「社會創新與未來創造」", en: "Teaching Assistant: Social Innovation & Future-Making" }, period: "2024.09 – 2025.01" }
        ] },
      { minor: true, cv: false, mark: "陸委會", logo: "",
        org: { zh: "大陸委員會", en: "Mainland Affairs Council" },
        roles: [
          { role: { zh: "臺灣青年學生兩岸關係研習營學員", en: "Participant, Cross-Strait Relations Workshop for Taiwanese Youth" }, period: "2022.08" }
        ] }
    ] },

    { key: "transport", line: "transport", title: { zh: "人本交通", en: "People-Oriented Transport" }, items: [
      { mark: "人本", logo: "",
        org: { zh: "社團法人下一代人本交通促進會", en: "Next Generation People-Oriented Transport Association" },
        roles: [
          { role: { zh: "副秘書長、北部分會會長", en: "Deputy Secretary-General; Chair, Northern Chapter" }, period: "2026.02 – 今",
            station: { zh: "人本交通", en: "Transport NGO" } }
        ] },
      { mark: "指南", logo: "", more: "/work.html",
        org: { zh: "政大指南路交通改善小組", en: "NCCU Zhinan Road Traffic Improvement Task Force" },
        roles: [
          { role: { zh: "召集人", en: "Convener" }, period: "2025.01 – 今",
            station: { zh: "指南路", en: "Zhinan Rd." },
            points: [
              { zh: "發起政大校門行人穿越道學生導護，獲華視新聞報導", en: "Started student crossing guards at the campus gate, covered by CTS News" },
              { zh: "提出文山區參與式預算兩案皆通過，促成指南路二段人行道改善工程", en: "Two Wenshan participatory-budget proposals adopted, leading to sidewalk works on Zhinan Rd. Sec. 2" }
            ] }
        ] },
      { minor: true, mark: "預算", logo: "",
        org: { zh: "臺北市參與式預算（中正區）", en: "Taipei Participatory Budgeting (Zhongzheng)" },
        roles: [
          { role: { zh: "「您行我也行」提案人", en: "Proposer" }, period: "2024",
            points: [ { zh: "獲臺北市政府感謝狀", en: "Certificate of appreciation, Taipei City Government" } ] }
        ] }
    ] },

    { key: "education", line: "", title: { zh: "學歷", en: "Education" }, items: [
      /* 一個學位、學程一行；fold: false＝職務超過三個也全部展開 */
      { mark: "政大", logo: "", fold: false,
        org: { zh: "國立政治大學", en: "National Chengchi University" },
        roles: [
          { role: { zh: "政治學系學士班", en: "B.A. in Political Science" }, period: "2022.09 – 2027.06（預計）",
            station: { zh: "政大", en: "NCCU" } },
          { role: { zh: "校學士：哲學、政治學與經濟學專長", en: "University Bachelor track: Philosophy, Politics and Economics" }, period: "" },
          { role: { zh: "輔修：經濟學系", en: "Minor in Economics" }, period: "" },
          { role: { zh: "輔修：哲學系", en: "Minor in Philosophy" }, period: "" },
          { role: { zh: "人文領袖榮譽學分學程", en: "Humanities Leadership Honors Program" }, period: "" },
          { role: { zh: "中國大陸與兩岸關係研究跨領域學分學程", en: "Interdisciplinary Program in China and Cross-Strait Studies" }, period: "" }
        ] },
      /* 建中：網站顯示、CV 不放 */
      { cv: false, mark: "建中", logo: "",
        org: { zh: "臺北市立建國高級中學", en: "Taipei Municipal Jianguo High School" },
        roles: [
          { role: { zh: "畢業", en: "Graduated" }, period: "2019.08 – 2022.06", station: { zh: "建中", en: "Jianguo HS" } }
        ] }
    ] },

    /* 榮譽與獎學金：一個獎項一筆，org 寫頒發單位，role 寫獎項名稱，新的寫上面 */
    { key: "honors", line: "", title: { zh: "榮譽與獎學金", en: "Honors & Scholarships" }, items: [
      { mark: "獎", logo: "",
        org: { zh: "國立政治大學政治學系", en: "Department of Political Science, NCCU" },
        roles: [
          { role: { zh: "馮麗華傑出系友獎學金", en: "Feng Li-hua Distinguished Alumni Scholarship" }, period: "2025" }
        ] }
    ] },

    /* 其他：跟三條路線都不直接相關的經歷。整段都是次要，網站上預設收合 */
    { key: "other", line: "", title: { zh: "其他經歷與研習", en: "Other Experience & Training" }, items: [
      { minor: true, mark: "市府", logo: "",
        org: { zh: "臺北市政府", en: "Taipei City Government" },
        roles: [
          { role: { zh: "大專青年學生公部門暑期工讀", en: "Public Sector Summer Intern" }, period: "2025.07" }
        ] },
      { minor: true, cv: false, mark: "青發署", logo: "",
        org: { zh: "教育部青年發展署", en: "Youth Development Administration, Ministry of Education" },
        roles: [
          { role: { zh: "公共事務人才培力基礎入門課程結業", en: "Completed Public Affairs Talent Foundation Course" }, period: "2025.03" }
        ] },
      { minor: true, cv: false, mark: "野火", logo: "",
        org: { zh: "國立政治大學野火陣線社", en: "NCCU Wildfire Front Club" },
        roles: [
          { role: { zh: "總務", en: "Treasurer" }, period: "2024.08 – 2025.07" },
          { role: { zh: "副社長", en: "Vice President" }, period: "2023.02 – 2024.07", station: { zh: "野火", en: "Wildfire Front" } }
        ] }
    ] }
  ],


  /* ---------- 4. 關注領域（取代原本的「理念白皮書」）【待確認】 ---------- */
  focusHeading: { zh: "關注領域", en: "Focus Areas" },
  focus: [
    { line: "student",
      title: { zh: "學生自治", en: "Student Government" },
      text:  { zh: "擔任學生議會議長與校務會議、學務會議、總務會議學生代表，處理議事、預算與校務協商；推動議事影音紀錄與直播，讓學生自治更透明。",
               en: "As Speaker and student representative on university councils, I work on procedure, budgets and negotiation, and pushed for recorded and live-streamed sessions." } },
    { line: "research",
      title: { zh: "研究與教學", en: "Research & Teaching" },
      text:  { zh: "在國關中心參與陸委會與國科會的中共菁英政治、反貪腐研究，並修讀中國大陸與兩岸關係研究學程；也擔任經濟全球化、人本交通等課程的教學助理。",
               en: "Research on CCP elite politics and anti-corruption for the Mainland Affairs Council and NSTC; teaching assistant for courses on globalisation and transport." } },
    { line: "transport",
      title: { zh: "人本交通", en: "People-Oriented Transport" },
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
    { line: "student",
      title: { zh: "學生議會官網改版與透明議會", en: "Student Congress Website & Transparency" },
      text:  { zh: "主導議會官網從 Google 協作平台遷移到學校平台，建立法規資料庫、歷史沿革與會議資訊，讓議事資料可查、可追溯。",
               en: "Led the migration of the Congress website to the university CMS, with a regulations database, history and meeting records." },
      links: [
        { label: { zh: "學生議會官網", en: "Website" }, url: "https://sc.video.nccu.edu.tw/" },
        { label: { zh: "議長介紹頁", en: "Speaker profile" }, url: "https://sc.video.nccu.edu.tw/p/speaker-now" }
      ] },
    { line: "research",
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
