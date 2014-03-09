'use strict';

angular.module('paginationDemo', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'stPagination'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/demo.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

angular.module('paginationDemo').controller('demoController', function ($scope, $http) {
  $http.get("data/angular-commits.txt").success(function (data) {
    var lines = data.split("\n");
    var commits = lines.map(function (line) {
      var lineTokens = line.split(" ");
      return {
        hash: lineTokens[0],
        comment: lineTokens.slice(1).join(" ")
      };
    });

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

    $scope.getResult = function (functionName, object) {
      return object[functionName]();
    }

    $scope.commits = commits;
  })
});

