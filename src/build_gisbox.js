// GIS_BOX presentation: one slide spec -> HTML deck (online) + PPTX (offline). Bilingual KA/EN.
// Facts come from https://github.com/GIS-GEORGIA/gis-toolkit (README, docs/TECHNICAL.md, git history, release v0.1.0), checked 2026-11-18.
const fs = require('fs');
const pptxgen = require('pptxgenjs');
const QR = require('qrcode');
const ROOT = __dirname + '/../';
const REPO = 'https://github.com/GIS-GEORGIA/gis-toolkit';

const SLIDES = [
  { t: 'cover', kicker: ['GIS DAY 2026 · 18.11.2026', 'GIS DAY 2026 · 18 Nov 2026'],
    title: ['GIS_BOX: AI-ის დახმარებით შექმნილი GIS ხელსაწყოების კრებული', 'GIS_BOX: an AI-assisted GIS toolkit'],
    sub: ['11 ხელსაწყო ერთ ფანჯარაში — ორენოვანი, ღია კოდით (MIT)', '11 tools in one window — bilingual, open source (MIT)'],
    note: ['GIS_BOX არის GIS ხელსაწყოების კრებული ერთ ფანჯარაში (tkinter). რეპოზიტორია: github.com/GIS-GEORGIA/gis-toolkit, ლიცენზია MIT. ფაქტები გადამოწმებულია 2026-11-18-ზე.', 'GIS_BOX is a collection of GIS tools in one window (tkinter). Repository: github.com/GIS-GEORGIA/gis-toolkit, MIT license. Facts checked on 2026-11-18.'] },
  { t: 'bullets', kicker: ['პრობლემა', 'Problem'], title: ['რუტინული GIS სამუშაო — ბევრი ცალკე ინსტრუმენტი', 'Routine GIS work — many separate tools'],
    items: [
      ['ნაკვეთების ძებნა კოდით გეობაზაში, კოორდინატების ამოღება რუკიდან, DWG-ის კონვერტაცია', 'Searching parcels by code in a geodatabase, pulling coordinates from maps, converting DWG'],
      ['ყოველი ამოცანა სხვადასხვა პროგრამას ან ხელით სამუშაოს ითხოვს', 'Each task needs a different program or manual work'],
      ['შედეგი უნდა მოხვდეს Excel-ში, Shapefile-სა და GeoPackage-ში', 'Results must end up in Excel, Shapefile and GeoPackage'],
      ['GIS_BOX ამ ამოცანებს ერთ ფანჯარაში აერთიანებს', 'GIS_BOX brings these tasks into one window']],
    note: ['პრობლემის აღწერა README-ის ხელსაწყოების სიიდანაა გამოყვანილი (ნაკვეთის ძებნა, კოორდინატების ამომღები, DWG/DXF კონვერტაცია და სხვ.).', 'The problem statement is derived from the README tool list (parcel search, coordinate extractor, DWG/DXF conversion, etc.).'] },
  { t: 'cards', kicker: ['პროდუქტი', 'Product'], title: ['რა არის GIS_BOX', 'What GIS_BOX is'], cols: 2,
    cards: [
      ['ერთი ფანჯარა', 'One window', '11 ხელსაწყო ერთ აპლიკაციაში (tkinter)', '11 tools in one application (tkinter)'],
      ['ორენოვანი', 'Bilingual', 'ქართული / English — გადამრთველი ზედა ზოლში', 'Georgian / English — switch in the top bar'],
      ['ღია კოდი', 'Open source', 'MIT ლიცენზია, კოდი GitHub-ზე', 'MIT license, code on GitHub'],
      ['Windows და Linux', 'Windows and Linux', 'მზა ბილდები: v0.1.0 (2026-08-31)', 'Prebuilt: v0.1.0 (2026-08-31)']],
    note: ['წყარო: README, GitHub release v0.1.0 (Windows zip; Linux deb, rpm, AppImage, tar.gz). ბილდები დიდია (დაახლოებით 190–280 MB), რადგან GDAL-ს, OCR მოდელებს და სხვა ბიბლიოთეკებს შეიცავს.', 'Source: README, GitHub release v0.1.0 (Windows zip; Linux deb, rpm, AppImage, tar.gz). Builds are large (about 190–280 MB) because they bundle GDAL, OCR models and other libraries.'] },
  { t: 'layers', kicker: ['AI', 'AI'], title: ['სად არის AI GIS_BOX-ში', 'Where the AI is in GIS_BOX'],
    cards: [
      ['1 · AI-ით შექმნილი', '1 · Built with AI', '102 commit-იდან 101-ს Claude-ის co-author ჩანაწერი აქვს; ავტორი — გიორგი კაპანაძე', '101 of 102 commits carry a Claude co-author trailer; author: Giorgi Kapanadze'],
      ['2 · AI პროდუქტის შიგნით', '2 · AI inside', 'ოფლაინ OCR (RapidOCR, ONNX Runtime) კოორდინატების ამომღებში: რუკა/PDF → კოორდინატთა ცხრილი', 'Offline OCR (RapidOCR, ONNX Runtime) in the coordinate extractor: map/PDF → coordinate table'],
      ['3 · დეტერმინისტული GIS ბირთვი', '3 · Deterministic GIS core', 'GDAL, geopandas, shapely — შედეგი გამეორებადია', 'GDAL, geopandas, shapely — reproducible results']],
    callout: ['პირდაპირ: GIS_BOX არ არის ჩატ-ბოტი; კოდში LLM ან გენერაციული AI-ის გამოძახება ვერ ვიპოვეთ.', 'To be clear: GIS_BOX is not a chatbot; we found no LLM or generative-AI calls in the code.'],
    note: ['ეს სლაიდი განზრახ ზუსტია. (1) git ისტორიაში 101 commit შეიცავს „Co-Authored-By: Claude“ ხაზს (მოდელები: Opus 4.8, Opus 5, Sonnet 5, Sonnet 5.5 — commit-ების trailer-ების მიხედვით). (2) OCR არის requirements.txt-ში (rapidocr-onnxruntime) და tools/coordextract/ocr.py-ში. (3) ბირთვი კლასიკური გეოდამუშავებაა.', 'This slide is deliberately precise. (1) 101 commits in git history contain a "Co-Authored-By: Claude" line (models per commit trailers: Opus 4.8, Opus 5, Sonnet 5, Sonnet 5.5). (2) OCR is in requirements.txt (rapidocr-onnxruntime) and tools/coordextract/ocr.py. (3) The core is classical geoprocessing.'] },
  { t: 'flow', kicker: ['AI ფუნქცია', 'AI feature'], title: ['კოორდინატების ამომღები: რუკა → ცხრილი', 'Coordinate extractor: map → table'],
    steps: [['შემოტანა', 'Capture', 'PDF გვერდი ან ეკრანის არე', 'PDF page or screen area'], ['OCR', 'OCR', 'ტექსტისა და რიცხვების ამოცნობა (ოფლაინ)', 'Recognise text and numbers (offline)'], ['გეო-რეფერენსი', 'Georeferencing', 'საკონტროლო წერტილები, უმცირესი კვადრატები, RMSE', 'Control points, least squares, RMSE'], ['ექსპორტი', 'Export', 'CSV, JSON, XLSX', 'CSV, JSON, XLSX']],
    callout: ['OCR-ის შედეგი ადამიანმა უნდა გადაამოწმოს; RMSE გეო-რეფერენსის სიზუსტეს აჩვენებს.', 'A person should review OCR output; RMSE shows the georeferencing accuracy.'],
    note: ['წყარო: docs/TECHNICAL.md §6.3 — capture.py (PyMuPDF ან ეკრანის დაჭერა), ocr.py (rapidocr-onnxruntime ნაგულისხმევი; pytesseract, easyocr — ალტერნატივა), georef.py (აფინური გარდაქმნა, 3+ საკონტროლო წერტილი, RMSE), export.py. OCR-ის სიზუსტის რიცხვი არ გვაქვს და არ ვასახელებთ.', 'Source: docs/TECHNICAL.md §6.3 — capture.py (PyMuPDF or screen capture), ocr.py (rapidocr-onnxruntime default; pytesseract, easyocr alternatives), georef.py (affine transform, 3+ control points, RMSE), export.py. We have no OCR accuracy figure and do not quote one.'] },
  { t: 'cards', kicker: ['ხელსაწყოები', 'Tools'], title: ['11 ხელსაწყო', 'The 11 tools'], cols: 4, small: true,
    cards: [
      ['ნაკვეთის ძებნა', 'Parcel search', 'File Geodatabase → SHP + GPKG', 'File Geodatabase → SHP + GPKG'],
      ['კოორდინატების ამომღები', 'Coordinate extractor', 'რუკა/PDF → კოორდინატები', 'Map/PDF → coordinates'],
      ['Shp → კოორდინატები', 'Shp → coordinates', 'წერტილები → Excel', 'Points → Excel'],
      ['GDB → PostGIS', 'GDB → PostGIS', 'ინკრემენტული სინქრონი, განრიგი', 'Incremental sync, schedule'],
      ['გეომეტრიების შეგროვება', 'Geometry → GeoPackage', 'ბევრი ფორმატი → ერთი GPKG', 'Many formats → one GPKG'],
      ['DWG/DXF კონვერტაცია', 'DWG/DXF conversion', '→ SHP / GPKG / GDB', '→ SHP / GPKG / GDB'],
      ['დაცვის ზონის კვეთა', 'Zone intersection', 'გადაკვეთის წერტილები, ფართობები', 'Crossing points, areas'],
      ['კვეთა და შაბლონი', 'Crossing & templates', 'ხაზი × ხაზი', 'Line × line'],
      ['ბუფერების აგება', 'Line buffers', 'UTM 37/38', 'UTM 37/38'],
      ['სახელების გადარქმევა', 'Rename → Latin', 'ქართული → ლათინური', 'Georgian → Latin'],
      ['რუკის სერვისები', 'Map services', 'tile/WMS URL-ები', 'tile/WMS URLs']],
    note: ['ხელსაწყოების სია README-ის ცხრილიდანაა. დეტალები: docs/TECHNICAL.md.', 'The tool list comes from the README table. Details: docs/TECHNICAL.md.'] },
  { t: 'bullets', kicker: ['ხარისხი', 'Quality'], title: ['ინჟინერიის ხარისხი', 'Engineering quality'],
    items: [
      ['159 ავტომატური ტესტის ფუნქცია (tests/)', '159 automated test functions (tests/)'],
      ['CI Linux-ზე, მათ შორის GUI smoke-ტესტი (xvfb)', 'CI on Linux, including a GUI smoke test (xvfb)'],
      ['v0.1.0 (2026-08-31): Windows zip; Linux deb, rpm, AppImage, tar.gz', 'v0.1.0 (2026-08-31): Windows zip; Linux deb, rpm, AppImage, tar.gz'],
      ['MIT ლიცენზია; DWG-ისთვის თან ატანია LibreDWG (GPL-3.0)', 'MIT license; LibreDWG (GPL-3.0) is bundled for DWG'],
      ['PostGIS-ის პაროლი ნაგულისხმევად მხოლოდ სესიაშია', 'PostGIS password is session-only by default']],
    note: ['ტესტების რაოდენობა = „def test_“ ფუნქციები tests/*.py-ში. CI-ის დეტალები: .github/workflows/ci.yml. უსაფრთხოება: README, GDB → PostGIS სექცია.', 'Test count = "def test_" functions in tests/*.py. CI details: .github/workflows/ci.yml. Security: README, GDB → PostGIS section.'] },
  { t: 'bullets', kicker: ['იდეები', 'Ideas'], title: ['შესაძლო AI მიმართულებები (წინადადებები)', 'Possible AI directions (proposals, not implemented)'], idea: true,
    items: [
      ['ამოცანის აღწერა ბუნებრივი ენით → ხელსაწყოს პარამეტრები (ადამიანი ადასტურებს)', 'Describe a task in natural language → tool parameters (a person confirms)'],
      ['ხელსაწყოების გამოტანა MCP სერვერად, რომ AI აგენტებმა გამოიყენონ', 'Expose the tools as an MCP server for AI agents'],
      ['OCR შედეგის ავტომატური შემოწმება საკონტროლო წერტილებთან', 'Automatic sanity-checks of OCR output against control points']],
    note: ['ეს არის იდეები განსახილველად და არა არსებული ფუნქციები. პროდუქტში ისინი დღეს არ არის.', 'These are ideas for discussion, not existing features. They are not in the product today.'] },
  { t: 'close', title: ['GIS_BOX: ჩამოტვირთე და სცადე', 'GIS_BOX: download and try'], sub: ['github.com/GIS-GEORGIA/gis-toolkit', 'github.com/GIS-GEORGIA/gis-toolkit'],
    note: ['QR კოდი გადაგიყვანთ GitHub რეპოზიტორიაში; Releases გვერდზე მზა ბილდებია Windows-ისა და Linux-ისთვის.', 'The QR code leads to the GitHub repository; the Releases page has prebuilt Windows and Linux builds.'] },
];

// ---------------- HTML ----------------
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const L = (ka, en) => `<span lang="ka">${esc(ka)}</span><span lang="en">${esc(en)}</span>`;
const LL = p => L(p[0], p[1]);
const noteH = n => `  <div class="note">${L(n[0], n[1])}</div>`;
const callout = (c, cls = 'tip') => `  <div class="callout ${cls}">${L(c[0], c[1])}</div>`;
function htmlSlide(s) {
  if (s.t === 'cover') return `
<section class="slide cover">
  <p class="kicker">${LL(s.kicker)}</p>
  <h1>${LL(s.title)}</h1>
  <p class="lead" style="margin-top:16px">${LL(s.sub)}</p>
  <a class="qr" href="${REPO}" target="_blank" rel="noopener"><img src="../assets/gisbox-qr.svg" alt="QR: gis-toolkit"><span>${L('დაასკანერე და გახსენი რეპოზიტორია', 'Scan to open the repository')}<br><b>github.com/GIS-GEORGIA/gis-toolkit</b></span></a>
${noteH(s.note)}
</section>`;
  if (s.t === 'close') return `
<section class="slide closing">
  <p class="kicker">GIS DAY 2026</p>
  <h2>${LL(s.title)}</h2>
  <p class="lead"><a href="${REPO}" target="_blank" rel="noopener">${esc(s.sub[0])}</a></p>
  <p style="margin-top:18px"><a class="qr" style="position:static;display:inline-flex" href="${REPO}" target="_blank" rel="noopener"><img src="../assets/gisbox-qr.svg" alt="QR"><span>${L('დაასკანერე', 'Scan me')}<br><b>GIS_BOX</b></span></a></p>
${noteH(s.note)}
</section>`;
  let body = '';
  if (s.t === 'bullets') {
    const lis = (i) => s.items.map(it => `<li>${esc(it[i])}</li>`).join('');
    body = `  <ul class="pts" lang="ka">${lis(0)}</ul>\n  <ul class="pts" lang="en">${lis(1)}</ul>` + (s.idea ? '\n' + callout(['ეს არის წინადადებები და არა არსებული ფუნქციები.', 'These are proposals, not existing features.'], 'warn') : '');
  } else if (s.t === 'cards' || s.t === 'layers') {
    const cls = s.t === 'layers' ? 'grid' : (s.cols === 4 ? 'grid' : 'grid g2');
    body = `  <div class="${cls}">${s.cards.map(c => `<div class="card"><h3>${L(c[0], c[1])}</h3><p>${L(c[2], c[3])}</p></div>`).join('')}</div>` + (s.callout ? '\n' + callout(s.callout, 'warn') : '');
  } else if (s.t === 'flow') {
    body = `  <div class="grid">${s.steps.map((c, i) => `<div class="card"><h3>${i + 1} · ${L(c[0], c[1])}</h3><p>${L(c[2], c[3])}</p></div>`).join('')}</div>\n` + callout(s.callout, 'tip');
  }
  return `
<section class="slide">
  <p class="kicker">${LL(s.kicker)}</p>
  <h2>${LL(s.title)}</h2>
${body}
${noteH(s.note)}
</section>`;
}

// ---------------- PPTX ----------------
const NAVY = '0A1F6B', TEAL = '1DBFA6', INK = '13213F', MUTE = '5B6785', PALE = 'EAF7F4', WHITE = 'FFFFFF', OK = '0E8F7B', AMBER = 'B7791F', AMBER_BG = 'FFF6E0';
const HF = 'Cambria', BF = 'Calibri', KF = 'Sylfaen';
const run = (t, o) => ({ text: t, options: o });
function pptx() {
  const p = new pptxgen(); p.layout = 'LAYOUT_WIDE'; p.title = 'GIS_BOX: an AI-assisted GIS toolkit'; p.author = 'GIS Day'; p.subject = 'Bilingual (Georgian/English)';
  const base = (s0, dark) => {
    const s = p.addSlide(); s.background = { color: dark ? NAVY : WHITE };
    s.addNotes('ქართული / Georgian\n' + s0.note[0] + '\n\nEnglish\n' + s0.note[1]); return s;
  };
  const titles = (s, t, dark) => {
    s.addText(t[0], { x: 0.6, y: 0.3, w: 12.1, h: 0.55, fontFace: KF, fontSize: 28, bold: true, color: dark ? WHITE : NAVY, margin: 0, valign: 'middle', isTextBox: true, fit: 'shrink' });
    s.addText(t[1], { x: 0.6, y: 0.88, w: 12.1, h: 0.45, fontFace: HF, fontSize: 20, bold: true, color: dark ? TEAL : OK, margin: 0, valign: 'middle', isTextBox: true, fit: 'shrink' });
  };
  const foot = s => s.addText('GIS DAY 2026 · GIS_BOX · github.com/GIS-GEORGIA/gis-toolkit', { x: 0.6, y: 7.05, w: 10.5, h: 0.3, fontFace: BF, fontSize: 10, color: MUTE, margin: 0, isTextBox: true });
  const logo = s => s.addImage({ path: ROOT + 'assets/gisday/logo.png', x: 11.3, y: 0.3, w: 1.5, h: 0.47 });
  const box = (s, x, y, w, h, kaT, enT, kaD, enD, fill = PALE, ks = 15) => {
    s.addShape('roundRect', { x, y, w, h, fill: { color: fill }, line: { color: fill }, rectRadius: 0.08 });
    s.addText([run(kaT, { fontFace: KF, fontSize: ks, bold: true, color: NAVY, breakLine: true }), run(enT, { fontFace: BF, fontSize: ks - 1, bold: true, color: MUTE, breakLine: true, paraSpaceAfter: 6 }), run(kaD, { fontFace: KF, fontSize: ks - 3, color: INK, breakLine: true }), run(enD, { fontFace: BF, fontSize: ks - 3.5, color: MUTE })], { x: x + 0.18, y: y + 0.12, w: w - 0.36, h: h - 0.2, margin: 0, valign: 'top', isTextBox: true });
  };
  const call = (s, c, y) => { s.addShape('roundRect', { x: 0.6, y, w: 12.1, h: 0.85, fill: { color: AMBER_BG }, line: { color: AMBER, width: 1 }, rectRadius: 0.06 });
    s.addText([run(c[0], { fontFace: KF, fontSize: 13, bold: true, color: INK, breakLine: true }), run(c[1], { fontFace: BF, fontSize: 13, color: MUTE })], { x: 0.8, y, w: 11.7, h: 0.85, margin: 0, valign: 'middle', isTextBox: true }); };
  for (const sd of SLIDES) {
    if (sd.t === 'cover') {
      const s = base(sd, true);
      s.addImage({ path: ROOT + 'resources/item-resources/_7vffgvGntbyqhMq6MEmu.png', x: 8.3, y: 0.9, w: 4.8, h: 4.8, sizing: { type: 'contain', w: 4.8, h: 4.8 } });
      s.addText(sd.kicker[0], { x: 0.7, y: 0.7, w: 7, h: 0.4, fontFace: BF, fontSize: 16, bold: true, color: TEAL, margin: 0, isTextBox: true });
      s.addText(sd.title[0], { x: 0.7, y: 1.4, w: 7.4, h: 1.7, fontFace: KF, fontSize: 30, bold: true, color: WHITE, margin: 0, valign: 'top', isTextBox: true });
      s.addText(sd.title[1], { x: 0.7, y: 3.2, w: 7.4, h: 0.9, fontFace: HF, fontSize: 24, bold: true, color: TEAL, margin: 0, valign: 'top', isTextBox: true });
      s.addText([run(sd.sub[0], { fontFace: KF, fontSize: 15, color: WHITE, breakLine: true, paraSpaceAfter: 4 }), run(sd.sub[1], { fontFace: BF, fontSize: 15, color: 'CADCFC' })], { x: 0.7, y: 4.4, w: 7.4, h: 1.2, margin: 0, valign: 'top', isTextBox: true });
      s.addShape('roundRect', { x: 11.35, y: 5.75, w: 1.5, h: 1.5, fill: { color: WHITE }, line: { color: WHITE }, rectRadius: 0.1 });
      s.addImage({ path: ROOT + 'assets/gisbox-qr.png', x: 11.45, y: 5.85, w: 1.3, h: 1.3, hyperlink: { url: REPO } });
      s.addText([run('დაასკანერე და გახსენი რეპოზიტორია', { fontFace: KF, fontSize: 12, color: WHITE, breakLine: true }), run('Scan to open the repository', { fontFace: BF, fontSize: 12, color: 'CADCFC', breakLine: true }), run('github.com/GIS-GEORGIA/gis-toolkit', { fontFace: BF, fontSize: 12, bold: true, color: TEAL })], { x: 7.2, y: 5.85, w: 4.0, h: 1.3, align: 'right', valign: 'middle', margin: 0, isTextBox: true });
    } else if (sd.t === 'close') {
      const s = base(sd, true);
      s.addImage({ path: ROOT + 'resources/item-resources/_7vffgvGntbyqhMq6MEmu.png', x: 8.6, y: 1.2, w: 4.2, h: 4.2, sizing: { type: 'contain', w: 4.2, h: 4.2 } });
      s.addText(sd.title[0], { x: 0.7, y: 1.7, w: 7.5, h: 0.9, fontFace: KF, fontSize: 32, bold: true, color: WHITE, margin: 0, isTextBox: true });
      s.addText(sd.title[1], { x: 0.7, y: 2.7, w: 7.5, h: 0.7, fontFace: HF, fontSize: 26, bold: true, color: TEAL, margin: 0, isTextBox: true });
      s.addText(sd.sub[0], { x: 0.7, y: 3.7, w: 7.5, h: 0.5, fontFace: BF, fontSize: 20, color: WHITE, margin: 0, isTextBox: true, hyperlink: { url: REPO } });
      s.addShape('roundRect', { x: 0.7, y: 4.5, w: 1.9, h: 1.9, fill: { color: WHITE }, line: { color: WHITE }, rectRadius: 0.1 });
      s.addImage({ path: ROOT + 'assets/gisbox-qr.png', x: 0.8, y: 4.6, w: 1.7, h: 1.7, hyperlink: { url: REPO } });
    } else {
      const s = base(sd, false); titles(s, sd.title, false); logo(s); foot(s);
      if (sd.t === 'bullets') {
        const items = sd.items.flatMap((it, i) => [run(it[0], { fontFace: KF, fontSize: 20, color: INK, breakLine: true }), run(it[1], { fontFace: BF, fontSize: 17, color: MUTE, breakLine: i < sd.items.length - 1, paraSpaceAfter: 14 })]);
        s.addText(items, { x: 0.6, y: 1.7, w: sd.idea ? 12.1 : 8.2, h: sd.idea ? 3.8 : 5.0, margin: 0, valign: 'top', isTextBox: true });
        if (!sd.idea) s.addImage({ path: ROOT + 'assets/gisbox-logo.png', x: 9.6, y: 2.2, w: 2.8, h: 2.8 });
        if (sd.idea) call(s, ['ეს არის წინადადებები და არა არსებული ფუნქციები.', 'These are proposals, not existing features.'], 5.9);
      } else if (sd.t === 'cards') {
        const c = sd.cols, n = sd.cards.length, w = (12.1 - 0.25 * (c - 1)) / c, h = sd.small ? 1.6 : 2.45;
        sd.cards.forEach((cd, i) => box(s, 0.6 + (i % c) * (w + 0.25), 1.6 + Math.floor(i / c) * (h + 0.2), w, h, cd[0], cd[1], cd[2], cd[3], PALE, sd.small ? 13 : 17));
      } else if (sd.t === 'layers') {
        sd.cards.forEach((cd, i) => box(s, 0.6 + i * 4.1, 1.6, 3.9, 3.7, cd[0], cd[1], cd[2], cd[3], i === 1 ? 'D5F2EC' : PALE, 16));
        call(s, sd.callout, 5.6);
      } else if (sd.t === 'flow') {
        sd.steps.forEach((cd, i) => { box(s, 0.6 + i * 3.1, 1.8, 2.85, 3.0, cd[0], cd[1], cd[2], cd[3], PALE, 16);
          if (i < 3) s.addShape('line', { x: 3.45 + i * 3.1, y: 3.3, w: 0.25, h: 0, line: { color: NAVY, width: 2, endArrowType: 'triangle' } }); });
        call(s, sd.callout, 5.3);
      }
    }
  }
  return p.writeFile({ fileName: ROOT + 'downloads/GIS_BOX_AI_PRESENTATION.pptx' });
}

(async () => {
  fs.mkdirSync(ROOT + 'assets', { recursive: true });
  const opt = { margin: 1, errorCorrectionLevel: 'M', color: { dark: '#0a1f6b', light: '#ffffff' } };
  fs.writeFileSync(ROOT + 'assets/gisbox-qr.svg', await QR.toString(REPO, Object.assign({ type: 'svg' }, opt)));
  await QR.toFile(ROOT + 'assets/gisbox-qr.png', REPO, Object.assign({ width: 600 }, opt));
  const html = `<!doctype html>
<html lang="ka">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>GIS_BOX: AI-assisted GIS toolkit</title>
<link rel="stylesheet" href="../assets/deck.css">
<link rel="stylesheet" href="../assets/gisday.css">
</head>
<body>
<main class="deck">
${SLIDES.map(htmlSlide).join('\n')}
</main>
<script src="../assets/deck.js"></script>
</body>
</html>
`;
  fs.writeFileSync(ROOT + 'presentations/gis-box.html', html);
  await pptx();
  console.log('ok', SLIDES.length, 'slides');
})();
