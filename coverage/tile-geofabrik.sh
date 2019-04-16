echo "Running TippeCanoe"

cat drcog_colorado-latest-internal.osm.pbf.geojsonseq | jq '.properties.height|=tonumber' | tippecanoe -f -o drcog_in_osm-geofabrik.mbtiles -Z2 -B12 -z20 -pf -pd -ps --layer=osm
