describe('Filter: stServerPagination', function () {
  'use strict';

  beforeEach(module('stPagination'));

  beforeEach(function () {
    jasmine.addMatchers(customJasmineMatchers);
  });

  var $scope, $filter, serverConfig, stPagination, $httpBackend, dummyCollection, someCollection;

  function createDummySlice(startIndex, endIndex) {
    return {
      total: dummyCollection.length,
      collection: dummyCollection.slice(startIndex, endIndex)
    };
  }

  beforeEach(inject(function ($rootScope, _$filter_, _stPagination_, _$httpBackend_) {
    $scope = $rootScope.$new();
    $filter = _$filter_;
    stPagination = _stPagination_;
    serverConfig = stPagination.paginationServerConfig({
      url: 'collection/:start/:end'
    });

    dummyCollection = stPagination.range(255).map(function (number) {
      return {
        id: number,
        dummyText: 'item-' + number
      };
    });


    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('collection/0/10').respond(200, createDummySlice(0, 10));

    someCollection = [];
    $filter('stServerPagination')(someCollection, serverConfig);
    $httpBackend.flush();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('initialization', function () {
    it('creates a pagination property on an collection', function () {
      expect(someCollection.pagination).toBeDefined();
    });

    it('creates a pagination property with the ServerPagination type', function () {
      expect(someCollection.pagination).toBeInstanceOf(stPagination.ServerPagination);
    });

    it('loads the collection', function () {
      expect(someCollection.length).toBe(10);
      expect(someCollection[0]).toEqual({id: 0, dummyText: 'item-0'});
      expect(someCollection[9]).toEqual({id: 9, dummyText: 'item-9'});
      expect(someCollection[10]).not.toBeDefined();
    });
    it('calculates the pages correctly from the server result', function () {
      expect(someCollection.pagination.length()).toBe(255);
      expect(someCollection.pagination.totalPages()).toBe(26);
    });
  });

  describe('pagination.next()', function () {
    it('loads the next page from the server', function () {
      $httpBackend.expectGET('collection/10/20').respond(200, createDummySlice(10, 20));
      someCollection.pagination.next();
      $httpBackend.flush();

      expect(someCollection.length).toBe(10);
      expect(someCollection[0]).toEqual({id: 10, dummyText: 'item-10'});
      expect(someCollection[9]).toEqual({id: 19, dummyText: 'item-19'});
      expect(someCollection[10]).not.toBeDefined();
    });
  });

  describe('pagination.setPage()', function () {
    it('loads page 10 from the server', function () {
      $httpBackend.expectGET('collection/100/110').respond(200, createDummySlice(100, 110));
      someCollection.pagination.setPage(10);
      $httpBackend.flush();

      expect(someCollection.length).toBe(10);
      expect(someCollection[0]).toEqual({id: 100, dummyText: 'item-100'});
      expect(someCollection[9]).toEqual({id: 109, dummyText: 'item-109'});
      expect(someCollection[10]).not.toBeDefined();
    });
  });

  describe('pagination.prev()', function () {
    it('loads the pre page of page 10 from the server', function () {
      $httpBackend.expectGET('collection/100/110').respond(200, createDummySlice(100, 110));
      someCollection.pagination.setPage(10);
      $httpBackend.flush();

      $httpBackend.expectGET('collection/90/100').respond(200, createDummySlice(90, 100));
      someCollection.pagination.prev( );
      $httpBackend.flush();

      expect(someCollection.length).toBe(10);
      expect(someCollection[0]).toEqual({id: 90, dummyText: 'item-90'});
      expect(someCollection[9]).toEqual({id: 99, dummyText: 'item-99'});
      expect(someCollection[10]).not.toBeDefined();
    });
  });

  describe('pagination.setLimit()', function () {
    it('loads first page with limit of 5 from the server', function () {
      $httpBackend.expectGET('collection/0/5').respond(200, createDummySlice(0, 5));
      someCollection.pagination.setLimit(5);
      $httpBackend.flush();

      expect(someCollection.length).toBe(5);
      expect(someCollection[0]).toEqual({id: 0, dummyText: 'item-0'});
      expect(someCollection[4]).toEqual({id: 4, dummyText: 'item-4'});
      expect(someCollection[5]).not.toBeDefined();
    });

    it('loads first page with limit of 25 from the server', function () {
      $httpBackend.expectGET('collection/0/25').respond(200, createDummySlice(0, 25));
      someCollection.pagination.setLimit(25);
      $httpBackend.flush();

      expect(someCollection.length).toBe(25);
      expect(someCollection[0]).toEqual({id: 0, dummyText: 'item-0'});
      expect(someCollection[24]).toEqual({id: 24, dummyText: 'item-24'});
      expect(someCollection[25]).not.toBeDefined();
    });
  });

});
