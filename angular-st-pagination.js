/*!
 * angular-st-pagination v0.4.0
 * source: git@github.com:tilmanpotthof/angular-st-pagination.git
 * license: MIT (https://raw.githubusercontent.com/tilmanpotthof/angular-st-pagination/master/LICENCE)
 */
(function(angular) {
  angular.module("stPagination", []);
  "use strict";
  function Pagination(collection) {
    this._collection = collection;
    this._limit = Pagination.DEFAULT_LIMIT;
    this._page = 0;
    this._cachedIndices = {};
  }
  Pagination.isNumberOrDefault = function(number, defaultValue) {
    return angular.isNumber(number) ? number : defaultValue;
  };
  Pagination.DEFAULT_LIMIT = 10;
  Pagination.DEFAULT_EDGE_RANGE = 3;
  Pagination.DEFAULT_MID_RANGE = 3;
  angular.extend(Pagination.prototype, {
    setCollection: function(collection) {
      this._collection = collection;
      this.checkPageLimits();
    },
    paginatedCollection: function() {
      return this._collection.slice(this.start(), this.stop());
    },
    collection: function() {
      return this._collection;
    },
    start: function() {
      return this.offset();
    },
    stop: function() {
      var length = this.length();
      var stop = this.offset() + this.getLimit();
      return stop < length ? stop : length;
    },
    length: function() {
      return this._collection.length;
    },
    setLimit: function(limit) {
      this._limit = limit;
    },
    totalPages: function() {
      return Math.ceil(this._collection.length / this.getLimit()) || 1;
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
      midRange = Pagination.isNumberOrDefault(midRange, Pagination.DEFAULT_MID_RANGE);
      edgeRange = Pagination.isNumberOrDefault(edgeRange, Pagination.DEFAULT_EDGE_RANGE);
      var indexCacheKey = this.indexCacheKey(midRange, edgeRange);
      if (this._cachedIndices[indexCacheKey]) {
        return this._cachedIndices[indexCacheKey];
      } else {
        var rangeBuilder = new RangeBuilder(this.totalPages());
        rangeBuilder.foldForIndex(this.page(), midRange, edgeRange);
        var indices = rangeBuilder.build();
        this._cachedIndices[indexCacheKey] = indices;
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
  "use strict";
  function RangeBuilder(rangeLength) {
    this.array = RangeBuilder.range(rangeLength);
    this.lastIndex = rangeLength - 1;
  }
  RangeBuilder.range = function(length) {
    return Array.apply(null, new Array(length)).map(function(_, i) {
      return i;
    });
  };
  angular.extend(RangeBuilder.prototype, {
    build: function() {
      return this.array;
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
    foldForIndex: function(index, midRange, edgeRange) {
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
  angular.module("stPagination").provider("stPagination", function() {
    "use strict";
    var DEFAULT_CSS_CONFG = {};
    this.setDefaultLimit = function(defaultLimit) {
      Pagination.DEFAULT_LIMIT = defaultLimit;
    };
    this.setDefaultEdgeRange = function(defaultEdgeRange) {
      Pagination.DEFAULT_EDGE_RANGE = defaultEdgeRange;
    };
    this.setDefaultMidRange = function(defaultMidRange) {
      Pagination.DEFAULT_MID_RANGE = defaultMidRange;
    };
    this.setDefaultCssConfig = function(cssConfig) {
      DEFAULT_CSS_CONFG = cssConfig;
    };
    this.$get = function() {
      return {
        hasPagination: function(collection) {
          return collection && collection.pagination instanceof Pagination;
        },
        Pagination: Pagination,
        range: RangeBuilder.range,
        indexRangeBuilder: function(length) {
          return new RangeBuilder(length);
        },
        cssConfig: function() {
          return DEFAULT_CSS_CONFG;
        }
      };
    };
  });
  angular.module("stPagination").filter("stPagination", [ "stPagination", function(stPagination) {
    "use strict";
    return function stPaginationFilter(inputCollection, originalCollection) {
      var collectionWithPaginationHandle;
      if (!inputCollection) {
        return;
      }
      collectionWithPaginationHandle = originalCollection || inputCollection;
      if (!stPagination.hasPagination(collectionWithPaginationHandle)) {
        collectionWithPaginationHandle.pagination = new stPagination.Pagination(inputCollection);
      }
      var pagination = collectionWithPaginationHandle.pagination;
      pagination.setCollection(inputCollection);
      return pagination.paginatedCollection();
    };
  } ]);
  angular.module("stPagination").directive("stPaginationLimit", [ "stPagination", function(stPagination) {
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
          if (stPagination.hasPagination(collection)) {
            $scope.pagination = collection.pagination;
          } else {
            delete $scope.pagination;
          }
        });
      }
    };
  } ]);
  angular.module("stPagination").directive("stPagination", [ "stPagination", "$parse", function(stPagination, $parse) {
    "use strict";
    var css3UserSelectAliases = [ "-webkit-touch-callout", "-webkit-user-select", "-moz-user-select", "-ms-user-select", "user-select" ];
    var basePagination = "<ul>" + '<li ng-class="{%DISABLED_CLASS%: pagination.onFirstPage()}">' + '<a ng-click="pagination.prev()">&laquo;</a>' + "</li>" + '<li ng-class="{%SELECTED_CLASS%: pagination.onPage(index)}" ' + 'ng-repeat="index in pagination.reducedIndices(midRange, edgeRange)">' + '<a ng-click="pagination.setPage(index)">{{ displayPaginationIndex(index) }}</a>' + "</li>" + '<li ng-class="{%DISABLED_CLASS%: pagination.onLastPage()}">' + '<a ng-click="pagination.next()">&raquo;</a>' + "</li>" + "</ul>";
    var cssConfigUtil = {
      extendDefaults: function(options) {
        var basicDefaults = {
          divWrapped: false,
          selectedClass: "active",
          disabledClass: "disabled"
        };
        var defaults = stPagination.cssConfig();
        if (!angular.isObject(defaults)) {
          defaults = this.getCssConfigByKey(defaults);
        }
        var combinedDefaults = angular.extend(basicDefaults, defaults);
        return angular.extend(combinedDefaults, options);
      },
      cssConfigsByKey: {
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
      },
      getCssConfigByKey: function(key) {
        var configObject = this.cssConfigsByKey[key];
        if (configObject !== undefined) {
          return configObject;
        } else {
          var msg = 'Given css-config attribute "' + key + '" is not in allowed values ' + allowedValues;
          throw new Error(msg);
        }
      },
      parseCssConfig: function(cssConfig) {
        var configObject = $parse(cssConfig)({});
        if (angular.isObject(configObject)) {
          return configObject;
        }
        cssConfig = cssConfig || defaultCssConfig;
        configObject = this.getCssConfigByKey(cssConfig);
        return configObject;
      }
    };
    var allowedValues = '"' + Object.keys(cssConfigUtil.cssConfigsByKey).join('", "') + '"';
    var defaultCssConfig = "list";
    function displayPaginationIndex(index) {
      if (angular.isNumber(index)) {
        return index + 1;
      } else if (angular.isArray(index)) {
        return "...";
      } else {
        return index;
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
        var cssConfigObject = cssConfigUtil.parseCssConfig(attributes.cssConfig);
        cssConfigObject = cssConfigUtil.extendDefaults(cssConfigObject);
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
        $scope.displayPaginationIndex = displayPaginationIndex;
        $scope.$watch("collection", function(collection) {
          if (angular.isArray(collection)) {
            if (stPagination.hasPagination(collection)) {
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
  angular.module("stPagination").filter("stPageInfo", [ "stPagination", function(stPagination) {
    "use strict";
    var propertyNameToFunctionMapping = {
      total: "length",
      totalPages: "totalPages",
      currentPage: "displayPage",
      startIndex: "displayStart",
      stopIndex: "stop"
    };
    return function(collection, propertyName) {
      if (stPagination.hasPagination(collection) && propertyName) {
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
})(angular);