angular.module('stPagination').filter('stPagination', function (StPagination) {
  'use strict';

  return function (inputCollection, originalCollection) {
    var collectionWithPaginationHandle;

    if (!inputCollection) {
      return;
    }

    collectionWithPaginationHandle = originalCollection || inputCollection;

    if (!StPagination.hasPagination(collectionWithPaginationHandle)) {
      collectionWithPaginationHandle.pagination = new StPagination(inputCollection);
    }
    var pagination = collectionWithPaginationHandle.pagination;
    pagination.setInputCollection(inputCollection);
    return pagination.paginatedInputCollection();
  };
});
