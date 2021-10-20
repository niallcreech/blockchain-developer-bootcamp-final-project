const Tracks = artifacts.require("./Tracks.sol");
const truffleAssert = require('truffle-assertions');

describe("When voting on an entry", () => {
  contract("Voting", accounts => {
    
    let contract;
    let trackId;
  	let entryId;

    beforeEach(function() {
       return Tracks.new()
       .then(function(instance) {
          contract = instance;
					trackId = 1
      		contract.addTrack("mytrack", "mydescription", { from: accounts[0] });
					entryId = 1
					contract.addEntry(trackId, "myentry", "mydescription", { from: accounts[0] }); 
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

    async function createTestEntry(_trackId) {
      const _tx = await contract.addEntry(_trackId, "myentry", "mydescription", { from: accounts[0] }); 
      let _id;
      truffleAssert.eventEmitted(_tx, 'EntryCreated', (ev) => {
        _id = ev.entryId.toNumber();
        return true;
      });
      return _id;
    }
 
    it("...should initialise with 1 not 0 as track and entry numbers.", async () => {
      expect(await contract.nextTrackId().then(res => res.toString()) !== '2');
      expect(await contract.nextEntryId().then(res => res.toString()) !== '2');
    });
  
    it("...should allow voting again during cooldown on a different track.", async () => {
      let res;
      let secondTrackId = trackId + 1;
      let secondTrackEntryId = entryId + 1;
      
      // Setup two contracts and entries
      await contract.addTrack("mytrack", "mydescription", { from: accounts[0] });
      await contract.addEntry(secondTrackId, "myentry", "mydescription", { from: accounts[0] }); 
      
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
      const _trackId = await createTestTrack();
      const _entryId = await createTestEntry(_trackId);
      const _tx = await contract.vote(_entryId, { from: accounts[0] });
			truffleAssert.eventEmitted(_tx, 'EntryVotedFor', (ev) => {
    			expect(ev.entryId.toNumber()).to.equal(_entryId);
        	return true;
    	});
    });
  	
    it("...should stop the address voting again for the same entry.", async () => {
      const _trackId = await createTestTrack();
      const _entryId = await createTestEntry(_trackId);
      await contract.vote(_entryId, { from: accounts[1] });
      await contract.vote(_entryId, { from: accounts[2] });
      try {
        await contract.vote(_entryId, { from: accounts[1] });
        assert(false);
      } catch (e){}
    });

	it("...should stop the address voting again during cooldown.", async () => {
      let res;
      let secondTrackId = trackId + 1;
      let secondEntryId = entryId + 1;
      let secondTrackEntryId = secondEntryId + 1;
      await contract.addTrack("mytrack", "mydescription", { from: accounts[0] });
      await contract.addEntry(trackId, "myentry", "mydescription", { from: accounts[0] }); 
      await contract.addEntry(secondTrackId, "myentry", "mydescription", { from: accounts[0] }); 

      await contract.vote(entryId, { from: accounts[0] });
      res1 = await contract.lastVoteTime(accounts[0], trackId).then(res => res.toString());
			expect(res1 !== '0');
      await contract.addEntry(trackId, "myentry", "mydescription", { from: accounts[0] }); 
      try {
        await contract.vote(secondEntryId, { from: accounts[0] });
        assert(false);
      } catch (e){}
			res2 = await contract.lastVoteTime(accounts[0], trackId).then(res => res.toString());
			expect(res1 === res2);
    });
  });
});

async function getVoteTimes(contract, _account, trackIds) {
  const voteTimes = trackIds.map(async (_trackId) => {
    {trackId: await contract.lastVoteTime(_account, _trackId).then(res => res.toString())}
  });
  return voteTimes;
}