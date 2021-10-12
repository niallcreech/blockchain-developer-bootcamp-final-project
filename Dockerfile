FROM node:alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN apk add git \
  && npm install -g ganache-cli truffle \
  && npm install
COPY scripts ./scripts
COPY contracts ./contracts
COPY migrations ./migrations
COPY test ./test
COPY truffle-config.js .
CMD ["./scripts/run_network.sh"]

