'use strict';

describe('Filter: pagination', function () {

  // load the controller's module
  beforeEach(module('stPagination'));

  beforeEach(function() {
    this.addMatchers({
      toBeInstanceOf: function(expectedInstance) {
        var actual = this.actual;
        var notText = this.isNot ? " not" : "";
        this.message = function() {
          return "Expected " + actual.constructor.name + notText + " is instance of " + expectedInstance.name;
        };
        return actual instanceof expectedInstance;
      }
    });
  });

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

  it('should create a pagination property with the Pagination type', inject(function ($filter, Pagination) {
    var someCollection = [];
    $filter("pagination")(someCollection);
    expect(someCollection.pagination).toBeInstanceOf(Pagination);
  }));

  it('should link the created pagination with the collection', inject(function ($filter, Pagination) {
    var someCollection = [];
    $filter("pagination")(someCollection);
    expect(someCollection.pagination.collection).toBe(someCollection);
  }));

  it('should ignore undefined inputs', inject(function ($filter) {
    expect($filter("pagination")(undefined)).toBe(undefined);
  }));


  it('should work correctly with ng-repeat and keep the pagination', inject(function ($compile) {
    $scope.collection = [1,2,3];
    var element = $compile('<li ng-repeat="element in collection | pagination">{{element}}</li>')($scope);
    $scope.$apply();

    var paginationAfterFirstApply = $scope.collection.pagination;

    $scope.collection = [4,5,6];
    $scope.$apply();

    var paginationAfterSecondApply = $scope.collection.pagination;

    expect(paginationAfterFirstApply).toBe(paginationAfterSecondApply);
    expect(paginationAfterSecondApply.collection).toBe($scope.collection);

  }));
});
