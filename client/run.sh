#!/bin/sh

usage() {
    echo "Usage: $0 -t" 1>&2; exit 1;
}

TEST=false

while getopts "t" o; do
    case "${o}" in
        t)
            TEST=true
            ;;
        \?)
            echo "ERROR: Invalid option -$OPTARG"
            usage
            ;;
    esac
done

if [ "${TEST}" == "true" ]; then
  echo "Running frontend tests..."
   npm run test -- --ci --watchAll=false
else
  echo "Running frontend..."
  npm start
fi

