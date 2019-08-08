echo "Tiling Buildings in OSM"

tippecanoe -o osm_buildings.mbtiles -Z15 -z15 -Pf -pk -pf -pd -ps -b0 -d17 --no-duplication --no-tile-stats -l buildings all_buildings.geojsonseq
