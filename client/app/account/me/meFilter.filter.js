'use strict';

angular.module('leanmeaneatsApp')
.filter('meFilter', function () {
  function isMatch(str, pattern) {
    return str.toLowerCase().indexOf(pattern.toLowerCase()) !== -1;
  }

  return function(recipes, searchText) {
    var items = {
        searchText: searchText,
        out: []
    };
    angular.forEach(recipes, function (recipe) {
      if (isMatch(recipe.name   , this.searchText) ||
          isMatch(recipe.instructions , this.searchText) ) {
        this.out.push(recipe);
      }
    }, items);
    return items.out;
  };
});
