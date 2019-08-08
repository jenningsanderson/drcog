'use strict';

var tileReduce = require('@mapbox/tile-reduce');
var fs = require('fs')
var path = require('path');
var _ = require('lodash')

const mapScript = "map-addresses.js";

var taskingManagerSquares = JSON.parse(fs.readFileSync("../docs/contains_buildings_grid.geojson"))

var squaresByRef = {}

var total = 0;

taskingManagerSquares.features.forEach(function(f){
  squaresByRef[f.properties.grid_ref] = {
    type:"Feature",
    properties:{
      buildings_in_osm: 0,
      no_addresses: 0,
      grid_ref: f.properties.grid_ref,
      grid_id: f.properties.grid_id,
      city: f.properties.city
    },
    geometry: f.geometry
  }
})

tileReduce({
    map: path.join(__dirname, mapScript),
    zoom: 15,
    sources: [{name: 'osm', mbtiles: path.join(__dirname, "../coverage/osm_buildings.mbtiles"), raw: false},
              // {name: 'drcog', mbtiles: path.join(__dirname, "../data/drcogZ15.mbtiles"), raw:false},
              {name: 'tmSquares', mbtiles: path.join(__dirname, "../data/tmSquaresZ15.mbtiles"), raw:false}],
    // bbox: [-105.5598,39.2467,-104.2325,40.6206],
    maxWorkers: 8
})
.on('reduce', function(res){
    res[0].features.forEach(function(square){
      squaresByRef[square.properties.grid_ref].properties.buildings_in_osm  += square.properties.buildings_in_osm
      squaresByRef[square.properties.grid_ref].properties.no_addresses      += square.properties.no_addresses

      // console.warn(square.properties)
    })
    total+=res[1]
})
.on('end', function(){
  var newFC = {type:"FeatureCollection",features:[]}
  Object.keys(squaresByRef).forEach(function(gridRef){
    squaresByRef[gridRef].properties.percentage = Math.round(squaresByRef[gridRef].properties.no_addresses / squaresByRef[gridRef].properties.buildings_in_osm * 100)
    newFC.features.push(squaresByRef[gridRef])
  })
  var outFile = fs.createWriteStream("../docs/no_addresses.geojson")
  outFile.write(JSON.stringify(newFC,null,2));
  console.warn(`Found ${total} buildings`)
})
