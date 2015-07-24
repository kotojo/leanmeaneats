'use strict';

angular.module('leanmeaneatsApp')
  .controller('RecipesCtrl', function ($scope, $http, $modal, $location, Auth, Recipe) {

    $scope.type = 'create';

    $scope.recipeData = {};

    $scope.ingredients = [];

    var user = Auth.getCurrentUser();

    //delete current ingredient before saving
    $scope.deleteIngredient = function(id) {
      for(var i=0; i<$scope.ingredients.length; i++){
        if($scope.ingredients[i].ndbno === id){
          $scope.ingredients.splice(i, 1);
        }
      }
    };

    //using to change nutrient values when selecting amounts
    //new assigned values are gram equivent values of the nutrient if the food was (number)(unit)
    //ex: nut=protein val=32 num=3 unit=oz There are 32 grams of protein in 3 oz of "food"
    $scope.changedValue=function(amount, serving, id) {

      if(amount !== undefined && serving !== undefined){
        for(var i=0; i<$scope.ingredients.length; i++) { //find the right ingredient
          if($scope.ingredients[i].ndbno === id) {
            for(var j=0; j<$scope.ingredients[i].nutrients.length; j++) { //set unit and qty
              $scope.ingredients[i].nutrients[j].unit = serving.label;
              $scope.ingredients[i].nutrients[j].qty = amount;
              for(var k=0; k<$scope.ingredients[i].nutrients[j].measures.length; k++) {
                //grab nutrient value from specific measurement and apply it to main value
                if($scope.ingredients[i].nutrients[j].measures[k].label === serving.label){
                  var value = $scope.ingredients[i].nutrients[j].measures[k].value / $scope.ingredients[i].nutrients[j].measures[k].qty;
                  $scope.ingredients[i].nutrients[j].value = value * amount;
                  console.log('changed a value');
                }
              }
            }
          }
        }
      }
    };

    $scope.search = function() {
      $http.get('/api/foods', { headers: {things:$scope.searchTerm} }).success(function(foodstuffs) {
        //foodstuffs === 'OK' ? $scope.foodstuffs = [{'name': 'No results'}] : $scope.foodstuffs = foodstuffs;
        $scope.foodstuffs = foodstuffs === 'OK' ? [{'name': 'No results'}] : foodstuffs;
      });
      $scope.searchTerm = '';
    };

    $scope.modalSearch = function(id) {
      $http.get('/api/foods/' + id).success(function(specFood) {
        $scope.specFood = specFood;
      }).then(function() {
        $scope.open();
      });
    };

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
        $location.path('/me');
      });

    };

    $scope.open = function() {

      $modal.open({
        animation: true,
        templateUrl: 'myModalContent.html',
        controller: 'modalInstanceCtrl',
        resolve: {
          food: function() {
            return $scope.specFood;
          }
        }
      });
    };

  }).controller('RecipesEditCtrl', function($scope, $http, $stateParams, $modal, $location, Auth, Recipe){

    $scope.type='edit';

    $scope.recipeData = {};

    Recipe.show($stateParams.id)
    .success(function(data) {
      $scope.recipe = data;
    }).then(function(){
      $scope.ingredients = $scope.recipe.ingredients;
      console.log($scope.ingredients[0]);
    });

    $scope.search = function() {
      $http.get('/api/foods', { headers: {things:$scope.searchTerm} }).success(function(foodstuffs) {
        // foodstuffs === 'OK' ? $scope.foodstuffs = [{'name': 'No results'}] : $scope.foodstuffs = foodstuffs ;
        $scope.foodstuffs = foodstuffs === 'OK' ? [{'name': 'No results'}] : foodstuffs;
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
        if($scope.ingredients[i].ndbno === id){
          $scope.ingredients.splice(i, 1);
        }
      }
    };

    //using to change nutrient values when selecting amounts
    //new assigned values are gram equivent values of the nutrient if the food was (number)(unit)
    //ex: nut=protein val=32 num=3 unit=oz There are 32 grams of protein in 3 oz of "food"
    $scope.changedValue=function(amount, serving, id) {

      if(amount !== undefined && serving !== undefined){
        for(var i=0; i<$scope.ingredients.length; i++) { //find the right ingredient
          if($scope.ingredients[i].ndbno === id) {
            for(var j=0; j<$scope.ingredients[i].nutrients.length; j++) { //set unit and qty
              $scope.ingredients[i].nutrients[j].unit = serving.label;
              $scope.ingredients[i].nutrients[j].qty = amount;
              for(var k=0; k<$scope.ingredients[i].nutrients[j].measures.length; k++) {
                //grab nutrient value from specific measurement and apply it to main value
                if($scope.ingredients[i].nutrients[j].measures[k].label === serving.label){
                  var value = $scope.ingredients[i].nutrients[j].measures[k].value / $scope.ingredients[i].nutrients[j].measures[k].qty;
                  $scope.ingredients[i].nutrients[j].value = value * amount;
                }
              }
            }
          }
        }
      }
    };

    $scope.modalSearch = function(id) {
      $http.get('/api/foods/' + id).success(function(specFood) {
        $scope.specFood = specFood;
      }).then(function() {
        $scope.open();
      });
    };

    $scope.open = function() {

      $modal.open({
        animation: true,
        templateUrl: 'myModalContent.html',
        controller: 'modalInstanceCtrl',
        resolve: {
          food: function() {
            return $scope.specFood;
          }
        }
      });
    };

    $scope.saveRecipe = function() {
      console.log($scope.ingredients);

      Recipe.update($scope.recipe._id, {
        name: $scope.recipeData.name,
        instructions: $scope.recipeData.instructions,
        ingredients: $scope.ingredients
      })
      .then( function() {
        $location.path('/me');
      });

    };

    $scope.getCurrentServing = function(food) {
      return _.find(food.nutrients[0].measures, function(measure){
        return measure.label === food.nutrients[0].unit;
      });
    };


  })
  .controller('modalInstanceCtrl', function($scope, $modalInstance, food) {

    $scope.food = food;

    $scope.ok = function() {
      $modalInstance.close();
    };
  })
  .controller('RecipesShowCtrl', function($scope, $stateParams, $location, Recipe) {

    var radarOptions = {

      //Boolean - If we show the scale above the chart data
      scaleOverlay : false,

      //Boolean - If we want to override with a hard coded scale
      scaleOverride : true,

      //** Required if scaleOverride is true **
      //Number - The number of steps in a hard coded scale
      scaleSteps : 5,
      //Number - The value jump in the hard coded scale
      scaleStepWidth : 0.5,
      //Number - The centre starting value
      scaleStartValue : 0,

      //Boolean - Whether to show lines for each scale point
      scaleShowLine : true,

      //String - Colour of the scale line
      scaleLineColor : '#999',

      //Number - Pixel width of the scale line
      scaleLineWidth : 1,

      //Boolean - Whether to show labels on the scale
      scaleShowLabels : true,

      //Interpolated JS string - can access value
      scaleLabel : '<%=Number(value)*100 + \'%\'%>',

      //String - Scale label font declaration for the scale label
      scaleFontFamily : '\'Arial\'',

      //Number - Scale label font size in pixels
      scaleFontSize : 12,

      //String - Scale label font weight style
      scaleFontStyle : 'normal',

      //String - Scale label font colour
      scaleFontColor : '#666',

      //Boolean - Show a backdrop to the scale label
      scaleShowLabelBackdrop : true,

      //String - The colour of the label backdrop
      scaleBackdropColor : 'rgba(255,255,255,0.75)',

      //Number - The backdrop padding above & below the label in pixels
      scaleBackdropPaddingY : 2,

      //Number - The backdrop padding to the side of the label in pixels
      scaleBackdropPaddingX : 2,

      //Boolean - Whether we show the angle lines out of the radar
      angleShowLineOut : true,

      //String - Colour of the angle line
      angleLineColor : 'rgba(255,255,255,0.3)',

      //Number - Pixel width of the angle line
      angleLineWidth : 1,

      //String - Point label font declaration
      pointLabelFontFamily : '\'Arial\'',

      //String - Point label font weight
      pointLabelFontStyle : 'normal',

      //Number - Point label font size in pixels
      pointLabelFontSize : 12,

      //String - Point label font colour
      pointLabelFontColor : '#000000',

      //Boolean - Whether to show a dot for each point
      pointDot : true,

      //Number - Radius of each point dot in pixels
      pointDotRadius : 2,

      //Number - Pixel width of point dot stroke
      pointDotStrokeWidth : 1,

      //Boolean - Whether to show a stroke for datasets
      datasetStroke : true,

      //Number - Pixel width of dataset stroke
      datasetStrokeWidth : 1,

      //Boolean - Whether to fill the dataset with a colour
      datasetFill : true,

      //Boolean - Whether to animate the chart
      animation : true,

      //Number - Number of animation steps
      animationSteps : 60,

      //String - Animation easing effect
      animationEasing : 'easeOutQuart',

      //Function - Fires when the animation is complete
      onAnimationComplete : null

    };

    var nutrientArr = ['Total lipid (fat)', 'Fatty acids, total saturated', 'Cholesterol', 'Sodium, Na', 'Fiber, total dietary', 'Sugars, total', 'Protein', 'Vitamin A, IU', 'Vitamin B-6', 'Vitamin B-12', 'Vitamin C, total ascorbic acid', 'Vitamin D', 'Calcium, Ca', 'Iron, Fe','Potassium, K'];

    $scope.a = {};

    Recipe.show($stateParams.id)
    .success(function(data) {
      $scope.recipe = data;
    })
    .then(function() { //nutrient array has values that are equal to exact spelling of ingredient nutrient keys, use them to iterate over nutrients, grab the values, and added them to new key value that i can put into radarData.
      _.forEach(nutrientArr, function(nutrient){
        _.forEach($scope.recipe.ingredients, function(food){
          var name = nutrient.replace(/[^a-z0-9.]+/ig, '');
           if ($scope.a[name] === undefined){
              $scope.a[name] = _.pluck(_.filter(food.nutrients, {'name': nutrient}), 'value')[0];
           }
           else {
            $scope.a[name] += _.pluck(_.filter(food.nutrients, {'name': nutrient}), 'value')[0];
           }
        });
      });
    })
    .then(function(){

      // Radar Data
      var radarData = {
        labels : ['Total Fat','Saturated Fat','Cholesterol','Sodium','Fiber','Sugar','Protein','Vitamin A','Vitamin B6','Vitamin B12', 'Vitamin C','Vitamin D','Calcium','Iron','Potassium'],
        datasets : [
          {
            fillColor : 'rgba(0,0,220,0.5)',
            strokeColor : 'rgba(0,0,220,1)',
            data : [($scope.a['Totallipidfat']/65),($scope.a['Fattyacidstotalsaturated']/20),($scope.a['Cholesterol']/300),($scope.a['SodiumNa']/4200),($scope.a['Fibertotaldietary']/25),($scope.a['Sugarstotal']/50),($scope.a['Protein']/50),($scope.a['VitaminAIU']/5000),($scope.a['VitaminB6']/2),($scope.a['VitaminB12']/6),($scope.a['VitaminCtotalascorbicacid']/60),($scope.a['VitaminD']/400),($scope.a['CalciumCa']/1000),($scope.a['IronFe']/180), ($scope.a['PotassiumK']/3500)]
          }
        ]
      };

      //Get the context of the Radar Chart canvas element we want to select
      var ctx = document.getElementById('radarChart').getContext('2d');

      // Create the Radar Chart
      $scope.myRadarChart = new Chart(ctx).Radar(radarData, radarOptions);

    });

    $scope.resize = function(amt){
      if ($scope.myRadarChart.options.scaleStepWidth + amt <= 0){
        return;
      }
      $scope.myRadarChart.options.scaleStepWidth += amt;
      $scope.myRadarChart.update();
    };

    $scope.deleteRecipe = function(id) {
      //pass in recipe id as param
      Recipe.delete(id)
        .then(function() {
          //redirect back to home page
          $location.path('/me');
        });
    };

  })
  .controller('RecipesAllCtrl', function($scope){


    $scope.resize = function(amt){

      if ($scope.chart.options.scaleStepWidth + amt <= 0){
        return;
      }
      $scope.chart.options.scaleStepWidth = $scope.chart.options.scaleStepWidth + amt;
      $scope.chart.update();
    };

    $scope.data = {
      labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
      datasets: [
        {
          label: 'My First dataset',
          fillColor: 'rgba(220,220,220,0.2)',
          strokeColor: 'rgba(220,220,220,1)',
          pointColor: 'rgba(220,220,220,1)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(220,220,220,1)',
          data: [65, 59, 90, 81, 56, 55, 40]
        },
        {
          label: 'My Second dataset',
          fillColor: 'rgba(151,187,205,0.2)',
          strokeColor: 'rgba(151,187,205,1)',
          pointColor: 'rgba(151,187,205,1)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(151,187,205,1)',
          data: [28, 48, 40, 19, 96, 27, 100]
        }
      ]
    };

    // Chart.js Options
    $scope.options =  {

      //Boolean - If we want to override with a hard coded scale
      scaleOverride : true,

      //** Required if scaleOverride is true **
      //Number - The number of steps in a hard coded scale
      scaleSteps : 5,
      //Number - The value jump in the hard coded scale
      scaleStepWidth : 20,
      //Number - The centre starting value
      scaleStartValue : 0,

      // Sets the chart to be responsive
      responsive: true,

      //Boolean - Whether to show lines for each scale point
      scaleShowLine : true,

      //Boolean - Whether we show the angle lines out of the radar
      angleShowLineOut : true,

      //Boolean - Whether to show labels on the scale
      scaleShowLabels : true,

      //String - Colour of the angle line
      angleLineColor : 'rgba(0,0,0,.1)',

      //Number - Pixel width of the angle line
      angleLineWidth : 1,

      //String - Point label font declaration
      pointLabelFontFamily : '"Arial"',

      //String - Point label font weight
      pointLabelFontStyle : 'normal',

      //Number - Point label font size in pixels
      pointLabelFontSize : 10,

      //String - Point label font colour
      pointLabelFontColor : '#666',

      //Boolean - Whether to show a dot for each point
      pointDot : true,

      //Number - Radius of each point dot in pixels
      pointDotRadius : 3,

      //Number - Pixel width of point dot stroke
      pointDotStrokeWidth : 1,

      //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
      pointHitDetectionRadius : 20,

      //Boolean - Whether to show a stroke for datasets
      datasetStroke : true,

      //Number - Pixel width of dataset stroke
      datasetStrokeWidth : 2,

      //Boolean - Whether to fill the dataset with a colour
      datasetFill : true,

      //String - A legend template
      legendTemplate : '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
    };

  });
