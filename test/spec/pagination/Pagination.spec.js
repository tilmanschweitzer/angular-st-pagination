'use strict';

describe('Type: Pagination', function () {

  // load the controller's module
  beforeEach(module('stPagination'));

  it('should be initialized with limit', inject(function (Pagination) {
    var pagination = new Pagination();

  }));
});
