var _     = require('lodash');
var turf = require("@turf/turf");
var turfClip = require('turf-clip')
var tilebelt = require("@mapbox/tilebelt");
var fs = require("fs");

var taskingManagerSquares = JSON.parse(fs.readFileSync("../docs/contains_buildings_grid.geojson"))

module.exports = function(data, tile, writeData, done) {

  var buildings = data.osm.buildings
  var tmSquares = data.tmSquares.contains_buildings_grid

  var buildingsThatShouldHaveAddresses = buildings.features.filter(function(f){
    if ( (f.properties.building != 'garage') &&
         (f.properties.building != 'shed')   &&
         (f.properties.building != 'carport') &&
         (f.properties.building != 'roof')
       ){
      return true
    }else{
      return false
    }
  });


  // Identify buildings with addresses
  var buildingsWithoutAddresses = buildingsThatShouldHaveAddresses.filter(function(f){
    if (f.properties.hasOwnProperty('addr:housenumber')){
      // writeData(JSON.stringify(f)+"\n")
      return false
    }else{
      return true
    }
  })

  var buildingsWithoutAddressesPoints = {type: "FeatureCollection", features: buildingsWithoutAddresses.map((f)=>turf.center(f))}
  var osmBuildingPoints = {type: "FeatureCollection", features: buildings.features.map((f)=>turf.center(f))}
  var buildingsThatShouldHaveAddressesPoints = {type: "FeatureCollection", features: buildingsThatShouldHaveAddresses.map((f)=>turf.center(f))}

  tmSquares.features.forEach(function(f){
    f.properties.no_addresses   = turf.pointsWithinPolygon(buildingsWithoutAddressesPoints, f).features.length || 0
    f.properties.should_have_addresses = turf.pointsWithinPolygon(buildingsThatShouldHaveAddressesPoints, f).features.length || 0
    f.properties.all_buildings_in_osm = turf.pointsWithinPolygon(osmBuildingPoints, f).features.length || 0
  })

  done(null, [tmSquares, buildings.features.length])
};
