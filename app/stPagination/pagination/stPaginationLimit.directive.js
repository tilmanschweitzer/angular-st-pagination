angular.module('stPagination').directive('stPaginationLimit', function (StPagination) {
  'use strict';

  var DEFAULT_LIMITS = [10, 20, 50];

  /**
   * @ngdoc directive
   * @name stPagination.directive:stPaginationLimit
   * @restrict E
   *
   * @description
   * Directive that displays a select element to change the number of items per page.
   *
   * <pre>
   *    <st-pagination-limit collection="users"></st-pagination-limit>
   * </pre>
   *
   * ## Configure the limits
   *
   * The limit options can be configured. The default is `[10, 20, 50]`.
   *
   * <pre>
   *    <st-pagination-limit collection="users" limits="[5,10,20,50,100]"></st-pagination-limit>
   * </pre>
   *
   * @param {Array} collection Array that was initialized by the
   *  {@link stPagination.filter:stPagination `stPagination` filter}
   * @param {Array=} limits Limit options for the select element. *(default: [10, 20, 50])*
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
             |
             Users per page
             <st-pagination-limit collection="users" limits="[5,10,20,50,100]" class="input-small">
             </st-pagination-limit>
           </div>
           <st-pagination collection="users" css-config="bootstrap2">
           </st-pagination>

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
    template: '<select ng-options="limit for limit in limits()" ng-model="pagination._limit"></select>',
    scope: {
      collection: '=',
      getLimits: '&limits'
    },
    link: function ($scope) {
      $scope.limits = function () {
        return $scope.getLimits() || DEFAULT_LIMITS;
      };

      $scope.$watch('collection', function(collection) {
        if (StPagination.hasPagination(collection)) {
          $scope.pagination = collection.pagination;
        } else {
          delete $scope.pagination;
        }
      });
    }
  };
});
