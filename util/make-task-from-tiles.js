#!/usr/local/bin/node

var fs = require('fs')

if (process.argv.length<3){
	console.error("Need to provide an array of tiles, like: ")
	console.error('\t./make-task-from-tiles \'["60_84","61,86"]\'')
	console.error('\t./make-task-from-tiles \'60_84,61,86\'')
	process.exit(1) 
}

var tiles;

try{
	tiles = JSON.parse(process.argv[2])
}catch(e){
	try{
		tiles = process.argv[2].split(",")
	}catch(e){
		console.error("Couldn't read your tiles")
	}
}

if(tiles){
	var allTiles = JSON.parse(fs.readFileSync('../docs/drcog3.geojson'))
	var theseFiles = allTiles.features.filter(x=>tiles.indexOf(x.properties.grid_ref)>-1)
	console.log(JSON.stringify({type:"FeatureCollection","features":theseFiles}))
}