angular.module('leanmeaneatsApp')
.factory('Recipe', function($http) {

  var recipeFactory = {};

  recipeFactory.create = function(recipeData) {
    return $http.post('api/recipes', recipeData);
  };

  return recipeFactory;
});
