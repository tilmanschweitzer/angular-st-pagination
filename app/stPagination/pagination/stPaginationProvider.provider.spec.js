describe('stPaginationProvider', function() {
  'use strict';

  var INITIAL_DEFAULT_LIMIT;
  var testArray;
  var testArrayPagination;

  var stPaginationProvider, stPagination, $compile, $scope, $filter;

  beforeEach(module('stPagination'));

  beforeEach(function () {
    jasmine.addMatchers(customJasmineMatchers);
  });

  beforeEach(module(function(_stPaginationProvider_) {
    stPaginationProvider = _stPaginationProvider_;
  }));

  beforeEach(inject(function(_stPagination_, _$compile_, $rootScope, _$filter_) {
    stPagination = _stPagination_;
    $compile = _$compile_;
    $scope = $rootScope;
    $filter = _$filter_;
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
      $scope.commits = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21];
      $filter('stPagination')($scope.commits);
    });

    describe('parameter check', function () {
      it('throws an error for undefined', function () {
        expect(function () {
          stPaginationProvider.setTemplateConfig(undefined);
        }).toThrow(new Error('Template config value undefined is not allowed'));
      });

      it('throws an error for non object parameters', function () {
        expect(function () {
          stPaginationProvider.setTemplateConfig(1);
        }).toThrow(new Error('Template config value 1 is not allowed'));
        expect(function () {
          stPaginationProvider.setTemplateConfig('bootstrap3');
        }).toThrow(new Error('Template config value "bootstrap3" is not allowed'));
      });

      it('throws an error for an empty object {}', function () {
        expect(function () {
          stPaginationProvider.setTemplateConfig({});
        }).toThrow(new Error('Missing config attribute for {}. Expected one of: config, configKey'));
      });

      it('throws an error for wrong config attributes', function () {
        expect(function () {
          stPaginationProvider.setTemplateConfig({nonExistingAttribute: 'x'});
        }).toThrow(new Error('Missing config attribute for {"nonExistingAttribute":"x"}. ' +
          'Expected one of: config, configKey'));
      });


      it('throws an error for conflicting config attributes (more than one)', function () {
        expect(function () {
          stPaginationProvider.setTemplateConfig({config: {}, configKey: 'bootstrap3'});
        }).toThrow(new Error('Conflicting config attributes: Use only of of: config, configKey'));
      });
    });


    it('throws an error for undefined configurations', function () {
      stPaginationProvider.setTemplateConfig({configKey: 'bootstrap-1'});

      var msg = 'Given css-config attribute "bootstrap-1" is not in allowed values ' +
        '"list", "divWrappedList", "bootstrap3", "bootstrap2", "zurbFoundation"';
      expect(function () {
        $configTestPagination = $compile(tmpl)($scope);
        $scope.$apply();
      }).toThrow(new Error(msg));
    });

    describe('with default configuration', function () {
      beforeEach(function () {
        $configTestPagination = $compile(tmpl)($scope);
        $scope.$apply();
      });

      it('renders an ul as default root element', function () {
        expect($configTestPagination.parent()[0]).toBeUndefined();
        expect($configTestPagination[0]).toBeInstanceOf(HTMLUListElement);
      });

      it('renders a "pagination" class to the root ul element', function () {
        expect($configTestPagination[0].className).toContain('pagination');
      });

      it('renders a "disabled" class for the prev link', function () {
        expect($configTestPagination.find('li:eq(0)').attr('class')).toBe('disabled');
      });

      it('renders a "active" class for the link to current (first) page', function () {
        expect($configTestPagination.find('li:eq(1)').attr('class')).toContain('active');
      });

      it('renders other page link without "active" class', function () {
        expect($configTestPagination.find('li:eq(2)').attr('class')).not.toContain('active');
        expect($configTestPagination.find('li:eq(3)').attr('class')).not.toContain('active');
      });
    });

    describe('with custom object configuration', function () {
      beforeEach(function () {
        var templateConfig = {
          divWrapped: true,
          selectedClass: 'selected',
          disabledClass: 'inactive'
        };
        stPaginationProvider.setTemplateConfig({config: templateConfig});
        $configTestPagination = $compile(tmpl)($scope);
        $scope.$apply();
      });

      it('renders a div as root element', function() {
        expect($configTestPagination.children()[0]).toBeInstanceOf(HTMLUListElement);
        expect($configTestPagination.children()[0].className).not.toContain('pagination');

        expect($configTestPagination[0]).toBeInstanceOf(HTMLDivElement);
      });

      it('renders a "pagination" class to the root div element', function() {
        expect($configTestPagination[0].className).toContain('pagination');
      });

      it('renders a "inactive" class for the prev link', function() {
        expect($configTestPagination.find('li:eq(0)').attr('class')).toBe('inactive');
      });

      it('renders a "current" class for the link to current (first) page', function() {
        expect($configTestPagination.find('li:eq(1)').attr('class')).toContain('selected');
      });

      it('renders other page link without "current" class', function() {
        expect($configTestPagination.find('li:eq(2)').attr('class')).not.toContain('selected');
        expect($configTestPagination.find('li:eq(3)').attr('class')).not.toContain('selected');
      });
    });

    describe('with css key "zurbFoundation"', function () {
      beforeEach(function () {
        stPaginationProvider.setTemplateConfig({configKey: 'zurbFoundation'});
        $configTestPagination = $compile(tmpl)($scope);
        $scope.$apply();
      });

      it('renders an ul as default root element', function () {
        expect($configTestPagination.parent()[0]).toBeUndefined();
        expect($configTestPagination[0]).toBeInstanceOf(HTMLUListElement);
      });

      it('renders a "pagination" class to the root ul element', function () {
        expect($configTestPagination[0].className).toContain('pagination');
      });

      it('renders a "unavailable" class for the prev link', function () {
        expect($configTestPagination.find('li:eq(0)').attr('class')).toBe('unavailable');
      });

      it('renders a "current" class for the link to current (first) page', function () {
        expect($configTestPagination.find('li:eq(1)').attr('class')).toContain('current');
      });

      it('renders other page link without "current" class', function () {
        expect($configTestPagination.find('li:eq(2)').attr('class')).not.toContain('current');
        expect($configTestPagination.find('li:eq(3)').attr('class')).not.toContain('current');
      });
    });

    describe('with css key "bootstrap2"', function () {
      beforeEach(function () {
        stPaginationProvider.setTemplateConfig({configKey: 'bootstrap2'});
        $configTestPagination = $compile(tmpl)($scope);
        $scope.$apply();
      });

      it('renders a div as root element', function () {
        expect($configTestPagination.children()[0]).toBeInstanceOf(HTMLUListElement);
        expect($configTestPagination.children()[0].className).not.toContain('pagination');

        expect($configTestPagination[0]).toBeInstanceOf(HTMLDivElement);
      });

      it('renders a "pagination" class to the root div element', function () {
        expect($configTestPagination[0].className).toContain('pagination');
      });

      it('renders a "disabled" class for the prev link', function () {
        expect($configTestPagination.find('li:eq(0)').attr('class')).toBe('disabled');
      });

      it('renders a "active" class for the link to current (first) page', function () {
        expect($configTestPagination.find('li:eq(1)').attr('class')).toContain('active');
      });

      it('renders other page link without "active" class', function () {
        expect($configTestPagination.find('li:eq(2)').attr('class')).not.toContain('active');
        expect($configTestPagination.find('li:eq(3)').attr('class')).not.toContain('active');
      });
    });

    describe('with css key "bootstrap3"', function () {
      beforeEach(function () {
        stPaginationProvider.setTemplateConfig({configKey: 'bootstrap3'});
        $configTestPagination = $compile(tmpl)($scope);
        $scope.$apply();
      });

      it('renders an ul as default root element', function () {
        expect($configTestPagination.parent()[0]).toBeUndefined();
        expect($configTestPagination[0]).toBeInstanceOf(HTMLUListElement);
      });

      it('renders a "pagination" class to the root ul element', function () {
        expect($configTestPagination[0].className).toContain('pagination');
      });

      it('renders a "disabled" class for the prev link', function () {
        expect($configTestPagination.find('li:eq(0)').attr('class')).toBe('disabled');
      });

      it('renders a "active" class for the link to current (first) page', function () {
        expect($configTestPagination.find('li:eq(1)').attr('class')).toContain('active');
      });

      it('renders other page link without "active" class', function () {
        expect($configTestPagination.find('li:eq(2)').attr('class')).not.toContain('active');
        expect($configTestPagination.find('li:eq(3)').attr('class')).not.toContain('active');
      });
    });
  });
});
