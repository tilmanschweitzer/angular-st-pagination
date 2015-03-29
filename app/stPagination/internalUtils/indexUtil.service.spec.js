describe('Service: indexUtil', function () {
  'use strict';

  // load the controller's module
  beforeEach(module('stPagination'));

  it('should generate a range', inject(function (indexUtil) {
    expect(indexUtil.range(0)).toEqual([]);
    expect(indexUtil.range(1)).toEqual([0]);
    expect(indexUtil.range(2)).toEqual([0, 1]);
    expect(indexUtil.range(10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  }));

  it('should build a range', inject(function (indexUtil) {
    expect(indexUtil.rangeBuilder(0).build()).toEqual([]);
    expect(indexUtil.rangeBuilder(1).build()).toEqual([0]);
    expect(indexUtil.rangeBuilder(2).build()).toEqual([0, 1]);
    expect(indexUtil.rangeBuilder(10).build()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  }));

  it('should generate a folded range around a given index', inject(function (indexUtil) {
    expect(indexUtil.rangeBuilder(3).foldRange(0,1).build()).toEqual([[0, 1], 2]);
    expect(indexUtil.rangeBuilder(5).foldRange(4,5).build()).toEqual([0, 1, 2, 3, [4]]);

    // edge cases
    expect(indexUtil.rangeBuilder(5).foldRange(5,0).build()).toEqual([0, 1, 2, 3, 4]);
    expect(indexUtil.rangeBuilder(5).foldRange(-1,100).build()).toEqual([[0, 1, 2, 3, 4]]);
    expect(indexUtil.rangeBuilder(0).foldRange(-1,-5).build()).toEqual([]);
  }));

  it('should generate a folded range using greaterThan', inject(function (indexUtil) {
    expect(indexUtil.rangeBuilder(10).foldGreaterThan(3).build()).toEqual([0, 1, 2, 3, [4, 5, 6, 7, 8, 9]]);
    expect(indexUtil.rangeBuilder(3).foldGreaterThan(3).build()).toEqual([0, 1, 2]);
    expect(indexUtil.rangeBuilder(10).foldGreaterThan(-1).build()).toEqual([[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]]);
    expect(indexUtil.rangeBuilder(10).foldGreaterThan(8).build()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, [9]]);
  }));

  it('should generate a folded range using foldGreaterEquals', inject(function (indexUtil) {
    expect(indexUtil.rangeBuilder(4).foldGreaterEquals(3).build()).toEqual([0, 1, 2, [3]]);
  }));

  it('should generate a folded range using foldLessThan', inject(function (indexUtil) {
    expect(indexUtil.rangeBuilder(4).foldLessThan(3).build()).toEqual([[0, 1, 2], 3]);
  }));

  it('should generate a folded range using foldLessEquals', inject(function (indexUtil) {
    expect(indexUtil.rangeBuilder(3).foldLessEquals(1).build()).toEqual([[0, 1], 2]);
  }));

  it('should generate a folded range chaining foldLessThan and foldGreaterThan', inject(function (indexUtil) {
    expect(indexUtil.rangeBuilder(3).foldLessThan(1).foldGreaterThan(1).build()).toEqual([[0], 1, [2]]);
    var expected = [[0, 1, 2, 3, 4], 5, 6, 7, 8, [9]];
    expect(indexUtil.rangeBuilder(10).foldLessThan(5).foldGreaterThan(8).build()).toEqual(expected);
  }));

  describe('foldFixedLengthForIndex', function () {
    it('should generate fixed length indices for the index 10', inject(function (indexUtil) {
      var foldedIndices = indexUtil.rangeBuilder(20).foldFixedLengthForIndex(10, 3).build();
      expect(foldedIndices.length).toEqual(13);
      expect(foldedIndices).toEqual([0,1,2,[3,4,5,6,7],8,9,10,11,12,[13,14,15,16],17,18,19]);
    }));

    it('should generate fixed length indices for the first index (0)', inject(function (indexUtil) {
      var foldedIndices = indexUtil.rangeBuilder(20).foldFixedLengthForIndex(0, 3).build();
      expect(foldedIndices.length).toEqual(13);
      expect(foldedIndices).toEqual([0,1,2,3,4,5,6,7,8,[9,10,11,12,13,14,15,16],17,18,19]);
    }));

    it('should generate fixed length indices for the index before first break (6).', inject(function (indexUtil) {
      var foldedIndices = indexUtil.rangeBuilder(20).foldFixedLengthForIndex(6, 3).build();
      expect(foldedIndices).toEqual([0,1,2,3,4,5,6,7,8,[9,10,11,12,13,14,15,16],17,18,19]);
    }));

    it('should generate fixed length indices for the index after first break (7)', inject(function (indexUtil) {
      var foldedIndices = indexUtil.rangeBuilder(20).foldFixedLengthForIndex(7, 3).build();
      expect(foldedIndices.length).toEqual(13);
      expect(foldedIndices).toEqual([0,1,2,[3,4],5,6,7,8,9,[10,11,12,13,14,15,16],17,18,19]);
    }));

    it('should generate fixed length indices for the last index (19)', inject(function (indexUtil) {
      var foldedIndices = indexUtil.rangeBuilder(20).foldFixedLengthForIndex(19, 3).build();
      expect(foldedIndices.length).toEqual(13);
      expect(foldedIndices).toEqual([0,1,2,[3,4,5,6,7,8,9,10],11,12,13,14,15,16,17,18,19]);
    }));

    it('should generate fixed length indices for the index before second break (13)', inject(function (indexUtil) {
      var foldedIndices = indexUtil.rangeBuilder(20).foldFixedLengthForIndex(13, 3).build();
      expect(foldedIndices.length).toEqual(13);
      expect(foldedIndices).toEqual([0,1,2,[3,4,5,6,7,8,9,10],11,12,13,14,15,16,17,18,19]);
    }));

    it('should generate fixed length indices for the index after second break (12)', inject(function (indexUtil) {
      var foldedIndices = indexUtil.rangeBuilder(20).foldFixedLengthForIndex(12, 3).build();
      expect(foldedIndices.length).toEqual(13);
      expect(foldedIndices).toEqual([0,1,2,[3,4,5,6,7,8,9],10,11,12,13,14,[15,16],17,18,19]);
    }));
  });

  describe('foldWithMidAndEdgeRangeForIndex', function () {
    it('should generate folded indices for a middle index (10)', inject(function (indexUtil) {
      var foldedIndices = indexUtil.rangeBuilder(20).foldWithMidAndEdgeRangeForIndex(10, 3, 2).build();
      expect(foldedIndices.length).toEqual(11);
      expect(foldedIndices).toEqual([0,1,[2,3,4,5,6,7],8,9,10,11,12,[13,14,15,16,17],18,19]);
    }));

    it('should generate folded indices for the first index (0)', inject(function (indexUtil) {
      var foldedIndices = indexUtil.rangeBuilder(20).foldWithMidAndEdgeRangeForIndex(0, 3, 2).build();
      expect(foldedIndices.length).toEqual(11);
      expect(foldedIndices).toEqual([0,1,2,3,4,5,6,7,[8,9,10,11,12,13,14,15,16,17],18,19]);
    }));

    it('should generate folded indices for the index before first break (5)', inject(function (indexUtil) {
      var foldedIndices = indexUtil.rangeBuilder(20).foldWithMidAndEdgeRangeForIndex(5, 3, 2).build();
      expect(foldedIndices.length).toEqual(11);
      expect(foldedIndices).toEqual([0,1,2,3,4,5,6,7,[8,9,10,11,12,13,14,15,16,17],18,19]);
    }));

    it('should generate folded indices for the index after first break (6)', inject(function (indexUtil) {
      var foldedIndices = indexUtil.rangeBuilder(20).foldWithMidAndEdgeRangeForIndex(6, 3, 2).build();
      expect(foldedIndices.length).toEqual(11);
      expect(foldedIndices).toEqual([0,1,[2,3],4,5,6,7,8,[9,10,11,12,13,14,15,16,17],18,19]);
    }));

    it('should generate folded indices for the last index (19)', inject(function (indexUtil) {
      var foldedIndices = indexUtil.rangeBuilder(20).foldWithMidAndEdgeRangeForIndex(19, 3, 2).build();
      expect(foldedIndices.length).toEqual(11);
      expect(foldedIndices).toEqual([0,1,[2,3,4,5,6,7,8,9,10,11],12,13,14,15,16,17,18,19]);
    }));

    it('should generate folded indices for the index before second break (14)', inject(function (indexUtil) {
      var foldedIndices = indexUtil.rangeBuilder(20).foldWithMidAndEdgeRangeForIndex(14, 3, 2).build();
      expect(foldedIndices.length).toEqual(11);
      expect(foldedIndices).toEqual([0,1,[2,3,4,5,6,7,8,9,10,11],12,13,14,15,16,17,18,19]);
    }));

    it('should generate folded indices for the index after second break (13)', inject(function (indexUtil) {
      var foldedIndices = indexUtil.rangeBuilder(20).foldWithMidAndEdgeRangeForIndex(13, 3, 2).build();
      expect(foldedIndices.length).toEqual(11);
      expect(foldedIndices).toEqual([0,1,[2,3,4,5,6,7,8,9,10],11,12,13,14,15,[16,17],18,19]);
    }));
  });
});
