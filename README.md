**ქართული** · [English](README.en.md)

# GIS Day — პრეზენტაციები

GIS Day-ის ონლაინ წვდომადი სლაიდები და მასალები (ორენოვანი: ქართული / English).

**ცოცხალი ვერსია:** https://gis-edu-georgia.github.io/gis-day/

ენა გადაირთვება <kbd>L</kbd> კლავიშით, ლექტორის ხედი — <kbd>S</kbd>, თემა — <kbd>D</kbd>.

## პრეზენტაციები

| პრეზენტაცია | ონლაინ | ფაილები |
|---|---|---|
| GIS DAY: FME vs GDAL vs QGIS vs Terrio | `presentations/fme-gdal-qgis-terrio.html` | `downloads/` — PPTX, XLSX, წყაროები, ბენჩმარკის მეთოდოლოგია |
| GIS Day 2026 (Esri media kit-ის მიმოხილვა) | — | `downloads/GIS-Day-2026.pptx` |
| Teacher for a Day | — | `downloads/Teacher-for-a-Day.pptx` |

## სტრუქტურა

```
gis-day/
├── index.html                 ← სასტარტო გვერდი
├── assets/                    ← deck.css / deck.js (სლაიდების ძრავი, python-course-დან)
├── presentations/             ← ონლაინ სლაიდები (HTML, 0 დამოკიდებულება)
├── downloads/                 ← PPTX, XLSX, MD
├── resources/                 ← Esri GIS Day 2026 Media Kit-იდან ჩამოწერილი რესურსები (იხ. NOTICE)
└── src/                       ← გენერატორები (node src/build_*.js)
```

ახალი პრეზენტაციის დასამატებლად: ახალი HTML `presentations/`-ში (`../assets/deck.css` + `../assets/deck.js`) და ბარათი `index.html`-ში.

## აწყობა

```sh
npm install
node src/build_comparison.js   # PPTX + src/tables.json
node src/build_xlsx.js         # XLSX
node src/build_html.js         # HTML სლაიდები
```

## ლიცენზია
ძრავი — MIT; შინაარსი — CC BY 4.0; Esri-ის რესურსები — Esri-ის (იხ. [NOTICE](NOTICE)).
