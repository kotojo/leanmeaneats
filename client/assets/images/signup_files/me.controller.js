'use strict';

angular.module('leanmeaneatsApp')
  .controller('MeCtrl', function($scope, Me) {

    Me.findMe()
      .success(function(data) {
        $scope.me = data;
      });

    $scope.searchText = '';

    var currentRecipes = [];

    $scope.curNutrients = {};

    var nutrientArr = ['Total lipid (fat)', 'Fatty acids, total saturated', 'Cholesterol', 'Sodium, Na', 'Fiber, total dietary', 'Sugars, total', 'Protein', 'Vitamin A, IU', 'Vitamin B-6', 'Vitamin B-12', 'Vitamin C, total ascorbic acid', 'Vitamin D', 'Calcium, Ca', 'Iron, Fe','Potassium, K'];

    $scope.changeRecipe = function(recipe, value){
      if (value === true) {
        currentRecipes.push(recipe);
        $scope.curNutrients = {};
      }
      else {
        _.remove(currentRecipes, function(thisRecipe){
          return thisRecipe === _.find(currentRecipes, { '_id': recipe._id });
        });
        $scope.curNutrients = {};
      }
      $scope.graphValues();

      if($scope.curNutrients['Total lipid (fat)'] === undefined){
        _.forEach($scope.chart.datasets[0].points, function(point) {
          point.value = 0;
        });
      }
      else {
        $scope.chart.datasets[0].points[0].value = $scope.curNutrients['Total lipid (fat)']/65;
        $scope.chart.datasets[0].points[1].value = $scope.curNutrients['Fatty acids, total saturated']/20;
        $scope.chart.datasets[0].points[2].value = $scope.curNutrients['Cholesterol']/300;
        $scope.chart.datasets[0].points[3].value = $scope.curNutrients['Sodium, Na']/4200;
        $scope.chart.datasets[0].points[4].value = $scope.curNutrients['Fiber, total dietary']/25;
        $scope.chart.datasets[0].points[5].value = $scope.curNutrients['Sugars, total']/50;
        $scope.chart.datasets[0].points[6].value = $scope.curNutrients['Protein']/50;
        $scope.chart.datasets[0].points[7].value = $scope.curNutrients['Vitamin A, IU']/5000;
        $scope.chart.datasets[0].points[8].value = $scope.curNutrients['Vitamin B-6']/2;
        $scope.chart.datasets[0].points[9].value = $scope.curNutrients['Vitamin B-12']/6;
        $scope.chart.datasets[0].points[10].value = $scope.curNutrients['Vitamin C, total ascorbic acid']/60;
        $scope.chart.datasets[0].points[11].value = $scope.curNutrients['Vitamin D']/400;
        $scope.chart.datasets[0].points[12].value = $scope.curNutrients['Calcium, Ca']/1000;
        $scope.chart.datasets[0].points[13].value = $scope.curNutrients['Iron, Fe']/180;
        $scope.chart.datasets[0].points[14].value = $scope.curNutrients['Potassium, K']/3500;
      }
      $scope.chart.update();
    };

    $scope.graphValues = function(){
      _.forEach(currentRecipes, function(recipe){
        _.forEach(recipe.ingredients, function(food){
          _.forEach(nutrientArr, function(nutrient){
            if ($scope.curNutrients[nutrient] === undefined){
              $scope.curNutrients[nutrient] = _.pluck(_.filter(food.nutrients, {'name' : nutrient}), 'value')[0];
            }
            else {
              $scope.curNutrients[nutrient] += _.pluck(_.filter(food.nutrients, {'name' : nutrient}), 'value')[0];
            }
          });
        });
      });
      console.log($scope.curNutrients);
    };

    $scope.data = {
      labels: ['Total Fat','Saturated Fat','Cholesterol','Sodium','Fiber','Sugar','Protein','Vitamin A','Vitamin B6','Vitamin B12', 'Vitamin C','Vitamin D','Calcium','Iron','Potassium'],
      datasets: [
        {
          label: 'My daily meals',
          fillColor: 'rgba(0,0,220,0.5)',
          strokeColor: 'rgba(0,0,220,1)',
          data: [$scope.curNutrients['Total lipid (fat)']/65, $scope.curNutrients['Fatty acids, total saturated']/20, $scope.curNutrients['Cholesterol']/300, $scope.curNutrients['Sodium, Na']/4200, $scope.curNutrients['Fiber, total dietary']/25, $scope.curNutrients['Sugars, total']/50, $scope.curNutrients['Protein']/50, $scope.curNutrients['Vitamin A, IU']/5000, $scope.curNutrients['Vitamin B-6']/2, $scope.curNutrients['Vitamin B-12']/6, $scope.curNutrients['Vitamin C, total ascorbic acid']/60, $scope.curNutrients['Vitamin D']/400, $scope.curNutrients['Calcium, Ca']/1000, $scope.curNutrients['Iron, Fe']/180, $scope.curNutrients['Potassium, K']/3500]
        }
      ]
    };

    $scope.resize = function(amt){

      if ($scope.chart.options.scaleStepWidth + amt <= 0){
        return;
      }
      $scope.chart.options.scaleStepWidth = $scope.chart.options.scaleStepWidth + amt;
      $scope.chart.update();
    };

    // Chart.js Options
    $scope.options =  {

      //Boolean - If we want to override with a hard coded scale
      scaleOverride : true,

      //** Required if scaleOverride is true **
      //Number - The number of steps in a hard coded scale
      scaleSteps : 5,
      //Number - The value jump in the hard coded scale
      scaleStepWidth : 0.2,
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

      //Interpolated JS string - can access value
      scaleLabel : '<%=Number(value).toFixed(2)*100 + \'%\'%>',

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
