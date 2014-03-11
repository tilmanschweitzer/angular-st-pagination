'use strict';

angular.module('stPagination').directive('paginationLimit', function (Pagination, $log) {

  var DEFAULT_LIMITS = [10, 20, 50];

  return {
    restrict: "E",
    replace: true,
    template: '<select ng-options="limit for limit in limits" ng-model="pagination.$limit"></select>',
    scope: {
      collection: "=?",
      limits: "=?"
    },
    link: function ($scope) {
      $scope.limits = $scope.limits || DEFAULT_LIMITS;
      $scope.$watch("collection", function(collection) {
        if (Pagination.hasPagination(collection)) {
          $scope.pagination = collection.pagination;
        }
      });
    }
  };
});



