'use strict';

function RangeBuilder(rangeLength) {
  this.array = RangeBuilder.range(rangeLength);
  this.lastIndex = rangeLength - 1;
}

RangeBuilder.range = function (length) {
  return Array.apply(null, new Array(length)).map(function (_, i) {
    return i;
  });
};

angular.extend(RangeBuilder.prototype, {
  build: function () {
    return this.array;
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
  foldForIndex: function (index, midRange, edgeRange) {
    var firstFoldStart = 0 + edgeRange;
    var firstFoldStop = index - midRange;
    var secondFoldStart = index + midRange;
    var secondFoldStop = this.lastIndex - edgeRange;
    if (index <= edgeRange + midRange) {
      firstFoldStart = edgeRange + midRange * 2;
      return this.foldRange(firstFoldStart, secondFoldStop);
    } else if (index >= (this.lastIndex - (edgeRange + midRange))) {
      secondFoldStop = this.lastIndex - (edgeRange + midRange * 2);
      return this.foldRange(firstFoldStart, secondFoldStop);
    } else {
      return this.foldRange(firstFoldStart, firstFoldStop).foldRange(secondFoldStart, secondFoldStop);
    }
  }
});
