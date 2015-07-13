'use strict';

var _ = require('lodash');
var Recipe = require('./recipe.model');

// Get list of recipes
exports.index = function(req, res) {
  Recipe.find(function (err, recipes) {
    if(err) { return handleError(res, err); }
    return res.json(200, recipes);
  });
};

// Get a single recipe
exports.show = function(req, res) {
  Recipe.findById(req.params.id, function (err, recipe) {
    if(err) { return handleError(res, err); }
    if(!recipe) { return res.send(404); }
    return res.json(recipe);
  });
};

// Creates a new recipe in the DB.
exports.create = function(req, res) {
  Recipe.create(req.body, function(err, recipe) {
    if(err) { return handleError(res, err); }
    return res.json(201, recipe);
  });
};

// Updates an existing recipe in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Recipe.findById(req.params.id, function (err, recipe) {
    if (err) { return handleError(res, err); }
    if(!recipe) { return res.send(404); }
    var updated = _.merge(recipe, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, recipe);
    });
  });
};

// Deletes a recipe from the DB.
exports.destroy = function(req, res) {
  Recipe.findById(req.params.id, function (err, recipe) {
    if(err) { return handleError(res, err); }
    if(!recipe) { return res.send(404); }
    recipe.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}