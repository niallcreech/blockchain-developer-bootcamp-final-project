import TracksContract from "../contracts/Tracks.json";
import Web3 from "web3";

export async function getTracks(){
    const {contract} = await getWeb3State();
 		const tracks = await contract.methods.getTracks().call();
    console.debug("getTracks: found " + tracks.length + " tracks.");
		return tracks;
}

async function getEvents(eventName, eventFilter){
	const {contract} = await getWeb3State();
	let results;
	try{
		const resultsRaw = await contract.getPastEvents(eventName, {
    	filter: eventFilter,
    	fromBlock: 0,
    	toBlock: 'latest'
		});
		results = resultsRaw.map(event => event.returnValues);
	} catch(e) {
		console.error(e);
		results = [];
	}	
	return results;	
}

export async function getVotes(trackId){
	const eventName = "EntryVotedFor";
	const eventFilter = {trackId: trackId};
	const events = await getEvents(eventName, eventFilter);
	let votes = {};
	events.forEach(function(event) {
		console.debug(event)
		const entryId = parseInt(event.entryId);
		if (votes[entryId]){
			votes[entryId]++;
		} else {
			votes[entryId] = 1;
		}
	});
	return votes;
}
	
export async function getEntries(trackId){
	const eventName = "EntryCreated";
	const eventFilter = {trackId: trackId};
	return await getEvents(eventName, eventFilter);
}

export async function sendVote(_entryId, _callback){
	// Send a contract call to vote for the entry
	const {accounts, contract} = await getWeb3State();
  const options = {from: accounts[0]}
  console.debug("WEB3:sendVote: " + _entryId);
  await contract.methods.vote(_entryId).send(options, _callback)
    .catch((err) => alert(err.message));
}

export async function sendTrack(name, desc, _callback){
  // Send a contract call to vote for the entry
  const {accounts, contract} = await getWeb3State();
  const options = {from: accounts[0]}
  console.debug("WEB3:sendTrack: "
    + name + ", "
    + desc + ", "
    + _callback + ")"
  ); 
  await contract.methods.addTrack(name, desc).send(options, _callback)
    .catch((err) => alert(err.message));
}

export async function sendEntry(trackId, name, desc, location, _callback){
  // Send a contract call to vote for the entry
  const {accounts, contract} = await getWeb3State();
  const options = {from: accounts[0]}
  console.debug("WEB3:sendEntry: "
    + trackId + ", "
    + name + ", "
    + desc + ", "
    + location + ","
    + _callback + ")"
  ); 
  await contract.methods.addEntry(trackId, name, desc, location).send(options, _callback)
    .catch((err) => alert(err.message));
}


export async function getWeb3State() {
  try {
      // Get network provider and web3 instance.
     	const web3 = new Web3(window.ethereum);

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = TracksContract.networks[networkId];
      const instance = new web3.eth.Contract(
        TracksContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
			return { web3, accounts, contract: instance };
   } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
			return {};
    }
}

