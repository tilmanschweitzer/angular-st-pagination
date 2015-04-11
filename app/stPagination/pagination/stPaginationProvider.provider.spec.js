describe('stPaginationProvider', function() {
  'use strict';

  var INITIAL_DEFAULT_LIMIT;
  var testArray;
  var testArrayPagination;

  var stPaginationProvider, stPagination, $compile, $scope, $filter, $templateCache;

  beforeEach(module('stPagination'));

  beforeEach(function() {
    jasmine.addMatchers(customJasmineMatchers);
  });

  beforeEach(module(function(_stPaginationProvider_) {
    stPaginationProvider = _stPaginationProvider_;
  }));

  beforeEach(inject(function(_stPagination_, _$compile_, $rootScope, _$filter_, _$templateCache_) {
    stPagination = _stPagination_;
    $compile = _$compile_;
    $scope = $rootScope;
    $filter = _$filter_;
    $templateCache = _$templateCache_;
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

  describe('setTemplateConfig', function() {
    var $configTestPagination;
    var tmpl = '<st-pagination collection="commits"></st-pagination>';

    beforeEach(function() {
      $scope.commits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
      $filter('stPagination')($scope.commits);
    });

    function htmlAssertions(options) {
      if (options.divWrapped) {
        it('renders a div as root element', function() {
          expect($configTestPagination.children()[0]).toBeInstanceOf(HTMLUListElement);
          expect($configTestPagination.children()[0].className).not.toContain('pagination');
          expect($configTestPagination[0]).toBeInstanceOf(HTMLDivElement);
        });
      } else {
        it('renders an ul as default root element', function() {
          expect($configTestPagination[0]).toBeInstanceOf(HTMLUListElement);
        });
      }

      it('renders a "pagination" class to the root div element', function() {
        expect($configTestPagination[0].className).toContain('pagination');
      });

      var disabledClass = options.disabledClass;
      var selectedClass = options.selectedClass;


      it('renders a "' + disabledClass + '" class for the prev link', function() {
        expect($configTestPagination.find('li:eq(0)').attr('class')).toContain(disabledClass);
      });

      it('renders a "' + selectedClass + '" class for the link to current (first) page', function() {
        expect($configTestPagination.find('li:eq(1)').attr('class')).toContain(selectedClass);
      });

      it('renders other page link without "' + selectedClass + '" class', function() {
        expect($configTestPagination.find('li:eq(2)').attr('class')).not.toContain(selectedClass);
        expect($configTestPagination.find('li:eq(3)').attr('class')).not.toContain(selectedClass);
      });
    }

    function defaultAssertions() {
      htmlAssertions({divWrapped: false, disabledClass: 'disabled', selectedClass: 'active'});
    }

    function bootstrap2Assertions() {
      htmlAssertions({divWrapped: true, disabledClass: 'disabled', selectedClass: 'active'});
    }

    function semanticUiAssertions() {
      it('renders a div as root element', function() {
        expect($configTestPagination[0]).toBeInstanceOf(HTMLDivElement);
      });

      it('renders a "ui", "pagination" and "menu" class to the root div element', function() {
        expect($configTestPagination[0].className).toContain('ui');
        expect($configTestPagination[0].className).toContain('pagination');
        expect($configTestPagination[0].className).toContain('menu');
      });

      it('renders a "disabled" class for the prev link', function() {
        expect($configTestPagination.find('a:eq(0)').attr('class')).toContain('disabled');
      });

      it('renders a "active" class for the link to current (first) page', function() {
        expect($configTestPagination.find('a:eq(1)').attr('class')).toContain('active');
      });

      it('renders other page link without "active" class', function() {
        expect($configTestPagination.find('a:eq(2)').attr('class')).not.toContain('active');
        expect($configTestPagination.find('a:eq(3)').attr('class')).not.toContain('active');
      });
    }

    describe('parameter check', function() {
      it('throws an error for undefined', function() {
        expect(function() {
          stPaginationProvider.setTemplateConfig(undefined);
        }).toThrow(new Error('Template config value undefined is not allowed'));
      });

      it('throws an error for non object parameters', function() {
        expect(function() {
          stPaginationProvider.setTemplateConfig(1);
        }).toThrow(new Error('Template config value 1 is not allowed'));
        expect(function() {
          stPaginationProvider.setTemplateConfig('bootstrap3');
        }).toThrow(new Error('Template config value "bootstrap3" is not allowed'));
      });

      it('throws an error for an empty object {}', function() {
        expect(function() {
          stPaginationProvider.setTemplateConfig({});
        }).toThrow(new Error('Missing config attribute for {}. ' +
          'Expected one of: template, templateUrl, templateConfig, templateKey'));
      });

      it('throws an error for wrong config attributes', function() {
        expect(function() {
          stPaginationProvider.setTemplateConfig({nonExistingAttribute: 'x'});
        }).toThrow(new Error('Missing config attribute for {"nonExistingAttribute":"x"}. ' +
          'Expected one of: template, templateUrl, templateConfig, templateKey'));
      });

      it('throws an error for conflicting config attributes (more than one)', function() {
        expect(function() {
          stPaginationProvider.setTemplateConfig({templateConfig: {}, templateKey: 'bootstrap3'});
        }).toThrow(new Error('Conflicting config attributes: ' +
          'Use only of of: template, templateUrl, templateConfig, templateKey'));
      });

      it('throws an error for undefined configurations', function() {
        stPaginationProvider.setTemplateConfig({templateKey: 'bootstrap-1'});

        var msg = 'Given templateKey "bootstrap-1" is not in allowed values ' +
          '"list", "divWrappedList", "bootstrap3", "bootstrap2", "zurbFoundation", "semanticUi"';
        expect(function() {
          $configTestPagination = $compile(tmpl)($scope);
          $scope.$apply();
        }).toThrow(new Error(msg));
      });
    });

    describe('with default configuration', function() {
      beforeEach(function() {
        $configTestPagination = $compile(tmpl)($scope);
        $scope.$apply();
      });

      defaultAssertions();
    });

    describe('with custom object configuration', function() {
      beforeEach(function() {
        var templateConfig = {
          divWrapped: true,
          selectedClass: 'selected',
          disabledClass: 'inactive'
        };
        stPaginationProvider.setTemplateConfig({templateConfig: templateConfig});
        $configTestPagination = $compile(tmpl)($scope);
        $scope.$apply();
      });

      htmlAssertions({divWrapped: true, disabledClass: 'inactive', selectedClass: 'selected'});
    });

    describe('with templateKey', function () {
      describe('"zurbFoundation"', function() {
        beforeEach(function() {
          stPaginationProvider.setTemplateConfig({templateKey: 'zurbFoundation'});
          $configTestPagination = $compile(tmpl)($scope);
          $scope.$apply();
        });

        htmlAssertions({divWrapped: false, disabledClass: 'unavailable', selectedClass: 'current'});
      });

      describe('"bootstrap2"', function() {
        beforeEach(function() {
          stPaginationProvider.setTemplateConfig({templateKey: 'bootstrap2'});
          $configTestPagination = $compile(tmpl)($scope);
          $scope.$apply();
        });

        bootstrap2Assertions();
      });

      describe('"bootstrap3"', function() {
        beforeEach(function() {
          stPaginationProvider.setTemplateConfig({templateKey: 'bootstrap3'});
          $configTestPagination = $compile(tmpl)($scope);
          $scope.$apply();
        });

        defaultAssertions();
      });

      describe('"semanticUi"', function() {
        beforeEach(function() {
          stPaginationProvider.setTemplateConfig({templateKey: 'semanticUi'});
          $configTestPagination = $compile(tmpl)($scope);
          $scope.$apply();
        });

        semanticUiAssertions();
      });
    });

    describe('with custom bootstrap2 template', function() {
      var bootstrap2Template = '<div class="pagination">' +
        '<ul>' +
        '<li ng-class="{disabled: pagination.onFirstPage()}"><a ng-click="pagination.prev()">&laquo;</a></li>' +
        '<li ng-repeat="pageIndex in pages()" ng-class="{active: pagination.onPage(pageIndex)}">' +
        '<a ng-click="pagination.setPage(pageIndex)">{{ displayIndex(pageIndex) }}</a>' +
        '</li>' +
        '<li ng-class="{disabled: pagination.onLastPage()}"><a ng-click="pagination.next()">&laquo;</a></li>' +
        '</ul>' +
        '</div>';

      describe('as string template', function() {
        beforeEach(function() {
          stPaginationProvider.setTemplateConfig({template: bootstrap2Template});
          $configTestPagination = $compile(tmpl)($scope);
          $scope.$apply();
        });

        bootstrap2Assertions();
      });

      describe('as templateUrl', function() {
        beforeEach(function() {
          $templateCache.put('templates/bootstrap2/pagination.html', bootstrap2Template);
          stPaginationProvider.setTemplateConfig({templateUrl: 'templates/bootstrap2/pagination.html'});
          $configTestPagination = $compile(tmpl)($scope);
          $scope.$apply();
        });

        bootstrap2Assertions();
      });
    });

    describe('with custom template for semantic ui', function() {
      beforeEach(function() {
        var template = '<div class="ui pagination menu">' +
          '<a class="icon item" ng-class="{disabled: pagination.onFirstPage()}" ng-click="pagination.prev()">' +
            '<i class="left arrow icon"></i>' +
          '</a>' +
          '<a class="item" ng-repeat="index in pages()" ' +
                          'ng-click="pagination.setPage(pageIndex)" ' +
                          'ng-class="{active: pagination.onPage(index)}">' +
            '{{ displayIndex(pageIndex) }}' +
          '</a>' +
          '<a class="icon item" ng-class="{disabled: pagination.onLastPage()}" ng-click="pagination.next()">' +
          '  <i class="right arrow icon"></i>' +
          '</a>' +
          '</div>';


        stPaginationProvider.setTemplateConfig({template: template});
        $configTestPagination = $compile(tmpl)($scope);
        $scope.$apply();
      });

      semanticUiAssertions();
    });

  });
});
