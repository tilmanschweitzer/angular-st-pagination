angular.module('stPagination').factory('indexUtil', function () {
  'use strict';

  function RangeBuilder(array) {
    this.array = array;
    this.lastIndex = array.length - 1;
  }

  angular.extend(RangeBuilder.prototype, {
    build: function () {
      return this.array;
    },
    foldGreaterThan: function (offset) {
      return this.foldRange(offset+1, this.lastIndex);
    },
    foldGreaterEquals: function (offset) {
      return this.foldRange(offset, this.lastIndex);
    },
    foldLessThan: function (limit) {
      return this.foldRange(0, limit - 1);
    },
    foldLessEquals: function (limit) {
      return this.foldRange(0, limit);
    },
    foldRange: function (start, stop) {
      var oldArray = this.array;
      var newArray = this.array = [];
      oldArray.forEach(function (value) {
        if (value < start || value > stop || angular.isArray(value)) {
          newArray.push(value);
        } else {
          var lastElement = newArray[newArray.length - 1];
          if (angular.isArray(lastElement)) {
            lastElement.push(value);
          } else {
            newArray.push([value]);
          }
        }
      });
      return this;
    },
    foldFixedLengthForIndex: function (index, length) {
      return this.foldWithMidAndEdgeRangeForIndex(index, length, length);
    },
    foldWithMidAndEdgeRangeForIndex: function (index, midRange, edgeRange) {
      var firstFoldStart = 0 + edgeRange;
      var firstFoldStop = index - midRange;
      var secondFoldStart = index + midRange;
      var secondFoldStop = this.lastIndex - edgeRange;
      if (index <= edgeRange + midRange) {
        firstFoldStart = edgeRange + midRange * 2;
        return this.foldRange(firstFoldStart,  secondFoldStop);
      } else if (index >= (this.lastIndex - (edgeRange + midRange))) {
        secondFoldStop = this.lastIndex - (edgeRange + midRange * 2);
        return this.foldRange(firstFoldStart,  secondFoldStop);
      } else {
        return this.foldRange(firstFoldStart, firstFoldStop).foldRange(secondFoldStart, secondFoldStop);
      }
    }
  });

  function range(length) {
    return Array.apply(null, new Array(length)).map(function (_, i) {return i;});
  }

  function rangeBuilder(length) {
    return new RangeBuilder(range(length));
  }

  return {
    range: range,
    rangeBuilder: rangeBuilder
  };
});
