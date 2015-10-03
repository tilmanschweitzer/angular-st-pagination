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
        'demos/stPagination/*'
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
    var buildTasks = [
      'concat:' + moduleName,
      'ngAnnotate:' + moduleName,
      'uglify:' + moduleName,
      'uglify:' + moduleName + 'Min',
      'karma:' + moduleName
    ];

    moduleWatchTasks['js-' + moduleName] = {
      files: module.src,
      tasks: [
        'eslint:' + moduleName + 'Dev'
      ].concat(buildTasks)
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
      ].concat(buildTasks)
    };
  });

  return _.extend(watch, moduleWatchTasks);
})();
