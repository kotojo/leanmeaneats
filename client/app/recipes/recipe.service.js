angular.module('leanmeaneatsApp')
.factory('Recipe', function($http) {

  var recipeFactory = {};

  recipeFactory.create = function(recipeData) {
    return $http.post('api/recipes', recipeData);
  };

  recipeFactory.show = function(id) {
    return $http.get('api/recipes/' + id);
  };

  recipeFactory.update = function(id, recipeData) {
    return $http.put('api/recipes/'+ id, recipeData);
  };

  recipeFactory.delete = function(id) {
    return $http.delete('api/recipes/' + id);
  };

  return recipeFactory;
});
