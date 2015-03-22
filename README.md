# angular-st-pagination ![Bower Version](https://img.shields.io/bower/v/angular-st-pagination.svg)

> Provides client-side pagination through a simple angular filter.



[![Build Status](https://img.shields.io/travis/tilmanpotthof/angular-st-pagination.svg)](https://travis-ci.org/tilmanpotthof/angular-st-pagination)
[![Test Coverage](https://img.shields.io/codeclimate/coverage/github/tilmanpotthof/angular-st-pagination.svg)](https://codeclimate.com/github/tilmanpotthof/angular-st-pagination)
[![Dependency Status](https://img.shields.io/gemnasium/tilmanpotthof/angular-st-pagination.svg)](https://gemnasium.com/tilmanpotthof/angular-st-pagination)
[![Code Climate](https://img.shields.io/codeclimate/github/tilmanpotthof/angular-st-pagination.svg)](https://codeclimate.com/github/tilmanpotthof/angular-st-pagination)
[![Issue Stat](http://issuestats.com/github/tilmanpotthof/angular-st-pagination/badge/issue)](http://issuestats.com/github/tilmanpotthof/angular-st-pagination)

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

The number of page links never changes and prevents the pagination to cause link breaks.

### Configurable for CSS frameworks

Configure the html structure of the pagination directive to use it with the popular CSS frameworks
**Bootstrap** and **Zurb Foundation**.

### Angular compatibility (1.3.x, 1.2.x, 1.0.x)

Angular is moving fast, but the compatibility is tested for all minor branches including older releases `1.0.x` and `1.2.x`.

### [Check the example page!](http://tilmanpotthof.github.io/angular-st-pagination/#/)


## Components

### `pagination` filter

Initializes a collection for the pagination.

* collection *(optional)* - pass the collection explicitly when filters are chained

#### Basic usage

    <ul>
      <li ng-repeat="user in users | pagination">
          {{ user.name }}
      </li>
    </ul>

#### Usage with chained filters

    <ul>
      <li ng-repeat="user in users | filter:userFilter | pagination:users">
          {{ user.name }}
      </li>
    </ul>

--

### `stPagination` directive

Displays the pagination. Collection must be initialized with the `pagination` filter.

* `collection` - collection initialized with `pagination` filter
* `midRange` *(optional - default: 3)* - number of page links before and after current index
* `edgeRange` *(optional - default: 3)* - number of page links at the start and end
* `cssConfig` *(optional - default: 'bootstrap3') - config key for the css style `'bootstrap2'` or `'bootstrap3'`

#### Basic usage

    <st-pagination collection="users"></st-pagination>

#### Configure number of displayed elements

    <st-pagination collection="users" mid-range="2" edge-range="2"></st-pagination>

--

### `stPaginationLimit` directive

Displays a select box to change the pagination limit. Collection must be initialized with the `pagination` filter.

* `collection` - collection initialized with `pagination` filter
* `limits` *(optional - default: [10, 20, 50])* - limit steps

#### Basic usage

    <st-pagination-limit collection="users"></st-pagination-limit>

#### Configure limit steps

    <st-pagination-limit collection="users" limits="[5,10,20,50,100]"></st-pagination-limit>

--

### `pageInfo` filter

Displays information about the pagination. Collection must be initialized with the `pagination` filter. 

* displayKey - selects an information to be displayed
   * `'total'` - number of elements in the collection
   * `'startIndex'` - index of the first page
   * `'stopIndex'` - index of the last page
   * `'currentPage'` - index of the current page
   * `'totalPages'` - total number of pages

#### Basic usage

    {{ users | pageInfo:'total' }}
    {{ users | pageInfo:'currentPage' }}

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




