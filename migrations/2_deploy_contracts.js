const Tracks = artifacts.require("./Tracks");

module.exports = function (deployer) {
  deployer.deploy(Tracks);
};
