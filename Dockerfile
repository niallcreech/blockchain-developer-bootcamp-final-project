FROM node:alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN apk add git \
  && npm install -g ganache-cli truffle \
  && npm install 
COPY run.sh .
COPY contracts ./contracts
COPY migrations ./migrations
COPY test ./test
COPY truffle-config.js .
COPY client/src/contracts ./client/src/contracts
ENTRYPOINT ["./run.sh"]

