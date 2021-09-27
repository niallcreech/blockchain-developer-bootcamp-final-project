const Tracks = artifacts.require("./Tracks.sol");
const truffleAssert = require('truffle-assertions');

contract("Tracks", accounts => {
  
  var contract;

  beforeEach(function() {
     return Tracks.new()
     .then(function(instance) {
        contract = instance;
     });
  });

  it("...should have a default track.", async () => {
    // Set value of 89
    let _tracks = await contract.getTracks();
    assert.equal(1, _tracks.length, "The initial track count is 1");

  });

  it("...should add a track.", async () => {
    const name = "mytrack"
    const tx = await contract.addTrack(name, "mydescription", { from: accounts[0] });
    let _tracks = await contract.getTracks()
    assert.equal(2, _tracks.length, "");
  });
 
  it("...should emit an event when adding a track.", async () => {
    const name = "mytrack"
    const tx = await contract.addTrack(name, "mydescription", { from: accounts[0] });
    truffleAssert.eventEmitted(tx, 'TrackCreated', (ev) => {
			expect(ev.trackId.toString()).to.equal("1");
    	return true; //return ev.name === name;
		});
 	});
});
