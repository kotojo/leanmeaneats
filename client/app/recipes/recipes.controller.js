'use strict';

angular.module('leanmeaneatsApp')
  .controller('RecipesCtrl', function ($scope, $http, $modal, $location, Auth, Recipe) {

    $scope.ingredients = [];

    var user = Auth.getCurrentUser();

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
        $scope.ingredients.push($scope.specFood);
      });
    };

    $scope.saveRecipe = function() {

      Recipe.create({
        name: $scope.recipeData.name,
        instructions: $scope.recipeData.instructions,
        ingredients: $scope.ingredients,
        _user: user._id
      })
      .then( function() {
        $location.path('/me')
      });

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

  })
  .controller('modalInstanceCtrl', function($scope, $modalInstance, food) {

    $scope.food = food;

    $scope.ok = function() {
      $modalInstance.close();
    }
  })
  .controller('RecipesShowCtrl', function($scope, $stateParams, Recipe) {

    Recipe.show($stateParams.id)
    .success(function(data) {
      $scope.recipe = data
    });

  })
