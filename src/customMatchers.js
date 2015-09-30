window.customJasmineMatchers = {
  toBeInstanceOf: function () {
    'use strict';

    return {
      compare: function (actual, expected) {
        var result = {};

        result.pass = actual instanceof expected;

        var instanceName = actual.constructor.name;

        if (!result.pass) {
          result.message = 'Expected ' + actual + ' to be an instance of "' + expected.name +
            '", but was instance of "' + instanceName + '"';
        }
        return result;
      }
    };
  },
  toHaveAnIsolatedScope: function () {
    'use strict';

    return {
      compare: function (actual) {
        if (!actual.isolateScope) {
          return {
            pass: false,
            message: 'Expected ' + actual + ' to have an isolated scope, but it seems not to be a scope.'
          };
        } else if (actual.isolateScope() === undefined) {
          return {
            pass: false,
            message: 'Expected ' + actual + ' to have an isolated scope.'
          };
        } else {
          return {
            pass: true
          };
        }
      }
    };
  }
};
