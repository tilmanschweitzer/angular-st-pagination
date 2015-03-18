#!/bin/sh

set -o verbose

# clean bower
rm -rf app/bower_components

# reinstall bower components
bower install

# prune node packages
npm prune
npm install

# start the build
grunt
