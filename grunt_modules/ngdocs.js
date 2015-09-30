module.exports = {
  options: {
    dest: 'generated/docs',
    title: 'angular-workshop-setup',
    scripts: [
      '//localhost:35729/livereload.js',
      'generated/dist/js/vendor.js',
      'generated/dist/js/docsVendor.js',
      'generated/dist/js/stPaginationDemoApp.js'
    ],
    styles: [
    ],
    editExample: false,
    sourceLink: true,
    navTemplate: 'example-pages/views/docsNav.html'
  },
  all: ['src/**/*.js']
};
