angular.module('stPagination').factory('stPagination', function (indexUtil) {
  'use strict';

  function Pagination(inputCollection) {
    this._inputCollection = inputCollection;
    this._limit = 10;
    this._page = 0;
    this._cachedReducedIndices = {};
  }

  // exports
  var stPagination = {
    hasPagination: function (collection) {
      return collection && collection.pagination instanceof Pagination;
    },
    Pagination: Pagination
  };

  function isNumberOrDefault(number, defaultValue) {
    return angular.isNumber(number) ? number : defaultValue;
  }

  angular.extend(Pagination.prototype, {
    setInputCollection: function (inputCollection) {
      this._inputCollection = inputCollection;
      this.checkPageLimits();
    },
    paginatedInputCollection: function () {
      return this._inputCollection.slice(this.start(), this.stop());
    },
    inputCollection: function () {
      return this._inputCollection;
    },
    start: function () {
      return this.offset();
    },
    stop: function () {
      var stop = this.offset() + this.getLimit();
      if (stop < this.length()) {
        return stop;
      } else {
        return this.length();
      }
    },
    length: function () {
      return this._inputCollection.length;
    },
    setLimit: function (limit) {
      this._limit = limit;
    },
    totalPages: function () {
      return Math.ceil(this._inputCollection.length / this.getLimit()) || 1;
    },
    offset: function () {
      return this._page * this._limit;
    },
    page: function () {
      return this._page;
    },
    next: function () {
      this._page += 1;
      this.checkPageLimits();
    },
    prev: function () {
      this._page -= 1;
      this.checkPageLimits();
    },
    getLimit: function () {
      return this._limit;
    },
    setPage: function (page) {
      if (!angular.isArray(page)) {
        this._page = page;
      } else {
        var middleIndex = Math.floor(((page.length - 1) / 2));
        this._page = page[middleIndex];
      }
      this.checkPageLimits();
    },
    checkPageLimits: function () {
      if (this._page < 0) {
        this._page = 0;
      } else if (this._page > this.lastPage()) {
        this._page = this.lastPage();
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
      if (this._cachedReducedIndices[indexCacheKey]) {
        return this._cachedReducedIndices[indexCacheKey];
      } else {
        var page = this.page();
        var total = this.totalPages();
        var rangeBuilder = indexUtil.rangeBuilder(total).foldWithMidAndEdgeRangeForIndex(page, midRange, edgeRange);
        var indices = rangeBuilder.build();
        this._cachedReducedIndices[indexCacheKey] = indices;
        return indices;
      }
    },
    indexCacheKey: function (midRange, edgeRange) {
      return this.page() + '-' + this.getLimit() + '-' + this.length() + '-' + midRange + '-' + edgeRange;
    },
    displayPage: function () {
      return this.page() + 1;
    },
    displayStart: function () {
      return this.start() + 1;
    }
  });

  return stPagination;
});
