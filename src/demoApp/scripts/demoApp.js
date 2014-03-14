'use strict';

angular.module('paginationDemo', [
  'ngRoute',
  'stPagination'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'demoApp/views/demo.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

angular.module('paginationDemo').controller('demoController', function ($scope, $http) {
  function createCommit(line) {
    var lineTokens = line.split(" ");
    return {
      hash: lineTokens[0],
      comment: lineTokens.slice(1).join(" ")
    };
  }

  function filterEmptyLine(line) {
    return !/(^\s*$)/.test(line);
  }

  $http.get("demoApp/data/angular-commits.txt").success(function (data) {
    var lines = data.split("\n");
    var commits = lines.filter(filterEmptyLine).map(createCommit);

    $scope.functionNames = [
      "limit",
      "start",
      "stop",
      "page",
      "displayPage",
      "lastPage",
      "totalPages",
      "onFirstPage",
      "onLastPage",
      "length"
    ];

    $scope.displayProperties = [
      "startIndex",
      "stopIndex",
      "currentPage",
      "totalPages"
    ];

    $scope.propertyTemplate = function (property) {
      return "{{ commits | pageInfo:'" + property + "' }}";
    };

    $scope.getResult = function (functionName, object) {
      return object[functionName]();
    };

    $scope.commits = commits;
  });
});

