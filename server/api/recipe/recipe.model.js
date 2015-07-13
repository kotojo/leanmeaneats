'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RecipeSchema = new Schema({
  name: String,
  instructions: String,
  ingredients: Array
});

module.exports = mongoose.model('Recipe', RecipeSchema);
