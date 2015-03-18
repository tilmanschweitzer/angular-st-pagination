angular.module('stPagination').filter('stPageInfo', function (StPagination) {
  'use strict';

  var propertyNameToFunctionMapping = {
    total: 'length',
    totalPages: 'totalPages',
    currentPage: 'displayPage',
    startIndex: 'displayStart',
    stopIndex: 'stop'
  };

  return function (inputCollection, propertyName) {
    if (StPagination.hasPagination(inputCollection) && propertyName) {
      var fnName = propertyNameToFunctionMapping[propertyName];
      if (!fnName) {
        throw new Error('No display property "' + propertyName + '" defined for the stPageInfo filter');
      }
      return inputCollection.pagination[fnName]();
    } else {
      return inputCollection;
    }
  };
});
