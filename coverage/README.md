# Coverage Calculations

_How is the DRCOG import going?_

**Future Goal:** Complete automation of the below at a remote endpoint -- but for now these run pretty easily on a single machine and we can update them here.


### Running
Currently need to do each of these steps manually, and you'll need `tippecanoe` and `osmium` installed locally. On a Mac this can be easily done with homebrew.


1. Download OSM extracts for Colorado. Use the [geofabriks internal extract](https://osm-internal.download.geofabrik.de/north-america/us/colorado.html) because it has user metadata. Also possible to do the export from Overpass: see the two `1 - *.sh` files for more info.

	1.5: If using the internal extract, must do `time-filter` to get latest data.
	
	`osmium time-filter -o colorado-internal.osm.pbf colorado-internal.osh.pbf`

1. Extract the buildings: Both `all_buildings` and `drcog_buildings` buildings: `./2-extract-buildings.sh colorado-internal.osm.pbf`

	The resulting geojsonseq files can be read more easily later for analysis with Python / your favorite Geo-DataScience tool.

	**Bonus:** How many DRCOG buildings are there? `wc -l drcog_buildings.geojsonseq`

3. Use tippecanoe to make Z15 vector tiles with the building geojsonseq files... (does all buildings by default, this is important for coverage)

4. Be sure to run the `Building Stats form GeoJSONSeq.ipynb` notebook in the `analysis` folder to generate the latest figures for the [osmcoloradoimport.info/stats](http://osmcoloradoimport.info/stats) webpage.