module.exports = function (grunt) {
  'use strict';

  var path = require('path');
  var config = require('./grunt_modules/config/config');

  require('time-grunt')(grunt);

  grunt.loadNpmTasks('gruntify-eslint');

  require('load-grunt-config')(grunt, {
    // path to task.js files, defaults to grunt dir
    configPath: path.join(process.cwd(), 'grunt_modules')
  });

  grunt.registerTask('build', [
    'ngtemplates',
    'concat',
    'ngdocs'
  ]);

  grunt.registerTask('dev', [
    'eslint:dev',
    'test',
    'build',
    'minify',
    'configureProxies:server',
    'connect:server',
    'watch'
  ]);

  grunt.registerTask('dev-docs', [
    'build',
    'connect:docs',
    'watch:docs'
  ]);

  grunt.registerTask('minify', [
    'ngAnnotate',
    'uglify'
  ]);

  grunt.registerTask('test', [
    'ngtemplates'
  ].concat(config.mapModulesWithTemplate('karma:<%= moduleName %>')));

  grunt.registerTask('test-min', config.mapModulesWithTemplate('karma:<%= moduleName %>Min'));

  grunt.registerTask('default', [
    'clean',
    'deps-ok',
    'nice-package',
    'eslint:prod',
    'test',
    'build',
    'minify',
    'test-min'
  ]);
};
