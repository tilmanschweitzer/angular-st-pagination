'use strict';

describe('Service: findPropertyName', function () {

  // load the controller's module
  beforeEach(module('stPagination'));

  it('should find a property name in an object', inject(function (findPropertyName) {
    var property = {};
    var object = {
      myProperty: property
    };
    expect(findPropertyName(property,  object)).toBe("myProperty");
  }));

  it('should find a property name in a nested object', inject(function (findPropertyName) {
    var property = {};
    var object = {
      nestedProperty: {
        myProperty: property
      }
    };
    expect(findPropertyName(property,  object)).toBe("nestedProperty.myProperty");
  }));

  it('should find a property name in an $scope', inject(function ($rootScope, findPropertyName) {
    var $scope = $rootScope.$new();
    $scope.myProperty = {};
    expect(findPropertyName($scope.myProperty, $scope)).toBe("myProperty");
  }));

  it('should find a property name in a child $scope', inject(function ($rootScope, findPropertyName) {
    var $parentScope = $rootScope.$new();
    var $scope = $parentScope.$new();

    var property = {};

    $parentScope.myProperty = property;
    expect(findPropertyName(property, $scope)).toBe("$parent.myProperty");
  }));
});
