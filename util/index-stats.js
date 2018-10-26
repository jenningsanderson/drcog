'use strict';

var fs = require('fs')
var path = require('path');
var tileReduce = require('@mapbox/tile-reduce');
var _ = require('lodash')

// const mapScript = "map/map-tiger-tags.js"
// const mapScript = "map/map-building-stats.js";

// var output    = "../data/denver-buildings.data"

var dailySums = {}

tileReduce({
    map: path.join(__dirname, 'map/map-drcog-data.js'),
    zoom: 15,
    sources: [{name: 'osm', mbtiles: path.join("../stats/drcog_in_osm.mbtiles"), raw: false}],
//     output: fs.createWriteStream('../data/'+file+'-buildings.data')
    // output: fs.createWriteStream(output)
    //bbox: [-83.083364,42.338525,-83.030155,42.362908]
    //geojson: tasks.invalidated[1].geometries[1]
})
.on('reduce', function(res){
  Object.keys(res).forEach(function(term){
    //If user doesn't exist, make empty user
    if (!dailySums.hasOwnProperty(term)){
      dailySums[term] = {};
    }
    //Go through the DAYS from each user
    Object.keys(res[term]).forEach(function(kv){
      if (!dailySums[term].hasOwnProperty(kv)){
        dailySums[term][kv] = res[term][kv]
      }else{
        dailySums[term][kv] += res[term][kv];
      }
    })
  })
})
.on('end', function(){
  fs.writeFileSync('../stats/dailySums.json',JSON.stringify(dailySums,null,2))
})
