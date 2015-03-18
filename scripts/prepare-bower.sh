#!/bin/sh

#./scripts/clean-build.sh


git checkout bower

DIST=dist/
git checkout 0.x-master -- $DIST bower.json README.md

for FILE in angular-st-pagination.js  angular-st-pagination.min.js angular-st-pagination.min.js.map
do
 cp $DIST/$FILE ./
 git add $FILE
done

git add README.md
git add bower.json
git reset head -- $DIST
