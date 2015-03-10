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
        return "/*!\n * " + lines.join("\n * ") + "\n */\n";
      },
      generateBanner: function () {
        var lines = [
          "<%= pkg.name %> v<%= build.version() %>",
          "source: <%= pkg.repository %>",
          "",
          "<%= git.info() %>",
          "Licence: <%= pkg.licence %> (<%= pkg.licenceUrl %>)"
        ];
        return this.multilineCommentFromLines(lines);
      },
      generateShortBanner: function () {
        var lines = [
          "<%= pkg.name %> v<%= build.version() %> | <%= git.info() %>"
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
      app: require('./bower.json').appPath || 'src',
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
          open: 'http://localhost:9000/src/',
          keepalive: true
        }
      },
      dist: {
        options: {
          open: 'http://localhost:9000/dist/',
          keepalive: true
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
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
    'bowerInstall': {
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
          mangle: true,
          banner: GIT.bannerHelper().generateBanner()
        },
        files: {
          'dist/angular-st-pagination.js': ['dist/angular-st-pagination.js']
        }
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
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
          src: [
            'bower_components/**/*'
          ],
          dest: '<%= yeoman.dist %>',
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
      }
    },

    coveralls: {
      options: {
        debug: true,
        coverage_dir: 'coverage',
        force: true
      }
    },

    shell: {
      bower_install: {
        command: "bower install"
      },
      gitHash: {
        command: "git log --pretty=format:'%h' -n 1",
        options: {
          callback: function (err, stdout, stderr, cb) {
            GIT.hash = stdout;
            console.log("git-version: " + GIT.hash);
            cb();
          }
        }
      },
      gitStatus: {
        command: "git status -s",
        options: {
          callback: function (err, stdout, stderr, cb) {
            GIT.status = stdout;
            cb();
          }
        }
      },
      gitVersionHash: {
        command: "git log --pretty=format:'%h' -n 1 v" + PKG.version,
        options: {
          callback: function (err, stdout, stderr, cb) {
            GIT.versionHash = stdout;
            console.log("git-hash of pkg.version tag: " + GIT.versionHash);
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
    'karma'
  ]);

  grunt.registerTask('build', [
    'shell',
    'clean:dist',
    'bowerInstall',
    'useminPrepare',
    'copy:styles',
    'concat',
    'ngmin',
    'copy:dist',
    'uglify:generated',
    'usemin',
    'uglify:addBanner'
  ]);

  grunt.registerTask('default', [
    'deps-ok',
    'nice-package',
    'newer:jshint',
    'test',
    'build'
  ]);

  GIT.info = function () {
    var gitVersionComment = "git-version: " + GIT.hash;
    if (this.isClean()) {
      return gitVersionComment;
    } else {
      return gitVersionComment + " (WARNING: Repo had uncommitted changed while creating the build.)";
    }
  };
  GIT.isClean = function () {
    return (/^\s*$/.test(GIT.status));
  };
  GIT.isTaggedWithPackageVersion = function () {
    return GIT.hash === GIT.versionHash;
  };

  BUILD.version = function () {
    if (GIT.isTaggedWithPackageVersion() && GIT.isClean()) {
      return PKG.version;
    } else {
      return PKG.devVersion + "-sha." + GIT.hash;
    }
  };
};
