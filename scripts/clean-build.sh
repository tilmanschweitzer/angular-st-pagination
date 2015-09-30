#!/bin/sh

set -o verbose

# prune node packages
npm prune
npm install

# start the build
grunt
