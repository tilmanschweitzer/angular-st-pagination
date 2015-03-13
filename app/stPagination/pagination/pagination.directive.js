'use strict';

angular.module('stPagination').directive('stPagination', function (Pagination) {

  var css3UserSelectAliases = [
    '-webkit-touch-callout',
    '-webkit-user-select',
    '-moz-user-select',
    '-ms-user-select',
    'user-select'
  ];

  var basePagination = '<ul>' +
      '<li ng-class="{disabled: pagination.onFirstPage()}">' +
        '<a ng-click="pagination.prev()">&laquo;</a>' +
      '</li>' +
      '<li ng-class="{active: pagination.onPage(index)}" ' +
        'ng-repeat="index in pagination.reducedIndices(midRange, edgeRange)">' +
        '<a ng-click="pagination.setPage(index)">{{ index | displayPaginationIndex }}</a>' +
      '</li>' +
      '<li ng-class="{disabled: pagination.onLastPage()}">' +
        '<a ng-click="pagination.next()">&raquo;</a>' +
      '</li>' +
    '</ul>';

  var transformationForCssConfig = {
    list: function ($element) {
      $element.addClass('pagination');
    },
    divWrappedList: function ($element) {
      $element.wrap('<div class="pagination"></div>');
    }
  };

  transformationForCssConfig.bootstrap3 = transformationForCssConfig.list;
  transformationForCssConfig.bootstrap2 = transformationForCssConfig.divWrappedList;

  var allowedValues = '"' + Object.keys(transformationForCssConfig).join('", "') + '"';

  var DEFAULT_CSS_CONFIG = 'bootstrap3';

  return {
    restrict: 'E',
    replace: true,
    scope: {
      collection: '=',
      edgeRange: '=',
      midRange: '='
    },
    template: basePagination,
    compile: function ($element, attributes) {
      var cssConfig = attributes.cssConfig || DEFAULT_CSS_CONFIG;
      var transformation = transformationForCssConfig[cssConfig];
      if (angular.isFunction(transformation)) {
        transformation($element);
      } else {
        var msg = 'Given css-config attribute "' + attributes.cssConfig + '" is not in allowed values ' + allowedValues;
        throw new Error(msg);
      }
    },
    controller: function ($scope, $element, $attrs) {
      // set css to prevent selections
      angular.forEach(css3UserSelectAliases, function (alias) {
        $element.css(alias, 'none');
      });

      var collectionName = $attrs.collection;

      $scope.$watch('collection', function (collection) {
        if (angular.isArray(collection)) {
          if (Pagination.hasPagination(collection)) {
            $scope.pagination = collection.pagination;
          } else {
            var msg = 'Collection "' + collectionName + '" in the pagination directive is not used with a neccessary ' +
              'pagination filter.';
            throw new Error(msg);
          }
        }
      });
    }
  };
});
