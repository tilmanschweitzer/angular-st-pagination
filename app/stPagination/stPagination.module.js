/**
 * @ngdoc overview
 * @name stPagination
 *
 * @description
 * # stPagination
 * The `stPagination` module provides a complete client-side pagination with a simple angular filter and directive.
 *
 * The two main components are the {@link stPagination.filter:stPagination `stPagination` filter} and
 * the {@link stPagination.directive:stPagination `stPagination` directive}.
 * A limit for the pagination can be changed with the
 * {@link stPagination.directive:stPaginationLimit `stPaginationLimit` directive} and information like current page
 * or number total pages can be displayed by the {@link stPagination.filter:stPageInfo `stPageInfo` filter}.
 *
 * ## Configure default values
 *
 * Default values for the pagination can be configured with the `stPaginationProvider`.
 *
 * <pre>
 *   angular.module('myModule', ['stPagination']).config(function (stPaginationProvider) {
 *       stPaginationProvider.setDefaultLimit(10); // actual default is 10
 *       stPaginationProvider.setDefaultMidRange(3); // actual default is 3
 *       stPaginationProvider.setDefaultEdgeRange(3); // actual default is 3
 *   });
 * </pre>
 *
 * Global css configuration is possible with a config object and a config key as described for the
 * {@link stPagination.directive:stPagination `stPagination` directive}.
 *
 * <pre>
 *     stPaginationProvider.setDefaultCssConfig('bootstrap2'); // actual default is 'list'
 *     stPaginationProvider.setDefaultCssConfig({
 *         divWrapped: false,
 *         selectedClass: 'active',
 *         disabledClass: 'disabled'
 *     });
 * </pre>
 *
 */
angular.module('stPagination', []);
