angular.module('stPaginationDemoApp')
  .controller('stPaginationDemoController', function ($scope, $http, exampleCommits) {
    'use strict';

    $scope.commits = exampleCommits;

    $scope.commentFilter = '';

    $scope.displayProperties = [
      'total',
      'startIndex',
      'stopIndex',
      'currentPage',
      'totalPages'
    ];

    $scope.propertyTemplate = function (property) {
      return '{{ commits | stPageInfo:"' + property + '" }}';
    };
  });
