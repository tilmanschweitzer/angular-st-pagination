'use strict';

describe('Filter: pagination', function () {

  // load the controller's module
  beforeEach(module('stPagination'));

  var mainController,
      $scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();
  }));

  it('should create a pagination property on an collection', inject(function ($filter) {
    var someCollection = [];
    $filter("pagination")(someCollection);
    expect(someCollection.pagination).not.toBe(undefined);
  }));

  it('should create a persistent pagination property through a usage in ng-repeat', inject(function ($compile) {
    $scope.collection = [1,2,3];
    var element = $compile('<li ng-repeat="element in collection | pagination">{{element}}</li>')($scope);
    $scope.$apply();
    $scope.collection = [4,5,6];
    $scope.$apply();

    expect($scope.collection.pagination).not.toBe(undefined);
  }));

  it('should ignore undefined inputs', inject(function ($filter) {
    expect($filter("pagination")(undefined)).toBe(undefined);
  }));
});
