'use strict';

var fs = require('fs')
var path = require('path');
var tileReduce = require('@mapbox/tile-reduce');
var _ = require('lodash')

const mapScript = "map/map-coverage.js";

var features = []

tileReduce({
    map: path.join(__dirname, mapScript),
    zoom: 15,
    sources: [{name: 'osm', mbtiles: path.join("../osmZ15.mbtiles"), raw: false},
              {name: 'drcog', mbtiles: path.join(__dirname, "../drcogZ15.mbtiles"), raw:false}],
    bbox: [-105.5598,39.2467,-104.2325,40.6206],
    maxWorkers: 8
})
.on('reduce', function(feat){
    features.push(feat)
})
.on('end', function(){
    var outFile = fs.createWriteStream("../docs/drcog2.geojson")
    outFile.write(JSON.stringify({type:"FeatureCollection",features:features}));
})
