#!/usr/bin/env node
"use strict";

var connect = require("connect");
var http = require("http");
var fs = require("fs");
var morgan = require('morgan')
var serveStatic = require('serve-static')

var commits = require('./app/demoApp/data/commits.json');

function commitResult(start, end) {
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
    .use(morgan('combined'))
    .use(serveStatic(__dirname + '/app'))
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
