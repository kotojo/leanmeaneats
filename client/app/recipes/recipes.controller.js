'use strict';

angular.module('leanmeaneatsApp')
  .controller('RecipesCtrl', function ($scope, $http, $modal, $location, Auth, Recipe) {

    $scope.type = "create";

    $scope.recipeData = {};

    $scope.ingredients = [];

    var user = Auth.getCurrentUser();

    //delete current ingredient before saving
    $scope.deleteIngredient = function(id) {
      for(var i=0; i<$scope.ingredients.length; i++){
        if($scope.ingredients[i].ndbno == id){
          $scope.ingredients.splice(i, 1);
        };
      };
    };

    //using to change nutrient values when selecting amounts
    //new assigned values are gram equivent values of the nutrient if the food was (number)(unit)
    //ex: nut=protein val=32 num=3 unit=oz There are 32 grams of protein in 3 oz of "food"
    $scope.changedValue=function(amount, serving, id) {

      if(amount != undefined && serving != undefined){
        for(var i=0; i<$scope.ingredients.length; i++) { //find the right ingredient
          if($scope.ingredients[i].ndbno == id) {
            for(var j=0; j<$scope.ingredients[i].nutrients.length; j++) { //set unit and qty
              $scope.ingredients[i].nutrients[j].unit = serving.label;
              $scope.ingredients[i].nutrients[j].qty = amount;
              for(var k=0; k<$scope.ingredients[i].nutrients[j].measures.length; k++) {
                //grab nutrient value from specific measurement and apply it to main value
                if($scope.ingredients[i].nutrients[j].measures[k].label == serving.label){
                  var value = $scope.ingredients[i].nutrients[j].measures[k].value / $scope.ingredients[i].nutrients[j].measures[k].qty;
                  $scope.ingredients[i].nutrients[j].value = value * amount;
                  console.log('changed a value');
                };
              };
            };
          };
        };
      };
    };

    $scope.search = function() {
      $http.get('/api/foods', { headers: {things:$scope.searchTerm} }).success(function(foodstuffs) {
        foodstuffs == 'OK' ? $scope.foodstuffs = [{"name": "No results"}] : $scope.foodstuffs = foodstuffs;
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

  }).controller('RecipesEditCtrl', function($scope, $http, $stateParams, $modal, $location, Auth, Recipe){

    $scope.type="edit";

    $scope.recipeData = {};

    Recipe.show($stateParams.id)
    .success(function(data) {
      $scope.recipe = data
    }).then(function(){
      $scope.ingredients = $scope.recipe.ingredients;
      console.log($scope.ingredients[0]);
    });

    $scope.search = function() {
      $http.get('/api/foods', { headers: {things:$scope.searchTerm} }).success(function(foodstuffs) {
        foodstuffs == 'OK' ? $scope.foodstuffs = [{"name": "No results"}] : $scope.foodstuffs = foodstuffs;
      });
      $scope.searchTerm = '';
    };

    $scope.addFood = function(id) {
      $http.get('/api/foods/' + id).success(function(specFood) {
        $scope.specFood = specFood;
      }).then(function() {
        $scope.ingredients.push($scope.specFood);
      });
    };

    //delete current ingredient before saving
    $scope.deleteIngredient = function(id) {
      for(var i=0; i<$scope.ingredients.length; i++){
        if($scope.ingredients[i].ndbno == id){
          $scope.ingredients.splice(i, 1);
        };
      };
    };

    //using to change nutrient values when selecting amounts
    //new assigned values are gram equivent values of the nutrient if the food was (number)(unit)
    //ex: nut=protein val=32 num=3 unit=oz There are 32 grams of protein in 3 oz of "food"
    $scope.changedValue=function(amount, serving, id) {

      if(amount != undefined && serving != undefined){
        for(var i=0; i<$scope.ingredients.length; i++) { //find the right ingredient
          if($scope.ingredients[i].ndbno == id) {
            for(var j=0; j<$scope.ingredients[i].nutrients.length; j++) { //set unit and qty
              $scope.ingredients[i].nutrients[j].unit = serving.label;
              $scope.ingredients[i].nutrients[j].qty = amount;
              for(var k=0; k<$scope.ingredients[i].nutrients[j].measures.length; k++) {
                //grab nutrient value from specific measurement and apply it to main value
                if($scope.ingredients[i].nutrients[j].measures[k].label == serving.label){
                  var value = $scope.ingredients[i].nutrients[j].measures[k].value / $scope.ingredients[i].nutrients[j].measures[k].qty;
                  $scope.ingredients[i].nutrients[j].value = value * amount;
                };
              };
            };
          };
        };
      };
    };

    $scope.modalSearch = function(id) {
      $http.get('/api/foods/' + id).success(function(specFood) {
        $scope.specFood = specFood;
      }).then(function() {
        $scope.open();
      });
    }

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

    $scope.saveRecipe = function() {
      console.log($scope.ingredients);

      Recipe.update($scope.recipe._id, {
        name: $scope.recipeData.name,
        instructions: $scope.recipeData.instructions,
        ingredients: $scope.ingredients
      })
      .then( function() {
        $location.path('/me')
      });

    };

    $scope.getCurrentServing = function(food) {
      return _.find(food.nutrients[0].measures, function(measure){
        return measure.label == food.nutrients[0].unit;
      });
    };


  })
  .controller('modalInstanceCtrl', function($scope, $modalInstance, food) {

    $scope.food = food;

    $scope.ok = function() {
      $modalInstance.close();
    }
  })
  .controller('RecipesShowCtrl', function($scope, $stateParams, $location, Recipe) {

    Recipe.show($stateParams.id)
    .success(function(data) {
      $scope.recipe = data
    });

    $scope.deleteRecipe = function(id) {
      //pass in card id as param
      Recipe.delete(id)
        .then(function() {
          //redirect back to home page
          $location.path('/me');
        });
    };

  });
