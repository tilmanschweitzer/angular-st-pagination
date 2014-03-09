'use strict';

angular.module('stPagination').service("Pagination", function () {

  function Pagination(inputCollection) {
    this.inputCollection = inputCollection;
    this.limit = 10;
  }

  angular.extend(Pagination.prototype, {
    setInputCollection: function (inputCollection) {
      this.inputCollection = inputCollection;
    },
    getPaginatedInputCollection: function () {
      return this.inputCollection.slice(0, this.limit);
    }
  });

  return Pagination;
});
