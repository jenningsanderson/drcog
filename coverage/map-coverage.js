var _     = require('lodash');
var turf = require("@turf/turf");
var turfClip = require('turf-clip')
var tilebelt = require("tilebelt");
var fs = require("fs");

// var taskingManagerSquares = JSON.parse(fs.readFileSync("../docs/contains_buildings_grid.geojson"))

module.exports = function(data, tile, writeData, done) {

  var drcog     = data.drcog.polies_4326
  var osm       = data.osm.osm
  var tmSquares = data.tmSquares.contains_buildings_grid

  //Get the center of the objects for counting points in polygons...

  var osmPoints = {type: "FeatureCollection", features: osm.features.map((f)=>turf.center(f))}
  var drCogPoints = {type: "FeatureCollection", features: drcog.features.map((f)=>turf.center(f))}

  // console.warn(osmPoints.features.length, drCogPoints.features.length)

  tmSquares.features.forEach(function(f){
    f.properties.osm   = turf.pointsWithinPolygon(osmPoints, f).features.length
    f.properties.drcog = turf.pointsWithinPolygon(drCogPoints, f).features.length
  })

  done(null, tmSquares)
};
