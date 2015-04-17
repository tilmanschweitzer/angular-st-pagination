'use strict';

function ServerPagination(inputCollection, serverPaginationConfiguration) {
  Pagination.apply(this, arguments);

  this.config = serverPaginationConfiguration;

  this._serverResult = {
    total: this._limit
  };

  this.loadData();
}

ServerPagination.prototype = new Pagination();

angular.extend(ServerPagination.prototype, {
  paginatedCollection: function() {
    return this._serverResult.collection;
  },
  setServerResult: function(data) {
    this._serverResult = {
      collection: this.config.get.collection(data),
      total: this.config.get.total(data)
    };
    this._collection.length = this.getLimit();
    angular.extend(this._collection, this._serverResult.collection);
  },
  length: function() {
    return this._serverResult.total;
  },
  next: function() {
    Pagination.prototype.next.apply(this, arguments);
    this.loadData();
  },
  prev: function() {
    Pagination.prototype.prev.apply(this, arguments);
    this.loadData();
  },
  setPage: function() {
    Pagination.prototype.setPage.apply(this, arguments);
    this.loadData();
  },
  setLimit: function() {
    Pagination.prototype.setLimit.apply(this, arguments);
    this.loadData();
  },
  loadData: function() {
    var url = this.config.url;
    url = url.replace(':start', this.start());
    url = url.replace(':end', this.stop());
    ServerPagination.$http.get(url).success(angular.bind(this, this.setServerResult));
  }
});
