const Tracks = artifacts.require("./Tracks.sol");
const truffleAssert = require('truffle-assertions');

describe("When working with a Tracks contract", () => {
  contract("Lifecycle", accounts => {
    
    let contract;
  	let trackId;

    beforeEach(function() {
       return Tracks.new()
       .then(function(instance) {
          contract = instance;
					trackId = 0
      		contract.addTrack("mytrack", "mydescription", { from: accounts[0] });
       });
    });
  
    it("...should close an open track.", async () => {
      await contract.closeTrack(trackId, { from: accounts[0] });
      assert.equal(true, await contract.isTrackClosed(trackId), "");
    });
  
    it("...should open a closed track.", async () => {
      await contract.closeTrack(trackId, { from: accounts[0] });
      assert.equal(true, await contract.isTrackClosed(trackId), "");
			await contract.openTrack(trackId, { from: accounts[0] });
      assert.equal(true, await contract.isTrackOpen(trackId), "");
    });

		it("...should not open a blocked track.", async () => {
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
        await contract.addEntry(trackId, "myentry", "mydescription", { from: accounts[0] });
        assert(false);
      } catch (e){}
    });

		it("...should not allow voting when admin has blocked.", async () => {
      await contract.disableAllVoting(true);
			try {
        await contract.vote(entryId, { from: accounts[0] });
        assert(false);
      } catch (e){}
    });

  });
});
