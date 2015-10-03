module.exports = (function () {
  'use strict';

  var config = require('./config/config.js');
  var _ = require('underscore');

  var eslintConfig = {
    dev: {
      src: [
        'src/**/*.js'
      ],
      options: {
        configFile: '.eslint-dev.json'
      }
    },

    prod: {
      src: [
        'src/**/*.js'
      ],
      options: {
        configFile: '.eslint.json'
      }
    }
  };

  config.eachModule(function (modulePaths, moduleName) {
    eslintConfig[moduleName] = {
      src: modulePaths.anyJs,
      options: {
        configFile: '.eslint.json'
      }
    };
    eslintConfig[moduleName + 'Dev'] = {
      src: modulePaths.anyJs,
      options: {
        configFile: '.eslint-dev.json'
      }
    };
  });

  return eslintConfig;
}());
