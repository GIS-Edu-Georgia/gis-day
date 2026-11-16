// Builds presentations/fme-gdal-qgis-terrio.html (dependency-free, bilingual, uses assets/deck.js engine)
const fs = require('fs');
const { MATRIX, FORMATS, FORMAT_NOTES } = require('./data');
const T = require('./tables.json');
const OUT = __dirname + '/../presentations/fme-gdal-qgis-terrio.html';

const L = (ka, en) => `<span lang="ka">${ka}</span><span lang="en">${en}</span>`;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const LE = (ka, en) => L(esc(ka), esc(en));
const SYM = { '✔': 'ok', '◐': 'part', '✘': 'no', '?': 'unk' };
const sym = s => (s ? `<b class="sym ${SYM[s]}">${s}</b> ` : '');
const cell = c => `<td>${sym(c.s)}${LE(c.ka, c.en)}</td>`;
const th = (ka, en) => `<th>${en === undefined ? esc(ka) : LE(ka, en)}</th>`;
const rowhead = p => `<th class="rh">${LE(p.ka, p.en)}</th>`;
const table = (head, rows, cls = 'small') => `<table class="${cls}"><tr>${head.map(h => (Array.isArray(h) ? th(h[0], h[1]) : th(h))).join('')}</tr>${rows.join('')}</table>`;
const matrixRows = list => list.map(r => `<tr>${rowhead(r.k)}${r.v.map(cell).join('')}</tr>`);
const rows5 = rows => rows.map(r => `<tr>${rowhead(r[0])}${r.slice(1).map(cell).join('')}</tr>`);
const LEGEND = `<p class="small muted legend"><b class="sym ok">✔</b> ${LE('მხარდაჭერილია', 'Supported')} · <b class="sym part">◐</b> ${LE('ნაწილობრივ / დამოკიდებულია', 'Partial / depends')} · <b class="sym no">✘</b> ${LE('არა', 'No')} · <b class="sym unk">?</b> ${LE('დაუდასტურებელი', 'Unverified')}</p>`;
const slide = (kicker, title, body, note, cls = '') => `
<section class="slide ${cls}">
  <p class="kicker">${LE(kicker[0], kicker[1])}</p>
  <h2>${LE(title[0], title[1])}</h2>
${body}
  <div class="note">${L(esc(note[0]), esc(note[1]))}</div>
</section>`;
const pts = (list, cls = 'pts tight') => [['ka', 0], ['en', 1]].map(([lg, i]) => `<ul class="${cls}" lang="${lg}">${list.map(it => `<li><b>${esc(it[i * 2])}</b>${it[i * 2 + 1] ? `<small>${esc(it[i * 2 + 1])}</small>` : ''}</li>`).join('')}</ul>`).join('\n');
const card = (h, kaT, enT) => `<div class="card"><h3>${h}</h3><p>${LE(kaT, enT)}</p></div>`;
const chips = list => `<p class="chips">${list.map(([a, b]) => `<span class="tag">${LE(a, b)}</span>`).join(' ')}</p>`;
const callout = (cls, kaB, enB, kaT, enT) => `<div class="callout ${cls}">${L(`<b>${esc(kaB)}</b>${esc(kaT)}`, `<b>${esc(enB)}</b>${esc(enT)}`)}</div>`;

const S = [];

// 1 cover
S.push(`
<section class="slide cover">
  <p class="kicker">${LE('GIS DAY 2026 · 18.11.2026', 'GIS DAY 2026 · 18 Nov 2026')}</p>
  <h1>${LE('GIS DAY: FME, GDAL, QGIS და Terrio-ს შედარება', 'GIS DAY: FME vs GDAL vs QGIS vs Terrio')}</h1>
  <p class="lead" style="margin-top:16px">${LE('გეოსივრცული მონაცემების დამუშავების, ავტომატიზაციის, არქიტექტურის, წარმადობისა და სერვერული შესაძლებლობების ტექნიკური შედარება', 'A Technical Comparison of Geospatial Data Processing, Automation, Architecture, Performance and Server Capabilities')}</p>
  <p class="small muted" style="margin-top:14px">${LE('ფაქტები გადამოწმებულია 2026-11-16-ზე · კლავიში L — ენა, S — ლექტორის ხედი', 'Facts verified as of 2026-11-16 · key L switches language, S opens presenter view')}</p>
  <a class="qr" href="https://gisday.qgis.ge/" target="_blank" rel="noopener"><img src="../assets/gisday/qr.svg" alt="QR: gisday.qgis.ge"><span>${LE('დაასკანერე და გახსენი საიტი', 'Scan to open the site')}<br><b>gisday.qgis.ge</b></span></a>
  <div class="note">${L('ოთხი სხვადასხვა კატეგორიის ხელსაწყო: ETL პლატფორმა, ბიბლიოთეკა/CLI, დესკტოპ GIS და ახალი pure-Rust ხელსაწყო. მიზანია არა გამარჯვებულის გამოცხადება, არამედ ამოცანის მიხედვით არჩევა.', 'Four tools from different categories: ETL platform, library/CLI, desktop GIS and a new pure-Rust toolkit. The goal is choosing by task, not crowning a winner.')}</div>
</section>`);

// 2 intro
S.push(slide(['შესავალი', 'Introduction'], ['გეოსივრცული მონაცემების დამუშავების ეკოსისტემა', 'The geospatial data processing ecosystem'], `
  <img class="banner" src="../assets/gisday/circles.png" alt="">
  <div class="two"><div>
${pts([
  ['ფორმატების სიმრავლე და სხვადასხვა კოორდინატთა სისტემა', '', 'Many formats and coordinate reference systems', ''],
  ['დიდი რასტრული, ვექტორული და LiDAR მონაცემები', '', 'Large raster, vector and LiDAR datasets', ''],
  ['განმეორებადი, ავტომატიზებული პროცესები', '', 'Repeatable, automated workflows', ''],
  ['შედეგების გამოქვეყნება ვებ-სერვისებად', '', 'Publishing results as web services', ''],
])}
  </div><div>
    <div class="card"><h3>FME</h3><p>${LE('ETL პლატფორმა · სერვერი (FME Flow)', 'ETL platform · server (FME Flow)')}</p></div>
    <div class="card"><h3>GDAL</h3><p>${LE('დამუშავების ბიბლიოთეკა · ბრძანების სტრიქონის ხელსაწყოები', 'Processing library · command-line toolkit')}</p></div>
    <div class="card"><h3>QGIS</h3><p>${LE('დესკტოპ GIS აპლიკაცია · QGIS Server (OGC)', 'Desktop GIS application · QGIS Server (OGC)')}</p></div>
    <div class="card"><h3>Terrio</h3><p>${LE('ბიბლიოთეკა და CLI · ბრაუზერზე დაფუძნებული WebAssembly აპლიკაცია', 'Library and CLI · browser-based WebAssembly application')}</p></div>
  </div></div>
  ${callout('tip', 'რატომ ვადარებთ? ', 'Why compare? ', 'ისინი ხშირად ერთ პროექტში ერთად გამოიყენება, მაგრამ ერთმანეთს არ ცვლის.', 'They are often used together in one project but are not interchangeable.')}`,
  ['ოთხივე წყვეტს ფორმატების, CRS-ების, მასშტაბისა და ავტომატიზაციის პრობლემებს, მაგრამ სხვადასხვა კატეგორიაშია.', 'All four address format diversity, CRSs, scale and automation, but sit in different categories, so we compare by task.']));

// 3 FME
S.push(slide(['FME', 'FME'], ['FME (Safe Software): სივრცული ETL და ავტომატიზაცია', 'FME (Safe Software): spatial ETL and enterprise automation'], `
  ${chips([['2026.2 · 2026 წლის ივნისი', '2026.2 · June 2026'], ['კომერციული', 'Commercial'], ['კვარტალური გამოშვებები', 'Quarterly releases']])}
  <div class="two"><div>
${pts([
  ['FME Form / Workbench', 'ავტორინგის გარემო; Readers → Transformers → Writers', 'FME Form / Workbench', 'Authoring environment; Readers → Transformers → Writers'],
  ['Transformers', 'გარდაქმნა, შეერთება, ვალიდაცია, სქემის რუკა', 'Transformers', 'Reproject, join, validate, schema mapping'],
  ['სივრცული ETL', 'მონაცემთა ინტეგრაცია ბევრ წყაროსა და ფორმატს შორის', 'Spatial ETL', 'Data integration across many sources and formats'],
])}
  </div><div>
${pts([
  ['FME Flow', 'Automations, Schedules, REST API, Engines', 'FME Flow', 'Automations, Schedules, REST API, engines'],
  ['კორპორატიული არქიტექტურა', 'Docker, Kubernetes, Remote Engines, Hosted SaaS', 'Enterprise architecture', 'Docker, Kubernetes, Remote Engines, hosted SaaS'],
  ['ლიცენზია', 'გამოწერა, პერპეტუალური ან PAYG; საგანმანათლებლო უფასო ლიცენზიები', 'Licensing', 'Subscription, perpetual or PAYG; free education licenses'],
])}
  </div></div>`,
  ['FME 2026.2 გამოვიდა 2026 წლის ივნისში (Safe community post, 2026-06-26). Flow 2026.2-ში ჩაშენებული MCP სერვერია. ფასები ღიად არ არის გამოქვეყნებული; ფასების ფორუმული შეფასებები ანეკდოტურია. წყაროები: academy.safe.com, fme.safe.com/platform/deployments, fme.safe.com/pricing.', 'FME 2026.2 shipped in June 2026 (Safe community post, 2026-06-26). Flow 2026.2 adds a native MCP server. Prices are not publicly detailed; forum price complaints are anecdotal. Sources: academy.safe.com, fme.safe.com/platform/deployments, fme.safe.com/pricing.']));

// 4 GDAL
S.push(slide(['GDAL', 'GDAL'], ['GDAL: რასტრისა და ვექტორის ბიბლიოთეკა', 'GDAL: the raster and vector translator library'], `
  ${chips([['3.13.3 · 2026-08-18', '3.13.3 · 2026-08-18'], ['MIT-ტიპის ლიცენზია', 'MIT-style license'], ['ბიბლიოთეკა + CLI', 'Library + CLI']])}
  <div class="two"><div>
    <div class="card"><h3>${LE('არქიტექტურა', 'Architecture')}</h3>
      <ul>
        <li>${LE('აპლიკაციები: QGIS, rasterio, სკრიპტები', 'Applications: QGIS, rasterio, scripts')}</li>
        <li>${LE('CLI და bindings: gdal, gdalwarp, ogr2ogr · Python (osgeo)', 'CLI and bindings: gdal, gdalwarp, ogr2ogr · Python (osgeo)')}</li>
        <li>${LE('ბირთვი: რასტრის მოდელი + ვექტორის მოდელი (OGR)', 'Core: raster model + vector model (OGR)')}</li>
        <li>${LE('დრაივერები: GeoTIFF, COG, GPKG, Parquet, NetCDF, HDF…', 'Drivers: GeoTIFF, COG, GPKG, Parquet, NetCDF, HDF…')}</li>
      </ul></div>
  </div><div>
${pts([
  ['დამუშავება', 'warp, translate, mosaic (VRT), contour, rasterize, DEM, vector SQL', 'Processing', 'warp, translate, mosaic (VRT), contour, rasterize, DEM, vector SQL'],
  ['გადაპროექცია და კონვერტაცია', 'gdalwarp, gdal_translate, ogr2ogr', 'Reprojection and conversion', 'gdalwarp, gdal_translate, ogr2ogr'],
  ['ავტომატიზაცია', 'bash/Python სკრიპტები, cron/CI, gdal pipeline', 'Automation', 'bash/Python scripts, cron/CI, gdal pipeline'],
  ['შეზღუდვები', 'GUI/სერვერი არ აქვს; LAS/COPC driver არ აქვს', 'Limitations', 'No GUI or server; no LAS/COPC driver'],
])}
  </div></div>`,
  ['ერთიანი gdal CLI (3.11-დან) provisional-ია და თავსებადობის გარანტია არ აქვს; სტაბილური ქცევისთვის gdalwarp/ogr2ogr. GDAL პროექტი ავრცელებს წყაროს კოდსა და Docker image-ებს; ბინარებს მესამე მხარე ამზადებს. წყარო: gdal.org.', 'The unified gdal CLI (3.11+) is provisional with no compatibility guarantee; use gdalwarp/ogr2ogr for stable behaviour. The project distributes source and Docker images; binaries come from third parties. Source: gdal.org.']));

// 5 QGIS
S.push(slide(['QGIS', 'QGIS'], ['QGIS: დესკტოპ GIS და სერვერი', 'QGIS: desktop GIS, processing and server'], `
  ${chips([['4.2.3 · 2026-09-25', '4.2.3 · 2026-09-25'], ['LTR 3.44.15', 'LTR 3.44.15'], ['GPL-2.0', 'GPL-2.0']])}
  <div class="grid">
    ${card(LE('დესკტოპი და კარტოგრაფია', 'Desktop and cartography'), 'სტილები, ლეიაუტები, ატლასები', 'Styling, print layouts, atlases')}
    ${card('Processing Toolbox', 'ანალიზის ალგორითმები ერთ ადგილას (GDAL-ის ჩათვლით)', 'Analysis algorithms in one place (including GDAL)')}
    ${card('Graphical Model Designer', 'ალგორითმების ჯაჭვი ვიზუალურად', 'Chain algorithms visually')}
    ${card('PyQGIS', 'Python API დესკტოპისა და სკრიპტებისთვის', 'Python API for desktop and scripts')}
    ${card('Plugins', 'საზოგადოების გაფართოებები', 'Community extensions')}
    ${card('QGIS Server', 'WMS, WFS, WCS, WMTS, OGC API Features', 'WMS, WFS, WCS, WMTS, OGC API Features')}
  </div>`,
  ['QGIS 4.2.3 უახლესია, LTR 3.44.15; 4.4-ის წინ feature freeze-ია. QGIS Server არის FastCGI პროგრამა Apache/NGINX-ის უკან. წყაროები: qgis.org/download, docs.qgis.org server manual.', 'QGIS 4.2.3 is the latest, LTR is 3.44.15; feature freeze ahead of 4.4. QGIS Server is a FastCGI program behind Apache/NGINX. Sources: qgis.org/download, docs.qgis.org server manual.']));

// 6 Terrio
S.push(slide(['Terrio', 'Terrio'], ['Terrio (OpenGeos): ახალი pure-Rust ხელსაწყო', 'Terrio (OpenGeos): an emerging pure-Rust toolkit'], `
  ${chips([['v0.9.0 · 2026-11-15', 'v0.9.0 · 2026-11-15'], ['MIT', 'MIT'], ['Early development', 'Early development']])}
  <div class="two"><div>
    <img src="../assets/terrio-ui.png" alt="terrio ui" style="max-width:100%;border-radius:8px;border:1px solid var(--line)">
    <p class="small muted">${LE('terrio ui — ლოკალური ბრაუზერ-ინტერფეისი (წყარო: github.com/opengeos/terrio)', 'terrio ui — local browser interface (source: github.com/opengeos/terrio)')}</p>
  </div><div>
${pts([
  ['წმინდა Rust', 'C დამოკიდებულებების გარეშე; WebAssembly-ზეც იგება', 'Pure Rust', 'No C dependencies by default; builds to WebAssembly'],
  ['Raster, vector, Point Cloud', 'LAS, LAZ, COPC, EPT', 'Raster, vector, point cloud', 'LAS, LAZ, COPC, EPT'],
  ['ინტერფეისები', 'CLI · Python · JavaScript/WASM · ლოკალური UI · MCP', 'Interfaces', 'CLI · Python · JavaScript/WASM · local UI · MCP'],
  ['GDAL-თან თავსებადობა', 'GDAL-სტილის ბრძანებები; არასავალდებულო GDAL backend', 'GDAL compatibility', 'GDAL-style commands; optional GDAL backend'],
  ['შეზღუდვები', 'API შეიძლება შეიცვალოს 1.0-მდე; GDAL-ის სრული ჩანაცვლება მიზანი არ არის; PostGIS ბირთვში არ არის', 'Limitations', 'API may change before 1.0; replacing all of GDAL is not a goal; no PostGIS in core'],
])}
  </div></div>`,
  ['რეპოზიტორია შეიქმნა 2026-10-14-ს, ამიტომ პროექტი ძალიან ახალია. README ამბობს, რომ ძირითადად AI-ით, ადამიანის ზედამხედველობით იქმნება. ბენჩმარკები ვერ ვიპოვეთ. წყარო: github.com/opengeos/terrio, terrio.dev.', 'The repository was created on 2026-10-14, so the project is very young. The README states it is primarily built with AI under human review. No benchmarks found. Source: github.com/opengeos/terrio, terrio.dev.']));

// 7 architecture
S.push(slide(['არქიტექტურა', 'Architecture'], ['არქიტექტურის შედარება: ოთხი განსხვავებული კატეგორია', 'Architecture comparison: four different categories'], `
  <div class="grid g2">
    <div class="card"><h3>FME · ${LE('ETL პლატფორმა', 'ETL platform')}</h3><ul><li>FME Flow: core + engines (server)</li><li>FME Form: Workbench (authoring)</li><li>Readers · Transformers · Writers</li></ul></div>
    <div class="card"><h3>GDAL · ${LE('ბიბლიოთეკა + CLI', 'Library + CLI')}</h3><ul><li>CLI · Python · C/C++ API</li><li>${LE('რასტრის + ვექტორის მოდელი', 'Raster + vector model')}</li><li>Drivers (OGR)</li></ul></div>
    <div class="card"><h3>QGIS · ${LE('დესკტოპ GIS', 'Desktop GIS')}</h3><ul><li>QGIS Server (FastCGI) + OGC</li><li>Desktop · Processing · PyQGIS · Plugins</li><li>GDAL/OGR + native providers</li></ul></div>
    <div class="card"><h3>Terrio · ${LE('ბიბლიოთეკა + CLI + WASM', 'Library + CLI + WASM')}</h3><ul><li>CLI · Python · JS/WASM · UI · MCP</li><li>Pure-Rust core crates</li><li>Optional GDAL backend (C)</li></ul></div>
  </div>
  ${callout('tip', 'განკუთვნილება ', 'Intended purpose ', 'FME — ინტეგრაცია და ავტომატიზაცია · GDAL — დამუშავების საფუძველი · QGIS — ანალიზი და რუკები · Terrio — მსუბუქი, პორტატული I/O', 'FME — integration and automation · GDAL — the processing foundation · QGIS — analysis and maps · Terrio — lightweight, portable I/O')}`,
  ['დიაგრამა გამარტივებულია. QGIS იყენებს GDAL/OGR-ს ფორმატებისთვის; Terrio ცდილობს GDAL-თან თავსებადობას.', 'The diagram is simplified. QGIS uses GDAL/OGR for many formats; Terrio targets GDAL compatibility.']));

// 8 GUI/CLI/API
S.push(slide(['ინტერფეისები', 'Interfaces'], ['GUI, CLI და API', 'GUI vs CLI vs API'],
  table(['', 'FME', 'GDAL', 'QGIS', 'Terrio'].map((h, i) => (i ? h : ['კრიტერიუმი', 'Criterion'])), rows5(T[8])) + LEGEND,
  ['სწავლის მრუდის შეფასებები ექსპერტულია და არა გაზომილი. QGIS Server ვებ-რედაქტირების ინტერფეისს არ იძლევა.', 'Learning-curve ratings are expert judgement, not measurements. QGIS Server does not provide a web editing UI.']));

// 9 server
S.push(slide(['სერვერი', 'Server'], ['სერვერი და კორპორატიული გაშვება', 'Server and enterprise deployment'],
  table(['', 'FME Flow', 'QGIS Server', 'GDAL-based custom service', 'Terrio WASM + local UI'], rows5(T[9])) + LEGEND + callout('warn', 'მნიშვნელოვანია ', 'Important ', 'მხოლოდ FME Flow და QGIS Server არიან ცალკე სერვერული პროდუქტები. GDAL და Terrio სერვერული პლატფორმები არ არის.', 'Only FME Flow and QGIS Server are dedicated server products. GDAL and Terrio are not server platforms.'),
  ['QGIS Server-ს დაგეგმვა არ აქვს (cron/გარე სისტემა); ერთი მაგალითი — რამდენიმე FastCGI instance NGINX-ის უკან. `terrio ui` მხოლოდ 127.0.0.1-ზე უსმენს. FME Flow REST API V3-ის deprecation მეორეული წყაროა.', 'QGIS Server has no scheduler (use cron/external); the official example runs several FastCGI instances behind NGINX. `terrio ui` listens on 127.0.0.1 only. The FME Flow REST API V3 deprecation is from a secondary source.']));

// 10 OS
S.push(slide(['OS', 'OS'], ['ოპერაციული სისტემების თავსებადობა', 'Operating system compatibility'],
  table(['', 'FME', 'GDAL', 'QGIS', 'Terrio'], rows5(T[10])) + LEGEND,
  ['FME Flow-ს OS ცხრილი ძიების შეჯამებაა (support.safe.com 403-ს აბრუნებდა); გადაამოწმეთ Safe Software-ის მიმდინარე ტექნიკური სპეციფიკაციების გვერდზე. GDAL-ის ბინარებს მესამე მხარე ამზადებს.', 'The FME Flow OS table is from a search summary (support.safe.com returned 403); verify on Safe Software\'s current technical-specifications page. GDAL binaries are third-party.']));

// 11 formats
const fmtRows = FORMATS.map(f => `<tr><th class="rh">${esc(f.k)}</th>${f.v.map(v => `<td class="c">${sym(v)}</td>`).join('')}</tr>`);
S.push(slide(['ფორმატები', 'Formats'], ['მონაცემთა ფორმატები და drivers', 'Data formats and drivers'],
  `<div class="two"><div>${table([['ფორმატი', 'Format'], 'FME', 'GDAL', 'QGIS', 'Terrio'], fmtRows)}</div><div>
   <ul class="pts tight" lang="ka">${FORMAT_NOTES.map(n => `<li>${esc(n.ka)}</li>`).join('')}</ul>
   <ul class="pts tight" lang="en">${FORMAT_NOTES.map(n => `<li>${esc(n.en)}</li>`).join('')}</ul>
   ${callout('warn', 'გაფრთხილება ', 'Caution ', 'მხარდაჭერა დამოკიდებულია ვერსიაზე, build-სა და კონფიგურაციაზე.', 'Support depends on version, build and configuration.')}</div></div>` + LEGEND,
  ['FME-ში HDF5 დაუდასტურებელია. GDAL-ს (Geo)Parquet driver აქვს 3.5-დან. COPC reader/writer FME-ში 2023+ ვერსიებშია.', 'HDF5 in FME is unverified. GDAL has a (Geo)Parquet driver since 3.5. FME has a COPC reader/writer in 2023+ versions.']));

// 12 performance
S.push(slide(['წარმადობა', 'Performance'], ['წარმადობა და ბენჩმარკინგი', 'Performance and benchmarking'], `
  ${callout('err', 'რიცხვები არ არსებობს ', 'No numbers ', 'ოთხმხრივი გამოქვეყნებული ბენჩმარკი ვერ მოვძებნეთ, ამიტომ არც რიცხვებს ვასახელებთ და არც გრაფიკს ვხატავთ.', 'We found no published four-way benchmark, so we show no numbers and draw no chart.')}
  <div class="two"><div>
${pts([
  ['GDAL mailing-list ანგარიშები', 'მეტი thread ყოველთვის უკეთესი არ არის; ხშირად I/O ზღუდავს', 'GDAL mailing-list reports', 'More threads are not always faster; I/O often limits'],
  ['რაზეა დამოკიდებული', 'აპარატურა, მონაცემთა ზომა, drivers, შეკუმშვა, ალგორითმი, კონფიგურაცია', 'What it depends on', 'Hardware, data size, drivers, compression, algorithm, configuration'],
])}
  </div><div>
${pts([
  ['8 ტესტი', 'რასტრის კითხვა/ჩაწერა, გადაპროექცია, ვექტორის კონვერტაცია, დიდი მონაცემები, Point Cloud, პარალელიზმი, მეხსიერება, CPU', '8 scenarios', 'Raster read/write, reprojection, vector conversion, large data, point cloud, parallelism, memory, CPU'],
  ['მეთოდოლოგია', 'downloads/GIS_DAY_BENCHMARK_METHODOLOGY.md', 'Methodology', 'downloads/GIS_DAY_BENCHMARK_METHODOLOGY.md'],
])}
  </div></div>`,
  ['ბენჩმარკი არ ჩატარებულა. მეთოდოლოგია აღწერს მონაცემებს, გარემოს, 5+ გაშვებას, ჩაწერას და სისწორის შემოწმებას.', 'No benchmark was run. The methodology covers datasets, environment, 5+ runs, measurement and output correctness checks.']));

// 13 automation
S.push(slide(['ავტომატიზაცია', 'Automation'], ['ავტომატიზაცია და პროგრამირება', 'Automation and programming'],
  table(['', 'FME', 'GDAL', 'QGIS', 'Terrio'], rows5(T[13])) + LEGEND,
  ['FME-ის C++ SDK დაუდასტურებელია. GDAL-ისთვის Rust crate-ები თემისაა, არაოფიციალური. Terrio-ს PostGIS ბირთვში არ აქვს.', 'An FME C++ SDK is unverified. Rust crates for GDAL are community-maintained, not official. Terrio has no PostGIS in core.']));

// 14 use cases
const ucRows = T[14].map(r => `<tr>${rowhead(r[0])}<td><b>${esc(r[1])}</b></td><td>${LE(r[2].ka, r[2].en)}</td></tr>`);
S.push(slide(['გამოყენება', 'Use cases'], ['რეალური გამოყენების შემთხვევები', 'Real-world use cases'],
  table([['სცენარი', 'Use case'], ['რეკომენდებული', 'Best fit'], ['რატომ', 'Why']], ucRows),
  ['რეკომენდაციები არქიტექტურული შეფასებაა და არა ბენჩმარკი. LiDAR-ზე: პროდუქციაში PDAL (აქ არ შედარებულა) ან FME/QGIS უფრო უსაფრთხოა.', 'Recommendations are architectural judgement, not benchmark results. For LiDAR, PDAL (not compared here) or FME/QGIS is usually safer in production.']));

// 15 pros/cons
const pc = [
  ['FME', ['ვიზუალური workflow-ები, ფართო ფორმატები, კორპორატიული Flow', 'Visual workflows, broad formats, enterprise Flow'], ['კომერციული ლიცენზია და ხარჯი; დახურული კოდი', 'Commercial license and cost; closed source']],
  ['GDAL', ['სიმწიფე, ფორმატების სიგანე, ღია კოდი, ინტეგრაცია', 'Maturity, format breadth, open source, integration'], ['GUI/სერვერი არ აქვს; CLI-ის სწავლა', 'No GUI or server; CLI learning curve']],
  ['QGIS', ['სრული GIS, უფასო, დიდი საზოგადოება, plugins', 'Full GIS, free, large community, plugins'], ['მძიმე ETL GUI-ის გარეშე რთულია; Server-ის დაგეგმვა/სკალირება ხელით', 'Heavy ETL without GUI is harder; Server scheduling/scaling is manual']],
  ['Terrio', ['პორტატული (WASM), C დამოკიდებულებების გარეშე, MIT, COPC in place', 'Portable (WASM), no C dependencies, MIT, COPC in place'], ['ძალიან ახალი, API არასტაბილურია; ბენჩმარკი არ არის', 'Very young, unstable API; no benchmarks']],
];
S.push(slide(['შეფასება', 'Assessment'], ['უპირატესობები და ნაკლოვანებები', 'Advantages and disadvantages'],
  `<div class="grid g2">${pc.map(([n, a, b]) => `<div class="card"><h3>${n}</h3><p><b class="sym ok">+</b> ${LE(a[0], a[1])}</p><p><b class="sym no">−</b> ${LE(b[0], b[1])}</p></div>`).join('')}</div>`,
  ['დაბალანსებული შეფასება ცხრა კრიტერიუმით; წარმადობის დადასტურებული მონაცემი არ გვაქვს.', 'A balanced assessment over nine criteria; we have no verified performance data.']));

// 16-17 matrix (split)
S.push(slide(['მატრიცა 1/2', 'Matrix 1/2'], ['შედარების მატრიცა: შესაძლებლობები', 'Comparison matrix: capabilities'],
  table([['კრიტერიუმი', 'Criterion'], 'FME', 'GDAL', 'QGIS', 'Terrio'], matrixRows(MATRIX.slice(0, 8))) + LEGEND,
  ['სრული მატრიცა ხელმისაწვდომია XLSX-ში: downloads/GIS_DAY_COMPARISON_MATRIX.xlsx.', 'The full matrix is available as XLSX: downloads/GIS_DAY_COMPARISON_MATRIX.xlsx.']));
S.push(slide(['მატრიცა 2/2', 'Matrix 2/2'], ['შედარების მატრიცა: ხარჯი და სიმწიფე', 'Comparison matrix: cost and maturity'],
  table([['კრიტერიუმი', 'Criterion'], 'FME', 'GDAL', 'QGIS', 'Terrio'], matrixRows(MATRIX.slice(8))) + LEGEND,
  ['წარმადობის სტრიქონი: დამოუკიდებელი ბენჩმარკი ვერ მოვძებნეთ.', 'Performance row: no independent benchmark found.']));

// 18 verdict
const vrows = T[16].map(r => `<tr>${rowhead(r[0])}${r[1].map(v => `<td class="c">${v === '●' ? '<b class="sym ok">●</b>' : v === '○' ? '<b class="sym part">○</b>' : ''}</td>`).join('')}</tr>`);
S.push(slide(['დასკვნა', 'Verdict'], ['საბოლოო დასკვნა: გადაწყვეტილების მატრიცა', 'Final verdict: a decision matrix, not a single winner'],
  `<div class="two"><div>${table([['კითხვა', 'Question'], 'FME', 'GDAL', 'QGIS', 'Terrio'], vrows)}<p class="small muted"><b class="sym ok">●</b> ${LE('საუკეთესო', 'best fit')} · <b class="sym part">○</b> ${LE('კარგი', 'good fit')}</p></div><div>
   ${callout('tip', 'Terrio: შემავსებელი თუ ალტერნატივა? ', 'Terrio: complement or alternative? ', 'ამჟამად — შემავსებელი სპეციფიკურ სცენარებში (WASM, ბრაუზერი, pure-Rust, COG/COPC in place). ალტერნატივა — ზოგ ამოცანაში, პროექტის მომწიფების შემდეგ.', 'Today a complement in specific scenarios (WASM, browser, pure-Rust, COG/COPC in place); an alternative only for some tasks once the project matures.')}
   <p class="small muted">${LE('ეს შეფასება ექსპერტულია და არა გაზომილი.', 'This is expert judgement, not measured data.')}</p></div></div>`,
  ['უნივერსალური გამარჯვებული არ არსებობს. სერვერისთვის FME Flow — კორპორატიული ავტომატიზაცია, QGIS Server — OGC რუკების სერვისები.', 'There is no universal winner. For servers, FME Flow suits enterprise automation and QGIS Server suits OGC map services.']));

// 19 sources
const srcs = [
  ['FME', [['academy.safe.com', 'https://academy.safe.com/'], ['fme.safe.com/platform/deployments', 'https://fme.safe.com/platform/deployments/'], ['fme.safe.com/pricing', 'https://fme.safe.com/pricing/']]],
  ['GDAL', [['gdal.org', 'https://gdal.org/en/stable/'], ['gdal.org/download', 'https://gdal.org/en/stable/download.html'], ['github.com/OSGeo/gdal', 'https://github.com/OSGeo/gdal/releases']]],
  ['QGIS', [['qgis.org', 'https://www.qgis.org/'], ['QGIS Server manual', 'https://docs.qgis.org/latest/en/docs/server_manual/getting_started.html'], ['github.com/qgis/QGIS', 'https://github.com/qgis/QGIS/releases']]],
  ['Terrio', [['github.com/opengeos/terrio', 'https://github.com/opengeos/terrio'], ['terrio.dev', 'https://terrio.dev'], ['ROADMAP.md', 'https://github.com/opengeos/terrio/blob/main/ROADMAP.md']]],
];
S.push(slide(['წყაროები', 'Sources'], ['წყაროები და ჩამოსატვირთი ფაილები', 'Sources and downloads'],
  `<div class="grid g2">${srcs.map(([n, ls]) => `<div class="card"><h3>${n}</h3><ul>${ls.map(([t, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${t}</a></li>`).join('')}</ul></div>`).join('')}</div>
   <p class="small" style="margin-top:14px">${LE('ჩამოსატვირთი', 'Downloads')}: <a href="../downloads/GIS_DAY_FME_GDAL_QGIS_TERRIO.pptx">PPTX</a> · <a href="../downloads/GIS_DAY_COMPARISON_MATRIX.xlsx">XLSX</a> · <a href="../downloads/GIS_DAY_RESEARCH_REFERENCES.md">${LE('წყაროები', 'References')}</a> · <a href="../downloads/GIS_DAY_BENCHMARK_METHODOLOGY.md">${LE('ბენჩმარკის მეთოდოლოგია', 'Benchmark methodology')}</a></p>`,
  ['სრული სია წვდომის თარიღებითა და დაუდასტურებელი პუნქტებით: downloads/GIS_DAY_RESEARCH_REFERENCES.md.', 'Full list with access dates and unverified items: downloads/GIS_DAY_RESEARCH_REFERENCES.md.'], 'closing'));

const html = `<!doctype html>
<html lang="ka">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>GIS DAY: FME vs GDAL vs QGIS vs Terrio</title>
<link rel="stylesheet" href="../assets/deck.css">
<link rel="stylesheet" href="../assets/gisday.css">
<style>
  .sym{font-weight:700} .sym.ok{color:var(--accent2)} .sym.part{color:var(--warn)} .sym.no{color:var(--danger)} .sym.unk{color:var(--muted)}
  th.rh{text-align:left} td.c{text-align:center;font-size:1.15em}
  .chips{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 14px}
  table.small td,table.small th{vertical-align:top}
</style>
</head>
<body>
<main class="deck">
${S.join('\n')}
</main>
<script src="../assets/deck.js"></script>
</body>
</html>
`;
fs.writeFileSync(OUT, html);
console.log('html ok', S.length, 'slides');
