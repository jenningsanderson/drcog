var _     = require('lodash');
var turf = require("@turf/turf");
var tilebelt = require("tilebelt");

module.exports = function(data, tile, writeData, done) {

  //Extract the osm layer from the mbtile
  var drcog = data.drcog.polies_4326
  var osm   = data.osm.osm
    
  osmBuildings = 0;
  osm.features.forEach(function(feat){
      if (feat.properties.building && feat.properties.building!='no'){
          osmBuildings++
      }
  });
  
  var drCogBuildings = drcog.features.length;
    
  var percentageComplete =  osmBuildings / drCogBuildings * 100  
  var thisTile = {
      type:"Feature",
      geometry: tilebelt.tileToGeoJSON(tile),
      properties: {
          'drcog' : drCogBuildings,
          'osm'   : osmBuildings,
          'percentComplete':Math.round(percentageComplete)
      }
  }
//   writeData(JSON.stringify(thisTile)+"\n")

  done(null, thisTile)
};
