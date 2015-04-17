'use strict';

function PaginationServerConfig() {

}

angular.extend(PaginationServerConfig.prototype, {
  get: {
    total: function (data) {
      return data.total;
    },
    collection: function (data) {
      return data.collection;
    }
  }
});
