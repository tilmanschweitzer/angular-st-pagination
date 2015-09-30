/* eslint angular/document-service: 0 */
angular.module('stPaginationDemoApp')
  .controller('stPaginationTemplateConfigController', function ($scope, $compile, stPaginationTemplateConfigUtil) {
    'use strict';

    $scope.templateConfigs = [
      {
        label: 'Bootstrap 3.x (ul list)',
        path: 'styles/bootstrap-3.3.5.css',
        templateKey: 'bootstrap3'
      },
      {
        label: 'Bootstrap 2.x (div wrapped ul list)',
        path: 'styles/bootstrap-2.3.2.css',
        templateKey: 'bootstrap2'
      },
      {
        label: 'Zurb Foundation 5',
        path: 'styles/foundation-5.5.1.css',
        templateKey: 'zurbFoundation'
      },
      {
        label: 'Zurb Foundation 4',
        path: 'styles/foundation-4.3.2.css',
        templateKey: 'zurbFoundation'
      },
      {
        label: 'Zurb Foundation 3',
        path: 'styles/foundation-3.2.5.css',
        templateKey: 'zurbFoundation'
      },
      {
        label: 'Semantic UI',
        path: 'styles/semantic-1.11.6.css',
        templateKey: 'semanticUi'
      },
      {
        label: 'ul list',
        path: 'styles/bootstrap-3.3.5.css',
        templateKey: 'list'
      },
      {
        label: 'div wrapped ul list',
        path: 'styles/bootstrap-2.3.2.css',
        templateKey: 'divWrappedList'
      }
    ];

    $scope.templateConfig = $scope.templateConfigs[0];

    function generateHtml() {
      var template = stPaginationTemplateConfigUtil.getTemplate($scope.templateConfig);
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
