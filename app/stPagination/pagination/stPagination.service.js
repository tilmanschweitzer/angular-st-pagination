angular.module('stPagination').provider('stPagination', function() {
  'use strict';

  this.setDefaultLimit = function(defaultLimit) {
    Pagination.DEFAULT_LIMIT = defaultLimit;
  };

  this.setDefaultEdgeRange = function(defaultEdgeRange) {
    Pagination.DEFAULT_EDGE_RANGE = defaultEdgeRange;
  };

  this.setDefaultMidRange = function(defaultMidRange) {
    Pagination.DEFAULT_MID_RANGE = defaultMidRange;
  };

  this.$get = function() {
    return {
      hasPagination: function(collection) {
        return collection && collection.pagination instanceof Pagination;
      },
      Pagination: Pagination,
      range: RangeBuilder.range,
      indexRangeBuilder: function(length) {
        return new RangeBuilder(length);
      }
    };
  };
});
