angular.module('stPagination').filter('stPageInfo', function (stPagination) {
  'use strict';

  var propertyNameToFunctionMapping = {
    total: 'length',
    totalPages: 'totalPages',
    currentPage: 'displayPage',
    startIndex: 'displayStart',
    stopIndex: 'stop'
  };

  /**
   * @ngdoc filter
   * @name stPagination.filter:stPageInfo
   * @kind function
   *
   * @description
   * Returns information about pagination properties.
   * Array must be initialized with the `pagination` filter.
   *
   * <pre>
   *    {{ users | stPageInfo:'total' }}
   *    {{ users | stPageInfo:'currentPage' }}
   *    {{ users | stPageInfo:'totalPages' }}
   *    {{ users | stPageInfo:'startIndex' }}
   *    {{ users | stPageInfo:'stopIndex' }}
   * </pre>
   *
   * @param {Array} collection Array that was initialized by the
   *  {@link stPagination.filter:stPagination `stPagination` filter}
   * @param {String} propertyName Name of the pagination property
   *   - `'total'` total number of elements in the collection
   *   - `'currentPage'` index of the current page
   *   - `'totalPages'` total number of pages
   *   - `'startIndex'` index of the first element on the current page
   *   - `'stopIndex'` index of the last element on the current page
   *
   * @return {Number} The value of the specified pagination property.
   *
   * @example
   *
     <example module="paginationExample">
       <file name="index.html">
         <h2>Pagination with chained filters</h2>
         <div ng-controller="ExampleController">
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
             <table class="table">
               <thead>
                 <tr>
                   <th>Property</th>
                   <th>Value</th>
                   <th>Usage example</th>
                 </tr>
               </thead>
               <tbody>
                 <tr>
                   <td><code>'total'</code></td>
                   <td><span class="badge label-primary">{{ commits | stPageInfo:'total' }}</span></td>
                   <td><code>{{ propertyTemplate('total') }}</code></td>
                 </tr>
                 <tr>
                   <td><code>'currentPage'</code></td>
                   <td><span class="badge label-primary">{{ commits | stPageInfo:'currentPage' }}</span></td>
                   <td><code>{{ propertyTemplate('currentPage') }}</code></td>
                 </tr>
                 <tr>
                   <td><code>'totalPages'</code></td>
                   <td><span class="badge label-primary">{{ commits | stPageInfo:'totalPages' }}</span></td>
                   <td><code>{{ propertyTemplate('totalPages') }}</code></td>
                 </tr>
                 <tr>
                   <td><code>'startIndex'</code></td>
                   <td><span class="badge label-primary">{{ commits | stPageInfo:'startIndex' }}</span></td>
                   <td><code>{{ propertyTemplate('startIndex') }}</code></td>
                 </tr>
                 <tr>
                   <td><code>'stopIndex'</code></td>
                   <td><span class="badge label-primary">{{ commits | stPageInfo:'stopIndex' }}</span></td>
                   <td><code>{{ propertyTemplate('stopIndex') }}</code></td>
                 </tr>
               </tbody>
             </table>
           </div>
           <st-pagination collection="commits"></st-pagination>
         </div>
       </file>
       <file name="app.js">
         angular.module('paginationExample', ['stPagination', 'stPaginationDemoApp'])
           .config(function (stPaginationProvider) {
               stPaginationProvider.setTemplateConfig({templateKey: 'bootstrap2'});
           })
           .controller('ExampleController', function ExampleController($scope, exampleCommits) {
              $scope.commits = exampleCommits;
              $scope.propertyTemplate = function (property) {
                return '{{ commits | stPageInfo:"' + property + '" }}';
              };
            });
       </file>
     </example>
  */
  return function (collection, propertyName) {
    if (stPagination.hasPagination(collection) && propertyName) {
      var fnName = propertyNameToFunctionMapping[propertyName];
      if (!fnName) {
        throw new Error('No display property "' + propertyName + '" defined for the stPageInfo filter');
      }
      return collection.pagination[fnName]();
    } else {
      return collection;
    }
  };
});
