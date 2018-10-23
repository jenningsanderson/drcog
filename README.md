# DRCOG Building Import

Utlities and web resources maintained by Jennings for the 2018 Denver Building Import. [Denver Planimetrics](https://wiki.openstreetmap.org/wiki/Denver_Planimetrics_Import)

If you're looking for the main DRCOG_Buildings Repository for the actual import instructions, see [github.com/geochasm/DRCOG_Buildings](//github.com/geochasm/DRCOG_Buildings)

What's in this Repo?
---------

`docs` is the webroot of [osmcoloradoimport.info](//osmcoloradoimport.info)

`util` has nodejs scripts for both data analysis (with [@mapbox/tile-reduce](//github.com/mapbox/tile-reduce) as well as task generation [make-tasks-from-tiles.js] scripts to extract certain `grid_refs` from `docs/drcog3.geosjson`.

`tm-projects` holds the geojson files that define some of the current tasks on [tasking-manager.mapsarecool.com](tasking-manager.mapsarecool.com)



##### Questions? 
Open an issue or find me in the [OSMUS slack](osmus.slack.com) workspace (`jenningsanderson`)
