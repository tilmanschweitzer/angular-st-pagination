# angular-st-pagination ![Bower Version](https://img.shields.io/bower/v/angular-st-pagination.svg)

> Provides client-side pagination through a simple angular filter.

[![Build Status](https://img.shields.io/travis/tilmanpotthof/angular-st-pagination.svg)](https://travis-ci.org/tilmanpotthof/angular-st-pagination)
[![Test Coverage](https://img.shields.io/codeclimate/coverage/github/tilmanpotthof/angular-st-pagination.svg)](https://codeclimate.com/github/tilmanpotthof/angular-st-pagination)
[![Dependency Status](https://img.shields.io/gemnasium/tilmanpotthof/angular-st-pagination.svg)](https://gemnasium.com/tilmanpotthof/angular-st-pagination)
[![Code Climate](https://img.shields.io/codeclimate/github/tilmanpotthof/angular-st-pagination.svg)](https://codeclimate.com/github/tilmanpotthof/angular-st-pagination)

    bower install angular-st-pagination --save-dev

Script path and basic usage.

    <script src="bower_components/angular-st-pagination/angular-st-pagination.min.js>

    // module dependency
    <script>
    	angular.modules('myApp', ['stPagination']);
    </script>

    // pagination filter and directives
    <ul>
      <li ng-repeat="user in users | pagination">{{ user.name }}</li>
    </ul>
    <st-pagination collection="users"></st-pagination>
    <st-pagination-limit collection="commits" limits="[5,10,20,50,100]"></st-pagination-limit>


## Features

### Complete pagination logic

Just use the pagination filter with an array and the logic is handled by the library. It is as simple as this example: `user in users | pagination`.

### Fixed number of elements

The number of page links never changes and prevents the pagination to cause line breaks.

### Configurable for CSS frameworks

Configure the html structure of the pagination directive to use it with the popular CSS frameworks
**Bootstrap** and **Zurb Foundation**.

### Angular compatibility (1.3.x, 1.2.x, 1.0.x)

Angular is moving fast, but the compatibility is tested for all stable minor releases `1.0.x`, `1.2.x` and `1.3.x`.

### [Check the example page!](http://tilmanpotthof.github.io/angular-st-pagination/#/)

### [Release Notes](ReleaseNotes)

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
* `cssConfig` *(optional - default: 'list')* - Custom **`{object}`** to configure the html structure or **`{string}`** key for a predefined configuration.

#### Basic usage

    <st-pagination collection="users"></st-pagination>

#### Configure number of displayed page links

    <st-pagination collection="users" mid-range="2" edge-range="2"></st-pagination>

#### Configure css with framework key

    <st-pagination collection="users" css-config="'zurbFoundation'"></st-pagination>

#### Configure css with config object

    <st-pagination collection="users" css-config="{selectedClass: 'current', disabledClass: 'unavailable'}">
    </st-pagination>

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




