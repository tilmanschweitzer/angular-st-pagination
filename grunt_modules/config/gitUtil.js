module.exports = (function () {

  var package = require('../../package.json');
  var execSync = require('child_process').execSync;
  var execEncoding = { encoding: 'utf8' };
  var _ = require('underscore');

  var gitUtil = {
    isClean: function () {
      return (/^\s*$/.test(this.gitInfo.status));
    },
    isReleaseVersion: function () {
      return (/^\d+\.\d+\.\d+$/.test(package.version));
    },
    isReleaseBranch: function () {
      return this.gitInfo.branch === '0.x-master';
    },
    buildVersion: function () {
      if (this.isReleaseVersion() && this.isReleaseBranch() && this.isClean()) {
        return package.version;
      } else {
        return package.version + '-sha.' + this.gitInfo.hash;
      }
    },
    banner: {
      templateScope: function (module) {
        return {
          module: module,
          git: gitUtil.gitInfo,
          pkg: package,
          buildVersion: gitUtil.buildVersion()
        }
      },
      multilineCommentTemplateFromLines: function (lines) {
        return _.template('/**\n * ' + lines.join('\n * ') + '\n */');
      },
      generate: function (module) {
        var lines = [
          '<%= pkg.name %> v<%= buildVersion %>',
          'module: <%= module.moduleName %>',
          'source: <%= pkg.repository.url %>',
          'license: <%= pkg.license %>'
        ];
        return this.multilineCommentTemplateFromLines(lines)(this.templateScope(module));
      },
      generateShort: function (module) {
        var lines = [
          '<%= pkg.name %> (module: <%= module.moduleName %>) v<%= buildVersion %>'
        ];
        return this.multilineCommentTemplateFromLines(lines)(this.templateScope(module));
      }
    }
  };

  gitUtil.gitInfo = {
    hash: execSync('git log --pretty=format:"%H" -n 1', execEncoding),
    status: execSync('git status -s', execEncoding),
    branch: (execSync('git status -s -b ', execEncoding).match(/## ((\w|[-\.])+)\.\.\..*/) || {})[1]
  };

  return gitUtil;
}());
