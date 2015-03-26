describe('Directive: paginationLimit', function () {
  'use strict';

  // load the controller's module
  beforeEach(module('stPagination'));

  beforeEach(function () {
    this.addMatchers(customJasmineMatchers);
  });

  function getOptionValuesByText($select) {
    var optionValueByText = {};
    $select.find('option').each(function (i, option) {
      var $option = angular.element(option);
      optionValueByText[$option.text()] = $option.val();
    });
    return optionValueByText;
  }
  var $scope, $basicPaginationLimit, $directiveScope, $compile, $filter, StPagination;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, _$compile_, _$filter_, _StPagination_) {
    $compile = _$compile_;
    $filter = _$filter_;
    StPagination = _StPagination_;
    $scope = $rootScope.$new();
    $basicPaginationLimit = $compile('<st-pagination-limit collection="commits"></st-pagination-limit>')($scope);
    $directiveScope = $basicPaginationLimit.isolateScope();
  }));

  it('should create and replace the st-pagination-limit with a select tag', function () {
    expect($basicPaginationLimit[0].tagName).toBe('SELECT');
  });

  it('should create a new and isolated scope', function () {
    expect($directiveScope).toBeDefined();
    expect($directiveScope.$id).not.toBe($scope.$id);
    expect($directiveScope.commits).toBe(undefined);
  });

  it('should set default limits to [10,20,50]', function () {
    expect($directiveScope.limits()).toEqual([10,20,50]);
  });

  it('should allow to set the limits to different value', function () {
    var tmpl = '<st-pagination-limit collection="commits" limits="[10,20,50,100]"></st-pagination-limit>';
    var $element = $compile(tmpl)($scope);
    expect($element.isolateScope().limits()).toEqual([10,20,50,100]);
  });

  it('should extract pagination object correctly from the collection', function () {
    $scope.commits = [];
    $filter('stPagination')($scope.commits);

    $scope.$apply();

    expect($directiveScope.pagination).toBe($scope.commits.pagination);
    expect($directiveScope.pagination).toBeInstanceOf(StPagination);
  });


  it('should not define a pagination if non is set to the collection', function () {
    $scope.commits = undefined;

    $scope.$apply();
    expect($directiveScope.pagination).not.toBeDefined();

    $scope.commits = [];
    $scope.$apply();
    expect($directiveScope.pagination).not.toBeDefined();
  });

  it('should reset the pagination if the collection is reset', function () {
    $scope.commits = [];
    $filter('stPagination')($scope.commits);

    $scope.$apply();
    expect($directiveScope.pagination).toBeDefined();

    $scope.commits = [];
    $scope.$apply();
    expect($directiveScope.pagination).not.toBeDefined();
  });

  it('updates the limit on the pagination object', function () {
    $scope.commits = [];
    $filter('stPagination')($scope.commits);
    $scope.$apply();

    expect($scope.commits.pagination._limit).toBe(10);

    var optionValueByText = getOptionValuesByText($basicPaginationLimit);
    $basicPaginationLimit.val(optionValueByText[20]).trigger('change');

    $scope.$apply();
    expect($scope.commits.pagination._limit).toBe(20);
  });

  it('initializes the select values', function () {
    $scope.commits = [];
    $filter('stPagination')($scope.commits);
    $scope.$apply();

    expect($basicPaginationLimit.find(':selected').text()).toBe('10');
    expect($basicPaginationLimit.find('option:nth-child(2)').text()).toBe('20');
  });

});
