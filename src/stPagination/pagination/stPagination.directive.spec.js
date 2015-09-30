describe('Directive: pagination', function () {
  'use strict';

  beforeEach(module('stPagination'));

  beforeEach(function () {
    jasmine.addMatchers(customJasmineMatchers);
  });

  var $scope, $simplePagination, $compile, $filter;

  beforeEach(inject(function ($rootScope, _$filter_, _$compile_) {
    $compile = _$compile_;
    $filter = _$filter_;
    $scope = $rootScope.$new().$new();
    $scope.commits = [];
    $filter('stPagination')($scope.commits);
    $simplePagination = $compile('<st-pagination collection="commits"></st-pagination>')($scope);
    $scope.$apply();
  }));

  it('should create and replace the pagination with a list tag (UL)', function () {
    expect($simplePagination[0].tagName).toBe('UL');
  });

  it('should created an new and isolated scope', function () {
    expect($simplePagination).toHaveAnIsolatedScope();
  });

  it('should set the collection correctly', function () {
    expect($simplePagination.isolateScope().collection).toBe($scope.commits);
  });

  it('should set the pagination of the collection correctly', function () {
    expect($simplePagination.isolateScope().pagination).toBe($scope.commits.pagination);
  });

  it('should throw an error if the collection has no pagination', function () {
    $scope.otherCommits = [];
    var msg = 'Collection "otherCommits" in the pagination directive is not used with a neccessary pagination filter.';
    expect(function () {
      $compile('<st-pagination collection="otherCommits"></st-pagination>')($scope);
      $scope.$apply();
    }).toThrow(new Error(msg));
  });

  it('should accept an not defined collection without errors', function () {
    $compile('<st-pagination collection="undefinedCollection"></st-pagination>')($scope);
    $scope.$apply();
  });

  describe('displayIndex', function () {
    var $simplePaginationScope;
    beforeEach(function () {
      $simplePaginationScope = $simplePagination.isolateScope();
    });
    it('should increment a index by 1', function () {
      expect($simplePaginationScope.displayIndex(0)).toBe(1);
      expect($simplePaginationScope.displayIndex(1)).toBe(2);
    });

    it('should return "..." for an array', function () {
      expect($simplePaginationScope.displayIndex([1, 2, 3])).toBe('...');
    });

    it('should pass other values', function () {
      expect($simplePaginationScope.displayIndex('123')).toBe('123');
      expect($simplePaginationScope.displayIndex(undefined)).toBe(undefined);
      expect($simplePaginationScope.displayIndex({})).toEqual({});
    });
  });

  describe('event handling', function () {
    var $prev, $page1, $page2, $page3, $next;

    beforeEach(function () {
      $scope.commits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
      $filter('stPagination')($scope.commits);
      $scope.commits.pagination.setPage(1);
      $scope.$apply();

      spyOn($scope.commits.pagination, 'next');
      spyOn($scope.commits.pagination, 'prev');
      spyOn($scope.commits.pagination, 'setPage');

      $scope.$apply();

      $prev = $simplePagination.find('li:eq(0)');
      $page1 = $simplePagination.find('li:eq(1)');
      $page2 = $simplePagination.find('li:eq(2)');
      $page3 = $simplePagination.find('li:eq(3)');
      $next = $simplePagination.find('li:eq(4)');
    });

    it('example should have 3 pages', function () {
      expect($simplePagination.isolateScope().pagination.totalPages()).toBe(3);
    });

    it('example have 5 list elements (prev, 1, 2, 3, next)', function () {
      expect($simplePagination.find('li').length).toBe(5);
    });

    it('example have an active button for page 2', function () {
      expect($page2.hasClass('active')).toBe(true);
    });

    it('example have the displayed elements « 1 2 3 »', function () {
      expect($prev.find('a').text()).toBe('«');
      expect($next.find('a').text()).toBe('»');
      expect($page1.find('a').text()).toBe('1');
      expect($page2.find('a').text()).toBe('2');
      expect($page3.find('a').text()).toBe('3');
    });

    it('should call prev page when clicking on the prev button', function () {
      $prev.find('a').trigger('click');
      expect($scope.commits.pagination.prev).toHaveBeenCalled();
      expect($scope.commits.pagination.next).not.toHaveBeenCalled();
    });

    it('should call next page when clicking on the next button', function () {
      $next.find('a').trigger('click');
      expect($scope.commits.pagination.next).toHaveBeenCalled();
      expect($scope.commits.pagination.prev).not.toHaveBeenCalled();
    });

    it('should call setPage with 1 when clicking on page 2', function () {
      $page2.find('a').trigger('click');
      expect($scope.commits.pagination.setPage).toHaveBeenCalledWith(1);
      expect($scope.commits.pagination.prev).not.toHaveBeenCalled();
      expect($scope.commits.pagination.next).not.toHaveBeenCalled();
    });
  });

});
