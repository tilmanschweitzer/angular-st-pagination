#!/bin/sh

ISSUE_NUMBER_INPUT=$1


if [ -z $ISSUE_NUMBER_INPUT ]; then
   echo 'usage: '$0' <issue-number>'
   exit 0
fi

JSON=$(curl -s https://api.github.com/repos/tilmanpotthof/angular-st-pagination/issues/15)

ISSUE_NUMBER=$(echo 'console.log('$JSON'.number)' | node)
ISSUE_NAME=$(echo 'console.log('$JSON'.title)' | node)
DASHED_ISSUE_NAME=$(echo $ISSUE_NAME | tr ' ' '-')

COMMAND='git checkout -b issue-'$ISSUE_NUMBER'/'$DASHED_ISSUE_NAME

while [[ ! $EXECUTE =~ ^[YyNn]$ ]]
do
  read -p "execute '${COMMAND}' [Y/N]: " -n 1 -r EXECUTE
  echo ""
done
if [[ $EXECUTE =~ ^[Nn]$ ]]
then
  exit 0
fi


eval $COMMAND

git status

