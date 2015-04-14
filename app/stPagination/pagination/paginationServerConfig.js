'use strict';

angular.module('stPagination').factory("paginationServerConfig", function () {

  function PaginationServerConfig() {

  }

  function paginationServerConfig(configOptions) {
    var config = new PaginationServerConfig();
    angular.extend(config, configOptions);
    return config;
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

  return paginationServerConfig;
});
