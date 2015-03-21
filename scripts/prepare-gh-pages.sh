#!/bin/sh

git checkout gh-pages

DIST=dist/


rm -rf app docs demoApp bower_components *.js *.html

git checkout 0.x-master -- $DIST

git mv -f dist/* ./

