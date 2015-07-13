'use strict';

angular.module('leanmeaneatsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('recipes', {
        url: '/recipes',
        templateUrl: 'app/recipes/recipes.html',
        controller: 'RecipesCtrl'
      });
  });