'use strict';

angular.module('stPagination').filter('pagination', function () {
  return function (collection) {
    if (!collection) {
      return;
    }
    collection.pagination = {};
  };
});