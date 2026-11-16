// Single source of truth for the comparison (used by the PPTX and XLSX builders).
// Every text is a bilingual pair { ka, en }. Facts verified 2026-11-16 (see GIS_DAY_RESEARCH_REFERENCES.md).
const p = (ka, en) => ({ ka, en });
const TOOLS = ['FME', 'GDAL', 'QGIS', 'Terrio'];

// symbol cells: s = ✔ supported, ◐ partial/depends, ✘ not available, ? unverified
const c = (s, ka, en) => ({ s, ka, en });

const MATRIX = [
  { k: p('მიზანი', 'Purpose'), v: [
    c('', 'სივრცული ETL და მონაცემთა ინტეგრაციის პლატფორმა', 'Spatial ETL and data integration platform'),
    c('', 'რასტრისა და ვექტორის კონვერტაციის ბიბლიოთეკა და CLI ხელსაწყოები', 'Raster/vector translator library and CLI tools'),
    c('', 'სრულფასოვანი დესკტოპ GIS (+ QGIS Server)', 'Complete desktop GIS (+ QGIS Server)'),
    c('', 'წმინდა Rust-ის გეოსივრცული I/O ხელსაწყო (CLI, ბიბლიოთეკები, WASM)', 'Pure-Rust geospatial I/O toolkit (CLI, libraries, WASM)')] },
  { k: p('GUI', 'GUI'), v: [
    c('✔', 'FME Form (Workbench) და FME Flow ვებ-ინტერფეისი', 'FME Form (Workbench) desktop; FME Flow web UI'),
    c('✘', 'არ აქვს (GUI სხვა პროგრამებშია)', 'None (GUIs come from other applications)'),
    c('✔', 'მშობლიური დესკტოპ GUI', 'Native desktop GUI'),
    c('◐', 'ლოკალური ბრაუზერ-UI და ვებ-ვერსია; დესკტოპ GIS არა', 'Local browser UI and web version; not a desktop GIS')] },
  { k: p('CLI', 'CLI'), v: [
    c('✔', 'workspace-ების გაშვება ბრძანების სტრიქონიდან', 'Run workspaces from the command line'),
    c('✔', 'gdal, gdalwarp, ogr2ogr…', 'gdal, gdalwarp, ogr2ogr…'),
    c('✔', 'qgis_process (Processing ალგორითმები)', 'qgis_process (Processing algorithms)'),
    c('✔', 'terrio (ძირითადი ინტერფეისი)', 'terrio (primary interface)')] },
  { k: p('Python', 'Python'), v: [
    c('✔', 'PythonCaller, fmeobjects', 'PythonCaller, fmeobjects'),
    c('✔', 'osgeo.gdal bindings', 'osgeo.gdal bindings'),
    c('✔', 'PyQGIS და Processing', 'PyQGIS and Processing'),
    c('✔', 'pip install terrio (rasterio-ის მსგავსი API)', 'pip install terrio (rasterio-style API)')] },
  { k: p('API-ები', 'APIs'), v: [
    c('✔', 'FME Flow REST API (V4)', 'FME Flow REST API (V4)'),
    c('✔', 'C/C++ API და bindings', 'C/C++ API and bindings'),
    c('✔', 'C++, PyQGIS, plugin API; OGC სერვისები', 'C++, PyQGIS, plugin API; OGC services'),
    c('✔', 'Rust crate, Python, JavaScript/WASM, MCP', 'Rust crate, Python, JavaScript/WASM, MCP')] },
  { k: p('სერვერული შესაძლებლობები', 'Server capabilities'), v: [
    c('✔', 'FME Flow — ცალკე სერვერული პროდუქტი', 'FME Flow — dedicated server product'),
    c('✘', 'არ არის სერვერი (საჭიროა საკუთარი სერვისი)', 'Not a server (custom service required)'),
    c('✔', 'QGIS Server — OGC ვებ-სერვისები', 'QGIS Server — OGC web services'),
    c('✘', 'სერვერი არ არის; მხოლოდ ლოკალური UI', 'No server product; local UI only')] },
  { k: p('ოპერაციული სისტემები', 'Operating systems'), v: [
    c('✔', 'Form: Windows, Linux, macOS (ARM); Flow: Windows, Linux', 'Form: Windows, Linux, macOS (ARM); Flow: Windows, Linux'),
    c('✔', 'Windows, Linux, macOS (ბინარები მესამე მხარისგან)', 'Windows, Linux, macOS (third-party binaries)'),
    c('✔', 'Windows, macOS, Linux (+ Android, BSD, კონტეინერები)', 'Windows, macOS, Linux (+ Android, BSD, containers)'),
    c('✔', 'Windows, Linux, macOS', 'Windows, Linux, macOS')] },
  { k: p('მხარდაჭერილი ფორმატები', 'Supported data formats'), v: [
    c('✔', 'ძალიან ფართო კატალოგი; ზოგი — ფასიანი plug-in-ით', 'Very broad catalog; some via extra-cost plug-ins'),
    c('✔', 'ძალიან ფართო raster/vector drivers-ის ნაკრები', 'Very broad raster/vector driver set'),
    c('✔', 'GDAL/OGR-ით და საკუთარი provider-ებით', 'Via GDAL/OGR and native providers'),
    c('◐', 'მზარდი pure-Rust drivers; დანარჩენი — არასავალდებულო GDAL backend-ით', 'Growing pure-Rust drivers; long tail via optional GDAL backend')] },
  { k: p('დამუშავების შესაძლებლობები', 'Processing capabilities'), v: [
    c('✔', 'Transformers-ის დიდი ბიბლიოთეკა', 'Large transformer library'),
    c('✔', 'warp, translate, VRT, contour, rasterize, DEM, vector SQL', 'warp, translate, VRT, contour, rasterize, DEM, vector SQL'),
    c('✔', 'Processing Toolbox (საკუთარი + GDAL ალგორითმები)', 'Processing Toolbox (native + GDAL algorithms)'),
    c('✔', 'GDAL-სტილის ოპერაციები და Point Cloud ფილტრები', 'GDAL-style operations and point cloud filters')] },
  { k: p('ავტომატიზაცია', 'Automation'), v: [
    c('✔', 'Workspaces, Flow Automations, Schedules, webhooks', 'Workspaces, Flow Automations, Schedules, webhooks'),
    c('✔', 'სკრიპტები, cron/CI, gdal pipeline', 'Scripts, cron/CI, gdal pipeline'),
    c('✔', 'Graphical Modeler, qgis_process, PyQGIS', 'Graphical Modeler, qgis_process, PyQGIS'),
    c('✔', 'CLI სკრიპტები, Python/JS, MCP', 'CLI scripts, Python/JS, MCP')] },
  { k: p('მასშტაბირება', 'Scalability'), v: [
    c('✔', 'Engines, queues, Remote Engines, Kubernetes', 'Engines, queues, Remote Engines, Kubernetes'),
    c('◐', 'ბიბლიოთეკის დონეზე; პარალელიზმს თავად აგებთ', 'Library-level; you design the parallelism'),
    c('◐', 'Server: რამდენიმე instance load balancer-ის უკან; Desktop: ერთი მანქანა', 'Server: several instances behind a load balancer; Desktop: one machine'),
    c('◐', 'მრავალნაკადიანი, ერთ მანქანაზე; ორკესტრაცია არ აქვს', 'Multi-threaded, single machine; no orchestration')] },
  { k: p('წარმადობა', 'Performance'), v: [
    c('?', 'დამოუკიდებელი ბენჩმარკი ვერ მოვძებნეთ', 'No independent benchmark found'),
    c('?', 'მწიფე C/C++ ბირთვი; დასარეგულირებელია; ბენჩმარკი ვერ მოვძებნეთ', 'Mature C/C++ core; tunable; no cross-tool benchmark found'),
    c('?', 'დამოკიდებულია ალგორითმსა და მონაცემზე; ბენჩმარკი ვერ მოვძებნეთ', 'Depends on algorithm and data; no benchmark found'),
    c('?', 'გამოქვეყნებული ბენჩმარკი ვერ მოვძებნეთ', 'No published benchmarks found')] },
  { k: p('ლიცენზია', 'Licensing'), v: [
    c('', 'კომერციული: გამოწერა, პერპეტუალური ან PAYG', 'Commercial: subscription, perpetual or PAYG'),
    c('', 'MIT-ტიპის ღია ლიცენზია (OSGeo)', 'MIT-style open source (OSGeo)'),
    c('', 'GPL-2.0, ღია კოდი', 'GPL-2.0 open source'),
    c('', 'MIT, ღია კოდი', 'MIT open source')] },
  { k: p('სწავლის მრუდი', 'Learning curve'), v: [
    c('', 'საშუალო; ვიზუალური, დიდი კატალოგი, FME Academy', 'Moderate; visual, large catalog, FME Academy'),
    c('', 'მაღალი არაპროგრამისტებისთვის', 'Steep for non-programmers'),
    c('', 'GUI-თი მარტივი; PyQGIS/Server — უფრო რთული', 'Gentle with GUI; PyQGIS/Server steeper'),
    c('', 'მარტივი GDAL-ის მცოდნეებისთვის; დოკუმენტაცია ახალია', 'Easy if you know GDAL; documentation is young')] },
  { k: p('ეკოსისტემის სიმწიფე', 'Ecosystem maturity'), v: [
    c('', 'მწიფე კომერციული პროდუქტი; კვარტალური გამოშვებები', 'Mature commercial product; quarterly releases'),
    c('', 'ძალიან მწიფე; 25+ წელი', 'Very mature; 25+ years'),
    c('', 'ძალიან მწიფე; LTR და უახლესი გამოშვება', 'Very mature; LTR plus latest release'),
    c('', 'ახალი: v0.9.0; API შეიძლება შეიცვალოს 1.0-მდე', 'Emerging: v0.9.0; API may change before 1.0')] },
];

const FORMATS = [
  { k: 'GeoTIFF', v: ['✔', '✔', '✔', '✔'] },
  { k: 'Cloud Optimized GeoTIFF (COG)', v: ['✔', '✔', '✔', '✔'] },
  { k: 'Shapefile', v: ['✔', '✔', '✔', '✔'] },
  { k: 'GeoPackage (GPKG)', v: ['✔', '✔', '✔', '✔'] },
  { k: 'GeoJSON', v: ['✔', '✔', '✔', '✔'] },
  { k: 'NetCDF', v: ['✔', '✔', '✔', '✔'] },
  { k: 'HDF', v: ['?', '✔', '◐', '◐'] },
  { k: '(Geo)Parquet', v: ['✔', '✔', '◐', '✔'] },
  { k: 'LAS / LAZ', v: ['✔', '✘', '✔', '✔'] },
  { k: 'COPC', v: ['✔', '✘', '✔', '✔'] },
  { k: 'PostGIS', v: ['✔', '✔', '✔', '✘'] },
  { k: p('ღრუბლოვანი საცავი (S3/GCS/Azure)', 'Cloud storage (S3/GCS/Azure)').ka + ' / Cloud storage', v: ['◐', '✔', '◐', '✔'] },
];
const FORMAT_NOTES = [
  p('GDAL-ს LAS/LAZ/COPC driver არ აქვს (Point Cloud-ისთვის იყენებენ PDAL-ს).', 'GDAL has no LAS/LAZ/COPC driver (PDAL is used for point clouds).'),
  p('QGIS-ში ფორმატების ნაწილი GDAL-ის build-ზეა დამოკიდებული; Point Cloud — საკუთარი provider.', 'In QGIS many formats depend on the GDAL build; point clouds use native providers (verify per version).'),
  p('Terrio-ში PostGIS ბირთვის non-goal-ია; HDF4 და სხვა — არასავალდებულო GDAL backend-ით.', 'In Terrio PostGIS is a core non-goal; HDF4 and others need the optional GDAL backend.'),
];

module.exports = { p, c, TOOLS, MATRIX, FORMATS, FORMAT_NOTES };
