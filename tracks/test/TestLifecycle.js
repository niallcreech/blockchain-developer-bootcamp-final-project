const Tracks = artifacts.require("./Tracks.sol");
const truffleAssert = require('truffle-assertions');

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
      //let _tracks = await contract.getTracks();
      //assert.equal(1, _tracks.length, "The initial track count is 1");
  
    });
  
    it("...should open a closed track.", async () => {
      //let _tracks = await contract.getTracks();
      //assert.equal(1, _tracks.length, "The initial track count is 1");
  
    });

		it("...should not open a blocked track.", async () => {
      //let _tracks = await contract.getTracks();
      //assert.equal(1, _tracks.length, "The initial track count is 1");
  
    });

		it("...should unblock a blocked track.", async () => {
      //let _tracks = await contract.getTracks();
      //assert.equal(1, _tracks.length, "The initial track count is 1");
  
    });

  });
});
