const Tracks = artifacts.require("./Tracks.sol");
const truffleAssert = require('truffle-assertions');
const common = require("./common.js");


describe("When voting on an entry", () => {
  contract("Voting", accounts => {
    
    let contract;

    beforeEach(function() {
       return Tracks.new()
       .then(function(instance) {
          contract = instance;
			});
    });
    
    it("...should initialise with 1 not 0 as track and entry numbers.", async () => {
      expect(await contract.nextTrackId().then(res => res.toString()) !== '2');
      expect(await contract.nextEntryId().then(res => res.toString()) !== '2');
    });
  
    it("...should allow voting again during cooldown on a different track.", async () => {
      const {trackId, entryId}  = await common.getTestPair(contract, accounts[0]);
      
      const secondTrackId = await common.getTestTrack(contract, accounts[0]);
      const secondTrackEntryId = await common.getTestEntry(contract, accounts[0], secondTrackId);
      
      expect(await contract.lastVoteTime(accounts[0], trackId).then(res => res.toString()) == '0');
      expect(await contract.lastVoteTime(accounts[0], secondTrackId).then(res => res.toString()) == '0');
      
      // Vote once on first track
      await contract.vote(entryId, { from: accounts[0] });
      expect(await contract.lastVoteTime(accounts[0], trackId).then(res => res.toString()) !== '0');
      expect(await contract.lastVoteTime(accounts[0], secondTrackId).then(res => res.toString()) === '0');
 
      // Vote once on second track
      await contract.vote(secondTrackEntryId, { from: accounts[0] });
      expect(
        (await contract.lastVoteTime(accounts[0], secondTrackEntryId).then(res => res.toString()))
       < (await contract.lastVoteTime(accounts[0], secondTrackEntryId).then(res => res.toString())));
    });
  
    it("...should emit a vote event.", async () => {
      const {trackId, entryId}  = await common.getTestPair(contract, accounts[0]);
      const tx1 = await contract.vote(entryId, { from: accounts[0] });
			truffleAssert.eventEmitted(tx1, 'EntryVotedFor', (ev) => {
    			expect(ev.entryId.toNumber()).to.equal(1);
        	return true;
    	});
    });
  	
    it("...should stop the address voting again for the same entry.", async () => {
      const {trackId, entryId}  = await common.getTestPair(contract, accounts[0]);
      await contract.vote(entryId, { from: accounts[0] });
      await contract.vote(entryId, { from: accounts[1] });
      try {
        await contract.vote(entryId, { from: accounts[0] });
        assert(false);
      } catch (e){}
    });

	it("...should stop the address voting again during cooldown.", async () => {
      const {trackId, entryId}  = await common.getTestPair(contract, accounts[0]);
      
      const secondTrackId = await common.getTestTrack(contract, accounts[0]);
      const secondTrackEntryId = await common.getTestEntry(contract, accounts[0], secondTrackId);

      await contract.vote(entryId, { from: accounts[0] });
      res1 = await contract.lastVoteTime(accounts[0], trackId).then(res => res.toString());
			expect(res1 !== '0');
      await contract.addEntry(trackId, "myentry", "mydescription", { from: accounts[0] }); 
      try {
        await contract.vote(secondTrackEntryId, { from: accounts[0] });
        assert(false);
      } catch (e){}
			res2 = await contract.lastVoteTime(accounts[0], trackId).then(res => res.toString());
			expect(res1 === res2);
    });
  });
});
