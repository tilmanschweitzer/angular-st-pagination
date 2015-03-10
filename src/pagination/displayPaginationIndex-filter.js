'use strict';

angular.module('stPagination').filter('displayPaginationIndex', function () {

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



