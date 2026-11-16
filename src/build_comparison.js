const pptxgen = require('pptxgenjs');
const { p, c, TOOLS, MATRIX, FORMATS, FORMAT_NOTES } = require('./data');
const R = __dirname + '/../resources/';
const OUT = __dirname + '/../downloads/';

// Visual identity inherited from presentations/GIS-Day-2026.pptx (navy + teal, Cambria / Calibri)
const NAVY = '0A1F6B', TEAL = '1DBFA6', INK = '13213F', MUTE = '5B6785', PALE = 'EAF7F4', WHITE = 'FFFFFF', LINE = 'C9D3E6';
const OK = '0E8F7B', WARN = 'B7791F', BAD = 'C0392B', UNK = '7A869A';
const HF = 'Cambria', BF = 'Calibri', KF = 'Sylfaen'; // KF = Georgian-capable font
const W = 13.33;
const EXPORT = {};

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = 'GIS DAY: FME vs GDAL vs QGIS vs Terrio';
pres.author = 'GIS Day';
pres.subject = 'Bilingual (Georgian/English) technical comparison';

// ---------- helpers ----------
const symColor = { '✔': OK, '◐': WARN, '✘': BAD, '?': UNK };
const run = (t, o) => ({ text: t, options: o });
function pair(ka, en, o = {}) { // two stacked paragraphs: Georgian then English
  const kc = o.kc || INK, ec = o.ec || MUTE, ks = o.ks || 14, es = o.es || 13;
  const after = o.after === undefined ? 8 : o.after;
  return [
    run(ka, { fontFace: KF, fontSize: ks, color: kc, bold: !!o.kb, breakLine: true }),
    run(en, { fontFace: BF, fontSize: es, color: ec, breakLine: !!o.more, paraSpaceAfter: after }),
  ];
}
function pairs(list, o) { // list of [ka,en]; flatten
  const out = [];
  list.forEach(([ka, en], i) => out.push(...pair(ka, en, Object.assign({}, o, { more: i < list.length - 1 }))));
  return out;
}
function slideBase(titleKa, titleEn, notesKa, notesEn, opts = {}) {
  const s = pres.addSlide();
  s.background = { color: opts.dark ? NAVY : WHITE };
  const tc = opts.dark ? WHITE : NAVY, ec = opts.dark ? TEAL : OK;
  s.addText(titleKa, { x: 0.6, y: 0.3, w: 12.1, h: 0.55, fontFace: KF, fontSize: 28, bold: true, color: tc, margin: 0, valign: 'middle', isTextBox: true, fit: 'shrink' });
  s.addText(titleEn, { x: 0.6, y: 0.88, w: 12.1, h: 0.45, fontFace: HF, fontSize: 20, bold: true, color: ec, margin: 0, valign: 'middle', isTextBox: true });
  if (!opts.dark) {
    s.addText('GIS DAY 2026 · FME vs GDAL vs QGIS vs Terrio · ' + (opts.foot || 'ფაქტები / facts verified 2026-11-16'),
      { x: 0.6, y: 7.05, w: 10.5, h: 0.3, fontFace: BF, fontSize: 10, color: MUTE, margin: 0, isTextBox: true });
    s.slideNumber = { x: 12.2, y: 7.05, w: 0.6, h: 0.3, fontFace: BF, fontSize: 10, color: MUTE, align: 'right' };
  }
  s.addNotes('ქართული / Georgian\n' + notesKa + '\n\nEnglish\n' + notesEn);
  return s;
}
function chip(s, x, y, w, ka, en, fill = NAVY, color = WHITE, h = 0.62) {
  s.addShape('roundRect', { x, y, w, h, fill: { color: fill }, line: { color: fill }, rectRadius: 0.1 });
  s.addText([run(ka, { fontFace: KF, fontSize: 11, bold: true, color, breakLine: true }), run(en, { fontFace: BF, fontSize: 11, color })],
    { x, y, w, h, margin: [0, 0.08, 0, 0.08], align: 'center', valign: 'middle', isTextBox: true });
}
function box(s, x, y, w, h, ka, en, o = {}) {
  s.addShape('roundRect', { x, y, w, h, fill: { color: o.fill || PALE }, line: { color: o.line || o.fill || PALE }, rectRadius: 0.08 });
  s.addText([run(ka, { fontFace: KF, fontSize: o.ks || 13, bold: !!o.bold, color: o.color || INK, breakLine: !!en }), ...(en ? [run(en, { fontFace: BF, fontSize: o.es || 12, color: o.ecolor || o.color || MUTE })] : [])],
    { x, y, w, h, margin: [0.04, 0.1, 0.04, 0.1], align: o.align || 'center', valign: 'middle', isTextBox: true });
}
function arrow(s, x1, y1, x2, y2) {
  s.addShape('line', { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1) || 0, h: Math.abs(y2 - y1) || 0, line: { color: NAVY, width: 2, endArrowType: 'triangle' }, flipH: x2 < x1, flipV: y2 < y1 });
}
function cellRuns(cell, size = 10.5, dark = false) {
  const runs = [];
  if (cell.s) runs.push(run(cell.s + ' ', { fontFace: 'Segoe UI Symbol', fontSize: size + 1, bold: true, color: symColor[cell.s] || INK }));
  runs.push(run(cell.ka, { fontFace: KF, fontSize: size, color: INK, breakLine: true }));
  runs.push(run(cell.en, { fontFace: BF, fontSize: size - 0.5, color: MUTE }));
  return runs;
}
const hdr = (ka, en, size = 11) => ({ text: [run(ka, { fontFace: KF, fontSize: size, bold: true, color: WHITE, breakLine: !!en }), ...(en ? [run(en, { fontFace: BF, fontSize: size, bold: true, color: WHITE })] : [])], options: { fill: { color: NAVY }, align: 'left', valign: 'middle' } });
const rowHead = (pr, size = 11) => ({ text: [run(pr.ka, { fontFace: KF, fontSize: size, bold: true, color: NAVY, breakLine: true }), run(pr.en, { fontFace: BF, fontSize: size, bold: true, color: MUTE })], options: { fill: { color: PALE }, valign: 'middle' } });
const bodyCell = (cell, size) => ({ text: cellRuns(cell, size), options: { valign: 'middle', fill: { color: WHITE } } });
const tblOpts = (x, y, w, colW, extra = {}) => Object.assign({ x, y, w, colW, border: { type: 'solid', color: LINE, pt: 0.75 }, margin: [0.03, 0.08, 0.03, 0.08], autoPage: false }, extra);
function legend(s, y) {
  const sy = (t, col) => run(t + ' ', { fontFace: 'Segoe UI Symbol', color: col, bold: true, fontSize: 11 });
  const tx = (t) => run(t, { fontFace: KF, color: MUTE, fontSize: 10.5 });
  s.addText([sy('✔', OK), tx('მხარდაჭერილია / Supported   '), sy('◐', WARN), tx('ნაწილობრივ / Partial   '), sy('✘', BAD), tx('არა / No   '), sy('?', UNK), tx('დაუდასტურებელი / Unverified')],
    { x: 0.6, y, w: 12.1, h: 0.3, margin: 0, isTextBox: true });
}
const T = (s) => s; // placeholder for readability

// ================= 1. Cover =================
{
  const s = pres.addSlide(); s.background = { color: NAVY };
  s.addImage({ path: R + 'item-resources/_7vffgvGntbyqhMq6MEmu.png', x: 8.4, y: 1.0, w: 4.8, h: 4.8, sizing: { type: 'contain', w: 4.8, h: 4.8 } });
  s.addText('GIS DAY 2026 · 18.11.2026', { x: 0.7, y: 0.7, w: 7, h: 0.4, fontFace: BF, fontSize: 16, bold: true, color: TEAL, margin: 0, isTextBox: true });
  s.addText('GIS DAY: FME, GDAL, QGIS და Terrio-ს შედარება', { x: 0.7, y: 1.4, w: 7.4, h: 1.5, fontFace: KF, fontSize: 32, bold: true, color: WHITE, margin: 0, valign: 'top', isTextBox: true });
  s.addText('GIS DAY: FME vs GDAL vs QGIS vs Terrio', { x: 0.7, y: 3.0, w: 7.4, h: 0.6, fontFace: HF, fontSize: 26, bold: true, color: TEAL, margin: 0, valign: 'top', isTextBox: true });
  s.addText([
    run('გეოსივრცული მონაცემების დამუშავების, ავტომატიზაციის, არქიტექტურის, წარმადობისა და სერვერული შესაძლებლობების ტექნიკური შედარება', { fontFace: KF, fontSize: 14, color: WHITE, breakLine: true, paraSpaceAfter: 6 }),
    run('A Technical Comparison of Geospatial Data Processing, Automation, Architecture, Performance and Server Capabilities', { fontFace: BF, fontSize: 14, color: 'CADCFC' }),
  ], { x: 0.7, y: 3.9, w: 7.4, h: 1.8, margin: 0, valign: 'top', isTextBox: true });
  s.addText('ფაქტები გადამოწმებულია 2026-11-16-ზე / Facts verified as of 2026-11-16', { x: 0.7, y: 6.6, w: 9, h: 0.3, fontFace: KF, fontSize: 11, color: 'CADCFC', margin: 0, isTextBox: true });
  s.addNotes('ქართული / Georgian\nპრეზენტაცია ადარებს ოთხ განსხვავებული კატეგორიის ხელსაწყოს: FME (ETL პლატფორმა), GDAL (ბიბლიოთეკა და CLI), QGIS (დესკტოპ GIS) და Terrio (ახალი pure-Rust ხელსაწყო). მიზანია არა გამარჯვებულის გამოცხადება, არამედ ამოცანის მიხედვით არჩევა. ყველა ფაქტი გადამოწმებულია ოფიციალურ დოკუმენტაციასა და GitHub-ზე 2026-11-16-ს; დაუდასტურებელი პუნქტები აღნიშნულია.\n\nEnglish\nThis deck compares four tools from different categories: FME (ETL platform), GDAL (library + CLI), QGIS (desktop GIS) and Terrio (new pure-Rust toolkit). The goal is not to crown a winner but to choose by task. All facts were checked against official documentation and GitHub on 2026-11-16; unverified items are marked.');
}

// ================= 2. Introduction =================
{
  const s = slideBase('გეოსივრცული მონაცემების დამუშავების ეკოსისტემა', 'The Geospatial Data Processing Ecosystem',
    'ოთხივე ხელსაწყო წყვეტს ფორმატების, კოორდინატთა სისტემების, მასშტაბისა და ავტომატიზაციის პრობლემებს, მაგრამ სხვადასხვა კატეგორიაშია: ETL პლატფორმა, ბიბლიოთეკა/CLI, დესკტოპ GIS, ბრაუზერული WASM. ამიტომ შედარება ამოცანების მიხედვითაა, არა „ერთნაირი პროდუქტების“ ლოგიკით.',
    'All four tools address format diversity, coordinate reference systems, scale and automation, but sit in different categories: ETL platform, library/CLI, desktop GIS, browser WASM. The comparison is therefore task-based, not "like for like". Sources: official sites listed on the last slide.');
  s.addText(pairs([
    ['ფორმატების სიმრავლე და სხვადასხვა კოორდინატთა სისტემა', 'Many formats and coordinate reference systems'],
    ['დიდი რასტრული, ვექტორული და LiDAR მონაცემები', 'Large raster, vector and LiDAR datasets'],
    ['განმეორებადი, ავტომატიზებული პროცესები', 'Repeatable, automated workflows'],
    ['შედეგების გამოქვეყნება ვებ-სერვისებად', 'Publishing results as web services'],
  ], { ks: 15, es: 14, after: 10 }), { x: 0.6, y: 1.65, w: 4.6, h: 3.6, margin: 0, valign: 'top', isTextBox: true });
  s.addText([run('რატომ ვადარებთ? ', { fontFace: KF, fontSize: 14, bold: true, color: NAVY, breakLine: true }), run('ისინი ხშირად ერთ პროექტში ერთად გამოიყენება, მაგრამ ერთმანეთს არ ცვლის.', { fontFace: KF, fontSize: 14, color: INK, breakLine: true }),
    run('Why compare? ', { fontFace: BF, fontSize: 14, bold: true, color: NAVY, breakLine: true }), run('They are often used together in one project, but are not interchangeable.', { fontFace: BF, fontSize: 14, color: MUTE })],
    { x: 0.6, y: 5.35, w: 4.6, h: 1.5, margin: 0, valign: 'top', isTextBox: true });
  // category map
  const cats = [
    ['FME', [['ETL პლატფორმა', 'ETL platform'], ['სერვერული პლატფორმა (FME Flow)', 'Server platform (FME Flow)']]],
    ['GDAL', [['გეოსივრცული დამუშავების ბიბლიოთეკა', 'Geospatial processing library'], ['ბრძანების სტრიქონის ხელსაწყოები', 'Command-line toolkit']]],
    ['QGIS', [['დესკტოპ GIS აპლიკაცია', 'Desktop GIS application'], ['სერვერული პლატფორმა (QGIS Server, OGC)', 'Server platform (QGIS Server, OGC)']]],
    ['Terrio', [['დამუშავების ბიბლიოთეკა და CLI', 'Processing library and CLI'], ['ბრაუზერზე დაფუძნებული WebAssembly აპლიკაცია', 'Browser-based WebAssembly application']]],
  ];
  cats.forEach(([name, items], i) => {
    const y = 1.65 + i * 1.3;
    box(s, 5.6, y, 1.7, 1.15, name, '', { fill: NAVY, color: WHITE, ks: 20, bold: true });
    arrow(s, 7.3, y + 0.575, 7.65, y + 0.575);
    items.forEach(([ka, en], j) => box(s, 7.7 + j * 2.6, y, 2.5, 1.15, ka, en, { fill: j === 0 ? PALE : 'E6ECF8', ks: 12, es: 11 }));
  });
}

// ================= 3. FME =================
{
  const s = slideBase('FME (Safe Software): სივრცული ETL და ავტომატიზაცია', 'FME (Safe Software): Spatial ETL and Enterprise Automation',
    'FME Form არის ავტორინგის გარემო (Workbench), სადაც Readers → Transformers → Writers ჯაჭვით აგებენ workspace-ს. FME Flow არის სერვერი, რომელიც workspace-ებს უშვებს Automations-ით, Schedules-ით, REST API-თი და Engines-ით. Docker/Kubernetes და Remote Engines Service იძლევა ჰორიზონტალურ მასშტაბირებას. ლიცენზია კომერციულია; ფასები ღიად არ არის გამოქვეყნებული. FME 2026.2 გამოვიდა 2026 წლის ივნისში (Safe community post, 2026-06-26); 2026.1-დან კვარტალური ციკლია. Flow 2026.2-ში ჩაშენებული MCP სერვერია. წყაროები: academy.safe.com, fme.safe.com/platform/deployments, fme.safe.com/pricing.',
    'FME Form is the authoring environment (Workbench) where a workspace is built as Readers → Transformers → Writers. FME Flow is the server that runs workspaces via Automations, Schedules, the REST API and engines. Docker/Kubernetes and the Remote Engines Service provide horizontal scaling. Licensing is commercial; list prices are not publicly detailed. FME 2026.2 shipped in June 2026 (Safe community post, 2026-06-26); quarterly cadence since 2026.1. Flow 2026.2 adds a native MCP server. Sources: academy.safe.com, fme.safe.com/platform/deployments, fme.safe.com/pricing.');
  // pipeline diagram
  const y = 1.65;
  box(s, 0.6, y, 1.9, 1.3, 'Readers', 'წყაროები / sources', { fill: NAVY, color: WHITE, ks: 15, bold: true, ecolor: 'CADCFC' });
  arrow(s, 2.5, y + 0.65, 2.95, y + 0.65);
  box(s, 3.0, y, 2.6, 1.3, 'Transformers', 'გარდაქმნა, შეერთება, ვალიდაცია / reproject, join, validate', { fill: TEAL, color: INK, ks: 15, bold: true, es: 11, ecolor: INK });
  arrow(s, 5.6, y + 0.65, 6.05, y + 0.65);
  box(s, 6.1, y, 1.9, 1.3, 'Writers', 'სამიზნე ფორმატები / targets', { fill: NAVY, color: WHITE, ks: 15, bold: true, ecolor: 'CADCFC' });
  s.addShape('roundRect', { x: 0.45, y: y - 0.1, w: 7.7, h: 1.5, fill: { color: WHITE, transparency: 100 }, line: { color: NAVY, width: 1.25, dashType: 'dash' }, rectRadius: 0.1 });
  s.addText('FME Form · Workbench (workspace)', { x: 0.6, y: y + 1.42, w: 7.4, h: 0.28, fontFace: BF, fontSize: 11, bold: true, color: NAVY, margin: 0, isTextBox: true });
  arrow(s, 8.15, y + 0.65, 8.7, y + 0.65);
  box(s, 8.75, y - 0.1, 4.0, 1.5, 'FME Flow', 'Automations · Schedules · REST API · Engines', { fill: PALE, line: NAVY, ks: 17, bold: true, es: 12, color: NAVY, ecolor: INK });
  s.addText([run('ავტორინგი', { fontFace: KF, fontSize: 11, color: MUTE }), run(' / authoring', { fontFace: BF, fontSize: 11, color: MUTE })], { x: 0.6, y: y + 1.7, w: 3, h: 0.25, margin: 0, isTextBox: true });
  const L = [
    ['FME Form / Workbench: ავტორინგის გარემო და ვიზუალური ტილო', 'FME Form / Workbench: authoring environment and visual canvas'],
    ['სივრცული ETL: მონაცემთა ინტეგრაცია ბევრ წყაროსა და ფორმატს შორის', 'Spatial ETL: data integration across many sources and formats'],
    ['ავტომატიზაცია: Automations, Schedules, webhooks (FME Flow)', 'Automation: Automations, Schedules, webhooks (FME Flow)'],
  ];
  const Rr = [
    ['კორპორატიული არქიტექტურა: Docker, Kubernetes, Remote Engines, Hosted SaaS', 'Enterprise architecture: Docker, Kubernetes, Remote Engines, hosted SaaS'],
    ['ლიცენზია: კომერციული — გამოწერა, პერპეტუალური ან PAYG', 'Licensing: commercial — subscription, perpetual or PAYG'],
    ['სტატუსი: მწიფე; 2026.2 (2026 წლის ივნისი); კვარტალური გამოშვებები', 'Status: mature; 2026.2 (June 2026); quarterly releases'],
  ];
  s.addText(pairs(L, { ks: 14, es: 13, after: 12 }), { x: 0.6, y: 4.15, w: 6.0, h: 2.8, margin: 0, valign: 'top', isTextBox: true });
  s.addText(pairs(Rr, { ks: 14, es: 13, after: 12 }), { x: 6.9, y: 4.15, w: 5.9, h: 2.8, margin: 0, valign: 'top', isTextBox: true });
}

// ================= 4. GDAL =================
{
  const s = slideBase('GDAL: რასტრისა და ვექტორის ბიბლიოთეკა', 'GDAL: The Raster and Vector Translator Library',
    'GDAL/OGR გთავაზობთ ერთიან რასტრულ და ერთიან ვექტორულ მოდელს ფორმატისგან დამოუკიდებლად; ფორმატებს drivers უზრუნველყოფს. უახლესი სტაბილური ვერსია 3.13.3 (2026-08-18); bugfix გამოშვებები დაახლოებით ორ თვეში ერთხელ. ერთიანი `gdal` CLI (3.11-დან) ოფიციალურად „provisional“-ია — თავსებადობის გარანტია არ არსებობს; სტაბილური ქცევისთვის ტრადიციული gdalwarp/ogr2ogr უსაფრთხოა. GDAL-ს LAS/LAZ/COPC driver არ აქვს. GDAL პროექტი ავრცელებს წყაროს კოდსა და კონტეინერებს; ბინარებს მესამე მხარე ამზადებს. წყარო: gdal.org.',
    'GDAL/OGR presents one raster data model and one vector data model regardless of format; drivers provide the formats. Latest stable is 3.13.3 (2026-08-18); bugfix releases roughly every two months. The unified `gdal` CLI (3.11+) is documented as provisional with no compatibility guarantee, so the traditional gdalwarp/ogr2ogr are the stable choice. GDAL has no LAS/LAZ/COPC driver. The project distributes source and container images; binaries come from third parties. Source: gdal.org.');
  // layered architecture
  const layers = [
    ['აპლიკაციები: QGIS, rasterio, თქვენი სკრიპტები', 'Applications: QGIS, rasterio, your scripts', E6()],
    ['CLI და bindings: gdal, gdalwarp, ogr2ogr · Python (osgeo)', 'CLI and bindings: gdal, gdalwarp, ogr2ogr · Python (osgeo)', 'D5E0F5'],
    ['GDAL ბირთვი: რასტრის მოდელი + ვექტორის მოდელი (OGR)', 'GDAL core: raster model + vector model (OGR)', NAVY],
    ['დრაივერები: GeoTIFF, COG, GPKG, Parquet, NetCDF, HDF…', 'Drivers: GeoTIFF, COG, GPKG, Parquet, NetCDF, HDF…', TEAL],
  ];
  function E6() { return 'EAF0FB'; }
  layers.forEach(([ka, en, fill], i) => {
    const dark = fill === NAVY;
    box(s, 0.6, 1.65 + i * 1.15, 6.2, 1.0, ka, en, { fill, color: dark ? WHITE : INK, ecolor: dark ? 'CADCFC' : (fill === TEAL ? INK : MUTE), ks: 13, es: 12 });
  });
  chip(s, 0.6, 6.3, 2.0, 'ვერსია', '3.13.3 · 2026-08-18', NAVY, WHITE, 0.62);
  chip(s, 2.7, 6.3, 2.0, 'ლიცენზია', 'MIT-style', NAVY, WHITE, 0.62);
  chip(s, 4.8, 6.3, 2.0, 'ტიპი', 'Library + CLI', OK, WHITE, 0.62);
  const items = [
    ['რასტრი და ვექტორი: warp, translate, mosaic (VRT), contour, rasterize, DEM, vector SQL', 'Raster and vector: warp, translate, mosaic (VRT), contour, rasterize, DEM, vector SQL'],
    ['გადაპროექცია და ფორმატის კონვერტაცია: gdalwarp, gdal_translate, ogr2ogr', 'Reprojection and format conversion: gdalwarp, gdal_translate, ogr2ogr'],
    ['ავტომატიზაცია: bash/Python სკრიპტები, cron/CI, gdal pipeline', 'Automation: bash/Python scripts, cron/CI, gdal pipeline'],
    ['ძლიერი მხარეები: სიმწიფე, ფორმატების სიგანე, ინტეგრაცია (QGIS და სხვ.)', 'Strengths: maturity, format breadth, ecosystem integration (QGIS and others)'],
    ['შეზღუდვები: GUI/სერვერი არ აქვს; LAS/COPC driver არ აქვს; CLI მოითხოვს გამოცდილებას', 'Limitations: no GUI or server; no LAS/COPC driver; CLI needs expertise'],
  ];
  s.addText(pairs(items, { ks: 13.5, es: 12.5, after: 9 }), { x: 7.2, y: 1.6, w: 5.6, h: 5.3, margin: 0, valign: 'top', isTextBox: true });
}

// ================= 5. QGIS =================
{
  const s = slideBase('QGIS: დესკტოპ GIS და სერვერი', 'QGIS: Desktop GIS, Processing and Server',
    'QGIS 4.2.3 (2026-09-25) არის უახლესი გამოშვება; LTR არის 3.44.15; 4.4-ის წინ feature freeze-ია (qgis.org/download). ლიცენზია GPL-2.0 (GitHub). QGIS Server FastCGI პროგრამაა (qgis_mapserv.fcgi) Apache/NGINX-ის უკან და პუბლიკაციას აკეთებს WMS, WFS, WCS, WMTS და OGC API Features-ით. წყაროები: qgis.org, docs.qgis.org server manual.',
    'QGIS 4.2.3 (2026-09-25) is the latest release; the LTR is 3.44.15; a feature freeze is in place ahead of 4.4 (qgis.org/download). License GPL-2.0 (GitHub). QGIS Server is a FastCGI program (qgis_mapserv.fcgi) behind Apache/NGINX publishing WMS, WFS, WCS, WMTS and OGC API Features. Sources: qgis.org, docs.qgis.org server manual.');
  const tiles = [
    ['დესკტოპი და კარტოგრაფია', 'Desktop and cartography', 'სტილები, ლეიაუტები, ატლასები', 'Styling, print layouts, atlases'],
    ['Processing Toolbox', 'Processing Toolbox', 'ანალიზის ალგორითმები ერთ ადგილას (GDAL-ის ჩათვლით)', 'Analysis algorithms in one place (including GDAL)'],
    ['Graphical Model Designer', 'Graphical Model Designer', 'ალგორითმების ჯაჭვი ვიზუალურად', 'Chain algorithms visually'],
    ['PyQGIS', 'PyQGIS', 'Python API დესკტოპისა და სკრიპტებისთვის', 'Python API for desktop and scripts'],
    ['Plugins', 'Plugins', 'საზოგადოების გაფართოებები', 'Community extensions'],
    ['QGIS Server', 'QGIS Server', 'WMS, WFS, WCS, WMTS, OGC API Features', 'WMS, WFS, WCS, WMTS, OGC API Features'],
  ];
  tiles.forEach(([ka, en, dka, den], i) => {
    const x = 0.6 + (i % 3) * 4.1, y = 1.65 + Math.floor(i / 3) * 2.25;
    s.addShape('roundRect', { x, y, w: 3.9, h: 2.05, fill: { color: PALE }, line: { color: PALE }, rectRadius: 0.1 });
    s.addShape('ellipse', { x: x + 0.2, y: y + 0.2, w: 0.5, h: 0.5, fill: { color: i === 5 ? TEAL : NAVY }, line: { color: WHITE } });
    s.addText(String(i + 1), { x: x + 0.2, y: y + 0.2, w: 0.5, h: 0.5, align: 'center', valign: 'middle', fontFace: HF, fontSize: 15, bold: true, color: i === 5 ? INK : WHITE, margin: 0, isTextBox: true });
    s.addText([run(en, { fontFace: HF, fontSize: 15, bold: true, color: NAVY, breakLine: true }), run(ka === en ? '' : ka, { fontFace: KF, fontSize: 12, color: INK, breakLine: true }), run(dka, { fontFace: KF, fontSize: 12.5, color: INK, breakLine: true, paraSpaceBefore: 6 }), run(den, { fontFace: BF, fontSize: 12, color: MUTE })],
      { x: x + 0.85, y: y + 0.12, w: 2.95, h: 1.85, margin: 0, valign: 'top', isTextBox: true });
  });
  chip(s, 0.6, 6.2, 2.9, 'უახლესი', '4.2.3 · 2026-09-25', NAVY, WHITE);
  chip(s, 3.65, 6.2, 2.9, 'LTR', '3.44.15', NAVY, WHITE);
  chip(s, 6.7, 6.2, 2.9, 'ლიცენზია', 'GPL-2.0', NAVY, WHITE);
  chip(s, 9.75, 6.2, 3.0, 'ტიპი', 'Desktop GIS (+ Server)', OK, WHITE);
}

// ================= 6. Terrio =================
{
  const s = slideBase('Terrio (OpenGeos): ახალი pure-Rust ხელსაწყო', 'Terrio (OpenGeos): An Emerging Pure-Rust Toolkit',
    'Terrio v0.9.0 (2026-11-15) — რეპოზიტორია შეიქმნა 2026-10-14-ს, ამიტომ ძალიან ახალი პროექტია. README-ის მიხედვით: early development, API შეიძლება შეიცვალოს 1.0-მდე. ლიცენზია MIT. წმინდა Rust, C დამოკიდებულებების გარეშე, WebAssembly-ზეც იგება. CLI (`terrio`), Python (`pip install terrio`), JavaScript/WASM (`terrio-js`), ლოკალური ბრაუზერ-UI (`terrio ui`, 127.0.0.1) და MCP სერვერი. GDAL-თან თავსებადობა: ბრძანებები/პარამეტრები GDAL-ს მიჰყვება, შედეგები GDAL/PROJ/PDAL-თან ტესტირდება; არასავალდებულო GDAL backend C დამოკიდებულებაა. Roadmap-ის non-goals: GDAL-ის სრული ჩანაცვლება, vendor SDK ფორმატები, DB drivers (PostGIS) ბირთვში. README აღნიშნავს, რომ პროექტი ძირითადად AI-ით, ადამიანის ზედამხედველობით იქმნება. გამოქვეყნებული ბენჩმარკები ვერ ვიპოვეთ. წყარო: github.com/opengeos/terrio, terrio.dev.',
    'Terrio v0.9.0 (2026-11-15). The repository was created 2026-10-14, so it is a very young project. Per its README: early development, API may change before 1.0. License MIT. Pure Rust, no C dependencies by default, builds to WebAssembly. CLI (`terrio`), Python (`pip install terrio`), JavaScript/WASM (`terrio-js`), a local browser UI (`terrio ui`, 127.0.0.1 only) and an MCP server. GDAL compatibility: commands and options follow GDAL, results are tested against GDAL/PROJ/PDAL; the optional GDAL backend adds a C dependency. Roadmap non-goals: replacing all of GDAL, vendor-SDK formats, database drivers (PostGIS) in core. The README discloses that the project is primarily built with AI under human review. No published benchmarks found. Source: github.com/opengeos/terrio, terrio.dev.');
  s.addImage({ path: __dirname + '/../assets/terrio-ui.png', x: 0.6, y: 1.65, w: 5.6, h: 3.16 });
  s.addText('terrio ui — ლოკალური ბრაუზერ-ინტერფეისი / local browser interface (source: github.com/opengeos/terrio)', { x: 0.6, y: 4.85, w: 5.6, h: 0.5, fontFace: BF, fontSize: 10, color: MUTE, margin: 0, isTextBox: true });
  chip(s, 0.6, 5.5, 1.8, 'ვერსია', 'v0.9.0 · 2026-11-15', NAVY, WHITE);
  chip(s, 2.5, 5.5, 1.8, 'ლიცენზია', 'MIT', NAVY, WHITE);
  chip(s, 4.4, 5.5, 1.8, 'სტატუსი', 'Early development', BAD, WHITE);
  s.addText([run('განვითარება აქტიურია: ', { fontFace: KF, fontSize: 11, color: INK }), run('6 release 2026-10-31 → 2026-11-15 / active: several releases in two weeks', { fontFace: BF, fontSize: 11, color: MUTE })], { x: 0.6, y: 6.25, w: 5.6, h: 0.5, margin: 0, isTextBox: true });
  const items = [
    ['წმინდა Rust, C დამოკიდებულებების გარეშე; WebAssembly-ზეც იგება', 'Pure Rust, no C dependencies by default; builds to WebAssembly'],
    ['Raster, vector და Point Cloud I/O (LAS, LAZ, COPC, EPT)', 'Raster, vector and point cloud I/O (LAS, LAZ, COPC, EPT)'],
    ['CLI · Python · JavaScript/WASM · ლოკალური ბრაუზერ-UI · MCP', 'CLI · Python · JavaScript/WASM · local browser UI · MCP'],
    ['GDAL-თან თავსებადობა: GDAL-სტილის ბრძანებები; ტესტირება GDAL-თან; არასავალდებულო GDAL backend', 'GDAL compatibility: GDAL-style commands; tested against GDAL; optional GDAL backend'],
    ['შეზღუდვები: API შეიძლება შეიცვალოს 1.0-მდე; GDAL-ის სრული ჩანაცვლება მიზანი არ არის; PostGIS ბირთვში არ არის', 'Limitations: API may change before 1.0; replacing all of GDAL is not a goal; no PostGIS in core'],
  ];
  s.addText(pairs(items, { ks: 15, es: 13.5, after: 14 }), { x: 6.6, y: 1.6, w: 6.2, h: 5.3, margin: 0, valign: 'top', isTextBox: true });
}

// ================= 7. Architecture =================
{
  const s = slideBase('არქიტექტურის შედარება', 'Architecture Comparison: Four Different Categories',
    'ოთხივე ხელსაწყო სხვადასხვა არქიტექტურაა. FME: ავტორინგი (Form) + სერვერი (Flow). GDAL: C/C++ ბირთვი + drivers, რომელზეც სხვა პროგრამები დგას. QGIS: Qt/C++ დესკტოპი და ცალკე FastCGI სერვერი. Terrio: Rust ბირთვი და ბევრი ინტერფეისი (CLI, Python, WASM, UI, MCP). QGIS იყენებს GDAL/OGR-ს ფორმატებისთვის; Terrio ცდილობს GDAL-თან თავსებადობას. დიაგრამა გამარტივებულია — დეტალებისთვის იხილეთ ოფიციალური დოკუმენტაცია.',
    'The four tools have different architectures. FME: authoring (Form) + server (Flow). GDAL: a C/C++ core with drivers on which other programs are built. QGIS: a Qt/C++ desktop application plus a separate FastCGI server. Terrio: a Rust core with many front ends (CLI, Python, WASM, UI, MCP). QGIS uses GDAL/OGR for many formats; Terrio targets GDAL compatibility. The diagram is simplified; see official documentation for detail.');
  const cols = [
    ['FME', 'ETL პლატფორმა', 'ETL platform', [['FME Flow: core + engines', 'server'], ['FME Form: Workbench', 'authoring'], ['Readers · Transformers · Writers', 'workspace']]],
    ['GDAL', 'ბიბლიოთეკა + CLI', 'Library + CLI toolkit', [['CLI · Python · C/C++ API', 'interfaces'], ['რასტრის + ვექტორის მოდელი', 'core model'], ['Drivers (OGR)', 'formats']]],
    ['QGIS', 'დესკტოპ GIS', 'Desktop GIS (+ Server)', [['QGIS Server (FastCGI) + OGC', 'server'], ['Desktop · Processing · PyQGIS · Plugins', 'Qt/C++ app'], ['GDAL/OGR + native providers', 'data access']]],
    ['Terrio', 'ბიბლიოთეკა + CLI + WASM', 'Library + CLI + WASM', [['CLI · Python · JS/WASM · UI · MCP', 'interfaces'], ['Pure-Rust core crates', 'core'], ['Optional GDAL backend (C)', 'opt-in']]],
  ];
  cols.forEach(([name, ka, en, rows], i) => {
    const x = 0.6 + i * 3.1;
    box(s, x, 1.65, 2.9, 0.75, name, '', { fill: NAVY, color: WHITE, ks: 20, bold: true });
    s.addText([run(ka, { fontFace: KF, fontSize: 12, bold: true, color: OK, breakLine: true }), run(en, { fontFace: BF, fontSize: 12, bold: true, color: OK })], { x, y: 2.45, w: 2.9, h: 0.6, margin: 0, align: 'center', valign: 'middle', isTextBox: true });
    rows.forEach(([t, tag], j) => {
      const fills = ['EAF0FB', PALE, 'D5E0F5'];
      box(s, x, 3.15 + j * 1.0, 2.9, 0.88, t, tag, { fill: fills[j], ks: 12, es: 11 });
    });
  });
  s.addText([run('განკუთვნილება: ', { fontFace: KF, fontSize: 12, bold: true, color: NAVY }), run('FME — ინტეგრაცია და ავტომატიზაცია · GDAL — დამუშავების საფუძველი · QGIS — ანალიზი და რუკები · Terrio — მსუბუქი, პორტატული I/O', { fontFace: KF, fontSize: 12, color: INK, breakLine: true }),
    run('Intended purpose: ', { fontFace: BF, fontSize: 12, bold: true, color: NAVY }), run('FME — integration and automation · GDAL — the processing foundation · QGIS — analysis and maps · Terrio — lightweight, portable I/O', { fontFace: BF, fontSize: 12, color: MUTE })],
    { x: 0.6, y: 6.2, w: 12.1, h: 0.75, margin: 0, valign: 'top', isTextBox: true });
}

// ================= 8. GUI vs CLI vs API =================
{
  const s = slideBase('GUI, CLI და API', 'GUI vs CLI vs API',
    'FME-ს აქვს დესკტოპ GUI (Form) და ვებ-ინტერფეისი (Flow), CLI და API-ები. GDAL არის CLI + API, GUI არ აქვს. QGIS-ს აქვს მშობლიური დესკტოპ GUI, qgis_process CLI და PyQGIS/C++ API; QGIS Server ვებ-რედაქტირების ინტერფეისს არ იძლევა. Terrio-ს ძირითადი ინტერფეისი CLI-ა; აქვს ლოკალური ბრაუზერ-UI (`terrio ui`) და ვებ-ვერსია (terrio.dev/web), მაგრამ ეს დესკტოპ GIS არ არის. სწავლის მრუდის შეფასებები ექსპერტულია და არა გაზომილი.',
    'FME has a desktop GUI (Form), a web UI (Flow), a CLI and APIs. GDAL is CLI + API with no GUI. QGIS has a native desktop GUI, the qgis_process CLI and PyQGIS/C++ APIs; QGIS Server does not provide a web editing UI. Terrio\'s primary interface is the CLI; it has a local browser UI (`terrio ui`) and a web version (terrio.dev/web), but it is not a desktop GIS. Learning-curve ratings are expert judgement, not measurements.');
  const rows = [
    [p('დესკტოპ GUI', 'Native desktop GUI'), c('✔', 'FME Form', 'FME Form'), c('✘', '—', '—'), c('✔', 'QGIS Desktop', 'QGIS Desktop'), c('✘', '—', '—')],
    [p('ბრაუზერ-ინტერფეისი', 'Browser interface'), c('✔', 'FME Flow ვებ-UI', 'FME Flow web UI'), c('✘', '—', '—'), c('✘', 'მხოლოდ სერვისები (Server)', 'Services only (Server)'), c('✔', 'terrio ui, ვებ-ვერსია', 'terrio ui, web version')],
    [p('ბრძანების სტრიქონი', 'Command line'), c('✔', 'workspace-ის გაშვება', 'run workspaces'), c('✔', 'gdal, ogr2ogr…', 'gdal, ogr2ogr…'), c('✔', 'qgis_process', 'qgis_process'), c('✔', 'terrio', 'terrio')],
    [p('პროგრამირების API-ები', 'Programming APIs'), c('✔', 'REST, Python', 'REST, Python'), c('✔', 'C/C++, Python…', 'C/C++, Python…'), c('✔', 'PyQGIS, C++', 'PyQGIS, C++'), c('✔', 'Rust, Python, JS/WASM', 'Rust, Python, JS/WASM')],
    [p('სწავლის მრუდი', 'Learning curve'), c('', 'საშუალო', 'Moderate'), c('', 'მაღალი', 'Steep'), c('', 'დაბალი → საშუალო', 'Low → moderate'), c('', 'დაბალი GDAL-ის მცოდნეებისთვის', 'Low for GDAL users')],
    [p('არაპროგრამისტებისთვის', 'For non-programmers'), c('✔', 'კარგი', 'Good'), c('✘', 'სუსტი', 'Weak'), c('✔', 'ძალიან კარგი', 'Very good'), c('◐', 'UI ფორმებით', 'Via UI forms')],
    [p('workflow-ების დაპროექტება', 'Workflow design'), c('✔', 'Workbench ტილო', 'Workbench canvas'), c('◐', 'სკრიპტები, pipeline', 'Scripts, pipeline'), c('✔', 'Graphical Modeler', 'Graphical Modeler'), c('◐', 'სკრიპტები, MCP', 'Scripts, MCP')],
  ];
  EXPORT[8] = rows;
  const tbl = [[hdr('კრიტერიუმი', 'Criterion'), hdr('FME', ''), hdr('GDAL', ''), hdr('QGIS', ''), hdr('Terrio', '')]];
  rows.forEach(r => tbl.push([rowHead(r[0]), ...r.slice(1).map(x => bodyCell(x, 11))]));
  s.addTable(tbl, tblOpts(0.6, 1.5, 12.1, [2.5, 2.4, 2.4, 2.4, 2.4], { rowH: [0.42, 0.62, 0.62, 0.62, 0.62, 0.62, 0.62, 0.62] }));
  legend(s, 6.72);
}

// ================= 9. Server & Enterprise =================
{
  const s = slideBase('სერვერი და კორპორატიული გაშვება', 'Server and Enterprise Deployment',
    'ეს ძირითადი სლაიდია. მხოლოდ FME Flow და QGIS Server არიან ცალკე სერვერული პროდუქტები. FME Flow: REST API (V4), Schedules/Automations, Engines, Remote Engines, Kubernetes. QGIS Server: OGC ვებ-სერვისები (WMS/WFS/WCS/WMTS/OGC API Features); მასშტაბირება — რამდენიმე FastCGI instance load balancer-ის უკან (ოფიციალური მაგალითი NGINX-ით); დაგეგმვა/სამუშაოები არ აქვს — საჭიროა cron ან გარე სისტემა. GDAL სერვერი არ არის: GDAL-ზე დაფუძნებული სერვისი თქვენ უნდა ააგოთ. Terrio სერვერული პლატფორმა არ არის: `terrio ui` მხოლოდ 127.0.0.1-ზე უსმენს, WASM კი ბრაუზერში მუშაობს. FME Flow REST API-ის V3 deprecated-ია 2025.1-ში (მესამეული წყარო — გადაამოწმეთ docs.safe.com-ზე).',
    'This is the key slide. Only FME Flow and QGIS Server are dedicated server products. FME Flow: REST API (V4), Schedules/Automations, engines, Remote Engines, Kubernetes. QGIS Server: OGC web services (WMS/WFS/WCS/WMTS/OGC API Features); scaling is several FastCGI instances behind a load balancer (the official example uses NGINX); it has no job scheduler, so use cron or an external system. GDAL is not a server: a GDAL-based service must be built by you. Terrio is not a server platform: `terrio ui` listens on 127.0.0.1 only and WASM runs in the browser. FME Flow REST API V3 was deprecated in 2025.1 (secondary source; verify on docs.safe.com).');
  const hd = [hdr('', ''), hdr('FME Flow', ''), hdr('QGIS Server', ''), hdr('GDAL-based custom service', ''), hdr('Terrio WASM + local UI', '')];
  const rows = [
    [p('ცალკე სერვერული პროდუქტი', 'Dedicated server product'), c('✔', 'დიახ', 'Yes'), c('✔', 'დიახ (OGC სერვერი)', 'Yes (OGC server)'), c('✘', 'არა', 'No'), c('✘', 'არა', 'No')],
    [p('REST API', 'REST API'), c('✔', 'REST API (V4)', 'REST API (V4)'), c('◐', 'OGC API Features; job API არა', 'OGC API Features; no job API'), c('◐', 'თქვენ ქმნით', 'You build it'), c('✘', 'არა', 'No')],
    [p('დაგეგმილი სამუშაოები', 'Scheduled jobs'), c('✔', 'Schedules, Automations', 'Schedules, Automations'), c('✘', 'cron/გარე სისტემა', 'cron / external'), c('◐', 'cron/Airflow…', 'cron / Airflow…'), c('✘', 'არა', 'No')],
    [p('ვებ-სერვისები', 'Web services'), c('✔', 'სერვისად გამოქვეყნება', 'Publish as services'), c('✔', 'WMS, WFS, WCS, WMTS', 'WMS, WFS, WCS, WMTS'), c('◐', 'თქვენ ქმნით', 'You build it'), c('◐', 'ბრაუზერში (WASM)', 'In-browser (WASM)')],
    [p('განაწილებული დამუშავება', 'Distributed processing'), c('✔', 'Engines, Remote Engines', 'Engines, Remote Engines'), c('◐', 'რამდენიმე instance', 'Multiple instances'), c('◐', 'თქვენ ქმნით', 'You build it'), c('✘', 'არა', 'No')],
    [p('ჰორიზონტალური მასშტაბირება', 'Horizontal scaling'), c('✔', 'Kubernetes, Docker', 'Kubernetes, Docker'), c('◐', 'load balancer-ით, ხელით', 'Load balancer, manual'), c('◐', 'თქვენი არქიტექტურით', 'Your architecture'), c('✘', 'არა', 'No')],
    [p('საჭიროა საკუთარი განვითარება', 'Custom development required'), c('', 'დაბალი', 'Low'), c('', 'დაბალი–საშუალო', 'Low–moderate'), c('', 'მაღალი', 'High'), c('', 'ეს არ არის სერვერი', 'Not a server')],
  ];
  EXPORT[9] = rows;
  const tbl = [hd];
  rows.forEach(r => tbl.push([rowHead(r[0], 10.5), ...r.slice(1).map(x => bodyCell(x, 10.5))]));
  s.addTable(tbl, tblOpts(0.6, 1.5, 12.1, [2.5, 2.4, 2.4, 2.4, 2.4], { rowH: [0.4, 0.62, 0.62, 0.62, 0.62, 0.62, 0.62, 0.62] }));
  legend(s, 6.7);
}

// ================= 10. OS compatibility =================
{
  const s = slideBase('ოპერაციული სისტემების თავსებადობა', 'Operating System Compatibility',
    'FME: Form-ის ინსტალაცია Windows, Linux და macOS (ARM)-ზე (fme.safe.com/platform/deployments); Flow — Windows Server და Linux; Ubuntu 24.04 არის Recommended (ძიების შეჯამება support.safe.com-დან; გადაამოწმეთ Safe-ის მიმდინარე ტექნიკური სპეციფიკაციების გვერდზე (ძველი URL 404-ს აბრუნებს)). GDAL პროექტი ავრცელებს მხოლოდ წყაროს კოდს და კონტეინერებს; Windows/macOS/Linux ბინარებს conda-forge, OSGeo4W, Homebrew, დისტრიბუციები გვაძლევს. QGIS: Windows, macOS, Linux, Android, BSD, კონტეინერები; Server — Debian/Ubuntu (Apache/NGINX) და Windows (OSGeo4W); headless სერვერზე Xvfb შეიძლება იყოს საჭირო. Terrio: install scripts Linux/macOS/Windows-ისთვის, Homebrew cask, pip, cargo.',
    'FME: Form installs on Windows, Linux and macOS (ARM) (fme.safe.com/platform/deployments); Flow runs on Windows Server and Linux; Ubuntu 24.04 is rated Recommended (search summary of support.safe.com; verify on the current Safe Software technical-specifications page; the old tech-specs URL returned 404). The GDAL project distributes source and container images only; Windows/macOS/Linux binaries come from conda-forge, OSGeo4W, Homebrew and distributions. QGIS: Windows, macOS, Linux, Android, BSD, containers; Server on Debian/Ubuntu (Apache/NGINX) and Windows (OSGeo4W); a headless server may need Xvfb. Terrio: install scripts for Linux/macOS/Windows, Homebrew cask, pip, cargo.');
  const hd = [hdr('', ''), hdr('FME', ''), hdr('GDAL', ''), hdr('QGIS', ''), hdr('Terrio', '')];
  const rows = [
    [p('დესკტოპის ინსტალაცია', 'Desktop installation'), c('✔', 'Form: Windows, Linux, macOS (ARM)', 'Form: Windows, Linux, macOS (ARM)'), c('✔', 'მესამე მხარის ბინარები', 'Third-party binaries'), c('✔', 'Windows, macOS, Linux', 'Windows, macOS, Linux'), c('✔', 'ბინარი სამივე სისტემაზე', 'Binary on all three')],
    [p('სერვერული ინსტალაცია', 'Server installation'), c('✔', 'Flow: Windows, Linux', 'Flow: Windows, Linux'), c('✘', 'სერვერი არ არის', 'Not a server'), c('✔', 'Server: Linux, Windows', 'Server: Linux, Windows'), c('✘', 'სერვერი არ არის', 'Not a server')],
    [p('კონტეინერი და ღრუბელი', 'Container and cloud'), c('✔', 'Docker, Kubernetes, Hosted (AWS)', 'Docker, Kubernetes, Hosted (AWS)'), c('✔', 'ოფიციალური Docker images', 'Official Docker images'), c('✔', 'Docker დოკუმენტირებულია', 'Docker documented'), c('◐', 'ბინარი/WASM; ოფიციალური image — არ დადასტურდა', 'Binary/WASM; official image not verified')],
    [p('დამოკიდებულებები', 'Dependencies'), c('', 'ლიცენზია; Flow-ს თავისი კომპონენტები', 'License; Flow has its own components'), c('', 'PROJ და სხვა ბიბლიოთეკები', 'PROJ and other libraries'), c('', 'Server-ზე: FastCGI, Xvfb (print)', 'Server: FastCGI, Xvfb (printing)'), c('', 'C დამოკიდებულებები არ არის (ნაგულისხმევად)', 'No C dependencies (by default)')],
    [p('გაშვების სირთულე', 'Deployment complexity'), c('', 'Form დაბალი; Flow საშუალო–მაღალი', 'Form low; Flow medium–high'), c('', 'დაბალი პაკეტებით; მაღალი წყაროდან', 'Low via packages; high from source'), c('', 'Desktop დაბალი; Server საშუალო', 'Desktop low; Server medium'), c('', 'დაბალი', 'Low')],
  ];
  EXPORT[10] = rows;
  const tbl = [hd];
  rows.forEach(r => tbl.push([rowHead(r[0]), ...r.slice(1).map(x => bodyCell(x, 10.5))]));
  s.addTable(tbl, tblOpts(0.6, 1.6, 12.1, [2.5, 2.4, 2.4, 2.4, 2.4], { rowH: [0.4, 0.9, 0.8, 0.9, 0.9, 0.9] }));
  legend(s, 6.7);
}

// ================= 11. Formats =================
{
  const s = slideBase('მონაცემთა ფორმატები და drivers', 'Data Formats and Drivers',
    'ცხრილი აჩვენებს ზოგად მხარდაჭერას და არა ყველა ვერსიაში ერთნაირ ფუნქციონალს: მხარდაჭერა დამოკიდებულია ვერსიაზე, build-ზე, plug-in-ებზე და read/write რეჟიმზე. GDAL-ს (Geo)Parquet driver აქვს 3.5-დან (კითხვა/წერა); LAS/LAZ/COPC driver GDAL-ის სიებში არ არის. FME-ში COPC reader/writer დაემატა 2023+ ვერსიებში; cloud-native ფორმატები — 2024.0-დან (Safe-ის ბლოგი). HDF5 FME-ში დაუდასტურებელია. Terrio-ს cargo features ფორმატების ოჯახებს ჩართავს/გამორთავს; PostGIS ბირთვის non-goal-ია.',
    'The table shows general support, not identical behaviour in every version: support depends on version, build, plug-ins and read/write mode. GDAL has a (Geo)Parquet driver since 3.5 (read/write); no LAS/LAZ/COPC driver appears in its driver lists. FME added a COPC reader/writer in 2023+ and cloud-native formats from 2024.0 (Safe blog). HDF5 support in FME is unverified. Terrio\'s cargo features toggle format families; PostGIS is a core non-goal.');
  const tbl = [[hdr('ფორმატი', 'Format'), hdr('FME', ''), hdr('GDAL', ''), hdr('QGIS', ''), hdr('Terrio', '')]];
  FORMATS.forEach(f => tbl.push([{ text: f.k, options: { fontFace: BF, fontSize: 11, bold: true, color: NAVY, fill: { color: PALE }, valign: 'middle' } },
    ...f.v.map(v => ({ text: v, options: { fontFace: 'Segoe UI Symbol', fontSize: 14, bold: true, color: symColor[v], align: 'center', valign: 'middle' } }))]));
  s.addTable(tbl, tblOpts(0.6, 1.55, 7.4, [3.4, 1.0, 1.0, 1.0, 1.0], { rowH: 0.36 }));
  s.addText(FORMAT_NOTES.flatMap((n, i) => pair(n.ka, n.en, { ks: 12, es: 11.5, after: 10, more: i < FORMAT_NOTES.length - 1 })), { x: 8.4, y: 1.55, w: 4.4, h: 4.2, margin: 0, valign: 'top', isTextBox: true });
  s.addText([run('მხარდაჭერა დამოკიდებულია ვერსიაზე, build-სა და კონფიგურაციაზე. ', { fontFace: KF, fontSize: 11, color: MUTE, breakLine: true }), run('Support depends on version, build and configuration.', { fontFace: BF, fontSize: 11, color: MUTE })], { x: 8.4, y: 5.55, w: 4.4, h: 0.7, margin: 0, valign: 'top', isTextBox: true });
  legend(s, 6.7);
}

// ================= 12. Performance =================
{
  const s = slideBase('წარმადობა და ბენჩმარკინგი', 'Performance and Benchmarking',
    'დამოუკიდებელი, რეპროდუცირებადი ოთხმხრივი ბენჩმარკი (FME/GDAL/QGIS/Terrio) ვერ ვიპოვეთ; ამიტომ რიცხვებს არ ვასახელებთ და გრაფიკს არ ვხატავთ. GDAL-ის mailing-list მაგალითები ანეკდოტურია: threads ყოველთვის არ აჩქარებს (I/O ხშირად შემზღუდავია); GDAL_CACHEMAX-ის გაზრდა ზოგჯერ აუარესებს შედეგს. Terrio-სთვისაც გამოქვეყნებული ბენჩმარკი ვერ ვიპოვეთ. მეთოდოლოგია მოცემულია GIS_DAY_BENCHMARK_METHODOLOGY.md-ში.',
    'We found no independent, reproducible four-way benchmark (FME/GDAL/QGIS/Terrio), so we show no numbers and draw no chart. The GDAL mailing-list examples are anecdotal: threads do not always help (I/O is often the bottleneck) and a larger GDAL_CACHEMAX sometimes hurt. No published benchmarks were found for Terrio either. The methodology is in GIS_DAY_BENCHMARK_METHODOLOGY.md.');
  s.addText(pairs([
    ['გამოქვეყნებული ოთხმხრივი ბენჩმარკი ვერ მოვძებნეთ — რიცხვებს არ ვასახელებთ', 'No published four-way benchmark found — we show no numbers'],
    ['GDAL-ის შემთხვევები (mailing list): მეტი thread ყოველთვის უკეთესი არ არის; ხშირად I/O ზღუდავს', 'GDAL mailing-list reports: more threads are not always faster; I/O often limits'],
  ], { ks: 13.5, es: 12.5, after: 10 }), { x: 0.6, y: 1.6, w: 5.3, h: 2.4, margin: 0, valign: 'top', isTextBox: true });
  s.addText([run('რაზეა დამოკიდებული / What it depends on', { fontFace: BF, fontSize: 13, bold: true, color: NAVY })], { x: 0.6, y: 4.05, w: 5.3, h: 0.3, margin: 0, isTextBox: true });
  const f = [['აპარატურა', 'Hardware'], ['მონაცემთა ზომა', 'Data size'], ['დრაივერები', 'Drivers'], ['შეკუმშვა', 'Compression'], ['ალგორითმი', 'Algorithm'], ['კონფიგურაცია', 'Configuration']];
  f.forEach(([ka, en], i) => box(s, 0.6 + (i % 3) * 1.8, 4.45 + Math.floor(i / 3) * 1.05, 1.7, 0.95, ka, en, { fill: PALE, ks: 12, es: 11 }));
  // methodology pipeline
  s.addText([run('რეპროდუცირებადი მეთოდოლოგია / Reproducible methodology', { fontFace: BF, fontSize: 13, bold: true, color: NAVY })], { x: 6.5, y: 1.6, w: 6.3, h: 0.3, margin: 0, isTextBox: true });
  const steps = [['მონაცემები', 'Datasets (fixed)'], ['გარემო', 'Hardware + versions'], ['გაშვება', 'Run ×5, warm/cold'], ['გაზომვა', 'Time, RAM, CPU'], ['შემოწმება', 'Output correctness']];
  steps.forEach(([ka, en], i) => {
    box(s, 6.5, 2.0 + i * 0.7, 2.4, 0.58, ka, en, { fill: i % 2 ? PALE : 'E6ECF8', ks: 11, es: 10.5 });
    if (i < steps.length - 1) arrow(s, 7.7, 2.58 + i * 0.7, 7.7, 2.7 + i * 0.7);
  });
  s.addText(pairs([
    ['8 ტესტი: რასტრის კითხვა/ჩაწერა, გადაპროექცია, ვექტორის კონვერტაცია, დიდი მონაცემები, Point Cloud, პარალელიზმი, მეხსიერება, CPU', '8 scenarios: raster read/write, reprojection, vector conversion, large data, point cloud, parallelism, memory, CPU'],
  ], { ks: 12, es: 11.5 }), { x: 9.2, y: 2.0, w: 3.6, h: 3.5, margin: 0, valign: 'top', isTextBox: true });
  s.addText([run('დეტალები: GIS_DAY_BENCHMARK_METHODOLOGY.md / See GIS_DAY_BENCHMARK_METHODOLOGY.md', { fontFace: BF, fontSize: 11, color: MUTE })], { x: 6.5, y: 5.65, w: 6.3, h: 0.3, margin: 0, isTextBox: true });
}

// ================= 13. Automation & programming =================
{
  const s = slideBase('ავტომატიზაცია და პროგრამირება', 'Automation and Programming',
    'Python ოთხივე ხელსაწყოშია. C++ — GDAL და QGIS ბირთვია; FME-ის C++ SDK-ზე ამ კვლევაში დადასტურება ვერ მოვიპოვეთ. Rust — Terrio-ს მშობლიური ენაა; GDAL-ისთვის არსებობს თემის (community) crate-ები, ოფიციალური არა. JavaScript — Terrio-ს terrio-js (WASM); სხვებთან — REST/OGC სერვისებით. დაგეგმვა: FME Flow Schedules/Automations; QGIS და GDAL — cron/CI; Terrio — cron/CI. მონაცემთა ბაზები და ღრუბელი: GDAL (PostGIS, /vsis3/), FME (კონექტორები), QGIS (providers, GDAL VSI), Terrio (s3://, gs://, az://, HTTP range; PostGIS ბირთვში არა).',
    'Python is available in all four. C++ is the GDAL and QGIS core; we could not verify an FME C++ SDK in this research. Rust is Terrio\'s native language; community crates exist for GDAL, but none are official. JavaScript: Terrio\'s terrio-js (WASM); with others via REST/OGC services. Scheduling: FME Flow Schedules/Automations; QGIS and GDAL via cron/CI; Terrio via cron/CI. Databases and cloud: GDAL (PostGIS, /vsis3/), FME (connectors), QGIS (providers, GDAL VSI), Terrio (s3://, gs://, az://, HTTP range; no PostGIS in core).');
  const hd = [hdr('', ''), hdr('FME', ''), hdr('GDAL', ''), hdr('QGIS', ''), hdr('Terrio', '')];
  const rows = [
    [p('Python', 'Python'), c('✔', 'PythonCaller, fmeobjects', 'PythonCaller, fmeobjects'), c('✔', 'osgeo.gdal', 'osgeo.gdal'), c('✔', 'PyQGIS', 'PyQGIS'), c('✔', 'pip install terrio', 'pip install terrio')],
    [p('C++', 'C++'), c('?', 'დაუდასტურებელი', 'Unverified'), c('✔', 'ბირთვი', 'Core language'), c('✔', 'ბირთვი, plugins', 'Core, plugins'), c('✘', 'არა', 'No')],
    [p('Rust', 'Rust'), c('✘', 'არა', 'No'), c('◐', 'community crates', 'Community crates'), c('✘', 'არა', 'No'), c('✔', 'მშობლიური crate', 'Native crate')],
    [p('JavaScript', 'JavaScript'), c('◐', 'REST-ით', 'Via REST'), c('◐', 'არაოფიციალური ports', 'Unofficial ports'), c('◐', 'OGC სერვისებით', 'Via OGC services'), c('✔', 'terrio-js (WASM)', 'terrio-js (WASM)')],
    [p('CLI ავტომატიზაცია', 'CLI automation'), c('✔', 'workspace CLI', 'Workspace CLI'), c('✔', 'gdal, gdal pipeline', 'gdal, gdal pipeline'), c('✔', 'qgis_process', 'qgis_process'), c('✔', 'terrio, MCP', 'terrio, MCP')],
    [p('დაგეგმვა', 'Workflow scheduling'), c('✔', 'Flow Schedules', 'Flow Schedules'), c('◐', 'cron / CI', 'cron / CI'), c('◐', 'cron / CI', 'cron / CI'), c('◐', 'cron / CI', 'cron / CI')],
    [p('ბაზები და ღრუბელი', 'Databases and cloud'), c('✔', 'კონექტორები', 'Connectors'), c('✔', 'PostGIS, /vsis3/', 'PostGIS, /vsis3/'), c('✔', 'providers, VSI', 'providers, VSI'), c('◐', 's3/gs/az; PostGIS არა', 's3/gs/az; no PostGIS')],
  ];
  EXPORT[13] = rows;
  const tbl = [hd];
  rows.forEach(r => tbl.push([rowHead(r[0]), ...r.slice(1).map(x => bodyCell(x, 10.5))]));
  s.addTable(tbl, tblOpts(0.6, 1.5, 12.1, [2.5, 2.4, 2.4, 2.4, 2.4], { rowH: [0.4, 0.62, 0.62, 0.62, 0.62, 0.62, 0.62, 0.62] }));
  legend(s, 6.7);
}

// ================= 14. Use cases =================
{
  const s = slideBase('რეალური გამოყენების შემთხვევები', 'Real-World Use Cases',
    'რეკომენდაციები არქიტექტურული შეფასებაა და არა ბენჩმარკი. LiDAR-ზე: Terrio COPC-ს „in place“ კითხულობს, მაგრამ ახალი პროექტია; პროდუქციაში PDAL (ამ პრეზენტაციაში არ შედარებულა) ან FME/QGIS ჩვეულებრივ უფრო უსაფრთხო არჩევანია — ეს ჩვენი შეფასებაა. ყოველდღიური განახლებები: ერთჯერადი ამოცანებისთვის GDAL+cron საკმარისია; მრავალეტაპიანი, აუდიტირებადი პროცესებისთვის — FME Flow.',
    'Recommendations are architectural judgement, not benchmark results. For LiDAR: Terrio reads COPC in place but is a young project; PDAL (not compared here) or FME/QGIS is usually the safer production choice — this is our assessment. For daily updates: GDAL+cron is enough for simple jobs; for multi-step, auditable pipelines use FME Flow.');
  const rows = [
    [p('ეროვნული GIS მონაცემების ინტეგრაცია', 'National GIS data integration'), 'FME', p('სქემის რუკა, ვალიდაცია, ბევრი ფორმატი', 'Schema mapping, validation, many formats')],
    [p('თანამგზავრული სურათები', 'Satellite imagery processing'), 'GDAL', p('warp, COG, VRT, სკრიპტები', 'warp, COG, VRT, scripting')],
    [p('LiDAR დამუშავება', 'LiDAR processing'), 'Terrio / QGIS', p('COPC კითხვა in place (Terrio, ახალი); ვიზუალიზაცია QGIS-ში', 'COPC read in place (Terrio, emerging); inspection in QGIS')],
    [p('ETL pipelines', 'ETL pipelines'), 'FME / GDAL', p('FME — ვიზუალური; GDAL — კოდზე დაფუძნებული', 'FME visual; GDAL code-first')],
    [p('მუნიციპალური GIS', 'Municipal GIS'), 'QGIS (+ FME)', p('დესკტოპ ანალიზი და რუკები; FME მონაცემთა მომზადებას', 'Desktop analysis and maps; FME for data prep')],
    [p('კორპორატიული სივრცული ბაზები', 'Enterprise spatial databases'), 'FME', p('PostGIS და სხვა ბაზების ინტეგრაცია', 'PostGIS and other database integration')],
    [p('ავტომატური ყოველდღიური განახლებები', 'Automated daily updates'), 'FME Flow / GDAL+cron', p('Schedules vs მარტივი სკრიპტები', 'Schedules vs simple scripts')],
    [p('Web GIS ინფრასტრუქტურა', 'Web GIS infrastructure'), 'QGIS Server (+ GDAL)', p('OGC სერვისები; GDAL — წინასწარი დამუშავება', 'OGC services; GDAL for preprocessing')],
  ];
  EXPORT[14] = rows;
  const tbl = [[hdr('სცენარი', 'Use case'), hdr('რეკომენდებული', 'Best fit'), hdr('რატომ', 'Why')]];
  rows.forEach(r => tbl.push([rowHead(r[0]), { text: r[1], options: { fontFace: BF, fontSize: 12, bold: true, color: OK, valign: 'middle', fill: { color: WHITE } } }, { text: [run(r[2].ka, { fontFace: KF, fontSize: 11, color: INK, breakLine: true }), run(r[2].en, { fontFace: BF, fontSize: 10.5, color: MUTE })], options: { valign: 'middle', fill: { color: WHITE } } }]));
  s.addTable(tbl, tblOpts(0.6, 1.55, 12.1, [4.0, 2.3, 5.8], { rowH: [0.42, 0.62, 0.62, 0.62, 0.62, 0.62, 0.62, 0.62, 0.62] }));
}

// ================= 15. Pros and cons =================
{
  const s = slideBase('უპირატესობები და ნაკლოვანებები', 'Advantages and Disadvantages',
    'დაბალანსებული შეფასება ცხრა კრიტერიუმით: გამოყენების სიმარტივე, სწავლის მრუდი, სიმწიფე, გაფართოებადობა, ლიცენზია/ფასი, წარმადობა, მასშტაბირება, გაშვების სირთულე, საზოგადოება/მხარდაჭერა. წარმადობის შესახებ დადასტურებული მონაცემი არ გვაქვს. FME-ს ფასებზე ხმები საზოგადოებრივი ფორუმებიდანაა და ანეკდოტურია; ოფიციალური ფასები ღიად არ არის გამოქვეყნებული.',
    'A balanced assessment over nine criteria: ease of use, learning curve, ecosystem maturity, extensibility, licensing/cost, performance, scalability, deployment complexity, community/support. We have no verified performance data. FME pricing complaints come from community forums and are anecdotal; official prices are not publicly detailed.');
  const cards = [
    ['FME', [['+ ვიზუალური workflow-ები, ფართო ფორმატები, კორპორატიული Flow', '+ Visual workflows, broad formats, enterprise Flow'], ['+ ტრენინგი (FME Academy), კომერციული მხარდაჭერა', '+ Training (FME Academy), commercial support']], [['− კომერციული ლიცენზია და ხარჯი', '− Commercial license and cost'], ['− დახურული კოდი; vendor-ზე დამოკიდებულება', '− Closed source; vendor dependency']]],
    ['GDAL', [['+ სიმწიფე, ფორმატების სიგანე, ინტეგრაცია', '+ Maturity, format breadth, integration'], ['+ ღია კოდი (MIT-ტიპის), სკრიპტირებადი', '+ Open source (MIT-style), scriptable']], [['− GUI და სერვერი არ აქვს', '− No GUI or server'], ['− CLI-ის სწავლა და საკუთარი სერვისის აგება', '− CLI learning; build your own services']]],
    ['QGIS', [['+ სრული GIS, უფასო, დიდი საზოგადოება', '+ Full GIS, free, large community'], ['+ Plugins, PyQGIS, Server', '+ Plugins, PyQGIS, Server']], [['− მძიმე ETL/ავტომატიზაცია GUI-ის გარეშე რთულია', '− Heavy ETL/automation without GUI is harder'], ['− Server-ის დაგეგმვა/სკალირება ხელით', '− Server scheduling/scaling is manual']]],
    ['Terrio', [['+ პორტატული (WASM), C დამოკიდებულებების გარეშე', '+ Portable (WASM), no C dependencies'], ['+ MIT, GDAL-სტილის CLI, COPC in place', '+ MIT, GDAL-style CLI, COPC in place']], [['− ძალიან ახალი, API არასტაბილურია', '− Very young, unstable API'], ['− ფორმატების მცირე სიგანე; ბენჩმარკი არ არის', '− Narrower formats; no benchmarks']]],
  ];
  cards.forEach(([name, pros, cons], i) => {
    const x = 0.6 + i * 3.1;
    s.addShape('roundRect', { x, y: 1.6, w: 2.95, h: 5.2, fill: { color: PALE }, line: { color: PALE }, rectRadius: 0.1 });
    s.addText(name, { x: x + 0.15, y: 1.7, w: 2.65, h: 0.45, fontFace: HF, fontSize: 20, bold: true, color: NAVY, margin: 0, isTextBox: true });
    s.addText([...pros.flatMap(([ka, en]) => pair(ka, en, { kc: OK, ks: 13, es: 12, ec: MUTE, after: 6, more: true })), ...cons.flatMap(([ka, en], j) => pair(ka, en, { kc: BAD, ks: 13, es: 12, ec: MUTE, after: 6, more: j < cons.length - 1 }))],
      { x: x + 0.15, y: 2.2, w: 2.7, h: 4.5, margin: 0, valign: 'top', isTextBox: true });
  });
}

// ================= 16. Final verdict =================
{
  const s = slideBase('საბოლოო დასკვნა: გადაწყვეტილების მატრიცა', 'Final Verdict: A Decision Matrix, Not a Single Winner',
    'უნივერსალური გამარჯვებული არ არსებობს, რადგან ხელსაწყოები სხვადასხვა კატეგორიისაა. ● = საუკეთესო არჩევანი, ○ = კარგი არჩევანი. სერვერისთვის FME Flow საუკეთესოა კორპორატიული ავტომატიზაციისთვის, QGIS Server — OGC რუკების სერვისებისთვის. Terrio GDAL-ის შემავსებელია კონკრეტულ სცენარებში (WASM, pure-Rust, COG/COPC in place) და პოტენციური ალტერნატივაა მხოლოდ ზოგიერთ ამოცანაში; მისი roadmap თავად აცხადებს, რომ GDAL-ის სრული ჩანაცვლება მიზანი არ არის. შეფასება ექსპერტულია (2026-11-16).',
    'There is no universal winner because the tools belong to different categories. ● = best fit, ○ = good fit. For servers, FME Flow is best for enterprise automation, QGIS Server for OGC map services. Terrio is a complement to GDAL in specific scenarios (WASM, pure-Rust, COG/COPC in place) and a potential alternative only for some tasks; its own roadmap says replacing all of GDAL is not a goal. This is an expert assessment (2026-11-16).');
  const rows = [
    [p('დამწყებთათვის', 'Beginners'), ['○', '', '●', '']],
    [p('ვიზუალური workflow-ები', 'Visual workflows'), ['●', '', '○', '']],
    [p('ავტომატიზაცია', 'Automation'), ['○', '●', '○', '○']],
    [p('რასტრი და ვექტორი', 'Raster and vector processing'), ['○', '●', '○', '○']],
    [p('Desktop GIS', 'Desktop GIS'), ['', '', '●', '']],
    [p('კორპორატიული ETL', 'Enterprise ETL'), ['●', '○', '', '']],
    [p('სერვერული გაშვება', 'Server deployment'), ['●', '', '●', '']],
  ];
  EXPORT[16] = rows;
  const tbl = [[hdr('კითხვა', 'Question'), hdr('FME', ''), hdr('GDAL', ''), hdr('QGIS', ''), hdr('Terrio', '')]];
  rows.forEach(r => tbl.push([rowHead(r[0]), ...r[1].map(v => ({ text: v, options: { fontFace: 'Segoe UI Symbol', fontSize: 18, bold: true, color: v === '●' ? OK : WARN, align: 'center', valign: 'middle', fill: { color: v === '●' ? PALE : WHITE } } }))]));
  s.addTable(tbl, tblOpts(0.6, 1.55, 8.0, [3.2, 1.2, 1.2, 1.2, 1.2], { rowH: [0.42, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52] }));
  s.addText([run('● საუკეთესო / best fit   ○ კარგი / good fit', { fontFace: KF, fontSize: 11, color: MUTE })], { x: 0.6, y: 6.2, w: 8, h: 0.3, margin: 0, isTextBox: true });
  s.addShape('roundRect', { x: 8.95, y: 1.55, w: 3.8, h: 4.4, fill: { color: NAVY }, line: { color: NAVY }, rectRadius: 0.1 });
  s.addText([
    run('Terrio: GDAL-ის შემავსებელი თუ ალტერნატივა?', { fontFace: KF, fontSize: 14, bold: true, color: TEAL, breakLine: true }),
    run('Terrio: complement or alternative to GDAL?', { fontFace: BF, fontSize: 13, bold: true, color: TEAL, breakLine: true, paraSpaceAfter: 8 }),
    run('ამჟამად — შემავსებელი სპეციფიკურ სცენარებში (WASM, ბრაუზერი, pure-Rust, COG/COPC in place). ალტერნატივა — ზოგ ამოცანაში, პროექტის მომწიფების შემდეგ.', { fontFace: KF, fontSize: 12.5, color: WHITE, breakLine: true, paraSpaceAfter: 6 }),
    run('Today: a complement in specific scenarios (WASM, browser, pure-Rust, COG/COPC in place). An alternative only for some tasks, once the project matures.', { fontFace: BF, fontSize: 12, color: 'CADCFC' }),
  ], { x: 9.15, y: 1.7, w: 3.4, h: 4.1, margin: 0, valign: 'top', isTextBox: true });
  s.addText('ეს შეფასება ექსპერტულია და არა გაზომილი. / This is expert judgement, not measured data.', { x: 0.6, y: 6.55, w: 12, h: 0.35, fontFace: KF, fontSize: 11, color: MUTE, margin: 0, isTextBox: true });
}

// ================= 17. References =================
{
  const s = slideBase('წყაროები', 'Sources and References',
    'სრული სია, წვდომის თარიღებითა და დაუდასტურებელი პუნქტებით, არის GIS_DAY_RESEARCH_REFERENCES.md-ში. ყველა ვერსია/თარიღი გადამოწმებულია 2026-11-16-ზე GitHub API-თი და ოფიციალური გვერდებით. FME-ის support.safe.com სტატია WebFetch-ით 403-ს აბრუნებდა, ამიტომ OS-ის ცხრილი ძიების შეჯამებაა.',
    'The full list, with access dates and unverified items, is in GIS_DAY_RESEARCH_REFERENCES.md. All versions/dates were checked on 2026-11-16 via the GitHub API and official pages. The FME support.safe.com article returned HTTP 403 to our fetcher, so the OS table is based on a search summary.');
  const links = [
    ['FME', [['FME Academy', 'https://academy.safe.com/'], ['FME deployments', 'https://fme.safe.com/platform/deployments/'], ['FME pricing', 'https://fme.safe.com/pricing/'], ['FME 2026.2 highlights (community)', 'https://community.safe.com/product-updates/fme-2026-2-feature-highlights-40528']]],
    ['GDAL', [['GDAL documentation', 'https://gdal.org/en/stable/'], ['GDAL download', 'https://gdal.org/en/stable/download.html'], ['GDAL programs', 'https://gdal.org/en/stable/programs/index.html'], ['GDAL on GitHub', 'https://github.com/OSGeo/gdal/releases']]],
    ['QGIS', [['QGIS', 'https://www.qgis.org/'], ['QGIS download', 'https://www.qgis.org/download/'], ['QGIS Server manual', 'https://docs.qgis.org/latest/en/docs/server_manual/getting_started.html'], ['QGIS on GitHub', 'https://github.com/qgis/QGIS/releases']]],
    ['Terrio', [['Terrio repository', 'https://github.com/opengeos/terrio'], ['Terrio documentation', 'https://terrio.dev'], ['Terrio roadmap', 'https://github.com/opengeos/terrio/blob/main/ROADMAP.md'], ['Terrio releases', 'https://github.com/opengeos/terrio/releases']]],
  ];
  links.forEach(([name, items], i) => {
    const x = 0.6 + (i % 2) * 6.15, y = 1.6 + Math.floor(i / 2) * 2.55;
    s.addText(name, { x, y, w: 5.9, h: 0.4, fontFace: HF, fontSize: 18, bold: true, color: NAVY, margin: 0, isTextBox: true });
    s.addText(items.map(([t, u], j) => ({ text: t + ' — ' + u.replace('https://', ''), options: { hyperlink: { url: u, tooltip: u }, fontFace: BF, fontSize: 14, color: '1B4FBF', breakLine: j < items.length - 1, paraSpaceAfter: 8 } })),
      { x, y: y + 0.5, w: 6.0, h: 1.9, margin: 0, valign: 'top', isTextBox: true });
  });
  s.addText('მონაცემთა დამუშავება / ფაილი: GIS_DAY_RESEARCH_REFERENCES.md · GIS_DAY_COMPARISON_MATRIX.xlsx · GIS_DAY_BENCHMARK_METHODOLOGY.md', { x: 0.6, y: 6.7, w: 12, h: 0.3, fontFace: KF, fontSize: 11, color: MUTE, margin: 0, isTextBox: true });
}

require('fs').writeFileSync(__dirname + '/tables.json', JSON.stringify(EXPORT));
pres.writeFile({ fileName: OUT + 'GIS_DAY_FME_GDAL_QGIS_TERRIO.pptx' }).then(f => console.log('wrote', f));
