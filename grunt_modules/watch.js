module.exports = (function() {
  'use strict';

  var config = require('./config/config.js');
  var _ = require('underscore');

  var watch = {
    options: {
      livereload: true,
      interval: 200
    },
    html: {
      files: [
        'example-pages/*'
      ]
    },
    docs: {
      files: [
        'src/**/*.js'
      ],
      tasks: [
        'ngdocs'
      ]
    },
    assets: {
      files: [
        'src/assets/**/*', '!src/assets/stylesheets/**/*'
      ],
      tasks: [
        'jshint:extraScripts',
        'copy:assets'
      ]
    }
  };

  var moduleWatchTasks = {};

  _.each(config.modules, function (module, moduleName) {
    moduleWatchTasks['js-' + moduleName] = {
      files: module.getSources(),
      tasks: [
        'eslint:' + moduleName + 'Dev',
        'concat:' + moduleName,
        'uglify:' + moduleName,
        'uglify:' + moduleName + 'Min',
        'karma:' + moduleName
      ]
    };
    moduleWatchTasks['tests-' + moduleName] = {
      files: module.spec,
      tasks: [
        'eslint:' + moduleName + 'Dev',
        'karma:' + moduleName
      ]
    };

    if (!module.hasTemplates()) {
      return;
    }

    moduleWatchTasks['templates-' + moduleName] = {
      files: module.templates.src,
      tasks: [
        'ngtemplates:' + moduleName
      ]
    };
  });

  return _.extend(watch, moduleWatchTasks);
})();
