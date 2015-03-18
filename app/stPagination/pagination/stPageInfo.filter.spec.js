describe('Filter: stPageInfo', function () {
  'use strict';

  // load the controller's module
  beforeEach(module('stPagination'));

  var $scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $filter) {
    $scope = $rootScope.$new();
    $scope.commits = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
    $filter('stPagination')($scope.commits);
  }));

  it('should throw an error for undefined properties', inject(function ($filter) {
    expect(function () {
      $filter('stPageInfo')($scope.commits, 'undefinedProperty');
    }).toThrow(new Error('No display property "undefinedProperty" defined for the stPageInfo filter'));
  }));

  it('should pass the input for inputs without pagination', inject(function ($filter) {
    expect($filter('stPageInfo')([], 'totalPages')).toEqual([]);
    expect($filter('stPageInfo')(123, 'currentPage')).toEqual(123);
    expect($filter('stPageInfo')({}, 'totalPages')).toEqual({});
    expect($filter('stPageInfo')(undefined, 'totalPages')).toEqual(undefined);
    expect($filter('stPageInfo')('', 'totalPages')).toEqual('');
  }));

  it('should get number of total pages with  "totalPages"', inject(function ($filter) {
    expect($filter('stPageInfo')($scope.commits, 'totalPages')).toBe(3);
  }));

  it('should get the current page number (staring at 1) with "currentPage"', inject(function ($filter) {
    expect($filter('stPageInfo')($scope.commits, 'currentPage')).toBe(1);
  }));

  it('should get the current page number after next (staring at 2) with "currentPage"', inject(function ($filter) {
    $scope.commits.pagination.next();
    expect($filter('stPageInfo')($scope.commits, 'currentPage')).toBe(2);
  }));

  it('should get the current start index (1)', inject(function ($filter) {
    expect($filter('stPageInfo')($scope.commits, 'startIndex')).toBe(1);
  }));

  it('should get the current start index after next (11)', inject(function ($filter) {
    $scope.commits.pagination.next();
    expect($filter('stPageInfo')($scope.commits, 'startIndex')).toBe(11);
  }));

  it('should get the current stop index (10)', inject(function ($filter) {
    expect($filter('stPageInfo')($scope.commits, 'stopIndex')).toBe(10);
  }));

  it('should get the current start index after next (20)', inject(function ($filter) {
    $scope.commits.pagination.next();
    expect($filter('stPageInfo')($scope.commits, 'stopIndex')).toBe(20);
  }));

  it('should get the current start index after 2 x next (23)', inject(function ($filter) {
    $scope.commits.pagination.next();
    $scope.commits.pagination.next();
    expect($filter('stPageInfo')($scope.commits, 'stopIndex')).toBe(23);
  }));
});
