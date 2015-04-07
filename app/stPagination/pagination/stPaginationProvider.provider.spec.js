describe('stPaginationProvider', function() {
  'use strict';

  var INITIAL_DEFAULT_LIMIT;
  var testArray;
  var testArrayPagination;

  var stPaginationProvider;
  var stPagination;

  beforeEach(module('stPagination'));

  beforeEach(module(function(_stPaginationProvider_) {
    stPaginationProvider = _stPaginationProvider_;
  }));

  beforeEach(inject(function(_stPagination_) {
    stPagination = _stPagination_;
  }));

  it('exists', function() {
    expect(stPaginationProvider).toBeDefined();
  });

  describe('configurable default values', function() {
    beforeEach(function() {
      INITIAL_DEFAULT_LIMIT = new stPagination.Pagination()._limit;
      testArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
      testArrayPagination = new stPagination.Pagination(testArray);
      testArrayPagination.setLimit(1);
      testArrayPagination.setPage(10);
    });

    afterEach(function() {
      // reset to defaultLimit
      stPaginationProvider.setDefaultLimit(INITIAL_DEFAULT_LIMIT);
      stPaginationProvider.setDefaultEdgeRange(3);
      stPaginationProvider.setDefaultMidRange(3);
    });

    it('has a default limit of 10', function() {
      expect(INITIAL_DEFAULT_LIMIT).toBe(10);
    });

    it('defines the default limit for a new Pagination', function() {
      stPaginationProvider.setDefaultLimit(20);
      var pagination = new stPagination.Pagination([]);
      expect(pagination._limit).toBe(20);
    });

    it('has a default mid and edge range of 3', function() {
      var expected = [0, 1, 2, [3, 4, 5, 6, 7], 8, 9, 10, 11, 12, [13, 14, 15, 16], 17, 18, 19];
      expect(testArrayPagination.reducedIndices()).toEqual(expected);
      expect(testArrayPagination.reducedIndices()).toEqual(testArrayPagination.reducedIndices(3, 3));
    });

    it('defines a default edge range of 1', function() {
      stPaginationProvider.setDefaultEdgeRange(1);
      var expected = [0, [1, 2, 3, 4, 5, 6, 7], 8, 9, 10, 11, 12, [13, 14, 15, 16, 17, 18], 19];
      expect(testArrayPagination.reducedIndices()).toEqual(expected);
      expect(testArrayPagination.reducedIndices()).toEqual(testArrayPagination.reducedIndices(3, 1));
    });

    it('defines a default mid range of 1', function() {
      stPaginationProvider.setDefaultMidRange(1);
      var expected = [0, 1, 2, [3, 4, 5, 6, 7, 8, 9], 10, [11, 12, 13, 14, 15, 16], 17, 18, 19];
      expect(testArrayPagination.reducedIndices()).toEqual(expected);
      expect(testArrayPagination.reducedIndices()).toEqual(testArrayPagination.reducedIndices(1, 3));
    });

    it('defines a default edge and mid range of 1', function() {
      stPaginationProvider.setDefaultEdgeRange(1);
      stPaginationProvider.setDefaultMidRange(1);
      var expected = [0, [1, 2, 3, 4, 5, 6, 7, 8, 9], 10, [11, 12, 13, 14, 15, 16, 17, 18], 19];
      expect(testArrayPagination.reducedIndices()).toEqual(expected);
      expect(testArrayPagination.reducedIndices()).toEqual(testArrayPagination.reducedIndices(1, 1));
    });
  });



});
