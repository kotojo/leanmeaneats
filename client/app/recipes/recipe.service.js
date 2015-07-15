angular.module('leanmeaneatsApp')
.factory('Recipe', function($http) {

  var recipeFactory = {};

  recipeFactory.create = function(recipeData) {
    return $http.post('api/recipes', recipeData);
  };

  recipeFactory.show = function(id) {
    return $http.get('api/recipes/' + id);
  };

  return recipeFactory;
});
