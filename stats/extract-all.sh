echo "Turning all DrCog edits in any .osc.gz file into geojson"

find *.osc.gz | xargs -P8 -I '{}' ./extract.sh {}
