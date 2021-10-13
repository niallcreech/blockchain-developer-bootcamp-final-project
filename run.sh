#!/bin/sh

usage() {
    echo "Usage: $0 -p <port> -n <network> -t" 1>&2; exit 1;
}

NETWORK="development"
PORT=7545
TEST=false

while getopts "p:n:t" o; do
    case "${o}" in
        p)
            PORT=${OPTARG}
            ;;
        n)
            NETWORK=${OPTARG}
            ;;
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
  echo "Running test suite..."
  (truffle test --network ${NETWORK}) &
else
  echo "Deploying contracts to network ${NETWORK}..."
  (truffle migrate --network ${NETWORK}) &
fi

if [ "${NETWORK}" == "development" ]; then
    echo "Starting up ganache local environment..."
    ganache-cli --quiet -h 0.0.0.0 --port 7545
fi
