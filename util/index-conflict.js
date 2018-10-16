'use strict';

var fs = require('fs')
var path = require('path');
var tileReduce = require('@mapbox/tile-reduce');
var _ = require('lodash')

const mapScript = "map/map-building-conflict.js";

var output    = "denver-buildings.geojson"

var users = {}

tileReduce({
    map: path.join(__dirname, mapScript),
    zoom: 15,
    sources: [{name: 'history', mbtiles: path.join("/home/anderstj/sotmus-analysis/cities/denboulder_historical.mbtiles"), raw: false}],
    output: fs.createWriteStream(output)
    //bbox: [-83.083364,42.338525,-83.030155,42.362908]
    //geojson: tasks.invalidated[1].geometries[1]
})
.on('reduce', function(res){
})
.on('end', function(){
  console.log("DONE")
})
