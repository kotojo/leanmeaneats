'use strict'

var rest = require('restler');

exports.search = function(req, res) {
  rest.get("http://api.nal.usda.gov/ndb/search/?format=json&q=" + req.headers.things + "&sort=n&max=25&offset=0&api_key=pjrHjhRKOYjEXIEUWKwICs3VDp4aoobD7WYLw4FJ")
  .on('complete', function(data, response) {
    if(data.list != undefined) {
      console.log(data.list.item);
      if (response.statusCode == 200) {
        return res.json(200, data.list.item);
      };
    }
    else return res.send(200);
  });
};
