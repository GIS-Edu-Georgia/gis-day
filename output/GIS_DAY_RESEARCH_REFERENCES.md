# GIS DAY: FME vs GDAL vs QGIS vs Terrio — Research References

Access date for all sources: **2026-11-16**. / წყაროებზე წვდომის თარიღი: **2026-11-16**.

## Version and status summary / ვერსიები და სტატუსი

| Tool | Latest verified | Date | License | Status / Maturity | Source |
|---|---|---|---|---|---|
| FME (Safe Software) | FME 2026.2 (Form + Flow) | late June 2026 (community post dated 2026-06-26) | Commercial | Mature; quarterly releases since 2026.1 (March 2026). FME 2026.3 is referenced in search results; its date was not verified | community.safe.com highlights (below) |
| GDAL | 3.13.3 | 2026-08-18 | MIT-style (OSGeo) | Very mature; bugfix releases about every two months (3.13.0 on 2026-05-08) | gdal.org download page; GitHub releases API |
| QGIS | 4.2.3 (latest), 3.44.15 (LTR) | 2026-09-25 | GPL-2.0 (GitHub metadata) | Very mature; feature freeze ahead of 4.4 | qgis.org/download; GitHub releases API |
| Terrio (OpenGeos) | v0.9.0 | 2026-11-15 | MIT | **Emerging**: repo created 2026-10-14; README says "early development, API may change before 1.0"; releases v0.6.0 (2026-10-31) to v0.9.0 (2026-11-15) | github.com/opengeos/terrio; ROADMAP.md |

## Primary sources / ძირითადი წყაროები

### FME
- FME Academy: <https://academy.safe.com/>
- FME Accelerator course: <https://academy.safe.com/fme-accelerator> — **HTTP 403 to our fetcher; content not verified.**
- Deployment options (Docker, Kubernetes, Remote Engines Service, FME Flow Hosted on AWS; FME installable on Windows, Linux, macOS ARM): <https://fme.safe.com/platform/deployments/>
- Pricing and licensing: <https://fme.safe.com/pricing/>
- FME 2026.2 highlights (community): <https://community.safe.com/product-updates/fme-2026-2-feature-highlights-40528>
- Scaling FME Flow: <https://support.safe.com/hc/en-us/articles/41950655941389>
- OS support table: <https://support.safe.com/hc/en-us/articles/25407433729933> — **HTTP 403 to our fetcher; figures taken from a search-result summary. The official tech-specs URL (www.safe.com/fme/tech-specs/) redirected to a 404 on 2026-11-16 — verify on Safe Software's current technical-specifications page.**
- COPC reader/writer: <https://docs.safe.com/fme/html/FME-Form-Documentation/FME-ReadersWriters/copc/copc.htm>
- Cloud-native formats: <https://fme.safe.com/blog/2024/05/getting-started-with-cloud-native-geospatial-data-formats>

### GDAL
- Documentation: <https://gdal.org/en/stable/>
- Download and distribution (source + container images; binaries by third parties): <https://gdal.org/en/stable/download.html>
- Programs (unified `gdal` CLI, provisional; traditional utilities): <https://gdal.org/en/stable/programs/index.html>
- (Geo)Parquet driver (read/write; introduced 3.5): <https://gdal.org/en/stable/drivers/vector/parquet.html>
- Releases: <https://github.com/OSGeo/gdal/releases>

### QGIS
- Site and download: <https://www.qgis.org/> · <https://www.qgis.org/download/>
- QGIS Server (FastCGI, WMS/WFS/WCS/WMTS/OGC API Features, Xvfb note, load balancing example): <https://docs.qgis.org/latest/en/docs/server_manual/getting_started.html>
- Releases: <https://github.com/qgis/QGIS/releases>

### Terrio
- Repository and README: <https://github.com/opengeos/terrio>
- Roadmap (non-goals, local browser UI, GDAL parity work): <https://github.com/opengeos/terrio/blob/main/ROADMAP.md>
- Documentation: <https://terrio.dev>
- Releases: <https://github.com/opengeos/terrio/releases>

## Claims and how they were verified / მტკიცებულებები

| Claim | Status | Basis |
|---|---|---|
| GDAL 3.13.3 released 2026-08-18 | Verified | gdal.org download page + GitHub API |
| Unified `gdal` CLI is provisional, no compatibility guarantee | Verified | gdal.org programs page |
| GDAL has no LAS/LAZ/COPC driver | Verified in driver lists (no match for COPC/LAS); point clouds are PDAL's domain (general knowledge) | gdal.org raster/vector driver index |
| GDAL project distributes source + Docker images only | Verified | gdal.org download page |
| QGIS 4.2.3 / LTR 3.44.15 | Verified | qgis.org/download |
| QGIS Server publishes WMS, WMTS, WFS/OAPIF, WCS; needs X server (Xvfb) for printing on headless hosts; multiple instances can be load-balanced | Verified | QGIS Server manual |
| QGIS point cloud (LAS/LAZ/COPC) native support | **General knowledge, not verified in this run** | — |
| Terrio facts (pure Rust, CLI, Python, JS/WASM, `terrio ui` on 127.0.0.1, MCP, formats, GDAL backend, non-goals) | Verified | README + ROADMAP |
| Terrio is primarily built with AI under human review | Verified (README disclaimer) | README |
| FME Form on Windows, Linux, macOS (ARM) | Verified (deployments page) | fme.safe.com |
| FME Flow on Windows Server and Linux; Ubuntu 24.04 "Recommended" | **Partially verified** — from a search summary of the 403 page | see above |
| FME Flow REST API V3 deprecated in 2025.1 | **Secondary source only** | search summary |
| FME licensing options (subscription, perpetual, PAYG), free education licenses | Verified at summary level | fme.safe.com/pricing; reseller pages |
| FME price complaints | Anecdotal community posts — not used as fact | community.safe.com |
| FME HDF5 support | **Unverified** | not found |
| FME C++ SDK | **Unverified** | not found |
| Any performance ranking among the four tools | **Not available** — no independent benchmark found | see GIS_DAY_BENCHMARK_METHODOLOGY.md |
| GDAL threading anecdotes | Mailing-list reports (anecdotal) | lists.osgeo.org gdal-dev, e.g. <https://lists.osgeo.org/pipermail/gdal-dev/2025-April/060418.html> |

## Not compared
PDAL, GRASS, SAGA, GeoPandas, rasterio. PDAL is mentioned only as the usual point-cloud companion to GDAL.
