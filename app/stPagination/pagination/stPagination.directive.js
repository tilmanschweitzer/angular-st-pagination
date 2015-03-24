angular.module('stPagination').directive('stPagination', function (StPagination, $parse) {
  'use strict';

  var css3UserSelectAliases = [
    '-webkit-touch-callout',
    '-webkit-user-select',
    '-moz-user-select',
    '-ms-user-select',
    'user-select'
  ];

  var basePagination = '<ul>' +
      '<li ng-class="{%DISABLED_CLASS%: pagination.onFirstPage()}">' +
        '<a ng-click="pagination.prev()">&laquo;</a>' +
      '</li>' +
      '<li ng-class="{%SELECTED_CLASS%: pagination.onPage(index)}" ' +
        'ng-repeat="index in pagination.reducedIndices(midRange, edgeRange)">' +
        '<a ng-click="pagination.setPage(index)">{{ index | displayPaginationIndex }}</a>' +
      '</li>' +
      '<li ng-class="{%DISABLED_CLASS%: pagination.onLastPage()}">' +
        '<a ng-click="pagination.next()">&raquo;</a>' +
      '</li>' +
    '</ul>';

  function extendDefaults(options) {
    return angular.extend({
      divWrapped: false,
      selectedClass: 'active',
      disabledClass: 'disabled'
    }, options);
  }

  var cssConfigsByKey = {
    list: {},
    divWrappedList: {
      divWrapped: true
    },
    bootstrap3: {},
    bootstrap2: {
      divWrapped: true
    },
    zurbFoundation: {
      selectedClass: 'current',
      disabledClass: 'unavailable'
    }
  };

  var allowedValues = '"' + Object.keys(cssConfigsByKey).join('", "') + '"';
  var defaultCssConfig = 'list';

  function parseCssConfig(cssConfig) {
    var configObject = $parse(cssConfig)({});
    if (angular.isObject(configObject)) {
      return extendDefaults(configObject);
    }
    cssConfig = cssConfig || defaultCssConfig;
    configObject = cssConfigsByKey[cssConfig];
    if (configObject !== undefined) {
      return extendDefaults(configObject);
    } else {
      var msg = 'Given css-config attribute "' + cssConfig + '" is not in allowed values ' + allowedValues;
      throw new Error(msg);
    }
  }

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
   * As parameter you can pass a **`{string}`** key for configuration presets or an custom configuration
   * as **`{object}`**.
   *
   * The generated default structure of the directive is a simple list with links and a ***pagination*** class.
   * The current page link has an ***active*** class and the previous and next buttons get a ***disabled*** class
   * for the first or last page.
   *
   * <pre>
   *   <ul class="pagination">
   *     <li class="disabled"><a>&laquo;</a></li>
   *     <li class="active"><a>1</a></li>
   *     <li><a>1</a></li>
   *     <li><a>2</a></li>
   *     <li><a>3</a></li>
   *     <li><a>&raquo;</a></li>
   *   </ul>
   * </pre>
   *
   * The config property `{divWrapped: true}` or the key `'divWrappedList'` wraps the list in a div element.
   *
   * <pre>
   *   <div class="pagination">
   *     <ul>
   *       ...
   *     </ul>
   *   </div>
   * </pre>
   *
   * The config properties `selectedClass` and `disabledClass` replace the class attributes for the list elements.
   * For example `{selectedClass: 'current', disabledClass: 'unavailable'}` will generate the following html structure.
   *
   * <pre>
   *   <ul class="pagination">
   *     <li class="current"><a>&laquo;</a></li>
   *     <li class="unavailable"><a>1</a></li>
   *     <li><a>1</a></li>
   *     <li><a>2</a></li>
   *     <li><a>3</a></li>
   *     <li><a>&raquo;</a></li>
   *   </ul>
   * </pre>
   *
   * ### Config keys for css frameworks
   *
   * To simplify the configuration for popular css framework just use a **`{string}`** key for the configuration.
   *
   *   - `'bootstrap3'` generates the default structure
   *   - `'bootstrap2'` generates a `'divWrappedList'`
   *   - `'zurbFoundation'` set class attributes necessary for foundation (works with version 3-5)
   *
   * <pre>
   *    <st-pagination css-config="'zurbFoundation'"></st-pagination>
   * </pre>
   *
   * @param {Array} collection Array that was initialized by the
   *  {@link stPagination.filter:stPagination `stPagination` filter}
   * @param {number=} [midRange=3] Range before and after current index
   * @param {number=} [edgeRange=3]  Range at the start and end of all indices
   * @param {object|string=} [cssConfig='list'] Custom `{object}` to configure the html structure or `{string}` key
   *   for a predefined configuration.
   *
   *   Config **`{object}`** properties:
   *   - `divWrapped` - `{boolean}`   - if true the pagination list will be wrapped with a div element
   *        *(Default: false)*
   *   - `selectedClass` - `{string}` - set as class attribute for the li element of the selected page
   *        *(Default: 'active')*
   *   - `disabledClass` - `{string}` - set as class attribute to disable previous and next elements
   *        on first and last page *(Default: 'disabled')*
   *
   *  Config **`{string}`** keys:
   *   - `'list'`
   *   - `'divWrappedList'`
   *   - `'bootstrap3'` alias for `'list'`
   *   - `'bootstrap2'` alias for `'divWrappedList'`
   *   - `'zurbFoundation'` - custom configuration for zurb
   *
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
             <select ng-options="r for r in [1,2,3,4,5]" ng-model="mR" class="input-small"></select>
             <span><code>edgeRange:</code><span>
             <select ng-options="r for r in [1,2,3,4,5]" ng-model="eR" class="input-small"></select>
           </p>
           <p>
             <code>
              &lt;st-pagination collection="users" mid-range="{{mR}}" edge-range="{{eR}}"&gt;&lt;/st-pagination&gt;
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
      var cssConfigObject = parseCssConfig(attributes.cssConfig);

      if (cssConfigObject.divWrapped) {
        $element.wrap('<div class="pagination"></div>');
      } else {
        $element.addClass('pagination');
      }

      angular.forEach($element.find('li'), function (liElement) {
        var $liElement = angular.element(liElement);
        var ngClass = $liElement.attr('ng-class');
        ngClass = ngClass.replace('%DISABLED_CLASS%', cssConfigObject.disabledClass);
        ngClass = ngClass.replace('%SELECTED_CLASS%', cssConfigObject.selectedClass);
        $liElement.attr('ng-class', ngClass);
      });

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
