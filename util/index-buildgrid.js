'use strict';

var fs = require('fs')
var path = require('path');
var tileReduce = require('@mapbox/tile-reduce');
var _ = require('lodash')

// const mapScript = "map/map-tiger-tags.js"
const mapScript = "map/map-buildingCounts.js";

var output    = "../official-z15-grid.geojson"

var quads = []

tileReduce({
    map: path.join(__dirname, mapScript),
    zoom: 15,
    sources: [{name: 'drcog', mbtiles: path.join(__dirname, "../drcogZ15.mbtiles"), raw:false}],
    
    // output: fs.createWriteStream(output)
})
.on('reduce', function(res){
    quads.push(res)
    // Object.keys(res[0]).forEach(function(key){
    //     if ( users.hasOwnProperty(key) ){
    //         users[key] += res[0][key]
    //     }else{
    //         users[key] = res[0][key]
    //     }
    // })
})
.on('end', function(){
    fs.writeFileSync(output, JSON.stringify({"type":"FeatureCollection","features":quads}))
    // var userStream = fs.createWriteStream('../data/denver-users.edgelist');
    // Object.keys(users).forEach(function(key){
    //     userStream.write(`${key},${users[key]}\n`);
    // })
    console.warn("DONE")
})
