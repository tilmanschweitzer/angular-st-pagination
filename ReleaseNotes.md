## Release notes

### 0.2.1

* replaced $ prefixed for internal variables (#18)
* added API documentation (#15)
* added and documented generic css config keys 'list' and 'divWrappedList' (#11)

### 0.2.0

* added `st` prefixes for all components without prefix (#9)
    * `pageInfo` > `stPageInfo`
    * `pagination` > `stPagination` (filter)
* changes for angular 1.3 compatibility (#8)

### 0.1.2
* reduced files for bower release (#7)
* README documentation update (#2)

### 0.1.1

* code improvements
* improved build and demoApp

### 0.1.0

* initial version with base directives and filters
    * `stPagination` directive
    * `stPaginationLimit` directive
    * `pagination` filter
    * `pageInfo` filter
* prevent unintended selections (#4)
* configurable html-structure for Bootstrap 2.x compatibility (#3)
* resize pagination if inputCollection length changes (#1)
