var _     = require('lodash');
var turf = require("@turf/turf");
var turfClip = require('turf-clip')
var tilebelt = require("@mapbox/tilebelt");
var fs = require("fs");

// var taskingManagerSquares = JSON.parse(fs.readFileSync("../docs/contains_buildings_grid.geojson"))

module.exports = function(data, tile, writeData, done) {

  var drcog     = data.drcog.polies_4326
  var osm       = data.osm.buildings
  // var tmSquares = data.tmSquares.contains_buildings_grid

  var drcog_buildings_in_osm = osm.features.filter(function(b){
    return (b.properties.hasOwnProperty('source') && (b.properties['source'].toLowerCase().indexOf('drcog') >= 0))
  })

  var non_drcog_buildings_in_osm = osm.features.filter(function(b){
    return (!b.properties.hasOwnProperty('source') || (b.properties['source'].toLowerCase().indexOf('drcog') < 0))
  })

  // Count buildings per day and only save if there is a change!
  var date = new Date(2018,8,1).getTime()/1000; //July 2018?
  var currentTime   = new Date().getTime()/1000;

  var thisTileStops = []

  var thisPeriod = {
    'start':date,
    'osm'  :non_drcog_buildings_in_osm.length,
    'drcog': drcog_buildings_in_osm.filter(function(b){
      return (b.properties['@timestamp'] < date)
    }).length
  }

  const STEP  = (24*60*60) //Daily step

  while(date <= currentTime){

    //get the current number of buildings for this day...
    var numBuildingsThisPeriod = drcog_buildings_in_osm.filter(function(b){
      return (b.properties['@timestamp'] < date)
    }).length

    //If this number is different than the last, then do things.
    if (numBuildingsThisPeriod != thisPeriod['drcog']){
      thisPeriod['end'] = date;
      thisTileStops.push(JSON.parse(JSON.stringify(thisPeriod))) //cheap deepcopy

      thisPeriod = {
        'start':date,
        'drcog' : numBuildingsThisPeriod,
        'osm'   : non_drcog_buildings_in_osm.length
      }
    }

    date += STEP;
  }
  //Now close it:
  thisPeriod['end'] = Math.round(currentTime+(STEP*31)) //set the end period to 30 days in the future for safety
  thisTileStops.push(JSON.parse(JSON.stringify(thisPeriod))) //cheap deepcopy

  var feats = [];

  for(var i in thisTileStops){

    var feature = {
      'type':"Feature",
      'geometry':tilebelt.tileToGeoJSON(tile)
    }

    var p = (thisTileStops[i].osm + thisTileStops[i].drcog) / drcog.features.length;
    if (p>1){ p = 1}

    feature.properties = {
      'start': thisTileStops[i].start,
      'end'  : thisTileStops[i].end,
      'osm'  : thisTileStops[i].osm,
      'done' : thisTileStops[i].drcog,
      'drcog': drcog.features.length,
      'p_c'  : p
    }

    feats.push(feature)
  }

   /*

  // Do this if needing to regenerate tiles

  // node index-coverage-historical.js | tippecanoe -f -Z14 -z16 -o denverBuildings_z14_z16.mbtiles

  drcog_buildings_in_osm.forEach(function(f){
    f.properties =
     {t: f.properties['@timestamp']
   }
   writeData(JSON.stringify(f)+"\n")
  })
  //*/

  done(null, feats)
};
