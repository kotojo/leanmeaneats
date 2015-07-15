'use strict';

angular.module('leanmeaneatsApp')
  .controller('MeCtrl', function($scope, Me) {

    Me.findMe()
      .success(function(data) {
        $scope.me = data;
      });

  });
