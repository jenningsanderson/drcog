var _     = require('lodash');

var users = {}

module.exports = function(data, tile, writeData, done) {

  //Extract the osm layer from the mbtile
  var layer = data.osm.osm;

  var users ={}

  //A new approach: group features on tiles by users:
  // var gbUsers = _.groupBy(layer.features, function(f){return f.properties['@user']})
  //
  // //Iterate through the data teams and see what users exist?
  // Object.keys(global.mapOptions).forEach(function(team){
  //   //Iterate through actual team members.
  //   Object.keys(global.mapOptions[team]).forEach(function(user){
  //     if (gbUsers.hasOwnProperty(user)){
  //       var feats = JSON.parse(JSON.stringify(gbUsers[user])) //a cheep deepcopy :)
  //
  //       if (global.mapOptions[team][user].hasOwnProperty('f')){
  //         feats = feats.filter(function(f){
  //           return f.properties['@timestamp'] > global.mapOptions[team][user].f
  //         })
  //       }
  //       if (global.mapOptions[team][user].hasOwnProperty('t')){
  //         feats = feats.filter(function(f){
  //           return f.properties['@timestamp'] > global.mapOptions[team][user].f
  //         })
  //       }
  //
  //       if (feats.length){
  //         if (dataTeams.hasOwnProperty(team) ){
  //           dataTeams[team] = dataTeams[team].concat(feats);
  //         }else{
  //           dataTeams[team] = feats
  //         }
  //       }
  //     }
  //   })
  // })

  layer.features.forEach(function(feat){

    var u = feat.properties['@user'];
    var h = Math.floor(feat.properties['@timestamp'] / 3600);

    if ( !users.hasOwnProperty(u) ){
      users[u] = {};
    }
    if ( !users[u].hasOwnProperty(h) ){
      users[u][h] = 0;
    }

    users[u][h]++;

    writeData(JSON.stringify({
      type:"Feature",
      properties:{
        'user':u,
        'hour':h,
        'validSince':feat.properties['@timestamp'],
        'height':feat.properties.height
      },
      geometry: feat.geometry
    })+"\n")

  })
  done(null, users)
};
