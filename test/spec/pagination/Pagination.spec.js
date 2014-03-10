'use strict';

describe('Type: Pagination', function () {

  // load the controller's module
  beforeEach(module('stPagination'));

  it('should be initialized with limit of 10', inject(function (Pagination) {
    var pagination = new Pagination();
    expect(pagination.limit()).toBe(10);
  }));

  it('should calculate the total pages for an input collection', inject(function (Pagination) {
    function paginationWithArrayLength(length) {
      return new Pagination(new Array(length));
    }
    expect(paginationWithArrayLength(0).totalPages()).toBe(1);
    expect(paginationWithArrayLength(10).totalPages()).toBe(1);
    expect(paginationWithArrayLength(11).totalPages()).toBe(2);
    expect(paginationWithArrayLength(20).totalPages()).toBe(2);
    expect(paginationWithArrayLength(21).totalPages()).toBe(3);
  }));

  it('should have an initial offset and page 0', inject(function (Pagination) {
    var pagination = new Pagination(new Array(99));
    expect(pagination.page()).toBe(0);
    expect(pagination.offset()).toBe(0);
  }));

  it('should have the offset 10 and page 1 after navigation with next()', inject(function (Pagination) {
    var pagination = new Pagination(new Array(99));
    pagination.next();
    expect(pagination.page()).toBe(1);
    expect(pagination.offset()).toBe(10);
  }));

  it('should have correct offsets after settings the page to 2', inject(function (Pagination) {
    var pagination = new Pagination(new Array(99));
    pagination.setPage(2);
    expect(pagination.page()).toBe(2);
    expect(pagination.offset()).toBe(20);
  }));

  it('should limit setPage to total pages as maximum.', inject(function (Pagination) {
    var pagination = new Pagination(new Array(20));
    pagination.setPage(99);
    expect(pagination.page()).toBe(pagination.lastPage());
  }));

  it('should limit setPage to 0 as minimum.', inject(function (Pagination) {
    var pagination = new Pagination(new Array(20));
    pagination.setPage(-1);
    expect(pagination.page()).toBe(0);
  }));

  it('should have the page 2 after prev navigation from page 3', inject(function (Pagination) {
    var pagination = new Pagination(new Array(99));
    pagination.setPage(3);
    pagination.prev();
    expect(pagination.page()).toBe(2);
    expect(pagination.offset()).toBe(20);
  }));

  it('should stop at 0 although calling prev() several times', inject(function (Pagination) {
    var pagination = new Pagination(new Array(99));
    pagination.prev();
    pagination.prev();

    expect(pagination.page()).toBe(0);
    expect(pagination.offset()).toBe(0);
  }));

  it('should stop at totalPages() although calling next() several times', inject(function (Pagination) {
    var pagination = new Pagination(new Array(1));
    pagination.next();
    pagination.next();
    pagination.next();

    expect(pagination.page()).toBe(0);
  }));

  it('should return the correct parts after navigation', inject(function (Pagination) {
    var pagination = new Pagination([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]);

    var firstPage = pagination.paginatedInputCollection();
    pagination.next();
    var secondPage = pagination.paginatedInputCollection();
    pagination.next();
    var thirdPage = pagination.paginatedInputCollection();


    expect(firstPage).toEqual([1,2,3,4,5,6,7,8,9,10]);
    expect(secondPage).toEqual([11,12,13,14,15,16,17,18,19,20]);
    expect(thirdPage).toEqual([21]);

  }));

  it('should correct the pagination if the input size changes', inject(function (Pagination) {
    var pagination = new Pagination(new Array(100));
    pagination.setPage(pagination.lastPage());
    expect(pagination.page()).toBe(9);
    pagination.setInputCollection(new Array(50));
    expect(pagination.page()).toBe(4);
  }));
});
