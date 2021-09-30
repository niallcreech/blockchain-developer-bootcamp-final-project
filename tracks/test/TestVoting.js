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
					trackId = 0
      		contract.addTrack("mytrack", "mydescription", { from: accounts[0] });
					entryId = 0
					contract.addEntry(trackId, "myentry", "mydescription", { from: accounts[0] }); 
			});
    });
  
    it("...should emit a vote event.", async () => {
      const tx1 = await contract.vote(entryId, { from: accounts[0] });
			truffleAssert.eventEmitted(tx1, 'EntryVotedFor', (ev) => {
    			expect(ev.entryId.toNumber()).to.equal(0);
        	return true;
    	});
    });
  	
		
  });
});
