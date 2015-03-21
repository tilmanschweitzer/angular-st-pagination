'use strict';

angular.module('paginationDemo', [
  'ngRoute',
  'stPagination'
])
  .config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'demoApp/views/demo.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);

angular.module('paginationDemo').controller('demoController', ["$scope", "$http", function ($scope, $http) {
  function createCommit(line) {
    var lineTokens = line.split(' ');
    return {
      hash: lineTokens[0],
      comment: lineTokens.slice(1).join(' ')
    };
  }

  function filterEmptyLine(line) {
    return !/(^\s*$)/.test(line);
  }

  $http.get('demoApp/data/angular-commits.txt').success(function (data) {
    var lines = data.split('\n');
    var commits = lines.filter(filterEmptyLine).map(createCommit);

    $scope.functionNames = [
      'limit',
      'start',
      'stop',
      'page',
      'displayPage',
      'lastPage',
      'totalPages',
      'onFirstPage',
      'onLastPage',
      'length'
    ];

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

    $scope.getResult = function (functionName, object) {
      return object[functionName]();
    };

    $scope.commits = commits;
    $scope.commentFilter = '';
  });
}]).controller('cssConfigController', ["$scope", "$compile", function ($scope, $compile) {
  $scope.cssConfigs = [
    {
      label: 'Bootstrap 3.x (ul list)',
      path: 'bower_components/bootstrap-css-only/css/bootstrap.css',
      configKey: 'bootstrap3'
    },
    {
      label: 'Bootstrap 2.x (div wrapped ul list)',
      path: 'demoApp/styles/bootstrap-2.3.2.css',
      configKey: 'bootstrap2'
    },
    {
      label: 'ul list',
      path: 'bower_components/bootstrap-css-only/css/bootstrap.css',
      configKey: 'list'
    },
    {
      label: 'div wrapped ul list',
      path: 'demoApp/styles/bootstrap-2.3.2.css',
      configKey: 'divWrappedList'
    }
  ];

  $scope.selectedCssConfig = $scope.cssConfigs[0];

  function generateHtml() {
    var template = '<div><st-pagination  collection="commits" css-config="CSS_CONFIG"></st-pagination></div>';
    template = template.replace('CSS_CONFIG', $scope.selectedCssConfig.configKey);
    return $compile(template)($scope).html().replace(/></g, '>\n<');
  }

  $scope.generatedHtml = generateHtml();


  $scope.$watch('selectedCssConfig', function (newConfig, oldConfig) {
    if (!angular.equals(newConfig, oldConfig)) {
      document.querySelector('link[href="' + oldConfig.path + '"]').remove();
      document.head.appendChild(angular.element('<link rel="stylesheet" href="' + newConfig.path + '" />')[0]);

      $scope.generatedHtml = generateHtml();
    }
  });
}]);

