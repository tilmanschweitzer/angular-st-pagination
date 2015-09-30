module.exports = (function() {
  'use strict';

  var config = require('./config/config.js');
  var _ = require('underscore');

  function getModuleTestfiles(module) {
    return config.npmDevJquery
      .concat(config.npmComponents)
      .concat(config.npmDevComponents)
      .concat(config.jasmineMatchers)
      .concat(module.getSourcesWithDependencies())
      .concat(module.spec);
  }

  function getModuleMinTestfiles(module) {
    return config.npmDevJquery
      .concat(config.npmComponents)
      .concat(config.npmDevComponents)
      .concat(config.jasmineMatchers)
      .concat(module.minDest)
      .concat(module.spec);
  }

  var karmaTasks = {
  };

  _.each(config.modules, function (module, moduleName) {
    karmaTasks[moduleName] = {
      options: {
        configFile: 'karma.conf.js',
        preprocessors: {},
        coverageReporter: {
          reporters: [
            {type: 'text', dir: 'generated/reports/coverage'},
            {type: 'lcov', dir: 'generated/reports/coverage/lcov/' + moduleName}
          ]
        },
        files: getModuleTestfiles(module)
      }
    };

    karmaTasks[moduleName].options.preprocessors[module.srcWithoutSpec] = 'coverage';

    karmaTasks[moduleName + 'Min'] = {
      options: {
        configFile: 'karma.conf.js',
        coverageReporter: {
          reporters: []
        },
        files: getModuleMinTestfiles(module)
      }
    };
  });

  return karmaTasks;
})();
