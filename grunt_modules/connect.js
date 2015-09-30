module.exports = {
	server: {
    options: {
      port: 8181,
      open: 'http://localhost:8181/example-pages/',
      middleware: function (connect, options) {
        'use strict';

        var serveStatic = require('serve-static');


        if (!Array.isArray(options.base)) {
          options.base = [options.base];
        }

        // Setup the proxy
        var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];

        // Serve static files.
        options.base.forEach(function(base) {
          middlewares.push(serveStatic(base));
        });

        return middlewares;
      }
    }
  },
  docs: {
    options: {
      port: 8181,
      open: 'http://localhost:8181/generated/docs/#'
    }
  }
};
