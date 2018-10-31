echo "Turning all DrCog edits in any .osc.gz file into geojson"

find ~/Downloads/*.osc.gz | xargs -P8 -I '{}' ./extract.sh {}
