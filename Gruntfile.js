// Generated on 2014-03-08 using generator-angular 0.7.1
/* jshint camelcase: false */

'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  var GIT = {};
  var BUILD = {};
  var PKG = grunt.file.readJSON('package.json');

  GIT.bannerHelper = function () {
    return {
      multilineCommentFromLines: function (lines) {
        return '/*!\n * ' + lines.join('\n * ') + '\n */\n';
      },
      generateBanner: function () {
        var lines = [
          '<%= pkg.name %> v<%= build.version() %>',
          'source: <%= pkg.repository.url %>',
          'license: <%= pkg.license %> (<%= pkg.licenseUrl %>)'
        ];
        return this.multilineCommentFromLines(lines);
      },
      generateShortBanner: function () {
        var lines = [
          '<%= pkg.name %> v<%= build.version() %>'
        ];
        return this.multilineCommentFromLines(lines);
      }
    };
  };

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({
    pkg: PKG,
    git: GIT,
    build: BUILD,

    // Project settings
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= yeoman.app %>/**/*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      docs: {
        files: ['<%= yeoman.app %>/**/*.js'],
        tasks: ['ngdocs'],
        options: {
          livereload: true
        }
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/**/*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      dev: {
        options: {
          open: 'http://localhost:9000/app/',
          keepalive: true
        }
      },
      dist: {
        options: {
          open: 'http://localhost:9000/dist/',
          keepalive: true
        }
      },
      docs: {
        options: {
          open: 'http://localhost:9000/dist/docs/'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc-base'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/stPagination/**/*.js',
        '!<%= yeoman.app %>/stPagination/**/*.spec.js'
      ],
      test: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: [
          '<%= yeoman.app %>/stPagination/**/*.spec.js'
        ]
      }
    },

    jscs: {
      src: [
        '<%= yeoman.app %>/stPagination/**/*.js',
        '!<%= yeoman.app %>/stPagination/**/*.spec.js'
      ],
      options: {
        config: '.jscsrc'
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      }
    },

    // Automatically inject Bower components into the app
    'wiredep': {
      app: {
        src: [
          '<%= yeoman.app %>/index.html'
        ],
        ignorePath: '<%= yeoman.app %>/'
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>']
      }
    },

    uglify: {
      addBanner: {
        options: {
          mangle: false,
          compress: false,
          enclose: {
            angular: 'angular'
          },
          beautify: {
            width: 120,
            beautify: true,
            indent_level: 2
          },
          banner: GIT.bannerHelper().generateBanner()
        },
        files: {
          'dist/angular-st-pagination.js': ['dist/angular-st-pagination.js']
        }
      },
      dist: {
        options: {
          mangle: true,
          sourceMap: true,
          banner: GIT.bannerHelper().generateBanner()
        },
        files: {
          'dist/angular-st-pagination.min.js': ['dist/angular-st-pagination.js']
        }
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/',
          src: '*.js',
          dest: '.tmp/concat/'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.html',
            'demoApp/**/*'
          ]
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: [
            'bower_components/es5-shim/es5-shim.js',
            'bower_components/json3/lib/json3.min.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/bootstrap-css-only/css/bootstrap.css',
            'bower_components/bootstrap-css-only/fonts/*'
          ],
          dest: '<%= yeoman.dist %>'
        },{
          expand: true,
          dest: '<%= yeoman.dist %>',
          cwd: '.tmp/concat',
          src: [
            '*'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      },
      dist: {
        configFile: 'karma.conf.js',
        singleRun: true,
        options: {
          files: [
            'app/bower_components/jquery/dist/jquery.js',
            'app/bower_components/angular/angular.js',
            'app/bower_components/angular-mocks/angular-mocks.js',
            'dist/angular-st-pagination.min.js',
            'app/customMatchers.js',
            'app/stPagination/**/*.spec.js'
          ],
          preprocessors : {
            'dist/angular-st-pagination.js': 'coverage'
          },
          coverageReporter : {
            reporters: [
              { type: 'text' }
            ]
          }
        }
      }
    },

    sync: {
      all: {
        options: {
          // sync specific options
          sync: ['author', 'name', 'version']
        }
      }
    },

    ngdocs: {
      options: {
        dest: 'dist/docs',
        scripts: [
          'angular.js',
          '../angular-st-pagination.js',
          '../demoApp/scripts/exampleData.js'
        ],
        navTemplate: 'app/demoApp/views/docsNav.html',
        sourceLink: 'https://github.com/tilmanpotthof/angular-st-pagination/blob/{{sha}}/{{file}}#L{{codeline}}',
        editLink: 'https://github.com/tilmanpotthof/angular-st-pagination/edit/master/{{file}}#L{{codeline}}'
      },
      all: ['app/stPagination/**/*.js']
    },

    shell: {
      bower_install: {
        command: 'bower install'
      },
      gitHash: {
        command: 'git log --pretty=format:"%h" -n 1',
        options: {
          callback: function (err, stdout, stderr, cb) {
            GIT.hash = stdout;
            console.log('git-version: ' + GIT.hash);
            cb();
          }
        }
      },
      gitStatus: {
        command: 'git status -s',
        options: {
          callback: function (err, stdout, stderr, cb) {
            GIT.status = stdout;
            cb();
          }
        }
      },
      getBranch: {
        command: 'git status -s -b',
        options:  {
          callback: function (err, stdout, stderr, cb) {
            var match = stdout.match(/## ((\w|[-\.])+)\.\.\..*/);
            GIT.branch = (match || {})[1];
            cb();
          }
        }
      }
    }
  });


  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'bowerInstall',
      'copy:styles',
      'connect:dev',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'karma:unit'
  ]);

  grunt.registerTask('dev-docs', [
    'build',
    'connect:docs',
    'watch:docs'
  ]);

  grunt.registerTask('build', [
    'shell',
    'clean',
    'wiredep',
    'useminPrepare',
    'copy:styles',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'usemin',
    'uglify:addBanner',
    'uglify:dist',
    'karma:dist',
    'ngdocs'
  ]);

  grunt.registerTask('default', [
    'nice-package',
    'deps-ok',
    'sync',
    'newer:jshint',
    'newer:jscs',
    'test',
    'build'
  ]);

  GIT.info = function () {
    var gitVersionComment = 'git-version: ' + GIT.hash;
    if (this.isClean()) {
      return gitVersionComment;
    } else {
      return gitVersionComment + ' (WARNING: Repo had uncommitted changed while creating the build.)';
    }
  };
  GIT.isClean = function () {
    return (/^\s*$/.test(GIT.status));
  };
  GIT.isReleaseVersion = function () {
    return (/^\d+\.\d+\.\d+$/.test(PKG.version));
  };
  GIT.isReleaseBranch = function () {
    return GIT.branch === '0.x-master';
  };
  BUILD.version = function () {
    if (GIT.isReleaseVersion() && GIT.isReleaseBranch() && GIT.isClean()) {
      return PKG.version;
    } else {
      return PKG.version + '-sha.' + GIT.hash;
    }
  };
};
