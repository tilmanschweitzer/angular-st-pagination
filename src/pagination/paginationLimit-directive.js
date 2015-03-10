'use strict';

angular.module('stPagination').directive('stPaginationLimit', function (Pagination) {

  var DEFAULT_LIMITS = [10, 20, 50];

  return {
    restrict: "E",
    replace: true,
    template: '<select ng-options="limit for limit in limits()" ng-model="pagination.$limit"></select>',
    scope: {
      collection: "=",
      getLimits: "&limits"
    },
    link: function ($scope) {
      $scope.limits = function () {
        return $scope.getLimits() || DEFAULT_LIMITS;
      };

      $scope.$watch("collection", function(collection) {
        if (Pagination.hasPagination(collection)) {
          $scope.pagination = collection.pagination;
        } else {
          delete $scope.pagination;
        }
      });
    }
  };
});



