const Tracks = artifacts.require("./Tracks.sol");
const truffleAssert = require('truffle-assertions');
const common = require("./common.js");


describe("When working with a Tracks contract", () => {
  contract("Lifecycle", accounts => {
    
    let contract;

    beforeEach(function() {
       return Tracks.new()
       .then(function(instance) {
          contract = instance;
       });
    });
  
    it("...should close an open track.", async () => {
      const trackId = await common.getTestTrack(contract, accounts[0]);
      await contract.closeTrack(trackId, { from: accounts[0] });
      assert.equal(true, await contract.isTrackClosed(trackId), "");
    });
  
    it("...should open a closed track.", async () => {
      const trackId = await common.getTestTrack(contract, accounts[0]);
      await contract.closeTrack(trackId, { from: accounts[0] });
      assert.equal(true, await contract.isTrackClosed(trackId), "");
			await contract.openTrack(trackId, { from: accounts[0] });
      assert.equal(true, await contract.isTrackOpen(trackId), "");
    });

		it("...should not open a blocked track.", async () => {
     const trackId = await common.getTestTrack(contract, accounts[0]);
     await contract.blockTrack(trackId, { from: accounts[0] });
      assert.equal(true, await contract.isTrackBlocked(trackId), "");
			try{
				await contract.openTrack(trackId, { from: accounts[0] });
				assert(false);
			} catch (e){}
      assert.equal(false, await contract.isTrackOpen(trackId), "");
      assert.equal(true, await contract.isTrackBlocked(trackId), "");
    });

		it("...should unblock a blocked track.", async () => {
      const {trackId, entryId}  = await common.getTestPair(contract, accounts[0]);
      await contract.blockTrack(trackId, { from: accounts[0] });
      assert.equal(true, await contract.isTrackBlocked(trackId), "");
			await contract.unblockTrack(trackId, { from: accounts[0] });
      assert.equal(false, await contract.isTrackBlocked(trackId), "");
    });

		it("...should not allow adding tracks when admin has blocked.", async () => {
      await contract.disableAllTracks(true);
			try {
        await contract.addTrack(name, "mydescription", { from: accounts[0] });
        assert(false);
      } catch (e){}
    });

		it("...should not allow adding entries when admin has blocked.", async () => { 
      await contract.disableAllTracks(true);
			try {
        const {trackId, entryId}  = await common.getTestPair(contract, accounts[0]);
        assert(false);
      } catch (e){}
    });

		it("...should not allow voting when admin has blocked.", async () => {
      const {entryId}  = await common.getTestPair(contract, accounts[0]);
      
      await contract.disableAllVoting(true);
			try {
        await contract.vote(entryId, { from: accounts[0] });
        assert(false);
      } catch (e){}
    });

  });
});
