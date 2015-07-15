'use strict';

angular.module('leanmeaneatsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('recipes', {
        url: '/recipes',
        templateUrl: 'app/recipes/recipes.html',
        controller: 'RecipesCtrl'
      })
      .state('createRecipes', {
        url: '/recipes/new',
        templateUrl: 'app/recipes/newrecipe.html',
        controller: 'RecipesCtrl'
      })
      .state('showRecipe', {
        url: '/recipes/:id',
        templateUrl: 'app/recipes/showRecipe.html',
        controller: 'RecipesShowCtrl'
      });
  });
