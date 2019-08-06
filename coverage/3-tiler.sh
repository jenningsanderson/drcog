echo "Tiling Buildings in OSM"

tippecanoe -o osm_buildings.mbtiles -Z12 -z15 -Pf -pk -pf -pd -ps --no-duplication --no-tile-stats -l buildings all_buildings.geojsonseq
