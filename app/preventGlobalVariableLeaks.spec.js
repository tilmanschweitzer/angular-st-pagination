describe('global namespace', function () {
  'use strict';

  beforeEach(module('stPagination'));

  /*jshint nonew: false */
  it('has no Pagination function', function () {
    expect(window.Pagination).not.toBeDefined();
    expect(function () {
      new Pagination();
    }).toThrow();
  });

  it('has no RangeBuilder function', function () {
    expect(window.RangeBuilder).not.toBeDefined();
    expect(function () {
      new RangeBuilder();
    }).toThrow();
  });

  it('has no templateConfigUtil function', function () {
    expect(window.templateConfigUtil).not.toBeDefined();
    expect(function () {
      templateConfigUtil.getTemplate();
    }).toThrow();
  });

});
