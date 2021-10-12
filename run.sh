#!/bin/sh
npm install
ganache-cli --port 7545 -h 0.0.0.0 &
truffle migrate

