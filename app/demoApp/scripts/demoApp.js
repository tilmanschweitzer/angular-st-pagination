'use strict';


angular.module('paginationDemo', [
  'ngRoute',
  'stPagination'
])
  .config(function ($routeProvider, stPaginationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'demoApp/views/demo.html'
      })
      .otherwise({
        redirectTo: '/'
      });

    stPaginationProvider.setDefaultLimit(10);
    stPaginationProvider.setDefaultMidRange(3);
    stPaginationProvider.setDefaultEdgeRange(3);
    stPaginationProvider.setTemplateConfig({templateUrl: 'paginationTemplate.html'});
  }).run(function ($templateCache) {
    $templateCache.put('paginationTemplate.html', templateConfigUtil.getTemplate({templateKey: 'list'}));

    var tpl = '<st-pagination collection="commits" mid-range="midRange" edge-range="edgeRange">' +
      '</st-pagination>';
    $templateCache.put('paginationWrapper.html', tpl);
  });
angular.module('paginationDemo').controller('demoBaseController', function ($scope, $timeout, $templateCache) {
  $scope.styleResetToggle = true;

  function setStyleReset(value) {
    $scope.styleResetToggle = !!value;
  }

  function toggleStyle() {
    setStyleReset(false);
    $timeout(angular.bind(null, setStyleReset, true), 10);
  }

  $scope.GLOBAL_CONFIG = {
    templateConfig: {
      templateKey: 'bootstrap3'
    }
  };

  $scope.$watch('GLOBAL_CONFIG.templateConfig', function () {
    var template = templateConfigUtil.getTemplate($scope.GLOBAL_CONFIG.templateConfig);
    $templateCache.put('paginationTemplate.html', template);
    toggleStyle();
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
}).controller('templateConfigController', function ($scope, $compile, $filter, stPagination) {
  $scope.templateConfigs = [
    {
      label: 'Bootstrap 3.x (ul list)',
      path: 'bower_components/bootstrap-css-only/css/bootstrap.css',
      templateKey: 'bootstrap3'
    },
    {
      label: 'Bootstrap 2.x (div wrapped ul list)',
      path: 'demoApp/styles/bootstrap-2.3.2.css',
      templateKey: 'bootstrap2'
    },
    {
      label: 'Zurb Foundation 5',
      path: 'demoApp/styles/foundation-5.5.1.css',
      templateKey: 'zurbFoundation'
    },
    {
      label: 'Zurb Foundation 4',
      path: 'demoApp/styles/foundation-4.3.2.css',
      templateKey: 'zurbFoundation'
    },
    {
      label: 'Zurb Foundation 3',
      path: 'demoApp/styles/foundation-3.2.5.css',
      templateKey: 'zurbFoundation'
    },
    {
      label: 'Semantic UI',
      path: 'demoApp/styles/semantic-1.11.6.css',
      templateKey: 'semanticUi'
    },
    {
      label: 'ul list',
      path: 'bower_components/bootstrap-css-only/css/bootstrap.css',
      templateKey: 'list'
    },
    {
      label: 'div wrapped ul list',
      path: 'demoApp/styles/bootstrap-2.3.2.css',
      templateKey: 'divWrappedList'
    }
  ];

  $scope.templateConfig = $scope.templateConfigs[0];

  function generateHtml() {
    var template = templateConfigUtil.getTemplate($scope.templateConfig);
    return $compile(template)($scope).wrap('<div></div>').parent().html().replace(/></g, '>\n<');
  }

  $scope.generatedHtml = generateHtml();


  $scope.$watch('templateConfig', function (newConfig, oldConfig) {
    if (!angular.equals(newConfig, oldConfig)) {
      document.querySelector('link[href="' + oldConfig.path + '"]').remove();
      document.head.appendChild(angular.element('<link rel="stylesheet" href="' + newConfig.path + '" />')[0]);

      $scope.GLOBAL_CONFIG.templateConfig = newConfig;

      $scope.generatedHtml = generateHtml();
    }
  });
});

angular.module('paginationDemo').controller('serverPaginationController',
  function($scope, $http, stPagination) {
    $scope.serverCommits = [];
    $scope.paginationConfig = stPagination.paginationServerConfig({
      url: 'commits/:start/:end'
    });
  });


