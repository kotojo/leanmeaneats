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
        templateUrl: 'app/recipes/singlerecipe.html',
        controller: 'RecipesCtrl'
      })
      .state('editRecipes', {
        url: '/recipes/edit/:id',
        templateUrl: 'app/recipes/singleRecipe.html',
        controller: 'RecipesEditCtrl'
      })
      .state('showRecipe', {
        url: '/recipes/:id',
        templateUrl: 'app/recipes/showRecipe.html',
        controller: 'RecipesShowCtrl'
      });
  });
