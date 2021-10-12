#!/bin/sh
NETWORK=$1
PORT=$2
if [ -z ${NETWORK} ]; then
    NETWORK="development"
fi
if [ -z ${PORT} ]; then
    PORT="7545"
fi

if [ "${NETWORK}" == "development" ]; then
    ganache-cli --port 7545 -h 0.0.0.0 &
    sleep 3
fi
truffle migrate --network ${NETWORK}

