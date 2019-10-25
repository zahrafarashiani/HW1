
var PORT = 3000;
var fs = require('fs');
var express = require('express');
var dakhel = require('point-in-polygon');
var features = [];
var data = fs.readFileSync('sample-data.json', 'utf-8');
var gis = JSON.parse(data.toString());
gis.features.forEach(function (feature) {
  features.push(feature);

});
express()
  .use(express.json())
  .get('/gis/testpoint', (req, res) => {
    var result = { polygons : [] };
	
      var pt = [parseFloat(req.query.lat), parseFloat(req.query.long)];
      features.forEach(function (feature) {
         
          if (dakhel(pt, feature.geometry.coordinates[0]))
            result.polygons.push(feature.properties.name);
      })
      res.json(result);
  })
  .put('/gis/addpolygon', (req, res) => {
  
      features.push(req.body);
      res.sendStatus(200);
   
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`))