echo "Running TippeCanoe"

cat geojson/*.geojsonseq | jq '.properties.height|=tonumber' | tippecanoe -f -o drcog_in_osm.mbtiles -Z2 -B12 -z20 -pf -pd -ps --layer=osm
