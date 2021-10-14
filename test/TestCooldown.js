const Tracks = artifacts.require("./Tracks.sol");
const truffleAssert = require('truffle-assertions');

describe("When working with Tracks", () => {
  contract("Cooldown", accounts => {
    
    let contract;
    let trackId;
  	let entryId;
		let ownerAddress;
		let clientAddress;

    beforeEach(function() {
       return Tracks.new()
       .then(function(instance) {
					ownerAddress = accounts[0];
					clientAddress = accounts[9];
          contract = instance;
					trackId = 1
      		contract.addTrack("mytrack", "mydescription", { from: clientAddress });
					entryId = 1
					contract.addEntry(trackId, "myentry", "mydescription", { from: clientAddress }); 
			});
    });
  
	it("...should stop the address voting again during cooldown period.", async () => {
			expect(contract.votingCooldownEnabled);
			expect(!contract.isSenderInVotingCooldown(trackId), { from: clientAddress });
      let secondEntryId = entryId + 1;
      await contract.addEntry(trackId, "myentry", "mydescription", { from: clientAddress }); 

      await contract.vote(entryId, { from: clientAddress });
      res1 = await contract.lastVoteTime(clientAddress, trackId).then(res => res.toString());
			expect(res1 !== '0');
			expect(contract.isSenderInVotingCooldown(trackId), { from: clientAddress });
      await contract.addEntry(trackId, "myentry", "mydescription", { from: clientAddress }); 
      try {
        await contract.vote(secondEntryId, { from: clientAddress });
        assert(false);
      } catch (e){}
			res2 = await contract.lastVoteTime(clientAddress, trackId).then(res => res.toString());
			expect(res1 === res2);
  });

	it("...should stop the address creating another track during cooldown period.", async () => {
			expect(contract.trackCreationCooldownEnabled);
			expect(!contract.isSenderInTrackCreationCooldown(), { from: clientAddress });
      await contract.addTrack("mytrack", "mydescription", { from: clientAddress });
			expect(contract.isSenderInTrackCreationCooldown(), { from: clientAddress });

      try {
      await contract.addTrack("mytrack", "mydescription", { from: clientAddress });
        assert(false);
      } catch (e){}
  });

	it("...should allow the address creating another track if cooldown disabled.", async () => {
			expect(contract.entryCreationCooldownEnabled);
			await contract.enableCooldowns(false, {from: ownerAddress})
			expect(!contract.entryCreationCooldownEnabled);
			expect(!contract.isSenderInTrackCreationCooldown(), { from: clientAddress });
      await contract.addTrack("mytrack", "mydescription", { from: clientAddress });
			expect(!contract.isSenderInTrackCreationCooldown(), { from: clientAddress });
    	await contract.addTrack("mytrack", "mydescription", { from: clientAddress });
  });

	it("...should stop the address creating another entry during cooldown period.", async () => {
			expect(contract.entryCreationCooldownEnabled);
			expect(!contract.isSenderInEntryCreationCooldown(), { from: clientAddress });
      await contract.addEntry(trackId, "myentry", "mydescription", { from: clientAddress }); 
			expect(contract.isSenderInEntryCreationCooldown(), { from: clientAddress });

      try {
      	await contract.addEntry(trackId, "myentry", "mydescription", { from: clientAddress }); 
        assert(false);
      } catch (e){}
  });

	it("...should allow the address creating another entry if cooldown disabled.", async () => {
			expect(contract.entryCreationCooldownEnabled);
			await contract.enableCooldowns(false, {from: ownerAddress})
			expect(!contract.entryCreationCooldownEnabled);
			expect(!contract.isSenderInEntryCreationCooldown(), { from: clientAddress });
      await contract.addEntry(trackId, "myentry", "mydescription", { from: clientAddress }); 
			expect(!contract.isSenderInEntryCreationCooldown(), { from: clientAddress });
      try {
      	await contract.addEntry(trackId, "myentry", "mydescription", { from: clientAddress }); 
      } catch (e){assert(false);}
  });

});
});