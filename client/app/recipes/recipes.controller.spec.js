'use strict';

describe('Controller: RecipesCtrl', function () {

  // load the controller's module
  beforeEach(module('leanmeaneatsApp'));

  var RecipesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecipesCtrl = $controller('RecipesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
