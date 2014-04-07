'use strict';

angular.module('stPagination').factory("ServerPagination", function (Pagination, $http) {

  function ServerPagination(inputCollection, serverPaginationConfiguration) {
    Pagination.apply(this, arguments);

    this.config = serverPaginationConfiguration;

    this.$serverResult = {
      total: this.$limit
    };

    this.loadData();
  }

  function hasPagination(collection) {
    return collection && collection.pagination instanceof ServerPagination;
  }

  ServerPagination.hasPagination = hasPagination;

  ServerPagination.prototype = new Pagination();

  angular.extend(ServerPagination.prototype, {

    paginatedInputCollection: function () {
      return this.$serverResult.collection;
    },
    setServerResult: function (data) {
      this.$serverResult = {
        collection: this.config.get.collection(data),
        total: this.config.get.total(data)
      };
      this.$inputCollection.length = this.limit();
      angular.extend(this.$inputCollection, this.$serverResult.collection);
    },
    length: function () {
      return this.$serverResult.total;
    },
    next: function () {
      Pagination.prototype.next.apply(this, arguments);
      this.loadData();
    },
    prev: function () {
      Pagination.prototype.prev.apply(this, arguments);
      this.loadData();
    },
    setPage: function () {
      Pagination.prototype.setPage.apply(this, arguments);
      this.loadData();
    },
    setLimit: function () {
      Pagination.prototype.setLimit.apply(this, arguments);
      this.loadData();
    },
    loadData: function () {
      var url = this.config.url;
      url = url.replace(":start", this.start());
      url = url.replace(":end", this.stop());
      $http.get(url).success(this.setServerResult.bind(this));
    }
  });

  return ServerPagination;
});
