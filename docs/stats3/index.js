// Super simple tile server

// Based off the example at: https://gis.stackexchange.com/questions/125037/self-hosting-mapbox-vector-tiles

var express = require('express');
var http = require('http');
var app = express();
var path = require('path');
var tilelive = require('@mapbox/tilelive');
require('@mapbox/mbtiles').registerProtocols(tilelive);

//Get mbtiles file: 
if (process.argv.length < 3){
    console.error("Usage: node index.js <MBTILES FILE>")
    process.exit(1)
}

var tilesFile = path.resolve(process.argv[2])

console.warn("Loading mbtiles File: "+tilesFile)

tilelive.load('mbtiles:///' + tilesFile, function(err, source) {

    if (err) {
        throw err;
    }
    app.set('port', 7777);

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.get(/^\/v2\/tiles\/(\d+)\/(\d+)\/(\d+).pbf$/, function(req, res){

        var z = req.params[0];
        var x = req.params[1];
        var y = req.params[2];

        console.log('get tile %d, %d, %d', z, x, y);

        source.getTile(z, x, y, function(err, tile, headers) {
            if (err) {
                res.status(404)
                res.send(err.message);
                console.log(err.message);
            } else {
              res.set(headers);
              res.send(tile);
            }
        });
    });

    http.createServer(app).listen(app.get('port'),'0.0.0.0', function() {
        console.log('Express server listening 0.0.0.0:' + app.get('port'));
    });
});
