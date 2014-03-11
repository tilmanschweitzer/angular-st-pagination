'use strict';

var customJasmineMatchers = {
  toBeInstanceOf: function () {
    return {
      compare: function (actual, expected) {
        var result = {};

        result.pass = actual instanceof expected;

        var instanceName = actual.constructor.name;

        if (!result.pass) {
          result.message = "Expected " +  actual + " to be an instance of '" +  expected.name +
              "', but was instance of '" + instanceName + "'";
        }
        return result;
      }
    };
  }
};