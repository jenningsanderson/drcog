map.on('load', function () {
  map.addLayer({
        'id': 'coverage-history',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': "data/coverage-historical.geojson"
        },
        'paint':{
          'fill-opacity':['number', ['get', 'p_c']],

          'fill-color':{
            'property':'p_c',
            // 'interval':'continous',
            'stops':[
              [0,  'white'],
              [0.5,'lightgreen'],
              [1,  'darkgreen']
            ]
          }
        },
        maxzoom:14
      });

    map.addLayer({
      'id': 'denver-buildings-history',
      'type': 'fill',
      'source': {
        'type': 'vector',
        'url':'mapbox://jenningsanderson.c4ub9dzm'
      },
      "source-layer": 'denverBuildings_z14_z16',
      'paint':{
        'fill-color':'green',
        'fill-opacity':0.9
      },
      minzoom:14
    });

  map.on('click', 'coverage-history', function (e) {
      var feat = e.features[0]
      var coordinates = e.lngLat;

      new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(JSON.stringify(feat.properties))
          .addTo(map)
  });

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mouseenter', 'coverage-history', function () {
      map.getCanvas().style.cursor = 'pointer';
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'coverage-history', function () {
      map.getCanvas().style.cursor = '';
  });

  colors = ['white','lightgreen','green']
  labels = ['OSM < 50% of DrCog','OSM = 50% of DrCog','OSM >= DrCog']

  for (i = 0; i < colors.length; i++) {
    var label = labels[i];
    var color = colors[i];
    var item = document.createElement('div');
    var key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;

    var value = document.createElement('span');
    value.innerHTML = label;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
  }

  var timeline = new D3Timeline1D(function(brushEvent){
                     thisDate = Math.floor( brushEvent.getTime() / 1000 ) //Second resolution is just fine for this...
                     // updateMap()
                     console.log('updating filters', brushEvent, thisDate)

                     map.setFilter('coverage-history',['all',
                      ["<=",'start', thisDate],
                      [">=",'end', thisDate]
                     ])

                     map.setFilter('denver-buildings-history',[
                       '<=','t',thisDate
                     ])
  });

  d3.csv('data/timeline_counts.csv',function(err,data){

    // TODO: Update this timeline with drcog numbers...

    // console.log(data[0])
    if(err){
      throw err
    }else{

      parseDate = d3.utcParse("%Y-%m-%d")

      data.forEach(function(d){
        d.date = parseDate(d.date)
        d.count= Number(d['u'])
      })

      timeline.createD3Timeline({
        docID: "timeline-svg",
        data:  data
      })
    }
  });
});
