'use strict';

angular.module('leanmeaneatsApp')
  .controller('RecipesCtrl', function ($scope, $http, $modal, $location) {

    var ingredients = [];

    $scope.search = function() {
      $http.get('/api/foods', { headers: {things:$scope.searchTerm} }).success(function(foodstuffs) {
        $scope.foodstuffs = foodstuffs;
      });
      $scope.searchTerm = '';
    };

    $scope.modalSearch = function(id) {
      $http.get('/api/foods/' + id).success(function(specFood) {
        $scope.specFood = specFood;
      }).then(function() {
        $scope.open();
      });
    }

    $scope.addFood = function(id) {
      $http.get('/api/foods/' + id).success(function(specFood) {
        $scope.specFood = specFood;
      }).then(function() {
        ingredients.push($scope.specFood);
        console.log(ingredients);
      });
    };

    $scope.saveRecipe = function(form) {

      if(form.$valid) {
        Recipe.createRecipe({
          name: $scope.recipeData.name,
          instructions: $scope.recipeData.instructions,
          ingredients: ingredients
        })
        .then( function() {
          $location.path('/')
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

    $scope.open = function() {

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'myModalContent.html',
        controller: 'modalInstanceCtrl',
        resolve: {
          food: function() {
            return $scope.specFood;
          }
        }
      });

    }

  });

angular.module('leanmeaneatsApp')
  .controller('modalInstanceCtrl', function($scope, $modalInstance, food) {

    $scope.food = food;

    $scope.ok = function() {
      $modalInstance.close();
    }
  });
