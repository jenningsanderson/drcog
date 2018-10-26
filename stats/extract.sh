echo "Extracting DrCog"
osmium extract --set-bounds --with-history --overwrite -o drcog_$1.osh.pbf --bbox=-105.5598,39.2467,-104.2325,40.6206 $1

echo "Now running time filter for latest version"
osmium time-filter --overwrite -o drcog_latest_$1.osm.pbf drcog_$1.osh.pbf

rm drcog_$1.osh.pbf

echo "Now running tag-filter to get ONLY DrCog"
osmium tags-filter --overwrite -o drcog_latest_$1_filtered.osm.pbf drcog_latest_$1.osm.pbf r/source=*DRCOG* w/source=*DRCOG*

rm drcog_latest_$1.osm.pbf

echo "Now exporting to geojsonseq"
osmium export -c osmiumconfig --overwrite -o drcog_$1.geojsonseq drcog_latest_$1_filtered.osm.pbf

rm drcog_latest_$1_filtered.osm.pbf
