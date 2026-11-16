# Benchmark Methodology: FME vs GDAL vs QGIS vs Terrio
# ბენჩმარკის მეთოდოლოგია

**Status:** no benchmark was executed and no independent published cross-tool benchmark was found (checked 2026-11-16). This document is a reproducible *method*; it contains no results. / ბენჩმარკი არ ჩატარებულა და დამოუკიდებელი შედეგები ვერ მოვძებნეთ; ეს დოკუმენტი მხოლოდ მეთოდია, შედეგებს არ შეიცავს.

Only anecdotal evidence exists, e.g. gdal-dev reports that more `gdalwarp` threads are not always faster and that a larger `GDAL_CACHEMAX` sometimes slowed processing (I/O is often the limit).

## 1. Fairness rules / სამართლიანობის წესები
1. One machine, fixed OS, fixed power profile; record CPU model, cores, RAM, disk type, kernel.
2. Record exact versions of every tool, GDAL/PROJ builds, compiler/release flags, FME edition and engine count.
3. Same input, same output format, same compression, same resampling, same CRS and extent for every tool.
4. Compare tools only on tasks all of them can do; mark the rest "not supported" instead of forcing a comparison.
5. Verify outputs are equivalent (below) before comparing times.
6. Report median and IQR of ≥ 5 runs; never a single run; publish raw timings and scripts.
7. Run QGIS only through `qgis_process` (headless), not through GUI interaction; FME through `fme` CLI.

## 2. Datasets / მონაცემები
Use public, versioned data and record checksums (`sha256sum`).

| ID | Scenario | Suggested data type |
|---|---|---|
| R1 | Raster read/write | Single-band GeoTIFF, 1–10 GB, tiled + DEFLATE |
| R2 | Raster reprojection | Same file, EPSG:4326 → a projected CRS (e.g. UTM) |
| R3 | COG remote window read | Public COG over HTTP range requests |
| V1 | Vector conversion | Shapefile/GeoPackage with ≥ 1 M features → GeoPackage/GeoParquet |
| L1 | Large dataset | Dataset larger than RAM |
| P1 | Point cloud | LAZ → COPC, plus ground classification subset |
| C1 | Parallel execution | R2 repeated with 1, 2, 4, … N workers |
| M1 | Memory / CPU | Collected on every scenario above |

## 3. Commands (examples to adapt) / ბრძანებები

```bash
# R2 reprojection
gdalwarp -t_srs EPSG:32638 -r bilinear -co COMPRESS=DEFLATE -co TILED=YES in.tif out_gdal.tif
terrio warp in.tif out_terrio.tif --t-srs EPSG:32638 -r bilinear
qgis_process run gdal:warpreproject -- INPUT=in.tif TARGET_CRS=EPSG:32638 RESAMPLING=1 OUTPUT=out_qgis.tif
fme reproject_workspace.fmw --SourceDataset_GEOTIFF in.tif --DestDataset_GEOTIFF out_fme.tif   # parameter names depend on the workspace

# V1 vector conversion
ogr2ogr -f GPKG out_gdal.gpkg in.shp
terrio convert in.shp out_terrio.gpkg

# P1 point cloud (GDAL has no LAS/COPC driver; use PDAL as the GDAL-ecosystem baseline)
terrio convert tile.laz tile.copc.laz
```
Check each tool's current `--help` before running; options change between versions (the unified `gdal` CLI is provisional).

## 4. Measurement / გაზომვა

```bash
# wall time with warm-up and repetitions
hyperfine --warmup 1 --runs 5 --export-json r2_gdal.json 'gdalwarp ...'
# peak memory and CPU
/usr/bin/time -v <command> 2> time_log.txt     # "Maximum resident set size", "Percent of CPU"
```
- **Cold vs warm cache:** run both (`sync; echo 3 | sudo tee /proc/sys/vm/drop_caches` for cold on Linux).
- **Parallelism:** set threads explicitly and record them (`-wo NUM_THREADS=N`, `-multi`, `GDAL_NUM_THREADS`, `GDAL_CACHEMAX`; `RAYON_NUM_THREADS` for Rust tools; FME engine count).
- **Network scenarios (R3):** record bandwidth and latency; repeat at different times.

## 5. Correctness check / სისწორის შემოწმება
- Rasters: `gdalcompare.py`, or compare `gdalinfo -stats` and pixel difference; allow resampling tolerance and document it.
- Vectors: feature count, geometry validity, attribute checksum.
- Point clouds: point count, bounds, classification histogram.

## 6. Reporting template
Tool + version · scenario · dataset ID · command · threads · median ± IQR (s) · peak RSS (MB) · mean CPU % · output size · correctness result · notes. Charts may be produced only from measured data.

## 7. Why results depend on setup / რატომ ცვალებადია
Hardware (CPU, RAM, SSD vs network), data size, drivers, compression and tiling, algorithm and resampling kernel, and configuration (cache size, threads, build flags). Results must not be generalised beyond the tested configuration.
