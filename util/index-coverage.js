'use strict';

var fs = require('fs')
var path = require('path');
var tileReduce = require('@mapbox/tile-reduce');
var _ = require('lodash')

// const mapScript = "map/map-tiger-tags.js"
const mapScript = "map/map-building-stats.js";

var output    = "../data/denver-buildings.data"

var users = {}

tileReduce({
    map: path.join(__dirname, mapScript),
    zoom: 12,
    sources: [{name: 'osm', mbtiles: path.join("/data/planet/latest.planet.mbtiles"), raw: false},
              {name: 'drcog', mbtiles: path.join(__dirname, "../drcog.mbtiles", raw:false}],
    bbox: [-105.5598,39.2467,-104.2325,40.6206]
})
.on('reduce', function(res){
})
.on('end', function(){
})
