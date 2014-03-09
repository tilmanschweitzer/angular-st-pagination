'use strict';

angular.module("stPagination").factory("findPropertyName", function () {

  function findPropertyName(property, object) {

    try {
      if (angular.isObject(object)) {
        angular.forEach(object, function (value, key) {
          if (value === object || (key[0] === "$" && key !== "$parent")) {
            return;
          }
          if (value === property) {
            throw key;
          } else {
            var nestedName = findPropertyName(property, object[key]);
            if (nestedName) {
              throw key + "." + nestedName;
            }
          }
        });
      }
    } catch (result) {
      return result;
    }
  }

  return findPropertyName;
});