// "Our open projects" deck: GIS_BOX, GeoClass, linux-scripts. Facts from the three public repositories (checked 2026-11-21).
// Counts: git history of each repo ("Co-Authored-By: Claude" trailer counts), repo READMEs, CHANGELOG and the code (game registry).
const MY = ['[აქ დაამატე შენი სიტყვები]', '[Add your own words here]'];
const S = (n, ka, en) => ({ n, ka, en });
module.exports = [
  { t: 'cover', kicker: ['GIS DAY 2026', 'GIS DAY 2026'], title: ['ჩვენი ღია პროექტები: GIS_BOX, GeoClass, linux-scripts', 'Our open projects: GIS_BOX, GeoClass, linux-scripts'],
    sub: ['სამი პროექტი გეოგრაფებისთვის, მასწავლებლებისთვის და Linux-ის მომხმარებლებისთვის', 'Three projects for geographers, teachers and Linux users'],
    qr: { name: 'site', url: 'https://gisday.qgis.ge/', label: 'gisday.qgis.ge', ka: 'დაასკანერე და გახსენი საიტი', en: 'Scan to open the site' },
    note: ['სამი ღია (MIT) პროექტი: GIS_BOX — GIS ხელსაწყოები ერთ ფანჯარაში, GeoClass — საკლასო გეოგრაფიული თამაშები, linux-scripts — Linux-ის პატარა ხელსაწყოები. ფაქტები გადამოწმებულია 2026-11-21-ზე რეპოზიტორიებში.', 'Three open-source (MIT) projects: GIS_BOX — GIS tools in one window, GeoClass — classroom geography games, linux-scripts — small Linux utilities. Facts checked on 2026-11-21 in the repositories.'] },

  { t: 'table', kicker: ['მიმოხილვა', 'Overview'], title: ['სამი პროექტი ერთი შეხედვით', 'Three projects at a glance'],
    head: [['პროექტი', 'Project'], ['რა არის', 'What it is']],
    rows: [['GIS_BOX', 'GIS ხელსაწყოები ერთ ფანჯარაში: ნაკვეთის ძებნა, კოორდინატები, DWG → Shapefile · 2026-08-20 → 11-04', 'GIS tools in one window: parcel search, coordinates, DWG → Shapefile · 2026-08-20 → 11-04'],
      ['GeoClass', 'საკლასო გეოგრაფიული თამაშები QR კოდით და ცოცხალი რუკით · 2026-11-02 → 11-15', 'Classroom geography games with QR codes and a live map · 2026-11-02 → 11-15'],
      ['linux-scripts', 'Linux-ის პატარა ხელსაწყოები, მათ შორის QGIS-ის დამყენებელი · 2026-10-14 → 11-16', 'Small Linux utilities, including a QGIS installer · 2026-10-14 → 11-16']],
    note: ['სამივე პროექტი MIT ლიცენზიითაა. თარიღები git ისტორიიდანაა: GIS_BOX 2026-08-20 → 11-04, GeoClass 2026-11-02 → 11-15, linux-scripts 2026-10-14 → 11-16.', 'All three are MIT licensed. Dates come from git history: GIS_BOX 2026-08-20 → 11-04, GeoClass 2026-11-02 → 11-15, linux-scripts 2026-10-14 → 11-16.'] },

  { t: 'hero', kicker: ['GeoClass', 'GeoClass'], title: ['GeoClass: გაკვეთილი ტელეფონებით და ცოცხალი რუკით', 'GeoClass: a lesson with phones and a live map'], img: 'projects/geoclass_home.png',
    items: [['მასწავლებელი აჩვენებს QR კოდს, მოსწავლეები ტელეფონიდან პასუხობენ ანონიმურად, პასუხები ჩნდება რუკაზე', 'The teacher shows a QR code, students answer anonymously on their phones, answers appear on a map'],
      ['VI–IX კლასებისთვის; ქართული და English', 'For grades VI–IX; Georgian and English'],
      ['Web (PWA), Android, Windows და Linux ერთი კოდიდან', 'Web (PWA), Android, Windows and Linux from one codebase'],
      ['ცოცხალი: geoclass.qgis.ge · v1.0.0 (2026-11-11)', 'Live: geoclass.qgis.ge · v1.0.0 (2026-11-11)']],
    note: ['სურათი — geoclass.qgis.ge-ს საწყისი გვერდი (მასწავლებლის შესვლა; ქვემოთ QR). წყარო: README, GitHub release v1.0.0.', 'The image is the geoclass.qgis.ge start page (teacher sign-in; QR below). Source: README, GitHub release v1.0.0.'] },

  { t: 'table', kicker: ['თამაშები', 'Games'], title: ['რას აკეთებენ მოსწავლეები', 'What students do'],
    head: [['თამაში', 'Game'], ['რას ვარჯიშობენ', 'What it practises']],
    rows: [['სად გაემგზავრებოდი? / Where would you travel?', 'წერტილი რუკაზე და მიზეზი — ონლაინ რუკის გამოყენება', 'A point on the map and a reason — using an online map'],
      ['კოორდინატები / Coordinates', 'DD, DM, DMS და UTM; ადგილის პოვნა კოორდინატით', 'DD, DM, DMS and UTM; finding a place by coordinates'],
      ['საჰაერო ფოტო / Aerial photo', 'სად არის გადაღებული ფოტო ზემოდან', 'Where a photo from above was taken'],
      ['ბარათები / Cards', 'ერთი და იგივე ადგილის პოვნა სხვადასხვა მასშტაბზე', 'Finding the same place at different scales'],
      ['ფერადი ფირფიტები / Colour plates', 'ფერადი წერტილებში დამალული რეგიონი ან ქვეყანა', 'A region or country hidden in coloured dots'],
      ['რუკის პაზლი / Map puzzle', 'საქართველოს აწყობა რეგიონებიდან და მუნიციპალიტეტებიდან', 'Putting Georgia together from regions and municipalities'],
      ['რუკის მაკეტი / Map layout', 'სათაური, ისარი, ლეგენდა, მასშტაბი; A4 PDF', 'Title, north arrow, legend, scale; A4 PDF']],
    note: ['ცხრილი README-ის თამაშების სიიდანაა (სრულად ჩამოთვლილია 9 თამაში; აქ 7 გვაჩვენებ). README-ის გარდა კოდში ახალი „GIS ლაბორატორიის“ თამაშებიცაა — იხილეთ შემდეგი სლაიდი.', 'The table comes from the README games list (nine games in total; seven shown here). Besides the README the code has newer “GIS lab” games — see the next slide.'] },

  { t: 'bullets', kicker: ['GIS ლაბორატორია', 'GIS lab'], title: ['ახალი თამაშები: რელიეფი და ანალიზი', 'New games: terrain and analysis'], img: 'projects/geoclass_feature.png', imgKind: 'banner',
    items: [['რელიეფის პროფილი, დახრილობა, ხილვადობა', 'Terrain profile, slope, viewshed'],
      ['წყალგამყოფი (watershed) და მისი გაგრძელება DEM-დან', 'Watershed and its continuation derived from the DEM'],
      ['ყველაზე იაფი გზა (least-cost path)', 'Least-cost path'],
      ['თემატური რუკა (კლასიფიკაცია) და თანამგზავრული დროის გასწვრივი თამაში', 'Thematic map (classification) and a satellite time-lapse game'],
      ['112: ადგილის შეტყობინება მასწავლებლის შაბლონებით', '112: reporting your location with teacher templates']],
    note: ['წყარო: lib/games/registry.dart-ის თამაშები და commit-ები 2026-11-13 → 15 („Phase 2 Task 5–9“, „thematic map game“, „watershed level 2“, „satellite time-lapse game“, „112 game“). README ჯერ ამ თამაშებს არ აღწერს. რელიეფის თამაშები DEM-ზეა დაფუძნებული; დეტალები რეპოში.', 'Source: games in lib/games/registry.dart and commits of 2026-11-13 → 15 (“Phase 2 Task 5–9”, “thematic map game”, “watershed level 2”, “satellite time-lapse game”, “112 game”). The README does not describe these yet. The terrain games are DEM-based; details are in the repo.'] },

  { t: 'collage', kicker: ['თამაში', 'Game'], title: ['ბარათები: იპოვე ერთი და იგივე ადგილი', 'Cards: find the same place'], cols: 4,
    tiles: [['projects/card_p03_1.jpg', 'ენგური · დიდი მასშტაბი', 'Enguri · larger scale'], ['projects/card_p03_2.jpg', 'ენგური · პატარა მასშტაბი', 'Enguri · smaller scale'], ['projects/card_p06_1.jpg', 'ლაგოდეხი · დიდი მასშტაბი', 'Lagodekhi · larger scale'], ['projects/card_p06_2.jpg', 'ლაგოდეხი · პატარა მასშტაბი', 'Lagodekhi · smaller scale']],
    credit: ['რუკის სურათები: © OpenStreetMap-ის კონტრიბუტორები · Tracestrack Topo (CC BY 4.0)', 'Map images: © OpenStreetMap contributors · Tracestrack Topo (CC BY 4.0)'],
    note: ['ბარათები GeoClass-ის რეპოდანაა (web/cards). README-ის მიხედვით სურათები OpenStreetMap-ისა და Tracestrack Topo-ს შრეებიდანაა და მათი კრედიტი აპლიკაციაში ყოველთვის ჩანს.', 'The cards come from the GeoClass repo (web/cards). Per the README the pictures come from OpenStreetMap and Tracestrack Topo layers and their credit is always shown in the app.'] },

  { t: 'bullets', kicker: ['კონფიდენციალობა', 'Privacy'], title: ['GeoClass: მოსწავლისგან არაფერს ვითხოვთ', 'GeoClass: we ask students for nothing'], img: 'gisday/earth.png', imgKind: 'side',
    items: [['ანგარიში, სახელი, ელფოსტა ან ტელეფონი არ სჭირდება — მხოლოდ შემთხვევითი კოდი მოწყობილობაზე', 'No account, name, email or phone — only a random code made on the device'],
      ['სესიები ავტომატურად იშლება 6 თვის შემდეგ', 'Sessions are deleted automatically after 6 months'],
      ['მოსწავლეს შეუძლია საკუთარი პასუხების წაშლა', 'A student can delete their own answers'],
      ['კავშირის გაწყვეტისას პასუხები ელოდება და მოგვიანებით იგზავნება', 'When the connection drops, answers wait and are sent later'],
      ['აპლიკაცია cookies-ს არ ადგენს', 'The app sets no cookies']],
    note: ['წყარო: GeoClass README, სექცია „Privacy and GDPR“ და „Features“. კონფიდენციალობის პოლიტიკა — web/privacy/index.html.', 'Source: GeoClass README, sections “Privacy and GDPR” and “Features”. The privacy policy is web/privacy/index.html.'] },

  { t: 'hero', kicker: ['linux-scripts', 'linux-scripts'], title: ['linux-scripts: პატარა ხელსაწყოები Linux-ისთვის', 'linux-scripts: small tools for Linux'], img: 'projects/ls_installer.png',
    items: [['თითო საქაღალდე — თითო ხელსაწყო: USB-ის უსაფრთხო გამორთვა, Wi-Fi hotspot QR კოდით, პრინტერის დაყენება', 'One folder per tool: safe USB eject, a Wi-Fi hotspot with a QR code, printer setup'],
      ['PrintHub (ბეჭდვა), ერთი ფანჯარა მრავალი პროგრამის დასაყენებლად, DevOps Toolbox', 'PrintHub (printing), one window to install many programs, DevOps Toolbox'],
      ['უმეტესს აქვს ფანჯარა (EN / ქართული) და ბრძანების ხაზიც', 'Most have a window (EN / Georgian) and a command line']],
    note: ['სურათი — „Toolkit Installer“-ის ფანჯარა (ნამდვილი ეკრანის სურათი, ზედა ნაწილი). წყარო: README, ხელსაწყოების ცხრილი.', 'The image is the “Toolkit Installer” window (a real screenshot, top part). Source: README, tools table.'] },

  { t: 'hero', kicker: ['გეოგრაფებისთვის', 'For geographers'], title: ['QGIS-ის დაყენება ისე, როგორც შენ აირჩევ', 'Installing QGIS the way you choose'], img: 'projects/ls_qgis.png',
    items: [['ოფიციალური რეპოზიტორია (უახლესი / LTR / nightly), Flatpak, დისტრიბუციის პაკეტი, AUR', 'Official repository (latest / LTR / nightly), Flatpak, distribution package, AUR'],
      ['დიაგნოსტიკა (doctor), plugin-ების დამოკიდებულებები, ოფლაინ ასლი, სრული წაშლა', 'Doctor, plugin dependencies, an offline copy, full removal'],
      ['ცალკე „GIS toolbox“ ჩანართი: QGIS, SAGA, SpatiaLite', 'A “GIS toolbox” tab: QGIS, SAGA, SpatiaLite']],
    note: ['სურათი — qgis-installer-ის ფანჯარა (ნამდვილი ეკრანის სურათი). წყარო: README და CHANGELOG (“GIS toolbox tab”, 2026-11-09 … 15).', 'The image is the qgis-installer window (a real screenshot). Source: README and CHANGELOG (“GIS toolbox tab”, 2026-11-09 … 15).'] },

  { t: 'bullets', kicker: ['საიმედოობა', 'Reliability'], title: ['ფრთხილი დაყენება და განახლება', 'Careful install and update'], img: 'gisday/circles.png', imgKind: 'banner',
    items: [['install.sh არასოდეს გადაწერს ან წაშლის ფაილს, რომელიც მას არ ჩაუწერია', 'install.sh never overwrites or removes a file it did not write'],
      ['ჩაწერილი ფაილები (გზა და SHA-256) ინახება manifest-ში; არის --dry-run', 'Installed files (path and SHA-256) are recorded in a manifest; there is a --dry-run'],
      ['CI ამოწმებს Debian 12, Ubuntu 22.04 და 24.04, Fedora, Arch, openSUSE Tumbleweed და Alpine-ზე', 'CI checks Debian 12, Ubuntu 22.04 and 24.04, Fedora, Arch, openSUSE Tumbleweed and Alpine'],
      ['Python 3.8–3.13; ყოველი ცვლილება — pull request, რომელმაც CI გაიარა', 'Python 3.8–3.13; every change is a pull request that passed CI']],
    note: ['წყარო: linux-scripts README (“Supported systems”, “Install”) და CHANGELOG (“safer updates, installs and CI”, 2026-11-16).', 'Source: linux-scripts README (“Supported systems”, “Install”) and CHANGELOG (“safer updates, installs and CI”, 2026-11-16).'] },

  { t: 'stats', kicker: ['AI', 'AI'], title: ['როგორ დამეხმარა AI სამივე პროექტში', 'How AI helped across all three projects'],
    items: [['101 / 102', 'GIS_BOX: commit-ი Claude-ის co-author ჩანაწერით', 'GIS_BOX: commits with a Claude co-author trailer'], ['49 / 49', 'GeoClass: commit-ი Claude-ის co-author ჩანაწერით (14 დღე)', 'GeoClass: commits with a Claude co-author trailer (14 days)'], ['128 / 194', 'linux-scripts: commit-ი Claude-ის co-author ჩანაწერით', 'linux-scripts: commits with a Claude co-author trailer'], ['3', 'ღია MIT პროექტი', 'open MIT projects']],
    foot: ['ციფრები git ისტორიიდანაა: „Co-Authored-By: Claude“ ხაზები commit-ის ტექსტში', 'Numbers come from git history: “Co-Authored-By: Claude” lines in the commit text'],
    note: ['თითო რეპოში დათვლილია commit-ები, რომლებიც შეიცავს „Co-Authored-By: Claude“ ხაზს. ეს გვიჩვენებს AI-თან თანაავტორობის მასშტაბს და არა ხარისხს. ' + MY[0], 'In each repo we counted commits that contain a “Co-Authored-By: Claude” line. This shows the scale of AI co-authorship, not quality. ' + MY[1]] },

  { t: 'close3', title: ['სცადე და შემოგვიერთდი', 'Try them and join us'],
    qrs: [{ name: 'gisbox', url: 'https://github.com/GIS-GEORGIA/gis-toolkit', label: 'GIS_BOX', sub: 'GIS-GEORGIA/gis-toolkit' }, { name: 'geoclass', url: 'https://github.com/GIS-GEORGIA/geoclass', label: 'GeoClass', sub: 'geoclass.qgis.ge' }, { name: 'linux', url: 'https://github.com/kapo-Toolkits/linux-scripts', label: 'linux-scripts', sub: 'kapo-Toolkits/linux-scripts' }],
    note: ['სამი QR კოდი სამ GitHub რეპოზიტორიას ხსნის. GeoClass ცოცხლადაც ხელმისაწვდომია: geoclass.qgis.ge.', 'Three QR codes open the three GitHub repositories. GeoClass is also live: geoclass.qgis.ge.'] },
];
