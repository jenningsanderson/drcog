'use strict';

var fs = require('fs')
var path = require('path');
var tileReduce = require('@mapbox/tile-reduce');
var _ = require('lodash')

const mapScript = "map-coverage.js";

var taskingManagerSquares = JSON.parse(fs.readFileSync("../docs/contains_buildings_grid.geojson"))

var squaresByRef = {}

taskingManagerSquares.features.forEach(function(f){
  squaresByRef[f.properties.grid_ref] = {
    type:"Feature",
    properties:{
      osm: 0,
      drcog: 0,
      grid_ref: f.properties.grid_ref,
      rooftop_count: f.properties.rooftop_count,
      grid_id: f.properties.grid_id,
      city: f.properties.city
    },
    geometry: f.geometry
  }
})

tileReduce({
    map: path.join(__dirname, mapScript),
    zoom: 15,
    sources: [{name: 'osm', mbtiles: path.join(__dirname, "osm_buildings.mbtiles"), raw: false},
              {name: 'drcog', mbtiles: path.join(__dirname, "../data/drcogZ15.mbtiles"), raw:false},
              {name: 'tmSquares', mbtiles: path.join(__dirname, "../data/tmSquaresZ15.mbtiles"), raw:false}],
    // bbox: [-105.5598,39.2467,-104.2325,40.6206],
    maxWorkers: 8
})
.on('reduce', function(tmSquares){
    tmSquares.features.forEach(function(square){
      squaresByRef[square.properties.grid_ref].properties.osm   += square.properties.osm
      squaresByRef[square.properties.grid_ref].properties.drcog += square.properties.drcog
    })
})
.on('end', function(){
  var newFC = {type:"FeatureCollection",features:[]}
  Object.keys(squaresByRef).forEach(function(gridRef){
    squaresByRef[gridRef].properties.drcog = squaresByRef[gridRef].properties.drcog || squaresByRef[gridRef].properties.rooftop_count
    squaresByRef[gridRef].properties.percentComplete = Math.round(squaresByRef[gridRef].properties.osm / squaresByRef[gridRef].properties.drcog * 100) || 0
    newFC.features.push(squaresByRef[gridRef])
  })
  var outFile = fs.createWriteStream("../docs/coverage.geojson")
  outFile.write(JSON.stringify(newFC,null,2));
})
