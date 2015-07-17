'use strict'

var rest = require('restler');

exports.search = function(req, res) {
  rest.get("http://api.nal.usda.gov/ndb/search/?format=json&q=" + req.headers.things + "&sort=n&max=25&offset=0&api_key=pjrHjhRKOYjEXIEUWKwICs3VDp4aoobD7WYLw4FJ")
  .on('complete', function(data, response) {
    if(data.list !== undefined) {
      if (response.statusCode === 200) {
        return res.json(200, data.list.item);
      }
    }
    else return res.send(200);
  });
};

exports.show = function(req, res) {
  console.log(req);
  var id = req.url.slice(1);
  rest.get("http://api.nal.usda.gov/ndb/reports/?ndbno=" + id + "&type=f&format=json&api_key=pjrHjhRKOYjEXIEUWKwICs3VDp4aoobD7WYLw4FJ  ")
  .on('complete', function(data, response) {
      if (response.statusCode === 200) {
        console.log(data.report.food);
        return res.json(200, data.report.food);
      }
    });
};
