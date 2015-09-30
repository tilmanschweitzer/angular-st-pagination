/* eslint no-invalid-this: 0 */
angular.module('stPagination')
  .provider('stPagination', function (stPaginationInternalProvider) {
    'use strict';

    var TEMPLATE_CONFIG = {templateKey: 'list'};

    this.setDefaultLimit = function (defaultLimit) {
      stPaginationInternalProvider.Pagination.DEFAULT_LIMIT = defaultLimit;
    };

    this.setDefaultEdgeRange = function (defaultEdgeRange) {
      stPaginationInternalProvider.Pagination.DEFAULT_EDGE_RANGE = defaultEdgeRange;
    };

    this.setDefaultMidRange = function (defaultMidRange) {
      stPaginationInternalProvider.Pagination.DEFAULT_MID_RANGE = defaultMidRange;
    };

    function countConfigAttributes(tplConfig) {
      return (!!tplConfig.templateConfig + !!tplConfig.templateKey + !!tplConfig.template + !!tplConfig.templateUrl);
    }

    function checkTemplateConfig(templateConfig) {
      if (!templateConfig || !angular.isObject(templateConfig)) {
        throw new Error('Template config value ' + angular.toJson(templateConfig) + ' is not allowed');
      }
      var attributesCount = countConfigAttributes(templateConfig);
      if (attributesCount > 1) {
        throw new Error('Conflicting config attributes: ' +
          'Use only of of: template, templateUrl, templateConfig, templateKey');
      }
      if (attributesCount === 0) {
        throw new Error('Missing config attribute for ' + angular.toJson(templateConfig) + '. ' +
          'Expected one of: template, templateUrl, templateConfig, templateKey');
      }
    }

    this.setTemplateConfig = function (templateConfig) {
      checkTemplateConfig(templateConfig);
      TEMPLATE_CONFIG = templateConfig;
    };

    this.$get = function () {
      return {
        hasPagination: function (collection) {
          return collection && collection.pagination instanceof stPaginationInternalProvider.Pagination;
        },
        Pagination: stPaginationInternalProvider.Pagination,
        range: stPaginationInternalProvider.RangeBuilder.range,
        indexRangeBuilder: function (length) {
          return new stPaginationInternalProvider.RangeBuilder(length);
        },
        templateConfig: function () {
          return TEMPLATE_CONFIG;
        }
      };
    };
  });
