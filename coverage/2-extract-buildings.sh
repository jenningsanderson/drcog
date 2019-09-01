echo "Extracting DrCog Region"
osmium extract --set-bounds --overwrite -o drcog_bounds_$1.osm.pbf --bbox=-105.5598,39.2467,-104.2325,40.6206 $1

# Get all the buildings from the data
echo "Get only buildings from the data"
osmium tags-filter --overwrite -o all_buildings.osm.pbf drcog_bounds_$1.osm.pbf w/building=*

echo "Converting to geojsonseq"
osmium export -c osmiumconfig2 --overwrite -o all_buildings.geojsonseq all_buildings.osm.pbf

# Or we could get only drcog buildings
echo "Now running tag-filter to get ONLY DrCog Buildings"
osmium tags-filter --overwrite -o drcog_buildings.osm.pbf all_buildings.osm.pbf r/source=*DRCOG* w/source=*DRCOG*

echo "Converting to geojsonseq"
osmium export -c osmiumconfig2 --overwrite -o drcog_buildings.geojsonseq drcog_buildings.osm.pbf
