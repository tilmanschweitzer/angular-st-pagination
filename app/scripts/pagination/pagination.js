'use strict';

angular.module('stPagination').service("Pagination", function () {
  function Pagination(collection) {
    this.collection = collection;
  }

  angular.extend(Pagination.prototype, {
  });

  return Pagination;
});
