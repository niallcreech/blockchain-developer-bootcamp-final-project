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
 
    async function createTestTrack() {
      const _tx = await contract.addTrack("track_name", "track_description", { from: accounts[0] });
      let _trackId;
      truffleAssert.eventEmitted(_tx, 'TrackCreated', (ev) => {
        _trackId = ev.trackId.toNumber();
        return true;
      });
      return _trackId;
    }
 
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
    
    it("...should add a track in the open state.", async () => {
      const name = "mytrack"
      const _tx = await contract.addTrack(name, "mydescription", { from: accounts[0] });
      truffleAssert.eventEmitted(_tx, 'TrackCreated', async (ev) => {
          await contract.getTrackState(ev.trackId.toNumber())
            .then( (state) => {
              assert.equal(state, 'open');
            });
        });
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

    it("...should get track status.", async () => {
      const  _trackId = await createTestTrack();
      expect(await contract.getTrackState(_trackId) === "open");
      await contract.closeTrack(_trackId)
        .then(async () => {
          const status = await contract.getTrackState(_trackId);
          expect(status === "closed")
        });
        await contract.blockTrack(_trackId)
        .then(async () => {
          const status = await contract.getTrackState(_trackId);
          expect(status === "blocked")
        });
        await contract.unblockTrack(_trackId)
        .then(async () => {
          const status = await contract.getTrackState(_trackId);
          expect(status === "closed")
        });
        await contract.openTrack(_trackId)
        .then(async () => {
          const status = await contract.getTrackState(_trackId);
          expect(status === "open")
        });
    });
  });
});

