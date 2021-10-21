const Tracks = artifacts.require("./Tracks.sol");
const truffleAssert = require('truffle-assertions');
const common = require("./common.js");


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
      const {trackId, entryId}  = await common.getTestPair(contract, accounts[0]);
      const _entries = await contract.getEntriesForTrack(trackId);
      assert.equal(1, _entries.length, "");
    });
  
    it("...should emit an event when adding an entry.", async () => {
      const {trackId}  = await common.getTestPair(contract, accounts[0]);
      const tx = await contract.addEntry(trackId, "myentry", "mydescription", { from: accounts[0] });
      truffleAssert.eventEmitted(tx, 'EntryCreated', (ev) =>{
        expect(ev.entryId.toNumber()).to.not.equal(0);
        return true;
      });
    });
  });
});