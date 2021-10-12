# node:alpine will be our base image to create this image
FROM node:alpine
# Set the /app directory as working directory
WORKDIR /app
# Install ganache-cli globally
RUN npm install -g ganache-cli truffle
# Set the default command for the image
COPY run.sh .
COPY contracts ./contracts
COPY migrations ./migrations
COPY test ./test
COPY truffle-config.js .
COPY package.json .
CMD ["./run.sh"]

