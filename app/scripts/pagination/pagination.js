'use strict';

angular.module('stPagination').service("Pagination", function () {

  function Pagination(inputCollection) {
    this.$inputCollection = inputCollection;
    this.$limit = 10;
    this.$page = 0;
  }

  angular.extend(Pagination.prototype, {
    setInputCollection: function (inputCollection) {
      this.$inputCollection = inputCollection;
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
      return this.offset() + this.limit();
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
      this.$page = page;
      this.checkPageLimits();
    },
    checkPageLimits: function () {
      if (this.$page < 0) {
        this.$page = 0;
      } else if (this.$page > this.lastPage()) {
        this.$page = this.lastPage();
      }
    },
    displayPage: function () {
      return this.page() + 1;
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
    indices: function () {
      return Array.apply(null, new Array(this.totalPages())).map(function (_, i) {return i;});
    }
  });

  return Pagination;
});
