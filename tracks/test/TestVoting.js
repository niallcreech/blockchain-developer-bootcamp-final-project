const Tracks = artifacts.require("./Tracks.sol");
const truffleAssert = require('truffle-assertions');

describe("When voting on an entry", () => {
  contract("Voting", accounts => {
    
    let contract;
  
    beforeEach(function() {
       return Tracks.new()
       .then(function(instance) {
          contract = instance;
       });
    });
  
    it("...should increase an entries vote by one.", async () => {
      //let _tracks = await contract.getTracks();
      //assert.equal(1, _tracks.length, "The initial track count is 1");
  
    });
  
    it("...should not allow voting on an entry in the same track.", async () => {
      //let _tracks = await contract.getTracks();
      //assert.equal(1, _tracks.length, "The initial track count is 1");
  
    });

  });
});
