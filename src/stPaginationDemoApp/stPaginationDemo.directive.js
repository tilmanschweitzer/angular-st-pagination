angular.module('stPaginationDemoApp')
  .directive('stPaginationDemo', function (stPaginationTemplateConfigUtil) {
    'use strict';

    return {
      restrict: 'A',
      templateUrl: 'stPaginationDemoApp/stPaginationDemo.html',
      controller: function ($scope, $timeout, $templateCache) {
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
          var template = stPaginationTemplateConfigUtil.getTemplate($scope.GLOBAL_CONFIG.templateConfig);
          $templateCache.put('paginationTemplate.html', template);
          toggleStyle();
        });
      }
    };
  });
