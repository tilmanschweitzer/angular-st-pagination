'use strict';

describe('Directive: paginationLimit', function () {

  // load the controller's module
  beforeEach(module('stPagination'));

  beforeEach(function () {
    jasmine.addMatchers(customJasmineMatchers);
  });

  var $scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();
  }));

  it('should create and replace the pagination-limit with a select tag', inject(function ($compile) {
    var $element = $compile('<pagination-limit collection="commits"></pagination-limit>')($scope);
    expect($element[0].tagName).toBe("SELECT");
  }));


  it('should created an new and isolated scope', inject(function ($compile) {
    $scope.commits = [];
    var $element = $compile('<pagination-limit collection="commits"></pagination-limit>')($scope);
    var $directiveScope = $element.isolateScope();
    expect($directiveScope).not.toBe(undefined);
    expect($directiveScope.$id).not.toBe($scope.$id);
    expect($directiveScope.commits).toBe(undefined);
  }));

  it('should set default limits to [10,20,50]', inject(function ($compile) {
    $scope.commits = [];
    var $element = $compile('<pagination-limit collection="commits"></pagination-limit>')($scope);
    var $directiveScope = $element.isolateScope();
    expect($directiveScope.limits()).toEqual([10,20,50]);
  }));

  it('should allow to set the limits to different value', inject(function ($compile) {
    $scope.commits = [];
    var $element = $compile('<pagination-limit collection="commits" limits="[10,20,50,100]"></pagination-limit>')($scope);
    var $directiveScope = $element.isolateScope();
    expect($directiveScope.limits()).toEqual([10,20,50,100]);
  }));

  it('should extract pagination object correctly from the collection', inject(function ($compile, $filter, Pagination) {
    $scope.commits = [];
    $filter("pagination")($scope.commits);
    var $element = $compile('<pagination-limit collection="commits" limits="[10,20,50,100]"></pagination-limit>')($scope);
    $scope.$apply();
    var $directiveScope = $element.isolateScope();
    expect($directiveScope.pagination).toBe($scope.commits.pagination);
    expect($directiveScope.pagination).toBeInstanceOf(Pagination);
  }));

});
