const Tracks = artifacts.require("./Tracks.sol");
const truffleAssert = require('truffle-assertions');
const common = require("./common.js");
var Web3 = require('web3');

describe("When working with Tracks", () => {
  contract("Donations", accounts => {
    let contract;
    
    beforeEach(function() {
       return Tracks.new()
       .then(function(instance) {
          contract = instance;
       });
    });
    
    it("...should donate to the author of a Track.", async () => {
      const _donation = Web3.utils.toWei('0.1', 'ether');
			const {trackId, entryId}  = await common.getTestPair(contract, accounts[1]);
      await contract.donateToTrackOwner(trackId, {from: accounts[9], value: _donation});
			const _contractOwner = accounts[0];
			const _trackOwner = await contract.trackOwners(trackId);
			const _minDonation = await contract.minDonation();
			await contract.donations(_trackOwner).then(ret => {
				expect(ret, _donation - _minDonation, "donating to track owner should give them ether, minus the contract owners cut");
			});
			await contract.donations(accounts[1]).then(ret => {
				expect(ret, _minDonation, "donating to track owner should donate a little to the contract owner");
			});
    });

		it("...should not donate too little.", async () => {
      const _donation = Web3.utils.toWei('0.000000001', 'ether');
			const {trackId, entryId}  = await common.getTestPair(contract, accounts[0]);
      try{
      	await contract.donateToTrackOwner(trackId, {from: accounts[9], value: _donation});
				assert(false);
			} catch (err){
				assert(true);
			}
    });

	it("...should not donate too much.", async () => {
      const _donation = Web3.utils.toWei('100', 'ether');
			const {trackId, entryId}  = await common.getTestPair(contract, accounts[0]);
      try{
      	await contract.donateToTrackOwner(trackId, {from: accounts[9], value: _donation});
				assert(false);
			} catch (err){
				assert(true);
			}
    });

	it("...should allow the author of a Track to collect donations.", async () => {
      const _donation = Web3.utils.toWei('0.1', 'ether');
			const {trackId, entryId}  = await common.getTestPair(contract, accounts[9]);
      await contract.donateToTrackOwner(trackId, {from: accounts[9], value: _donation});
			const _trackOwner = await contract.trackOwners(trackId);
			const _storedDonations = await contract.donations(_trackOwner);
			await contract.collectDonations({from: accounts[9]}).then(ret => {
				ret === _donation;
			});
    });
		
});
});