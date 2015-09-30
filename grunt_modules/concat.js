module.exports = function() {
  'use strict';

  var config = require('./config/config.js');
  var _ = require('underscore');

  var concatOptions = {
    vendor: {
      src: config.npmComponents,
      dest: 'generated/dist/js/vendor.js'
    },
    docsVendor: {
      src: config.npmDocsComponents,
      dest: 'generated/dist/js/docsVendor.js'
    }
  };

  _.each(config.modules, function(module, moduleName) {
    concatOptions[moduleName] = {
      src: module.getSourcesWithDependencies(),
      dest: module.dest

    };
  });

  return concatOptions;
};
