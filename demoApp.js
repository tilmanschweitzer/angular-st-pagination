"use strict";angular.module("paginationDemo",["ngCookies","ngResource","ngSanitize","ngRoute","stPagination"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"demoApp/views/demo.html"}).otherwise({redirectTo:"/"})}]),angular.module("paginationDemo").controller("demoController",["$scope","$http",function(a,b){b.get("demoApp/data/angular-commits.txt").success(function(b){var c=b.split("\n"),d=c.map(function(a){var b=a.split(" ");return{hash:b[0],comment:b.slice(1).join(" ")}});a.functionNames=["limit","start","stop","page","displayPage","lastPage","totalPages","onFirstPage","onLastPage","length"],a.getResult=function(a,b){return b[a]()},a.commits=d})}]);