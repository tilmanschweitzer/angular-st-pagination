angular.module('stPaginationDemoApp', [
  'stPagination'
]).config(function (stPaginationProvider) {
  'use strict';

  stPaginationProvider.setDefaultLimit(10);
  stPaginationProvider.setDefaultMidRange(3);
  stPaginationProvider.setDefaultEdgeRange(3);
  stPaginationProvider.setTemplateConfig({templateUrl: 'paginationTemplate.html'});
}).run(function ($templateCache, stPaginationTemplateConfigUtil) {
  'use strict';

  $templateCache.put('paginationTemplate.html', stPaginationTemplateConfigUtil.getTemplate({templateKey: 'list'}));

  var tpl = '<st-pagination collection="commits" mid-range="midRange" edge-range="edgeRange">' +
    '</st-pagination>';
  $templateCache.put('paginationWrapper.html', tpl);
});
