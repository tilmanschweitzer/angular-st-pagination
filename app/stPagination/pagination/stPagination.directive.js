angular.module('stPagination').directive('stPagination', function (StPagination) {
  'use strict';

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

  var DEFAULT_CSS_CONFIG = 'list';

  /**
   * @ngdoc directive
   * @name stPagination.directive:stPagination
   * @restrict E
   *
   * @description
   * Directive that display a pagination for a collection that is initialized by the
   * {@link stPagination.filter:stPagination `stPagination` filter}.
   *
   * <pre>
   *    <st-pagination collection="users"></st-pagination>
   * </pre>
   *
   * ## Configure displayed ranges
   *
   * The automatic folding of indices can be configured.
   * The length of the displayed index ranges are set with the attributes `midRange` and `edgeRange.
   * If the ranges overlap they are summed up to keep a fixed length.
   * The overlapped element a replaced by '...' and a click on that pagination element will jump to the middle
   * of the folded elements.
   *
   * <pre>
   *    <st-pagination collection="users" mid-range="2" edge-range="3"></st-pagination>
   * </pre>
   *
   * ## Configure structure for css
   *
   * Configure the html structure for you css with the parameter `cssConfig`.
   * Decide between a basic `<ul>` list (`'list'`) or a list wrapped by `<div>` elements (`'divWrappedList'`).
   *
   * Bootstrap 3.x and 2.x are supported by these html structures.
   * Therefore just use the aliases `'bootstrap3'` for `'list'` and `'bootstrap2'` for `'divWrappedList'`.
   *
   * <pre>
   *    <st-pagination css-config="'bootstrap3'"></st-pagination>
   * </pre>
   *
   * @param {Array} collection Array that was initialized by the
   *  {@link stPagination.filter:stPagination `stPagination` filter}
   * @param {number=} [midRange=3] Range before and after current index
   * @param {number=} [edgeRange=3]  Range at the start and end of all indices
   * @param {string=} [cssConfig='list'] Key to defined the html structure.
   *   - `'list'`
   *   - `'divWrappedList'`
   *   - `'bootstrap3'` alias for `'list'`
   *   - `'bootstrap2'` alias for `'divWrappedList'`
   * @example
   *
     <example module="paginationExample">
       <file name="index.html">
         <div ng-controller="UserController">
           <table class="table">
             <thead>
               <tr>
                 <th>Name</th>
                 <th>Email</th>
               </tr>
             </thead>
             <tbody>
               <tr ng-repeat="user in users | stPagination">
                 <td>{{ user.name }}</td>
                 <td>{{ user.email  }}</td>
               </tr>
             </tbody>
           </table>
           <div>
             {{ users | stPageInfo:'startIndex' }} - {{ users | stPageInfo:'stopIndex' }}
             |
             Total {{ users | stPageInfo:'total' }}
           </div>
           <st-pagination collection="users" mid-range="midRange" edge-range="edgeRange" css-config="bootstrap2">
           </st-pagination>
           <hr/>
           <p ng-init="midRange = 1; edgeRange = 1">
             <span><code>midRange:</code><span>
             <select ng-options="r for r in [1,2,3,4,5]" ng-model="midRange" class="input-small"></select>
             <span><code>edgeRange:</code><span>
             <select ng-options="r for r in [1,2,3,4,5]" ng-model="edgeRange" class="input-small"></select>
           </p>
           <p>
             <code>
              &lt;st-pagination collection="users" mid-range="{{midRange}}" edge-range="{{edgeRange}}"&gt;&lt;/st-pagination&gt;
             </code>
           </p>
         </div>
       </file>
       <file name="app.js">
         angular.module('paginationExample', ['stPagination', 'exampleData'])
           .controller('UserController', function UserController($scope, exampleUsers) {
               $scope.users = exampleUsers;
               $scope.$watch('users.pagination', function (pagination) {
                 pagination.setPage(14)
               });
            });
       </file>
     </example>
  */
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
          if (StPagination.hasPagination(collection)) {
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
