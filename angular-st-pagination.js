/*!
 * angular-st-pagination v0.3.0
 * source: git@github.com:tilmanpotthof/angular-st-pagination.git
 * license: MIT (https://raw.githubusercontent.com/tilmanpotthof/angular-st-pagination/master/LICENCE)
 */
angular.module("stPagination", []);

angular.module("stPagination").factory("StPagination", [ "indexUtil", function(indexUtil) {
  "use strict";
  function StPagination(inputCollection) {
    this._inputCollection = inputCollection;
    this._limit = 10;
    this._page = 0;
    this._cachedReducedIndices = {};
  }
  function hasPagination(collection) {
    return collection && collection.pagination instanceof StPagination;
  }
  function isNumberOrDefault(number, defaultValue) {
    return angular.isNumber(number) ? number : defaultValue;
  }
  StPagination.hasPagination = hasPagination;
  angular.extend(StPagination.prototype, {
    setInputCollection: function(inputCollection) {
      this._inputCollection = inputCollection;
      this.checkPageLimits();
    },
    paginatedInputCollection: function() {
      return this._inputCollection.slice(this.start(), this.stop());
    },
    inputCollection: function() {
      return this._inputCollection;
    },
    start: function() {
      return this.offset();
    },
    stop: function() {
      var stop = this.offset() + this.getLimit();
      if (stop < this.length()) {
        return stop;
      } else {
        return this.length();
      }
    },
    length: function() {
      return this._inputCollection.length;
    },
    setLimit: function(limit) {
      this._limit = limit;
    },
    totalPages: function() {
      return Math.ceil(this._inputCollection.length / this.getLimit()) || 1;
    },
    offset: function() {
      return this._page * this._limit;
    },
    page: function() {
      return this._page;
    },
    next: function() {
      this._page += 1;
      this.checkPageLimits();
    },
    prev: function() {
      this._page -= 1;
      this.checkPageLimits();
    },
    getLimit: function() {
      return this._limit;
    },
    setPage: function(page) {
      if (!angular.isArray(page)) {
        this._page = page;
      } else {
        var middleIndex = Math.floor((page.length - 1) / 2);
        this._page = page[middleIndex];
      }
      this.checkPageLimits();
    },
    checkPageLimits: function() {
      if (this._page < 0) {
        this._page = 0;
      } else if (this._page > this.lastPage()) {
        this._page = this.lastPage();
      }
    },
    onFirstPage: function() {
      return this.page() === 0;
    },
    onLastPage: function() {
      return this.page() === this.lastPage();
    },
    onPage: function(page) {
      return this.page() === page;
    },
    lastPage: function() {
      return this.totalPages() - 1;
    },
    reducedIndices: function(midRange, edgeRange) {
      midRange = isNumberOrDefault(midRange, 3);
      edgeRange = isNumberOrDefault(edgeRange, 3);
      var indexCacheKey = this.indexCacheKey(midRange, edgeRange);
      if (this._cachedReducedIndices[indexCacheKey]) {
        return this._cachedReducedIndices[indexCacheKey];
      } else {
        var page = this.page();
        var total = this.totalPages();
        var rangeBuilder = indexUtil.rangeBuilder(total).foldWithMidAndEdgeRangeForIndex(page, midRange, edgeRange);
        var indices = rangeBuilder.build();
        this._cachedReducedIndices[indexCacheKey] = indices;
        return indices;
      }
    },
    indexCacheKey: function(midRange, edgeRange) {
      return this.page() + "-" + this.getLimit() + "-" + this.length() + "-" + midRange + "-" + edgeRange;
    },
    displayPage: function() {
      return this.page() + 1;
    },
    displayStart: function() {
      return this.start() + 1;
    }
  });
  return StPagination;
} ]);

angular.module("stPagination").filter("stPagination", [ "StPagination", function(StPagination) {
  "use strict";
  return function stPaginationFilter(inputCollection, originalCollection) {
    var collectionWithPaginationHandle;
    if (!inputCollection) {
      return;
    }
    collectionWithPaginationHandle = originalCollection || inputCollection;
    if (!StPagination.hasPagination(collectionWithPaginationHandle)) {
      collectionWithPaginationHandle.pagination = new StPagination(inputCollection);
    }
    var pagination = collectionWithPaginationHandle.pagination;
    pagination.setInputCollection(inputCollection);
    return pagination.paginatedInputCollection();
  };
} ]);

angular.module("stPagination").factory("indexUtil", function() {
  "use strict";
  function RangeBuilder(array) {
    this.array = array;
    this.lastIndex = array.length - 1;
  }
  angular.extend(RangeBuilder.prototype, {
    build: function() {
      return this.array;
    },
    foldGreaterThan: function(offset) {
      return this.foldRange(offset + 1, this.lastIndex);
    },
    foldGreaterEquals: function(offset) {
      return this.foldRange(offset, this.lastIndex);
    },
    foldLessThan: function(limit) {
      return this.foldRange(0, limit - 1);
    },
    foldLessEquals: function(limit) {
      return this.foldRange(0, limit);
    },
    foldRange: function(start, stop) {
      var oldArray = this.array;
      var newArray = this.array = [];
      oldArray.forEach(function(value) {
        if (value < start || value > stop || angular.isArray(value)) {
          newArray.push(value);
        } else {
          var lastElement = newArray[newArray.length - 1];
          if (angular.isArray(lastElement)) {
            lastElement.push(value);
          } else {
            newArray.push([ value ]);
          }
        }
      });
      return this;
    },
    foldFixedLengthForIndex: function(index, length) {
      return this.foldWithMidAndEdgeRangeForIndex(index, length, length);
    },
    foldWithMidAndEdgeRangeForIndex: function(index, midRange, edgeRange) {
      var firstFoldStart = 0 + edgeRange;
      var firstFoldStop = index - midRange;
      var secondFoldStart = index + midRange;
      var secondFoldStop = this.lastIndex - edgeRange;
      if (index <= edgeRange + midRange) {
        firstFoldStart = edgeRange + midRange * 2;
        return this.foldRange(firstFoldStart, secondFoldStop);
      } else if (index >= this.lastIndex - (edgeRange + midRange)) {
        secondFoldStop = this.lastIndex - (edgeRange + midRange * 2);
        return this.foldRange(firstFoldStart, secondFoldStop);
      } else {
        return this.foldRange(firstFoldStart, firstFoldStop).foldRange(secondFoldStart, secondFoldStop);
      }
    }
  });
  function range(length) {
    return Array.apply(null, new Array(length)).map(function(_, i) {
      return i;
    });
  }
  function rangeBuilder(length) {
    return new RangeBuilder(range(length));
  }
  return {
    range: range,
    rangeBuilder: rangeBuilder
  };
});

angular.module("stPagination").filter("displayPaginationIndex", function() {
  "use strict";
  return function(index) {
    if (angular.isNumber(index)) {
      return index + 1;
    } else if (angular.isArray(index)) {
      return "...";
    } else {
      return index;
    }
  };
});

angular.module("stPagination").directive("stPaginationLimit", [ "StPagination", function(StPagination) {
  "use strict";
  var DEFAULT_LIMITS = [ 10, 20, 50 ];
  return {
    restrict: "E",
    replace: true,
    template: '<select ng-options="limit for limit in limits()" ng-model="pagination._limit"></select>',
    scope: {
      collection: "=",
      getLimits: "&limits"
    },
    link: function($scope) {
      $scope.limits = function() {
        return $scope.getLimits() || DEFAULT_LIMITS;
      };
      $scope.$watch("collection", function(collection) {
        if (StPagination.hasPagination(collection)) {
          $scope.pagination = collection.pagination;
        } else {
          delete $scope.pagination;
        }
      });
    }
  };
} ]);

angular.module("stPagination").directive("stPagination", [ "StPagination", "$parse", function(StPagination, $parse) {
  "use strict";
  var css3UserSelectAliases = [ "-webkit-touch-callout", "-webkit-user-select", "-moz-user-select", "-ms-user-select", "user-select" ];
  var basePagination = "<ul>" + '<li ng-class="{%DISABLED_CLASS%: pagination.onFirstPage()}">' + '<a ng-click="pagination.prev()">&laquo;</a>' + "</li>" + '<li ng-class="{%SELECTED_CLASS%: pagination.onPage(index)}" ' + 'ng-repeat="index in pagination.reducedIndices(midRange, edgeRange)">' + '<a ng-click="pagination.setPage(index)">{{ index | displayPaginationIndex }}</a>' + "</li>" + '<li ng-class="{%DISABLED_CLASS%: pagination.onLastPage()}">' + '<a ng-click="pagination.next()">&raquo;</a>' + "</li>" + "</ul>";
  function extendDefaults(options) {
    return angular.extend({
      divWrapped: false,
      selectedClass: "active",
      disabledClass: "disabled"
    }, options);
  }
  var cssConfigsByKey = {
    list: {},
    divWrappedList: {
      divWrapped: true
    },
    bootstrap3: {},
    bootstrap2: {
      divWrapped: true
    },
    zurbFoundation: {
      selectedClass: "current",
      disabledClass: "unavailable"
    }
  };
  var allowedValues = '"' + Object.keys(cssConfigsByKey).join('", "') + '"';
  var defaultCssConfig = "list";
  function parseCssConfig(cssConfig) {
    var configObject = $parse(cssConfig)({});
    if (angular.isObject(configObject)) {
      return extendDefaults(configObject);
    }
    cssConfig = cssConfig || defaultCssConfig;
    configObject = cssConfigsByKey[cssConfig];
    if (configObject !== undefined) {
      return extendDefaults(configObject);
    } else {
      var msg = 'Given css-config attribute "' + cssConfig + '" is not in allowed values ' + allowedValues;
      throw new Error(msg);
    }
  }
  return {
    restrict: "E",
    replace: true,
    scope: {
      collection: "=",
      edgeRange: "=",
      midRange: "="
    },
    template: basePagination,
    compile: function($element, attributes) {
      var cssConfigObject = parseCssConfig(attributes.cssConfig);
      if (cssConfigObject.divWrapped) {
        $element.wrap('<div class="pagination"></div>');
      } else {
        $element.addClass("pagination");
      }
      angular.forEach($element.find("li"), function(liElement) {
        var $liElement = angular.element(liElement);
        var ngClass = $liElement.attr("ng-class");
        ngClass = ngClass.replace("%DISABLED_CLASS%", cssConfigObject.disabledClass);
        ngClass = ngClass.replace("%SELECTED_CLASS%", cssConfigObject.selectedClass);
        $liElement.attr("ng-class", ngClass);
      });
    },
    controller: [ "$scope", "$element", "$attrs", function($scope, $element, $attrs) {
      angular.forEach(css3UserSelectAliases, function(alias) {
        $element.css(alias, "none");
      });
      var collectionName = $attrs.collection;
      $scope.$watch("collection", function(collection) {
        if (angular.isArray(collection)) {
          if (StPagination.hasPagination(collection)) {
            $scope.pagination = collection.pagination;
          } else {
            var msg = 'Collection "' + collectionName + '" in the pagination directive is not used with a neccessary ' + "pagination filter.";
            throw new Error(msg);
          }
        }
      });
    } ]
  };
} ]);

angular.module("stPagination").filter("stPageInfo", [ "StPagination", function(StPagination) {
  "use strict";
  var propertyNameToFunctionMapping = {
    total: "length",
    totalPages: "totalPages",
    currentPage: "displayPage",
    startIndex: "displayStart",
    stopIndex: "stop"
  };
  return function(collection, propertyName) {
    if (StPagination.hasPagination(collection) && propertyName) {
      var fnName = propertyNameToFunctionMapping[propertyName];
      if (!fnName) {
        throw new Error('No display property "' + propertyName + '" defined for the stPageInfo filter');
      }
      return collection.pagination[fnName]();
    } else {
      return collection;
    }
  };
} ]);