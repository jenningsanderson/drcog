echo "Tiling Buildings in OSM"

tippecanoe -o osm_buildings.mbtiles -Z15 -z15 -Pf -pf -pd -ps --no-duplication --no-tile-stats all_buildings.geojsonseq