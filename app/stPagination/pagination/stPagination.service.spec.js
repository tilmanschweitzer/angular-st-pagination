describe('stPagination', function() {
  'use strict';

  var stPagination;

  beforeEach(function() {
    module('stPagination');
  });

  beforeEach(inject(function(_stPagination_) {
    stPagination = _stPagination_;
  }));

  function dummyCollection(Constructor) {
    var collection = [];
    collection.pagination = new Constructor([], {url:''});
    return collection;
  }

  describe('stPagination.hasPagination()', function () {

    it('returns false for a simple collection without a pagination', function () {
      expect(stPagination.hasPagination([])).toBe(false);
    });
    it('returns false for a collection with an anonymous function instance', function () {
      expect(stPagination.hasPagination(dummyCollection(function () {}))).toBe(false);
    });
    it('returns true for a collection with a Pagination instance', function () {
      expect(stPagination.hasPagination(dummyCollection(stPagination.Pagination))).toBe(true);
    });
    it('returns true for a collection with a ServerPagination  instance', function () {
      expect(stPagination.hasPagination(dummyCollection(stPagination.ServerPagination))).toBe(true);
    });
  });

  describe('stPagination.hasServerPagination()', function () {

    it('returns false for a simple collection without a pagination', function () {
      expect(stPagination.hasServerPagination([])).toBe(false);
    });
    it('returns false for a collection with an anonymous function instance', function () {
      expect(stPagination.hasServerPagination(dummyCollection(function () {}))).toBe(false);
    });
    it('returns false for a collection with a Pagination instance', function () {
      expect(stPagination.hasServerPagination(dummyCollection(stPagination.Pagination))).toBe(false);
    });
    it('returns true for a collection with a ServerPagination  instance', function () {
      expect(stPagination.hasServerPagination(dummyCollection(stPagination.ServerPagination))).toBe(true);
    });
  });

  describe('stPagination.Pagination', function() {

    describe('new instance', function() {
      it('has a default limit of 10', function() {
        var pagination = new stPagination.Pagination();
        expect(pagination.getLimit()).toBe(10);
      });

      it('has an initial offset and page 0', function() {
        var pagination = new stPagination.Pagination(new Array(99));
        expect(pagination.page()).toBe(0);
        expect(pagination.offset()).toBe(0);
      });
    });

    describe('totalPages()', function() {
      it('calculates the total pages for an input collection', function() {
        function paginationWithArrayLength(length) {
          return new stPagination.Pagination(new Array(length));
        }

        expect(paginationWithArrayLength(0).totalPages()).toBe(1);
        expect(paginationWithArrayLength(10).totalPages()).toBe(1);
        expect(paginationWithArrayLength(11).totalPages()).toBe(2);
        expect(paginationWithArrayLength(20).totalPages()).toBe(2);
        expect(paginationWithArrayLength(21).totalPages()).toBe(3);
      });
    });

    describe('next()', function() {
      it('changes the offset to 10 and the page to 1', function() {
        var pagination = new stPagination.Pagination(new Array(99));
        pagination.next();
        expect(pagination.page()).toBe(1);
        expect(pagination.offset()).toBe(10);
      });

      it('stops at totalPages() although it is called several times', function() {
        var pagination = new stPagination.Pagination(new Array(1));
        pagination.next();
        pagination.next();
        pagination.next();

        expect(pagination.page()).toBe(0);
      });
    });

    describe('setPage()', function() {
      it('to 2 changes page and offset correctly', function() {
        var pagination = new stPagination.Pagination(new Array(99));
        pagination.setPage(2);
        expect(pagination.page()).toBe(2);
        expect(pagination.offset()).toBe(20);
      });

      it('to 99 changes page and offset correctly', function() {
        var pagination = new stPagination.Pagination(new Array(20));
        pagination.setPage(99);
        expect(pagination.page()).toBe(pagination.lastPage());
      });

      it('to -1 set page to 0 as this is the minimum', function() {
        var pagination = new stPagination.Pagination(new Array(20));
        pagination.setPage(-1);
        expect(pagination.page()).toBe(0);
      });

      it('for arrays sets page to middle index', function() {
        var pagination = new stPagination.Pagination(stPagination.range(100));

        // check even number of elements
        pagination.setPage([3, 4]);
        expect(pagination.page()).toBe(3);

        // check odd number of elements
        pagination.setPage([3, 4, 5]);
        expect(pagination.page()).toBe(4);

        // check another even number of elements
        pagination.setPage([3, 4, 5, 6]);
        expect(pagination.page()).toBe(4);

        // check another odd number of elements
        pagination.setPage([3, 4, 5, 6, 7]);
        expect(pagination.page()).toBe(5);
      });
    });

    describe('prev()', function() {
      it('on page 3 switches to page 2', function() {
        var pagination = new stPagination.Pagination(new Array(99));
        pagination.setPage(3);
        pagination.prev();
        expect(pagination.page()).toBe(2);
        expect(pagination.offset()).toBe(20);
      });
      it('stops at 0 although it is called several times', function() {
        var pagination = new stPagination.Pagination(new Array(99));
        pagination.prev();
        pagination.prev();

        expect(pagination.page()).toBe(0);
        expect(pagination.offset()).toBe(0);
      });
    });

    describe('input collection', function() {
      it('is sliced correctly when navigation', function() {
        var array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
        var pagination = new stPagination.Pagination(array);

        var firstPage = pagination.paginatedCollection();
        pagination.next();
        var secondPage = pagination.paginatedCollection();
        pagination.next();
        var thirdPage = pagination.paginatedCollection();


        expect(firstPage).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        expect(secondPage).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
        expect(thirdPage).toEqual([21]);
      });

      it('changes resize the pagination correctly', function() {
        var pagination = new stPagination.Pagination(new Array(100));
        pagination.setPage(pagination.lastPage());
        expect(pagination.page()).toBe(9);
        pagination.setCollection(new Array(50));
        expect(pagination.page()).toBe(4);
      });

      it('is stored and returned correctly', function() {
        var inputCollection = [1, 2, 3];
        var pagination = new stPagination.Pagination(inputCollection);
        expect(pagination.collection()).toBe(inputCollection);
      });
    });

    describe('indexRangeBuilder', function() {

      it('should generate a range', function() {
        expect(stPagination.range(0)).toEqual([]);
        expect(stPagination.range(1)).toEqual([0]);
        expect(stPagination.range(2)).toEqual([0, 1]);
        expect(stPagination.range(10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      });

      it('should build a range', function() {
        expect(stPagination.indexRangeBuilder(0).build()).toEqual([]);
        expect(stPagination.indexRangeBuilder(1).build()).toEqual([0]);
        expect(stPagination.indexRangeBuilder(2).build()).toEqual([0, 1]);
        expect(stPagination.indexRangeBuilder(10).build()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      });

      it('should generate a folded range around a given index', function() {
        expect(stPagination.indexRangeBuilder(3).foldRange(0, 1).build()).toEqual([
          [0, 1],
          2
        ]);
        expect(stPagination.indexRangeBuilder(5).foldRange(4, 5).build()).toEqual([0, 1, 2, 3, [4]]);

        // edge cases
        expect(stPagination.indexRangeBuilder(5).foldRange(5, 0).build()).toEqual([0, 1, 2, 3, 4]);
        expect(stPagination.indexRangeBuilder(5).foldRange(-1, 100).build()).toEqual([
          [0, 1, 2, 3, 4]
        ]);
        expect(stPagination.indexRangeBuilder(0).foldRange(-1, -5).build()).toEqual([]);
      });

      describe('foldForIndex', function() {
        it('should generate folded indices for a middle index (10)', function() {
          var foldedIndices = stPagination.indexRangeBuilder(20).foldForIndex(10, 3, 2).build();
          expect(foldedIndices.length).toEqual(11);
          expect(foldedIndices).toEqual([0, 1, [2, 3, 4, 5, 6, 7], 8, 9, 10, 11, 12, [13, 14, 15, 16, 17], 18, 19]);
        });

        it('should generate folded indices for the first index (0)', function() {
          var foldedIndices = stPagination.indexRangeBuilder(20).foldForIndex(0, 3, 2).build();
          expect(foldedIndices.length).toEqual(11);
          expect(foldedIndices).toEqual([0, 1, 2, 3, 4, 5, 6, 7, [8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 18, 19]);
        });

        it('should generate folded indices for the index before first break (5)', function() {
          var foldedIndices = stPagination.indexRangeBuilder(20).foldForIndex(5, 3, 2).build();
          expect(foldedIndices.length).toEqual(11);
          expect(foldedIndices).toEqual([0, 1, 2, 3, 4, 5, 6, 7, [8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 18, 19]);
        });

        it('should generate folded indices for the index after first break (6)', function() {
          var foldedIndices = stPagination.indexRangeBuilder(20).foldForIndex(6, 3, 2).build();
          expect(foldedIndices.length).toEqual(11);
          expect(foldedIndices).toEqual([0, 1, [2, 3], 4, 5, 6, 7, 8, [9, 10, 11, 12, 13, 14, 15, 16, 17], 18, 19]);
        });

        it('should generate folded indices for the last index (19)', function() {
          var foldedIndices = stPagination.indexRangeBuilder(20).foldForIndex(19, 3, 2).build();
          expect(foldedIndices.length).toEqual(11);
          expect(foldedIndices).toEqual([0, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 12, 13, 14, 15, 16, 17, 18, 19]);
        });

        it('should generate folded indices for the index before second break (14)', function() {
          var foldedIndices = stPagination.indexRangeBuilder(20).foldForIndex(14, 3, 2).build();
          expect(foldedIndices.length).toEqual(11);
          expect(foldedIndices).toEqual([0, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 12, 13, 14, 15, 16, 17, 18, 19]);
        });

        it('should generate folded indices for the index after second break (13)', function() {
          var foldedIndices = stPagination.indexRangeBuilder(20).foldForIndex(13, 3, 2).build();
          expect(foldedIndices.length).toEqual(11);
          expect(foldedIndices).toEqual([0, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10], 11, 12, 13, 14, 15, [16, 17], 18, 19]);
        });
      });
    });
  });
});
