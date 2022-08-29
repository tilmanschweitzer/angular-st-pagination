# angular-st-pagination ![Bower Version](https://img.shields.io/bower/v/angular-st-pagination.svg)

> Deprecated: Client-side pagination with a simple AngularJS (1.x) filter and directive.

[![Build Status](https://api.travis-ci.org/tilmanpotthof/angular-st-pagination.svg)](https://travis-ci.org/tilmanpotthof/angular-st-pagination)
[![Test Coverage](https://coveralls.io/repos/tilmanpotthof/angular-st-pagination/badge.svg)](https://coveralls.io/r/tilmanpotthof/angular-st-pagination)
[![Code Climate](https://codeclimate.com/github/tilmanpotthof/angular-st-pagination.svg)](https://codeclimate.com/github/tilmanpotthof/angular-st-pagination)

[Check the example page!](http://tilmanschweitzer.github.io/angular-st-pagination/#/)

## Installation and usage

    bower install angular-st-pagination --save-dev

Script path and basic usage.

    <script src="bower_components/angular-st-pagination/angular-st-pagination.min.js>

    // module dependency
    <script>
    	angular.modules('myApp', ['stPagination']);
    </script>

    // pagination filter and directives
    <ul>
      <li ng-repeat="user in users | stPagination">{{ user.name }}</li>
    </ul>
    <st-pagination collection="users"></st-pagination>
    <st-pagination-limit collection="commits" limits="[5,10,20,50,100]"></st-pagination-limit>

#### [Release Notes](ReleaseNotes.md)

## Features

### Complete pagination logic

Just use the pagination filter with an array and the logic is handled by the library. It is as simple as this example: `user in users | pagination`.

### Fixed number of elements

The number of page links never changes and prevents the pagination to cause line breaks.

### Configurable for CSS frameworks

Configure the html structure of the pagination directive to use it with the popular CSS frameworks
**Bootstrap**, **Zurb Foundation** and **Semantic UI**.

### Angular compatibility (1.3.x, 1.2.x, 1.0.x)

Angular is moving fast, but the compatibility is tested for all stable minor releases `1.0.x`, `1.2.x` and `1.3.x`.


## Components

### [`stPagination`](http://tilmanpotthof.github.io/angular-st-pagination/docs/#/api/stPagination.filter:stPagination) filter

Initialized the pagination and returns a new limited sub-array with an offset controlled by a `stPagination` directive.
The initialized pagination object handles the filtering, correct calculation of offsets and pages.

* inputCollection - Source array to be paginated
* originalCollection *(optional)* - Required if the pagination filter is chained with others

#### Basic usage

    <ul>
      <li ng-repeat="user in users | pagination">
          {{ user.name }}
      </li>
    </ul>

#### Usage with other filters

    <ul>
      <li ng-repeat="user in users | filter:userFilter | pagination:users">
          {{ user.name }}
      </li>
    </ul>

--

### [`stPagination`](http://tilmanpotthof.github.io/angular-st-pagination/docs/#/api/stPagination.directive:stPagination) directive

Displays the pagination. Array must be initialized with the `stPagination` filter.

* `collection` - Array that was initialized by the `stPagination` filter
* `midRange` *(optional - default: 3)* - Number of page links before and after current index
* `edgeRange` *(optional - default: 3)* - Number of page links at the start and end

#### Basic usage

    <st-pagination collection="users"></st-pagination>

#### Configure number of displayed page links

    <st-pagination collection="users" mid-range="2" edge-range="2"></st-pagination>

--

### [`stPaginationProvider`](http://tilmanpotthof.github.io/angular-st-pagination/docs/#/api/stPagination)

Provides methods to configure default values and the pagination template.

#### Default values

    angular.module('myModule', ['stPagination']).config(function (stPaginationProvider) {
        stPaginationProvider.setDefaultLimit(10); // actual default is 10
        stPaginationProvider.setDefaultMidRange(3); // actual default is 3
        stPaginationProvider.setDefaultEdgeRange(3); // actual default is 3
    });

#### Templates

    // predefined templates ('list', 'divWrappedList', 'bootstrap3', 'bootstrap2', 'zurbFoundation', 'semanticUi')
    stPaginationProvider.setTemplateConfig({templateKey: 'bootstrap2'});

    // custom structure configuration
    stPaginationProvider.setTemplateConfig({
        templateConfig: {
            divWrapped: true,
            selectedClass: 'active',
            disabledClass: 'disabled'
        }
    });
    
    // custom template with templateUrl
    stPaginationProvider.setTemplateConfig({templateUrl: 'templates/pagination.html'});
    
    // custom template template
    stPaginationProvider.setTemplateConfig({template: '<div></div>'});

--

### [`stPaginationLimit`](http://tilmanpotthof.github.io/angular-st-pagination/docs/#/api/stPagination.directive:stPaginationLimit) directive

Displays a select element to change the number of items per page.
Array must be initialized with the `pagination` filter.

* `collection` - Array that was initialized by the `stPagination` filter
* `limits` *(optional - default: [10, 20, 50])* - Limit options for the select element.

#### Basic usage

    <st-pagination-limit collection="users"></st-pagination-limit>

#### Configure limit steps

    <st-pagination-limit collection="users" limits="[5,10,20,50,100]"></st-pagination-limit>

--

### [`stPageInfo`](http://tilmanpotthof.github.io/angular-st-pagination/docs/#/api/stPagination.directive:stPageInfo) filter

Displays information about pagination properties.
Array must be initialized with the `pagination` filter. 

* displayKey - selects an information to be displayed
   * `'total'` - number of elements in the collection
   * `'currentPage'` - index of the current page
   * `'totalPages'` - total number of pages
   * `'startIndex'` - index of the first page
   * `'stopIndex'` - index of the last page

#### Basic usage

    {{ users | stPageInfo:'total' }}
    {{ users | stPageInfo:'currentPage' }}
    {{ users | stPageInfo:'totalPages' }}
    {{ users | stPageInfo:'startIndex' }}
    {{ users | stPageInfo:'stopIndex' }}

## Build

To build the project use the following commands.

    npm install
    bower install
    grunt

Tests can be run with:

    grunt test

The demo app can be started for dev and dist using:

    grunt connect:dev
    grunt connect:dist

## Contribution

* Use [issues](https://github.com/tilmanpotthof/angular-st-pagination/issues) for bug reports or feature ideas




