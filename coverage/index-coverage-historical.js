'use strict';

var tileReduce = require('@mapbox/tile-reduce');
var fs = require('fs')
var path = require('path');
var _ = require('lodash')

const mapScript = "map-coverage-historical.js";

// var taskingManagerSquares = JSON.parse(fs.readFileSync("../docs/contains_buildings_grid.geojson"))

// var squaresByRef = {}

// taskingManagerSquares.features.forEach(function(f){
//   squaresByRef[f.properties.grid_ref] = {
//     type:"Feature",
//     properties:{
//       osm: 0,
//       drcog: 0,
//       grid_ref: f.properties.grid_ref,
//       rooftop_count: f.properties.rooftop_count,
//       grid_id: f.properties.grid_id,
//       city: f.properties.city
//     },
//     geometry: f.geometry
//   }
// })

var features = []

var timelineCounts = {}

tileReduce({
    map: path.join(__dirname, mapScript),
    zoom: 15,
    sources: [{name: 'osm', mbtiles: path.join(__dirname, "osm_buildings.mbtiles"), raw: false},
              {name: 'drcog', mbtiles: path.join(__dirname, "../data/drcogZ15.mbtiles"), raw:false}],
              // {name: 'tmSquares', mbtiles: path.join(__dirname, "../data/tmSquaresZ15.mbtiles"), raw:false}],
    bbox: [-105.5598,39.2467,-104.2325,40.6206],
    maxWorkers: 8
})
.on('reduce', function(res){

  res.forEach(function(r){

    if (timelineCounts.hasOwnProperty(r.properties['end'])){
      timelineCounts[r.properties['end']] ++
    }else{
      timelineCounts[r.properties['end']] = 1
    }

    features.push(r)
  });
})
.on('end', function(){

  var csvOut = fs.createWriteStream('../docs/data/timeline_counts.csv')
  csvOut.write("date,u\n")

  _.sortBy(Object.keys(timelineCounts)).forEach(function(d){
    var date = new Date(Number(d)*1000)
    if (date < new Date()){
      csvOut.write(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()},${timelineCounts[d]}\n`);
    }
  })

  // console.warn(timelineCounts)

  // var newFC = {type:"FeatureCollection",features:[]}
  // Object.keys(squaresByRef).forEach(function(gridRef){
  //   squaresByRef[gridRef].properties.drcog = squaresByRef[gridRef].properties.drcog || squaresByRef[gridRef].properties.rooftop_count
  //   squaresByRef[gridRef].properties.percentComplete = Math.round(squaresByRef[gridRef].properties.osm / squaresByRef[gridRef].properties.drcog * 100) || 0
  //   newFC.features.push(squaresByRef[gridRef])
  // })
  var outFile = fs.createWriteStream("../docs/data/coverage-historical.geojson")
  outFile.write(JSON.stringify({'type':"FeatureCollection",'features':features},null,2));
})
