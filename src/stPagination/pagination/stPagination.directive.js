angular.module('stPagination').directive('stPagination', function (stPagination, stPaginationTemplateConfigUtil) {
  'use strict';

  var css3UserSelectAliases = [
    '-webkit-touch-callout',
    '-webkit-user-select',
    '-moz-user-select',
    '-ms-user-select',
    'user-select'
  ];

  function displayIndex(index) {
    if (angular.isNumber(index)) {
      return index + 1;
    } else if (angular.isArray(index)) {
      return '...';
    } else {
      return index;
    }
  }

  /**
   * @ngdoc directive
   * @name stPagination.directive:stPagination
   * @restrict E
   *
   * @description
   * Directive that display a pagination for an array that is initialized by the
   * {@link stPagination.filter:stPagination `stPagination` filter}.
   *
   * <pre>
   *    <st-pagination collection="users"></st-pagination>
   * </pre>
   *
   * ## Configure number of displayed page links
   *
   * The automatic folding of indices can be configured.
   * The number of the displayed page links are set with the attributes `midRange` and `edgeRange.
   * If the page links overlap they are summed up to keep a fixed length.
   * The overlapped element a replaced by '...' and a click on that pagination element will jump to the middle
   * of the folded elements.
   *
   * <pre>
   *    <st-pagination collection="users" mid-range="2" edge-range="3"></st-pagination>
   * </pre>
   *
   * ## Configure templates
   *
   * Configure template with {@link stPagination `stPaginationProvider.setTemplateConfig()`}.
   *
   *
   * @param {Array} collection Array that was initialized by the
   *  {@link stPagination.filter:stPagination `stPagination` filter}
   * @param {number=} [midRange=3] Number of page links before and after current index
   * @param {number=} [edgeRange=3]  Number of page links at the start and end
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
           <st-pagination collection="users" mid-range="mR" edge-range="mR">
           </st-pagination>
           <hr/>
           <p ng-init="mR = 1; eR = 1">
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
         angular.module('paginationExample', ['stPagination', 'stPaginationDemoApp'])
           .config(function (stPaginationProvider) {
               stPaginationProvider.setTemplateConfig({templateKey: 'bootstrap2'});
           })
           .controller('UserController', function UserController($scope, exampleUsers) {
               $scope.users = exampleUsers;
               $scope.$watch('users.pagination', function (pagination) {
                 if(pagination) {
                   pagination.setPage(14);
                 }
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
    template: stPaginationTemplateConfigUtil.getTemplate(stPagination.templateConfig()),
    templateUrl: stPaginationTemplateConfigUtil.getTemplateUrl(stPagination.templateConfig()),
    controller: function ($scope, $element, $attrs) {
      // set css to prevent selections
      angular.forEach(css3UserSelectAliases, function (alias) {
        $element.css(alias, 'none');
      });

      var collectionName = $attrs.collection;

      $scope.displayIndex = displayIndex;

      $scope.pages = function () {
        return $scope.$eval('pagination.reducedIndices(midRange, edgeRange)');
      };

      $scope.$watch('collection', function (collection) {
        if (angular.isArray(collection)) {
          if (stPagination.hasPagination(collection)) {
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
