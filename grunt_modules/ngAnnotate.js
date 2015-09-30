module.exports = function() {
  'use strict';

  var _ = require('underscore');
  var config = require('./config/config.js');

  function getAllConfig() {
    var files = {};
    _.each(_.keys(config.modules), function(moduleName) {
      files['generated/dist/js/' + moduleName + '.js'] = ['generated/dist/js/' + moduleName + '.js'];
    });
    return {
      files: files
    };
  }

  return {
    all: getAllConfig()
  };
};
