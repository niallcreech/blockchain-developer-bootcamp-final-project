const Tracks = artifacts.require("./Tracks.sol");
const truffleAssert = require('truffle-assertions');

contract("Tracks", accounts => {
  it("...should have a default track.", async () => {
    const instance = await Tracks.deployed();

    // Set value of 89
    let _tracks = await instance.getTracks();
    assert.equal(1, _tracks.length, "The initial track count is 1");

  });
 });
  
  contract("Tracks", accounts => {
  it("...should add a track.", async () => {
    const instance = await Tracks.deployed();
    const name = "mytrack"
    const tx = await instance.addTrack(name, "mydescription", { from: accounts[0] });
    truffleAssert.eventEmitted(tx, 'TrackCreated', (ev) => {
    	return ev.name === name;
		});
    let _tracks = await instance.getTracks()
    assert.equal(2, _tracks.length, "");
  });
 });
  