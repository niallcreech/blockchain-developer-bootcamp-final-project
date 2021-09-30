const Tracks = artifacts.require("./Tracks.sol");
const truffleAssert = require('truffle-assertions');


describe("When working with Tracks entries", () => {
  contract("Entries", accounts => {
    let contract;
    
    beforeEach(function() {
       return Tracks.new()
       .then(function(instance) {
          contract = instance;
       });
    });
    
    it("...should add an entry.", async () => {
      const trackName = "mytrack"
      const trackIdVal = await contract.addTrack(trackName, "mydescription", { from: accounts[0]});
      const trackId = 1; //parseInt(trackIdVal);
      const tx = await contract.addEntry(trackId, "myentry", "mydescription", { from: accounts[0] });
      const _entries = await contract.getEntriesForTrack(trackId);
      assert.equal(1, _entries.length, "");
    });
  
    it("...should emit an event when adding an entry.", async () => {
      const trackName = "mytrack"
      const tmp = await contract.addTrack(trackName, "mydescription", { from: accounts[0] });
      const trackId = 1; 
      const tx = await contract.addEntry(trackId, "myentry", "mydescription", { from: accounts[0] });
      truffleAssert.eventEmitted(tx, 'EntryCreated', (ev) =>{
        expect(ev.entryId.toNumber()).to.not.equal(0);
        return true;
      });
    });
  });
});