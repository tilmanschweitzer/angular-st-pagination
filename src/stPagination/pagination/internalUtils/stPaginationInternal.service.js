/* eslint no-invalid-this: 0 */
angular.module('stPagination').provider('stPaginationInternal', function () {
  'use strict';

  this.Pagination = Pagination;
  this.RangeBuilder = RangeBuilder;

  this.$get = function () {

  };

  function Pagination(collection) {
    this._collection = collection;
    this._limit = Pagination.DEFAULT_LIMIT;
    this._page = 0;
    this._cachedIndices = {};
  }

  Pagination.isNumberOrDefault = function (number, defaultValue) {
    return angular.isNumber(number) ? number : defaultValue;
  };

  Pagination.DEFAULT_LIMIT = 10;
  Pagination.DEFAULT_EDGE_RANGE = 3;
  Pagination.DEFAULT_MID_RANGE = 3;

  angular.extend(Pagination.prototype, {
    setCollection: function (collection) {
      this._collection = collection;
      this.checkPageLimits();
    },
    paginatedCollection: function () {
      return this._collection.slice(this.start(), this.stop());
    },
    collection: function () {
      return this._collection;
    },
    start: function () {
      return this.offset();
    },
    stop: function () {
      var length = this.length();
      var stop = this.offset() + this.getLimit();
      return stop < length ? stop : length;
    },
    length: function () {
      return this._collection.length;
    },
    setLimit: function (limit) {
      this._limit = limit;
    },
    totalPages: function () {
      return Math.ceil(this._collection.length / this.getLimit()) || 1;
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
      midRange = Pagination.isNumberOrDefault(midRange, Pagination.DEFAULT_MID_RANGE);
      edgeRange = Pagination.isNumberOrDefault(edgeRange, Pagination.DEFAULT_EDGE_RANGE);

      var indexCacheKey = this.indexCacheKey(midRange, edgeRange);
      if (this._cachedIndices[indexCacheKey]) {
        return this._cachedIndices[indexCacheKey];
      } else {
        var rangeBuilder = new RangeBuilder(this.totalPages());
        rangeBuilder.foldForIndex(this.page(), midRange, edgeRange);
        var indices = rangeBuilder.build();
        this._cachedIndices[indexCacheKey] = indices;
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


  function RangeBuilder(rangeLength) {
    this.array = RangeBuilder.range(rangeLength);
    this.lastIndex = rangeLength - 1;
  }

  RangeBuilder.range = function (length) {
    return Array.apply(null, new Array(length)).map(function (_, i) {
      return i;
    });
  };

  angular.extend(RangeBuilder.prototype, {
    build: function () {
      return this.array;
    },
    foldRange: function (start, stop) {
      var oldArray = this.array;
      var newArray = this.array = [];
      oldArray.forEach(function (value) {
        if (value < start || value > stop || angular.isArray(value)) {
          newArray.push(value);
        } else {
          var lastElement = newArray[newArray.length - 1];
          if (angular.isArray(lastElement)) {
            lastElement.push(value);
          } else {
            newArray.push([value]);
          }
        }
      });
      return this;
    },
    foldForIndex: function (index, midRange, edgeRange) {
      var firstFoldStart = 0 + edgeRange;
      var firstFoldStop = index - midRange;
      var secondFoldStart = index + midRange;
      var secondFoldStop = this.lastIndex - edgeRange;
      if (index <= edgeRange + midRange) {
        firstFoldStart = edgeRange + midRange * 2;
        return this.foldRange(firstFoldStart, secondFoldStop);
      } else if (index >= (this.lastIndex - (edgeRange + midRange))) {
        secondFoldStop = this.lastIndex - (edgeRange + midRange * 2);
        return this.foldRange(firstFoldStart, secondFoldStop);
      } else {
        return this.foldRange(firstFoldStart, firstFoldStop).foldRange(secondFoldStart, secondFoldStop);
      }
    }
  });

});
