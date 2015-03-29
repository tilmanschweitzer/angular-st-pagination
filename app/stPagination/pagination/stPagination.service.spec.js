describe('Type: Pagination', function () {
  'use strict';

  beforeEach(module('stPagination'));

  var stPagination;

  beforeEach(inject(function (_stPagination_) {
    stPagination = _stPagination_;
  }));

  it('should be initialized with limit of 10', function () {
    var pagination = new stPagination.Pagination();
    expect(pagination.getLimit()).toBe(10);
  });

  it('should calculate the total pages for an input collection', function () {
    function paginationWithArrayLength(length) {
      return new stPagination.Pagination(new Array(length));
    }
    expect(paginationWithArrayLength(0).totalPages()).toBe(1);
    expect(paginationWithArrayLength(10).totalPages()).toBe(1);
    expect(paginationWithArrayLength(11).totalPages()).toBe(2);
    expect(paginationWithArrayLength(20).totalPages()).toBe(2);
    expect(paginationWithArrayLength(21).totalPages()).toBe(3);
  });

  it('should have an initial offset and page 0', function () {
    var pagination = new stPagination.Pagination(new Array(99));
    expect(pagination.page()).toBe(0);
    expect(pagination.offset()).toBe(0);
  });

  it('should have the offset 10 and page 1 after navigation with next()', function () {
    var pagination = new stPagination.Pagination(new Array(99));
    pagination.next();
    expect(pagination.page()).toBe(1);
    expect(pagination.offset()).toBe(10);
  });

  it('should have correct offsets after settings the page to 2', function () {
    var pagination = new stPagination.Pagination(new Array(99));
    pagination.setPage(2);
    expect(pagination.page()).toBe(2);
    expect(pagination.offset()).toBe(20);
  });

  it('should limit setPage to total pages as maximum.', function () {
    var pagination = new stPagination.Pagination(new Array(20));
    pagination.setPage(99);
    expect(pagination.page()).toBe(pagination.lastPage());
  });

  it('should limit setPage to 0 as minimum.', function () {
    var pagination = new stPagination.Pagination(new Array(20));
    pagination.setPage(-1);
    expect(pagination.page()).toBe(0);
  });

  it('should have the page 2 after prev navigation from page 3', function () {
    var pagination = new stPagination.Pagination(new Array(99));
    pagination.setPage(3);
    pagination.prev();
    expect(pagination.page()).toBe(2);
    expect(pagination.offset()).toBe(20);
  });

  it('should stop at 0 although calling prev() several times', function () {
    var pagination = new stPagination.Pagination(new Array(99));
    pagination.prev();
    pagination.prev();

    expect(pagination.page()).toBe(0);
    expect(pagination.offset()).toBe(0);
  });

  it('should stop at totalPages() although calling next() several times', function () {
    var pagination = new stPagination.Pagination(new Array(1));
    pagination.next();
    pagination.next();
    pagination.next();

    expect(pagination.page()).toBe(0);
  });

  it('should return the correct parts after navigation', function () {
    var pagination = new stPagination.Pagination([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]);

    var firstPage = pagination.paginatedCollection();
    pagination.next();
    var secondPage = pagination.paginatedCollection();
    pagination.next();
    var thirdPage = pagination.paginatedCollection();


    expect(firstPage).toEqual([1,2,3,4,5,6,7,8,9,10]);
    expect(secondPage).toEqual([11,12,13,14,15,16,17,18,19,20]);
    expect(thirdPage).toEqual([21]);

  });

  it('should correct the pagination if the input size changes', function () {
    var pagination = new stPagination.Pagination(new Array(100));
    pagination.setPage(pagination.lastPage());
    expect(pagination.page()).toBe(9);
    pagination.setCollection(new Array(50));
    expect(pagination.page()).toBe(4);
  });

  it('should return the input collection', function () {
    var inputCollection = [1,2,3];
    var pagination = new stPagination.Pagination(inputCollection);
    expect(pagination.collection()).toBe(inputCollection);
  });

  it('should set page to middle index', function () {
    var pagination = new stPagination.Pagination(stPagination.range(100));

    // check even number of elements
    pagination.setPage([3,4]);
    expect(pagination.page()).toBe(3);

    // check odd number of elements
    pagination.setPage([3,4,5]);
    expect(pagination.page()).toBe(4);

    // check another even number of elements
    pagination.setPage([3,4,5,6]);
    expect(pagination.page()).toBe(4);

    // check another odd number of elements
    pagination.setPage([3,4,5,6,7]);
    expect(pagination.page()).toBe(5);
  });

  describe('indexRangeBuilder', function () {

    it('should generate a range', function () {
      expect(stPagination.range(0)).toEqual([]);
      expect(stPagination.range(1)).toEqual([0]);
      expect(stPagination.range(2)).toEqual([0, 1]);
      expect(stPagination.range(10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('should build a range', function () {
      expect(stPagination.indexRangeBuilder(0).build()).toEqual([]);
      expect(stPagination.indexRangeBuilder(1).build()).toEqual([0]);
      expect(stPagination.indexRangeBuilder(2).build()).toEqual([0, 1]);
      expect(stPagination.indexRangeBuilder(10).build()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('should generate a folded range around a given index', function () {
      expect(stPagination.indexRangeBuilder(3).foldRange(0,1).build()).toEqual([[0, 1], 2]);
      expect(stPagination.indexRangeBuilder(5).foldRange(4,5).build()).toEqual([0, 1, 2, 3, [4]]);

      // edge cases
      expect(stPagination.indexRangeBuilder(5).foldRange(5,0).build()).toEqual([0, 1, 2, 3, 4]);
      expect(stPagination.indexRangeBuilder(5).foldRange(-1,100).build()).toEqual([[0, 1, 2, 3, 4]]);
      expect(stPagination.indexRangeBuilder(0).foldRange(-1,-5).build()).toEqual([]);
    });

    describe('foldForIndex', function () {
      it('should generate folded indices for a middle index (10)', function () {
        var foldedIndices = stPagination.indexRangeBuilder(20).foldForIndex(10, 3, 2).build();
        expect(foldedIndices.length).toEqual(11);
        expect(foldedIndices).toEqual([0,1,[2,3,4,5,6,7],8,9,10,11,12,[13,14,15,16,17],18,19]);
      });

      it('should generate folded indices for the first index (0)', function () {
        var foldedIndices = stPagination.indexRangeBuilder(20).foldForIndex(0, 3, 2).build();
        expect(foldedIndices.length).toEqual(11);
        expect(foldedIndices).toEqual([0,1,2,3,4,5,6,7,[8,9,10,11,12,13,14,15,16,17],18,19]);
      });

      it('should generate folded indices for the index before first break (5)', function () {
        var foldedIndices = stPagination.indexRangeBuilder(20).foldForIndex(5, 3, 2).build();
        expect(foldedIndices.length).toEqual(11);
        expect(foldedIndices).toEqual([0,1,2,3,4,5,6,7,[8,9,10,11,12,13,14,15,16,17],18,19]);
      });

      it('should generate folded indices for the index after first break (6)', function () {
        var foldedIndices = stPagination.indexRangeBuilder(20).foldForIndex(6, 3, 2).build();
        expect(foldedIndices.length).toEqual(11);
        expect(foldedIndices).toEqual([0,1,[2,3],4,5,6,7,8,[9,10,11,12,13,14,15,16,17],18,19]);
      });

      it('should generate folded indices for the last index (19)', function () {
        var foldedIndices = stPagination.indexRangeBuilder(20).foldForIndex(19, 3, 2).build();
        expect(foldedIndices.length).toEqual(11);
        expect(foldedIndices).toEqual([0,1,[2,3,4,5,6,7,8,9,10,11],12,13,14,15,16,17,18,19]);
      });

      it('should generate folded indices for the index before second break (14)', function () {
        var foldedIndices = stPagination.indexRangeBuilder(20).foldForIndex(14, 3, 2).build();
        expect(foldedIndices.length).toEqual(11);
        expect(foldedIndices).toEqual([0,1,[2,3,4,5,6,7,8,9,10,11],12,13,14,15,16,17,18,19]);
      });

      it('should generate folded indices for the index after second break (13)', function () {
        var foldedIndices = stPagination.indexRangeBuilder(20).foldForIndex(13, 3, 2).build();
        expect(foldedIndices.length).toEqual(11);
        expect(foldedIndices).toEqual([0,1,[2,3,4,5,6,7,8,9,10],11,12,13,14,15,[16,17],18,19]);
      });
    });
  });

});
