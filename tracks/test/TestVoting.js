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
  
    it("...should increase an entries vote by one.", async () => {
			const preVote = await contract.getVotes(entryId);
      await contract.vote(entryId, { from: accounts[0] }); 
 			assert.equal(preVote.toNumber() + 1, await contract.getVotes(entryId).then(result => result.toNumber()), "");
    });
  
    it("...should not allow voting on an entry in the same track.", async () => {
      const preVote = await contract.getVotes(entryId);
      await contract.vote(entryId, { from: accounts[0] }); 
 			assert.equal(preVote.toNumber() + 1, await contract.getVotes(entryId).then(result => result.toNumber()), "");
      try{
				await contract.vote(entryId, { from: accounts[0] }); 
				assert(false);
			}catch{}
 			assert.equal(preVote.toNumber() + 1, await contract.getVotes(entryId).then(result => result.toNumber()), "");
    });

  });
});
