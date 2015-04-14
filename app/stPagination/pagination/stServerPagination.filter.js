'use strict';

angular.module('stPagination').filter('stServerPagination', function(stPagination) {

  return function stServerPaginationFilter(inputCollection, config) {
    var collectionWithPaginationHandle;

    if (!inputCollection) {
      return;
    }

    collectionWithPaginationHandle = inputCollection;

    if (!stPagination.hasPagination(collectionWithPaginationHandle)) {
      collectionWithPaginationHandle.pagination = new stPagination.ServerPagination(inputCollection, config);
    }
    var pagination = collectionWithPaginationHandle.pagination;
    pagination.setCollection(inputCollection);
    return pagination.paginatedCollection();
  };

});
