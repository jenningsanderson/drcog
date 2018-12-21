echo "Extracting DrCog"
osmium extract --set-bounds --overwrite -o drcog_$1.osm.pbf --bbox=-105.5598,39.2467,-104.2325,40.6206 $1

#echo "Now running tag-filter to get ONLY DrCog"
#osmium tags-filter --overwrite -o drcog_$1_filtered.osm.pbf drcog_$1.osm.pbf w/building=*

echo "Now exporting to geojsonseq"
osmium export -c osmiumconfig2 --overwrite -o all_buildings.geojsonseq drcog_$1.osm.pbf
