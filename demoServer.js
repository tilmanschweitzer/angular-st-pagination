#!/usr/bin/env node
"use strict";

var connect = require("connect");
var http = require("http");
var fs = require("fs");

var lines = fs.readFileSync('src/demoApp/data/angular-commits.txt').toString().split("\n");
var commits = lines.filter(filterEmptyLine).map(createCommit);


function commitResult (start, end) {
  var result = commits.slice(start, end);

  return {
    total: commits.length,
    start: start,
    end: end,
    resultSize: result.length,
    collection: result
  };
}

var app = connect()
    .use(connect.logger('dev'))
    .use(connect.static('src/'))
    .use(function(req, res) {
      console.log(req);
      console.log(res);

      var match = req.url.match(/^\/commits\/(\d+)\/(\d+)/);

      if (match) {
        var start = parseInt(match[1], 10);
        var end = parseInt(match[2], 10);

        res.end(JSON.stringify(commitResult(start, end)));
      } else {
        res.end(req.url);
      }
    });


http.createServer(app).listen(3000);

function createCommit(line) {
  var lineTokens = line.split(" ");
  return {
    hash: lineTokens[0],
    comment: lineTokens.slice(1).join(" ")
  };
}

function filterEmptyLine(line) {
  return !/(^\s*$)/.test(line);
}