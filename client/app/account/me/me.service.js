'use strict';

angular.module('leanmeaneatsApp')
.factory('Me', function($http) {

  var recipeFactory = {};

  recipeFactory.findMe = function() {
    return $http.get('api/users/me');
  };

  return recipeFactory;
});
