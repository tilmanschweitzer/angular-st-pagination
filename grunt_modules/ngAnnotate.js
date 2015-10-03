module.exports = function() {
  'use strict';

  var _ = require('underscore');
  var config = require('./config/config.js');

  var ngAnnotate = {};

  config.eachModule(function (module, moduleName) {
    ngAnnotate[moduleName] = {
      files: {}
    };
    ngAnnotate[moduleName].files[module.dest] = [module.dest];
  });

  return ngAnnotate;
};
