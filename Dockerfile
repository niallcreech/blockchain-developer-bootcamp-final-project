FROM node:alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN apk add git \
  && npm install -g --silent ganache-cli truffle \
  && npm install --silent
COPY run.sh .
COPY contracts ./contracts
COPY migrations ./migrations
COPY test ./test
COPY truffle-config.js .
ENTRYPOINT ["./run.sh"]

