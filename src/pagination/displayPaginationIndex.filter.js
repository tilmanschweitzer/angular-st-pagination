angular.module('stPagination').filter('displayPaginationIndex', function () {
  'use strict';

  return function (index) {
    if (angular.isNumber(index)) {
      return index + 1;
    } else if (angular.isArray(index)) {
      return '...';
    } else {
      return index;
    }
  };
});



