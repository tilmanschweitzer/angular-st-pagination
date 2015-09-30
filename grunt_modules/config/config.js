module.exports = (function() {
  'use strict';

  var _ = require('underscore');
  var fs = require('fs');

  var config = {
    'npmComponents': [
      'node_modules/angular/angular.min.js'
    ],
    'npmDevJquery': [
      'node_modules/jquery/dist/jquery.js'
    ],
    'npmDevComponents': [
      'node_modules/angular-mocks/angular-mocks.js'
    ],
    'npmDocsComponents': [
      'node_modules/angular-animate/angular-animate.js',
      'node_modules/angular-route/angular-route.js'
    ],
    jasmineMatchers: [
      'src/customMatchers.js'
    ],
    'all': [
      'src/**/*.module.js',
      'src/**/!(*.spec).js',
      'generated/.tmp/templates/*.js'
    ],
    'allSpec': [
      'src/**/*.spec?(.config).js'
    ],
    modules: {
    },
    eachModule: function (fn) {
      _.each(this.modules, fn);
    },
    mapModulesWithTemplate: function (template) {
      var compiledTemplate = _.template(template);
      return _.map(config.modules, function (module) {
        return compiledTemplate(module);
      });
    }
  };

  var CONSTANTS = {
    MODULE_SRC: _.template('src/<%= moduleName %>/**/*.module.js'),
    DEST: _.template('generated/dist/js/<%= moduleName %>.js'),
    MIN_DEST: _.template('generated/dist/js/<%= moduleName %>.min.js'),
    SRC_WITHOUT_SPEC: _.template('src/<%= moduleName %>/**/!(*.spec).js'),
    ANY_JS: _.template('src/<%= moduleName %>/**/*.js'),
    TEST_SPEC: _.template('src/<%= moduleName %>/**/*.spec?(.config).js'),
    TEMPLATE_SRC: _.template('src/<%= moduleName %>/**/*.html'),
    TEMPLATE_DEST: _.template('generated/.tmp/templates/templates-<%= moduleName %>.js')
  };

  function BuildModule(moduleName) {
    this.moduleName = moduleName;
    this.src = [CONSTANTS.MODULE_SRC(this), CONSTANTS.SRC_WITHOUT_SPEC(this)];
    this.srcWithoutSpec = CONSTANTS.SRC_WITHOUT_SPEC(this);
    this.dest = CONSTANTS.DEST(this);
    this.minDest = CONSTANTS.MIN_DEST(this);
    this.spec = [CONSTANTS.TEST_SPEC(this)];
    this.anyJs = [CONSTANTS.ANY_JS(this)];
    this.dependencies = [];
  }

  _.extend(BuildModule.prototype, {
    withTemplates: function () {
      this.templates = {
        src: CONSTANTS.TEMPLATE_SRC(this),
        dest: CONSTANTS.TEMPLATE_DEST(this)
      };
      return this;
    },
    withDependencies: function (dependencies) {
      this.dependencies = dependencies;
      return this;
    },
    hasTemplates: function () {
      return this.templates !== undefined;
    },
    getSources: function () {
      if (this.hasTemplates()) {
        return this.src.concat(this.templates.dest)
      } else {
        return this.src;
      }
    },
    getSourcesWithDependencies: function () {
      return this.getSources().concat(_.flatten(this.getDependencies().map(function(dependency) {
        return config.modules[dependency].getSources();
      })))
    },
    getDependencies: function () {
      var uncheckedDependencies = this.dependencies;
      var dependencies = [];
      while (uncheckedDependencies.length > 0) {
        var currentDependency = uncheckedDependencies.pop();
        if (!(currentDependency in dependencies)) {
          dependencies.push(currentDependency);
          //uncheckedDependencies = _.unique(uncheckedDependencies.concat(currentDependency.dependencies));
        }
      }
      return dependencies;
    }
  });

  function addModule(moduleName) {
    var module = new BuildModule(moduleName);
    config.modules[moduleName] = module;
    return module;
  }

  addModule('stPagination');
  addModule('stPaginationDemoApp').withDependencies(['stPagination']).withTemplates();


  return config;
})();
