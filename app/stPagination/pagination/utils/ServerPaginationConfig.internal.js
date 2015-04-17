'use strict';

function PaginationServerConfig() {

}

angular.extend(PaginationServerConfig.prototype, {
  get: {
    total: function (data) {
      return data.total;
    },
    start: function (data) {
      return data.start;
    },
    end: function (data) {
      return data.end;
    },
    collection: function (data) {
      return data.collection;
    }
  }
});
