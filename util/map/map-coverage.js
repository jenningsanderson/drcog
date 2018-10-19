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

  tmSquares.features.forEach(function(f){
    f.properties.osm   = turf.pointsWithinPolygon(osmPoints, f).features.length
    f.properties.drcog = turf.pointsWithinPolygon(drCogPoints, f).features.length
  })

  // console.warn(JSON.stringify(tmSquares))

  // console.warn(JSON.stringify(tmSquares))

  // counts  = turf.pointsWithinPolygon(osmPoints, counts, null, 'osm')

  // tmSquares.features.forEach(function(feat){
  //   // console.warn(JSON.stringify(feat.geometry))
  //
  //   var drCogBuildings, osmBuildings
  //
  //   try{
  //     // var drCogBuildings = turfClip(drcog, feat)
  //     // var osmBuildings   = turfClip(osm, feat)
  //     feat.properties.osm = osmBuildings.features.length;
  //     feat.properties.drcog = drCogBuildings.features.length;
  //   }catch(err){
  //     console.warn("err")
  //   }
  // })

  // var squaresOfInterest = turfClip(tilePolygon, taskingManagerSquares)

  // taskingManagerSquares.features.forEach(function(feat){
  //   var intersection = turf.intersect(tilePolygon,feat)
  //   if(intersection){
  //     // console.warn(JSON.stringify(tilePolygon)+"\n"+JSON.stringify(intersection)+"\n")
  //
  //     try{
  //       var drCogBuildings = turfClip(intersection, drcog )
  //     }catch(err){
  //       console.warn("ERR on drCog",tile)
  //       var drCogBuildings = {features:[]}
  //     }
  //
  //     try{
  //       var osmBuildings   = turfClip(intersection, osm   )
  //     }catch(err){
  //       console.warn("ERR on osmBuildings",tile)
  //       var osmBuildings   = osmBuildings = {features:[]}
  //     }
  //
  //
  //     var drCogBuildingCount =  drCogBuildings.features.length
  //     var osmBuildingCount   =  osmBuildings.features.length
  //
  //     hitSquares.push({
  //       type:"Feature",
  //       properties:{
  //         drcog: drCogBuildingCount,
  //         osm:  osmBuildingCount,
  //         grid_ref: feat.properties.grid_ref
  //       },
  //       geometry: intersection.geometry
  //     })
  //
  //     //We have an intersection for this particular
  //   }
  // })
  // if (hitSquares.length){
  //   console.warn(JSON.stringify({type:"FeatureCollection",features:hitSquares}))
  // }


  //Extract the osm layer from the mbtile
  // var drcog = data.drcog.polies_4326
  // var osm   = data.osm.osm

  // var osmBuildings = osm.features.length;
  // var drCogBuildings = drcog.features.length;

  // console.warn(taskingManagerSquares.features.length)

  // var percentageComplete =  osmBuildings / drCogBuildings * 100
  // var thisTile = {
  //     type:"Feature",
  //     geometry: tilebelt.tileToGeoJSON(tile),
  //     properties: {
  //         'drcog' : drCogBuildings,
  //         'osm'   : osmBuildings,
  //         'percentComplete':Math.round(percentageComplete)
  //     }
  // }

//   writeData(JSON.stringify(thisTile)+"\n")

  done(null, tmSquares)
};
