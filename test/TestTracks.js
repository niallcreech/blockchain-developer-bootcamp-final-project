const Tracks = artifacts.require("./Tracks.sol");
const truffleAssert = require('truffle-assertions');

describe("When working with a contract", () => {
  contract("Tracks", accounts => {
    
    let contract;
  
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
      const tx1 = await contract.addTrack("mytrack1", "mydescription", { from: accounts[0] });
      truffleAssert.eventEmitted(tx1, 'TrackCreated', (ev) => {
    			expect(ev.trackId.toNumber()).to.equal(1);
        	return true;
    		});
      const tx2 = await contract.addTrack("mytrack2", "mydescription", { from: accounts[0] });
      truffleAssert.eventEmitted(tx2, 'TrackCreated', (ev) => {
          expect(ev.trackId.toNumber()).to.equal(2);
          return true;
        });
   	});
   	
   	it("...should get all the tracks.", async () => {
      const name = "mytrack"
      const tx = await contract.addTrack(name, "mydescription", { from: accounts[0] });
      const _tracks = await contract.getTracks()
      assert.equal(2, _tracks.length, "");
    });
  });
});

