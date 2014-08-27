'use strict';

angular.module('stPagination').factory("Pagination", function (indexUtil) {

  function Pagination(inputCollection) {
    this.$inputCollection = inputCollection;
    this.$limit = 10;
    this.$page = 0;
    this.$cachedReducedIndices = {};
  }

  function hasPagination(collection) {
    return collection && collection.pagination instanceof Pagination;
  }

  function isNumberOrDefault(number, defaultValue) {
    return angular.isNumber(number) ? number : defaultValue;
  }

  Pagination.hasPagination = hasPagination;

  angular.extend(Pagination.prototype, {
    setInputCollection: function (inputCollection) {
      this.$inputCollection = inputCollection;
      this.checkPageLimits();
    },
    paginatedInputCollection: function () {
      return this.$inputCollection.slice(this.start(), this.stop());
    },
    inputCollection: function () {
      return this.$inputCollection;
    },
    start: function () {
      return this.offset();
    },
    stop: function () {
      var stop = this.offset() + this.limit();
      if (stop < this.length()) {
        return stop;
      } else {
        return this.length();
      }
    },
    length: function () {
      return this.$inputCollection.length;
    },
    setLimit: function (limit) {
      this.$limit = limit;
    },
    totalPages: function () {
      return Math.ceil(this.$inputCollection.length / this.limit()) || 1;
    },
    offset: function () {
      return this.$page * this.$limit;
    },
    page: function () {
      return this.$page;
    },
    next: function () {
      this.$page += 1;
      this.checkPageLimits();
    },
    prev: function () {
      this.$page -= 1;
      this.checkPageLimits();
    },
    limit: function () {
      return this.$limit;
    },
    setPage: function (page) {
      if (!angular.isArray(page)) {
        this.$page = page;
      } else {
        var middleIndex = Math.floor((page.length / 2));
        this.$page = page[middleIndex];
      }
      this.checkPageLimits();
    },
    checkPageLimits: function () {
      if (this.$page < 0) {
        this.$page = 0;
      } else if (this.$page > this.lastPage()) {
        this.$page = this.lastPage();
      }
    },
    onFirstPage: function () {
      return this.page() === 0;
    },
    onLastPage: function () {
      return this.page() === this.lastPage();
    },
    onPage: function (page) {
      return this.page() === page;
    },
    lastPage: function () {
      return this.totalPages() - 1;
    },
    reducedIndices: function (midRange, edgeRange) {
      midRange = isNumberOrDefault(midRange, 3);
      edgeRange = isNumberOrDefault(edgeRange, 3);

      var indexCacheKey = this.indexCacheKey(midRange, edgeRange);
      if (this.$cachedReducedIndices[indexCacheKey]) {
        return this.$cachedReducedIndices[indexCacheKey];
      } else {
        var page = this.page();
        var total = this.totalPages();
        var rangeBuilder = indexUtil.rangeBuilder(total).foldWithMidAndEdgeRangeForIndex(page, midRange, edgeRange);
        var indices = rangeBuilder.build();
        this.$cachedReducedIndices[indexCacheKey] = indices;
        return indices;
      }
    },
    indexCacheKey: function (midRange, edgeRange) {
      return this.page() + "-" + this.limit() + "-" + this.length() + "-" + midRange + "-" + edgeRange;
    },
    displayPage: function () {
      return this.page() + 1;
    },
    displayStart: function () {
      return this.start() + 1;
    }
  });

  return Pagination;
});
