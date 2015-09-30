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
 * ## Configure templates
 *
 * Template for the {@link stPagination.directive:stPagination `stPagination` directive}
 * can be configured with the `stPaginationProvider`.
 *
 * ### Predefined templates - `templateKey`
 * The simplest way is to use one of the existing templates with the config attribute `templateKey`.
 *
 * <pre>
 *     stPaginationProvider.setTemplateConfig({templateKey: 'bootstrap2'});
 * </pre>
 *
 *  Possible values for `templateKey` **`{string}`**:
 *   - `'list'`
 *   - `'divWrappedList'`
 *   - `'bootstrap3'` alias for `'list'` and key for [bootstrap 3.x](http://getbootstrap.com)
 *   - `'bootstrap2'` alias for `'divWrappedList'` [bootstrap 2.x](http://getbootstrap.com/2.3.2/)
 *   - `'zurbFoundation'` - custom configuration for [zurb foundation](http://foundation.zurb.com/)
 *   - `'semanticUi`' - custom template for [semantic ui](semantic-ui.com/collections/menu.html#pagination)
 *
 * ### Configure base structure and classes - `templateConfig`
 *
 * For more flexibility use the `templateConfig` **`{object}`** to configure the html structure.
 *
 * <pre>
 *     stPaginationProvider.setTemplateConfig({
 *         templateConfig: {
 *             divWrapped: true,
 *             selectedClass: 'active',
 *             disabledClass: 'disabled'
 *         }
 *     });
 * </pre>
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
 *
 * <pre>
 *     stPaginationProvider.setTemplateConfig({
 *         templateConfig: {
 *             selectedClass: 'current',
 *             disabledClass: 'unavailable'
 *         }
 *     });
 * </pre>
 *
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
 *  Possible **`{object}`** properties for `templateConfig` are:
 *   - `divWrapped` - `{boolean}`   - if true the pagination list will be wrapped with a div element
 *        *(Default: false)*
 *   - `selectedClass` - `{string}` - set as class attribute for the li element of the selected page
 *        *(Default: 'active')*
 *   - `disabledClass` - `{string}` - set as class attribute to disable previous and next elements
 *        on first and last page *(Default: 'disabled')*
 *
 * ### Custom templates - `template` and `templateUrl`
 *
 * For unlimited flexibility use custom templates.
 * They are defined the same way as in directives with a `template` attribute for a template as string
 * or a `templateUrl` with a relative path to the template.
 *
 * <pre>
 *     // templateUrl
 *     stPaginationProvider.setTemplateConfig({templateUrl: 'templates/pagination.html'});
 *     // template
 *     stPaginationProvider.setTemplateConfig({template: '<div></div>'});
 * </pre>
 *
 * Example template:
 *
 * <pre>
 *   <ul class="pagination>
 *     <li ng-class="{disabled: pagination.onFirstPage()}">
 *       <a ng-click="pagination.prev()">&laquo;</a>
 *     </li>
 *     <li ng-class="{active: pagination.onPage(pageIndex)}"
 *         ng-repeat="pageIndex in pages()">
 *       <a ng-click="pagination.setPage(pageIndex)">{{ displayIndex(pageIndex) }}</a>
 *     </li>
 *     <li ng-class="{disabled: pagination.onLastPage()}">
 *       <a ng-click="pagination.next()">&raquo;</a>
 *     </li>
 *   </ul>
 * </pre>
 *
 */
angular.module('stPagination', []);
