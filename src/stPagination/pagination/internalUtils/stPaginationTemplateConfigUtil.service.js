angular.module('stPagination').factory('stPaginationTemplateConfigUtil', function () {
  'use strict';

  var stPaginationTemplateConfigUtil = {
    baseTemplate: '<ul>' +
      '<li ng-class="{%DISABLED_CLASS%: pagination.onFirstPage()}">' +
      '<a ng-click="pagination.prev()">&laquo;</a>' +
      '</li>' +
      '<li ng-class="{%SELECTED_CLASS%: pagination.onPage(pageIndex)}" ' +
      'ng-repeat="pageIndex in pages()">' +
      '<a ng-click="pagination.setPage(pageIndex)">{{ displayIndex(pageIndex) }}</a>' +
      '</li>' +
      '<li ng-class="{%DISABLED_CLASS%: pagination.onLastPage()}">' +
      '<a ng-click="pagination.next()">&raquo;</a>' +
      '</li>' +
      '</ul>',
    configDefaults: {
      divWrapped: false,
      selectedClass: 'active',
      disabledClass: 'disabled'
    },
    generateTemplate: function (configObject) {
      configObject = angular.extend(angular.copy(this.configDefaults), configObject);
      var $element = angular.element(this.baseTemplate);

      if (configObject.divWrapped) {
        $element.wrap('<div></div>');
        $element = $element.parent();
      }

      $element.addClass('pagination');

      angular.forEach($element.find('li'), function (liElement) {
        var $liElement = angular.element(liElement);
        var ngClass = $liElement.attr('ng-class');
        ngClass = ngClass.replace('%DISABLED_CLASS%', configObject.disabledClass);
        ngClass = ngClass.replace('%SELECTED_CLASS%', configObject.selectedClass);
        $liElement.attr('ng-class', ngClass);
      });

      return $element.wrap('<div></div>').parent().html();
    },
    getTemplateUrl: function (templateConfig) {
      return templateConfig.templateUrl;
    },
    getTemplate: function (templateConfig) {
      if (templateConfig.templateKey) {
        templateConfig = this.getTemplateConfigForKey(templateConfig.templateKey);
      }

      if (templateConfig.template) {
        return templateConfig.template;
      }

      if (templateConfig.templateConfig) {
        return this.generateTemplate(templateConfig.templateConfig);
      }
    },
    simpleConfigKeys: {
      list: {},
      divWrappedList: {
        divWrapped: true
      },
      bootstrap3: {},
      bootstrap2: {
        divWrapped: true
      },
      zurbFoundation: {
        selectedClass: 'current',
        disabledClass: 'unavailable'
      }
    },
    templateKeys: {
      semanticUi: '<div class="ui pagination menu">' +
        '<a class="icon item" ng-class="{disabled: pagination.onFirstPage()}" ng-click="pagination.prev()">' +
        '<i class="left arrow icon"></i>' +
        '</a>' +
        '<a class="item" ng-repeat="index in pages()" ' +
        'ng-click="pagination.setPage(index)" ' +
        'ng-class="{active: pagination.onPage(index)}">' +
        '{{ displayIndex(index) }}' +
        '</a>' +
        '<a class="icon item" ng-class="{disabled: pagination.onLastPage()}" ng-click="pagination.next()">' +
        '  <i class="right arrow icon"></i>' +
        '</a>' +
        '</div>'
    },
    allowedValues: function () {
      var keys = Object.keys;
      var allKeys = keys(this.simpleConfigKeys).concat(keys(this.templateKeys));
      return '"' + (allKeys.join('", "')) + '"';
    },
    getTemplateConfigForKey: function (key) {
      var configObject = this.simpleConfigKeys[key];
      if (configObject !== undefined) {
        return {
          templateConfig: configObject
        };
      }
      var template = this.templateKeys[key];
      if (template !== undefined) {
        return {
          template: template
        };
      }
      throw new Error('Given templateKey "' + key + '" is not in allowed values ' + this.allowedValues());
    }
  };

  return stPaginationTemplateConfigUtil;
});

