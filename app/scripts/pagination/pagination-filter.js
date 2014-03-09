'use strict';

angular.module('stPagination').filter('pagination', function (Pagination, findPropertyName, $log) {

  function hasPagination(collection) {
    return collection && collection.pagination instanceof Pagination;
  }

  return function (inputCollection, originalCollection) {
    var collectionWithPaginationHandle;

    if (!inputCollection) {
      return;
    }

    if (originalCollection) {
      collectionWithPaginationHandle = originalCollection;
    } else {
      collectionWithPaginationHandle = inputCollection;
    }

    if (!(hasPagination(collectionWithPaginationHandle))) {
      collectionWithPaginationHandle.pagination = new Pagination(inputCollection);

      if (this && this.$watch) {
        var collectionName = findPropertyName(collectionWithPaginationHandle, this);

        if (collectionName) {
          this.$watch(collectionName, function (newCollection, oldCollection) {
            if (hasPagination(oldCollection)) {
              newCollection.pagination = oldCollection.pagination;
            }
          });
        } else {
          throw new Error("Collection passed to pagination filter was not found in the scope. " +
              "Pass it to the filter if you have other filters in between.\n" +
              "element in collection | orderBy:'id' | pagination:collection");
        }
      }
    }
    var pagination = collectionWithPaginationHandle.pagination;
    pagination.setInputCollection(inputCollection);
    return pagination.paginatedInputCollection();
  };
});



