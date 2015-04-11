angular.module('stPagination').filter('stPagination', function (stPagination) {
  'use strict';

  /**
   * @ngdoc filter
   * @name stPagination.filter:stPagination
   * @kind function
   *
   * @description
   * Initialized the pagination and returns a new limited sub-array with an offset controlled by a
   * {@link stPagination.directive:stPagination `stPagination` directive}.
   * The initialized pagination object handles the filtering, correct calculation of offsets and pages.
   *
   * <pre>
   *    <ul>
   *      <li ng-repeat="user in users | stPagination">{{ user.name }}</li>
   *    </ul>
   * </pre>
   *
   * ## Usage with other filters
   *
   * If you want to apply other filters to you collection before the pagination filter,
   * you have to pass the `originalCollection` to the filter.
   * Otherwise the pagination object can not be attached correctly.
   *
   * <pre>
   *    <ul>
   *      <li ng-repeat="user in users | filter:{name: usernameFilter} | stPagination:users">
   *        {{ user.name }}
   *      </li>
   *    </ul>
   * </pre>
   *
   * @param {Array} inputCollection Source array to be paginated
   * @param {Array=} originalCollection Required if the pagination filter is chained with others
   * @return {Array} A new sub-array defined by the pagination limit and offset.
   *
   * @example
   *
     <example module="paginationExample">
       <file name="index.html">
         <div ng-controller="UserController">
           <h2>Simple pagination</h2>
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
           <st-pagination collection="users"></st-pagination>
         </div>
         <hr/>
         <h2>Pagination with chained filters</h2>
         <div ng-controller="CommitController">
           <div>
             <label for="comment-filter">Search comments</label>
             <input type="text" id="comment-filter" ng-model="commentFilter"/>
           </div>
           <table class="table">
             <thead>
               <tr>
                 <th>Hash</th>
                 <th>Comment</th>
               </tr>
             </thead>
             <tbody>
               <tr ng-repeat="commit in commits | filter: {comment: commentFilter} | stPagination:commits">
                 <td>{{ commit.hash }}</td>
                 <td>{{ commit.comment  }}</td>
               </tr>
             </tbody>
           </table>
           <div>
             {{ commits | stPageInfo:'startIndex' }} - {{ commits | stPageInfo:'stopIndex' }}
             |
             Total {{ commits | stPageInfo:'total' }}
           </div>
           <st-pagination collection="commits"></st-pagination>
         </div>
       </file>
       <file name="app.js">
         angular.module('paginationExample', ['stPagination', 'exampleData'])
           .config(function (stPaginationProvider) {
               stPaginationProvider.setTemplateConfig({templateKey: 'bootstrap2'});
           })
           .controller('UserController', function UserController($scope, exampleUsers) {
               $scope.users = exampleUsers;
            }).controller('CommitController', function CommitController($scope, exampleCommits) {
               $scope.commits = exampleCommits;
               $scope.commentFilter = '';
            });;
       </file>
     </example>
  */
  return function stPaginationFilter(inputCollection, originalCollection) {
    var collectionWithPaginationHandle;

    if (!inputCollection) {
      return;
    }

    collectionWithPaginationHandle = originalCollection || inputCollection;

    if (!stPagination.hasPagination(collectionWithPaginationHandle)) {
      collectionWithPaginationHandle.pagination = new stPagination.Pagination(inputCollection);
    }
    var pagination = collectionWithPaginationHandle.pagination;
    pagination.setCollection(inputCollection);
    return pagination.paginatedCollection();
  };
});
