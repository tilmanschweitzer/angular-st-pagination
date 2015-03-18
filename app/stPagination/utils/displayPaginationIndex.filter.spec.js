describe('Filter: displayPaginationIndex', function () {
  'use strict';

  // load the controller's module
  beforeEach(module('stPagination'));

  it('should increment a index by 1', inject(function ($filter) {
    expect($filter('displayPaginationIndex')(0)).toBe(1);
    expect($filter('displayPaginationIndex')(1)).toBe(2);
  }));

  it('should return "..." for an array', inject(function ($filter) {
    expect($filter('displayPaginationIndex')([1,2,3])).toBe('...');
  }));

  it('should pass other values', inject(function ($filter) {
    expect($filter('displayPaginationIndex')('123')).toBe('123');
    expect($filter('displayPaginationIndex')(undefined)).toBe(undefined);
    expect($filter('displayPaginationIndex')({})).toEqual({});
  }));
});
