'use strict';

angular.module('stPagination').service("Pagination", function () {
  function Pagination(collection) {
    this.collection = collection;
  }

  angular.extend(Pagination.prototype, {
    setCollection: function (collection) {
      this.collection = collection;
    }
  });

  return Pagination;
});
