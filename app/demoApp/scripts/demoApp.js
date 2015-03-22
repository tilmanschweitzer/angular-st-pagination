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
  $http.get('demoApp/data/commits.json').success(function (commits) {
    $scope.commits = commits;
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
}).controller('cssConfigController', function ($scope, $compile) {
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
});

