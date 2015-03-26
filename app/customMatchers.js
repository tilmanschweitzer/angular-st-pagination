'use strict';

window.customJasmine20Matchers = {
  toBeInstanceOf: function () {
    return {
      compare: function (actual, expected) {
        var result = {};

        result.pass = actual instanceof expected;

        var instanceName = actual.constructor.name;

        if (!result.pass) {
          result.message = 'Expected ' +  actual + ' to be an instance of "' +  expected.name +
              '", but was instance of "' + instanceName + '"';
        }
        return result;
      }
    };
  },
  toHaveAnIsolatedScope: function () {
    return {
      compare: function (actual) {
        var scope = actual.scope();
        if (!scope.$parent) {
          return {
            pass: false,
            message: 'Expected ' + actual + ' to have an isolated scope, but it seems not to be a scope.'
          };
        } else if (Object.getPrototypeOf(scope) === scope.$parent) {
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

function create10CompatipleJasmineMatcher (jasmine20Matcher) {
  return function (expected) {
    var actual = this.actual;
    var result = jasmine20Matcher().compare.call(undefined, actual, expected);
    this.message = result.message + "\n";
    return result.pass;
  };
}

window.customJasmineMatchers = {};

['toBeInstanceOf', 'toHaveAnIsolatedScope'].forEach(function (customMatcherName) {
  var jasmine20Matcher = window.customJasmine20Matchers[customMatcherName];
  window.customJasmineMatchers[customMatcherName] = create10CompatipleJasmineMatcher(jasmine20Matcher);
});

(function() {
  // simple patch for angular 1.2 isolateScope function
  var elementPrototype = angular.element(window.document).constructor.prototype;
  elementPrototype.isolateScope = elementPrototype.scope;

  // jasmine 1.0 polyfill
  window.customJasmineMatchers.toContain = function (expected) {
    var actual = this.actual || [];
    return actual.indexOf(expected) >= 0;
  };
}());
