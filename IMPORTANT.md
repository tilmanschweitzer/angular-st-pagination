## Branch to test compatibility

This branch exists to test the compatibility with angular 1.0.8.
All changes concerning the source MUST be done in the master.

### Check violations

Violations against this policy can be changed with the following git command:

    git diff -b master -- src/pagination

### Test and build

The bower components and node packages are not updated automatically.
Therefore run the `clean-build.sh` script.
