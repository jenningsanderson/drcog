'use strict';

var fs = require('fs')
var path = require('path');
var tileReduce = require('@mapbox/tile-reduce');
var _ = require('lodash')

// const mapScript = "map/map-tiger-tags.js"
const mapScript = "map/map-coverage.js";

var output    = "../data/denver-buildings.data"

var features = []

tileReduce({
    map: path.join(__dirname, mapScript),
    zoom: 12,
    sources: [{name: 'osm', mbtiles: path.join("/data/planet/latest.planet.mbtiles"), raw: false},
              {name: 'drcog', mbtiles: path.join(__dirname, "../drcog.mbtiles"), raw:false}],
    bbox: [-105.5598,39.2467,-104.2325,40.6206],
    maxWorkers: 8
})
.on('reduce', function(feat){
    features.push(feat)
})
.on('end', function(){
    var outFile = fs.createWriteStream("../docs/drcog.geojson")
    outFile.write(JSON.stringify({type:"FeatureCollection",features:features}));
})
