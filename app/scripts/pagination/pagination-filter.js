'use strict';

angular.module('stPagination').filter('pagination', function (Pagination, findPropertyName) {

  function hasPagination(collection) {
    return collection && collection.pagination instanceof Pagination;
  }
  return function (collection) {
    if (!collection) {
      return;
    }

    if (!(hasPagination(collection))) {
      collection.pagination = new Pagination(collection);

      if (this && this.$watch) {
        var collectionName = findPropertyName(collection, this);
        this.$watch(collectionName, function (newCollection, oldCollection) {
          if (hasPagination(oldCollection)) {
            newCollection.pagination = oldCollection.pagination;
            newCollection.pagination.setCollection(newCollection);
          }
        });
      }
    }

    return collection;
  };
});



