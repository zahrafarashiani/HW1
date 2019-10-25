
const fs = require('fs');
const express = require('express');
const PORT = 3000;
var inside = require('point-in-polygon');
var features = [];
var data = fs.readFileSync('input.json', 'utf-8');
var gis = JSON.parse(data.toString());
gis.features.forEach(function (feature) {
  features.push(feature);

});
express()
  .use(express.json())
  .get('/gis/testpoint', (req, res) => {
    var result = { polygons : [] };
    try {
      var point = [parseFloat(req.query.lat), parseFloat(req.query.long)];
      features.forEach(function (feature) {
        feature.geometry.coordinates.forEach(function (coordinates) {
          if (inside(point, coordinates))
            result.polygons.push(feature.properties.name);
        })
      })
      res.json(result);
    } catch (error) {
      res.sendStatus(404); //not found
    }
  })
  .put('/gis/addpolygon', (req, res) => {
    try {
      features.push(req.body);
      res.sendStatus(200); //send ok
    } catch (error) {
      res.sendStatus(403); //send forbiden

    }
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`))