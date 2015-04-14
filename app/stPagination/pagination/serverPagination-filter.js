'use strict';

angular.module('stPagination').filter('serverPagination', function (ServerPagination, findPropertyName) {

  return function (inputCollection, config) {
    var collectionWithPaginationHandle;

    if (!inputCollection) {
      return;
    }

    collectionWithPaginationHandle = inputCollection;


    if (!(ServerPagination.hasPagination(collectionWithPaginationHandle))) {
      collectionWithPaginationHandle.pagination = new ServerPagination(inputCollection, config);

      if (this && this.$watch) {
        var collectionName = findPropertyName(collectionWithPaginationHandle, this);

        if (collectionName) {
          this.$watch(collectionName, function (newCollection, oldCollection) {
            if (ServerPagination.hasPagination(oldCollection)) {
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



