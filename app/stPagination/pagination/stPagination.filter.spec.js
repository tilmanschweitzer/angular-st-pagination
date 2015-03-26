describe('Filter: pagination', function () {
  'use strict';

  beforeEach(module('stPagination'));

  beforeEach(function () {
    this.addMatchers(customJasmineMatchers);
  });

  var $scope, $filter, StPagination, $compile;

  beforeEach(inject(function ($rootScope, _$filter_, _$compile_, _StPagination_) {
    $scope = $rootScope.$new();
    $filter = _$filter_;
    $compile = _$compile_;
    StPagination = _StPagination_;
  }));

  it('should create a pagination property on an collection', function () {
    var someCollection = [];
    $filter('stPagination')(someCollection);
    expect(someCollection.pagination).not.toBe(undefined);
  });

  it('should create a pagination property with the Pagination type', function () {
    var someCollection = [];
    $filter('stPagination')(someCollection);
    expect(someCollection.pagination).toBeInstanceOf(StPagination);
  });

  it('should link the created pagination with the collection', function () {
    var someCollection = [];
    $filter('stPagination')(someCollection);
    expect(someCollection.pagination._inputCollection).toBe(someCollection);
  });

  it('should ignore undefined inputs', function () {
    expect($filter('stPagination')(undefined)).toBe(undefined);
  });

  it('should use a default limit of 10', function () {
    var array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    var result = $filter('stPagination')(array);
    expect(result.length).toBe(10);
    expect(result).toEqual(array.slice(0, 10));
  });

  it('should work with directly passed collections', function () {
    $scope.collection = [1, 2, 3];
    var tmpl = '<li ng-repeat="element in collection | orderBy:\'number\' | stPagination:collection">{{element}}</li>';
    $compile(tmpl)($scope);
    $scope.$apply();
    expect($scope.collection.pagination).toBeInstanceOf(StPagination);
  });

  it('should use a default limit of 10', function () {
    var array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    $filter('stPagination')(array);
    array.pagination.setLimit(20);
    var result =  $filter('stPagination')(array);

    expect(result.length).toBe(20);
    expect(result).toEqual(array.slice(0, 20));
  });
});
