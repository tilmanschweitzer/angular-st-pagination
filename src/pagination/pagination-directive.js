'use strict';

angular.module('stPagination').directive('pagination', function (Pagination, $log) {

  var paginationTemplate = '' +
      '<ul class="pagination">' +
        '<li ng-class="{disabled: pagination.onFirstPage()}">' +
          '<a ng-click="pagination.prev()">&laquo;</a>' +
        '</li>' +
        '<li ng-class="{active: pagination.onPage(index)}" ng-repeat="index in pagination.reducedIndices(midRange, edgeRange)">' +
          '<a ng-click="pagination.setPage(index)">{{ index | displayPaginationIndex }}</a>' +
        '</li>' +
        '<li ng-class="{disabled: pagination.onLastPage()}">' +
          '<a ng-click="pagination.next()">&raquo;</a>' +
        '</li>' +
      '</ul>';

  return {
    restrict: "E",
    replace: true,
    scope: {
      collection: "=",
      edgeRange: "=",
      midRange: "="
    },
    template: paginationTemplate,
    link: function ($scope, $element, attributes) {
      var collectionName = attributes.collection;

      $scope.$watch("collection", function (collection) {
        if (angular.isArray(collection)) {
          if (Pagination.hasPagination(collection)) {
            $scope.pagination = collection.pagination;
          } else {
            throw new Error("Collection '" + collectionName + "' in the pagination directive is not used with a neccessary pagination filter.");
          }
        }
      });
    }
  };
});
