// GIS_BOX presentation: one slide spec -> HTML deck (online) + PPTX (offline). Bilingual KA/EN.
// Facts come from https://github.com/GIS-GEORGIA/gis-toolkit (README, docs/TECHNICAL.md, git history, release v0.1.0), checked 2026-11-18.
const fs = require('fs');
const pptxgen = require('pptxgenjs');
const QR = require('qrcode');
const ROOT = __dirname + '/../';
const REPO = 'https://github.com/GIS-GEORGIA/gis-toolkit';

const SLIDES = require('./gisbox_slides');

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
  if (s.t === 'story') {
    const blk = (lab, p) => `<div class="card"><h3>${L(lab[0], lab[1])}</h3><p>${L(p[0], p[1])}</p></div>`;
    body = `  <div class="story"><figure><img src="../assets/${s.img}" alt=""><figcaption class="small muted">${L(s.cap[0], s.cap[1])}</figcaption></figure><div class="sblocks">${blk(['პრობლემა', 'Problem'], s.problem)}${blk(['როგორ დამეხმარა AI', 'How AI helped'], s.ai)}${blk(['შედეგი', 'Result'], s.result)}</div></div>\n` + callout([`გაკვეთილი: ${s.lesson[0]}`, `Lesson: ${s.lesson[1]}`], 'tip') + `\n  <p class="small muted">git: ${esc(s.when)}</p>`;
  } else if (s.t === 'hero') {
    body = `  <div class="story"><figure><img src="../assets/${s.img}" alt=""></figure><div><ul class="pts tight" lang="ka">${s.items.map(i => `<li>${esc(i[0])}</li>`).join('')}</ul><ul class="pts tight" lang="en">${s.items.map(i => `<li>${esc(i[1])}</li>`).join('')}</ul></div></div>`;
  } else if (s.t === 'collage') {
    body = `  <div class="collage">${s.tiles.map(t => `<figure><img src="../assets/${t[0]}" alt=""><figcaption class="small">${L(t[1], t[2])}</figcaption></figure>`).join('')}</div>`;
  } else if (s.t === 'stats') {
    body = `  <div class="grid">${s.items.map(i => `<div class="card"><h3 style="font-size:clamp(28px,4vw,48px);color:var(--accent2)">${esc(i[0])}</h3><p>${L(i[1], i[2])}</p></div>`).join('')}</div>\n  <p class="small muted">${L(s.foot[0], s.foot[1])}</p>`;
  } else if (s.t === 'table') {
    body = `  <table class="small"><tr><th>${L(s.head[0][0], s.head[0][1])}</th><th>${L(s.head[1][0], s.head[1][1])}</th></tr>${s.rows.map(r => `<tr><td><b>${esc(r[0])}</b></td><td>${L(r[1], r[2])}</td></tr>`).join('')}</table>`;
  } else if (s.t === 'bullets') {
    const lis = (i) => s.items.map(it => `<li>${esc(it[i])}</li>`).join('');
    const lists = `<ul class="pts" lang="ka">${lis(0)}</ul>\n  <ul class="pts" lang="en">${lis(1)}</ul>`;
    const im = s.img ? `<img class="${s.imgKind === 'banner' ? 'banner' : 'sideimg'}" src="../assets/${s.img}" alt="">` : '';
    body = s.imgKind === 'side' ? `  <div class="story"><div>${lists}</div><figure>${im}</figure></div>` : `  ${im}\n  ${lists}` + (s.idea ? '\n' + callout(['ეს არის წინადადებები და არა არსებული ფუნქციები.', 'These are proposals, not existing features.'], 'warn') : '');
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
    s.addText(t[0], { x: 0.6, y: 0.3, w: dark ? 12.1 : 10.5, h: 0.55, fontFace: KF, fontSize: 28, bold: true, color: dark ? WHITE : NAVY, margin: 0, valign: 'middle', isTextBox: true, fit: 'shrink' });
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
      const img = (path, x, y, w, h) => { s.addImage({ path: ROOT + 'assets/' + path, x, y, w, h, sizing: { type: 'contain', w, h } }); };
      if (sd.t === 'story') {
        s.addShape('roundRect', { x: 0.55, y: 1.5, w: 6.5, h: 3.95, fill: { color: 'F3F6FB' }, line: { color: 'C9D3E6', width: 1 }, rectRadius: 0.05 });
        img(sd.img, 0.65, 1.58, 6.3, 3.5);
        s.addText([run(sd.cap[0] + ' / ', { fontFace: KF, fontSize: 10.5, color: MUTE }), run(sd.cap[1], { fontFace: BF, fontSize: 10.5, color: MUTE })], { x: 0.65, y: 5.1, w: 6.3, h: 0.3, margin: 0, isTextBox: true });
        s.addShape('roundRect', { x: 0.55, y: 5.65, w: 6.5, h: 1.2, fill: { color: AMBER_BG }, line: { color: AMBER, width: 1 }, rectRadius: 0.06 });
        s.addText([run('გაკვეთილი / Lesson', { fontFace: KF, fontSize: 12, bold: true, color: AMBER, breakLine: true }), run(sd.lesson[0], { fontFace: KF, fontSize: 12.5, color: INK, breakLine: true }), run(sd.lesson[1], { fontFace: BF, fontSize: 12, color: MUTE })], { x: 0.75, y: 5.7, w: 6.1, h: 1.1, margin: 0, valign: 'middle', isTextBox: true });
        [['პრობლემა', 'Problem', sd.problem, PALE], ['როგორ დამეხმარა AI', 'How AI helped', sd.ai, 'D5F2EC'], ['შედეგი', 'Result', sd.result, PALE]].forEach(([ka, en, tx, fill], i) => {
          const y = 1.5 + i * 1.8;
          s.addShape('roundRect', { x: 7.3, y, w: 5.45, h: 1.68, fill: { color: fill }, line: { color: fill }, rectRadius: 0.08 });
          s.addText([run(ka + ' / ' + en, { fontFace: KF, fontSize: 12.5, bold: true, color: NAVY, breakLine: true, paraSpaceAfter: 3 }), run(tx[0], { fontFace: KF, fontSize: 12, color: INK, breakLine: true, paraSpaceAfter: 2 }), run(tx[1], { fontFace: BF, fontSize: 11, color: MUTE })], { x: 7.48, y: y + 0.08, w: 5.1, h: 1.55, margin: 0, valign: 'top', isTextBox: true, fit: 'shrink' });
        });
        s.addText('git: ' + sd.when, { x: 9.3, y: 6.9, w: 3.45, h: 0.25, align: 'right', fontFace: BF, fontSize: 10, color: MUTE, margin: 0, isTextBox: true });
      } else if (sd.t === 'hero') {
        s.addShape('roundRect', { x: 0.55, y: 1.5, w: 7.7, h: 4.95, fill: { color: 'F3F6FB' }, line: { color: 'C9D3E6', width: 1 }, rectRadius: 0.05 });
        img(sd.img, 0.65, 1.6, 7.5, 4.75);
        const its = sd.items.flatMap((it, i) => [run(it[0], { fontFace: KF, fontSize: 16, color: INK, breakLine: true }), run(it[1], { fontFace: BF, fontSize: 14, color: MUTE, breakLine: i < sd.items.length - 1, paraSpaceAfter: 14 })]);
        s.addText(its, { x: 8.6, y: 1.6, w: 4.2, h: 4.8, margin: 0, valign: 'top', isTextBox: true });
      } else if (sd.t === 'collage') {
        sd.tiles.forEach((t, i) => { const x = 0.6 + (i % 3) * 4.1, y = 1.5 + Math.floor(i / 3) * 2.8;
          s.addShape('roundRect', { x, y, w: 3.9, h: 2.4, fill: { color: 'F3F6FB' }, line: { color: 'C9D3E6', width: 1 }, rectRadius: 0.05 });
          img(t[0], x + 0.08, y + 0.08, 3.74, 2.24);
          s.addText([run(t[1], { fontFace: KF, fontSize: 12, bold: true, color: NAVY, breakLine: true }), run(t[2], { fontFace: BF, fontSize: 11, color: MUTE })], { x, y: y + 2.42, w: 3.9, h: 0.4, margin: 0, isTextBox: true }); });
      } else if (sd.t === 'stats') {
        const two = sd.items.length === 4, cw = two ? 5.95 : 3.9, step = two ? 6.15 : 4.1, per = two ? 2 : 3;
        sd.items.forEach((it, i) => { const x = 0.6 + (i % per) * step, y = 1.6 + Math.floor(i / per) * 2.45;
          s.addShape('roundRect', { x, y, w: cw, h: 2.25, fill: { color: PALE }, line: { color: PALE }, rectRadius: 0.08 });
          s.addText(it[0], { x: x + 0.2, y: y + 0.15, w: cw - 0.4, h: 1.1, fontFace: HF, fontSize: 48, bold: true, color: OK, margin: 0, isTextBox: true });
          s.addText([run(it[1], { fontFace: KF, fontSize: 14, color: INK, breakLine: true }), run(it[2], { fontFace: BF, fontSize: 13, color: MUTE })], { x: x + 0.2, y: y + 1.25, w: cw - 0.4, h: 0.9, margin: 0, valign: 'top', isTextBox: true }); });
        s.addText([run(sd.foot[0] + ' / ', { fontFace: KF, fontSize: 13, color: MUTE }), run(sd.foot[1], { fontFace: BF, fontSize: 13, color: MUTE })], { x: 0.6, y: 6.55, w: 12.1, h: 0.4, margin: 0, isTextBox: true });
      } else if (sd.t === 'table') {
        const hdr = (a, b) => ({ text: [run(a, { fontFace: KF, fontSize: 12, bold: true, color: WHITE, breakLine: true }), run(b, { fontFace: BF, fontSize: 12, bold: true, color: WHITE })], options: { fill: { color: NAVY } } });
        const rows = [[hdr(sd.head[0][0], sd.head[0][1]), hdr(sd.head[1][0], sd.head[1][1])]];
        sd.rows.forEach(r => rows.push([{ text: r[0], options: { fontFace: BF, fontSize: 13, bold: true, color: NAVY, valign: 'middle', fill: { color: PALE } } }, { text: [run(r[1], { fontFace: KF, fontSize: 13, color: INK, breakLine: true }), run(r[2], { fontFace: BF, fontSize: 12, color: MUTE })], options: { valign: 'middle' } }]));
        s.addTable(rows, { x: 0.6, y: 1.55, w: 12.1, colW: [2.0, 10.1], border: { type: 'solid', color: 'C9D3E6', pt: 0.75 }, margin: [0.03, 0.1, 0.03, 0.1], rowH: [0.5].concat(sd.rows.map(() => 0.58)) });
      } else if (sd.t === 'bullets') {
        const items = sd.items.flatMap((it, i) => [run(it[0], { fontFace: KF, fontSize: 20, color: INK, breakLine: true }), run(it[1], { fontFace: BF, fontSize: 17, color: MUTE, breakLine: i < sd.items.length - 1, paraSpaceAfter: 14 })]);
        s.addText(items, { x: 0.6, y: 1.7, w: sd.img ? 8.1 : 12.1, h: 5.0, margin: 0, valign: 'top', isTextBox: true });
        if (sd.imgKind === 'side') img(sd.img, 9.0, 1.7, 3.8, 3.8);
        else if (sd.imgKind === 'banner') img(sd.img, 9.0, 3.2, 3.8, 1.4);
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
