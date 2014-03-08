'use strict';

angular.module('stPagination').filter('pagination', function (Pagination) {
  return function (collection) {
    if (!collection) {
      return;
    }
    collection.pagination = new Pagination(collection);
  };
});