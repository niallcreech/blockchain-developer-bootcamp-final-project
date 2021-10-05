import TracksContract from "../contracts/Tracks.json";
import Web3 from "web3";

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          // Accounts now exposed
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:8545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    });
  });


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
		results = resultsRaw.map(event => getVoteEventDetails(event));
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

function	getVoteEventDetails(entryEvent) {
	return entryEvent.returnValues;
}

function	getEntryEventDetails(entryEvent) {
	return entryEvent.returnValues;
}
	
	
export async function sendVote(_entryId){
	// Send a contract call to vote for the entry
	const {accounts, contract} = await getWeb3State();
  const options = {from: accounts[0]}
  console.debug("WEB3:sendVote: " + _entryId);
	try {
		await contract.methods.vote(_entryId).send(options);
	} catch(e) {
		console.error(e);
	}	
}

export async function sendTrack(name, desc, _callback=null){
  // Send a contract call to vote for the entry
  const {accounts, contract} = await getWeb3State();
  const options = {from: accounts[0]}
  console.debug("WEB3:sendTrack: "
    + name + ", "
    + desc + ", "
    + _callback + ")"
  ); 
  try {
    await contract.methods.addTrack(name, desc).send(options, _callback);
  } catch(e) {
    console.error(e);
  } 
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
  try {
    await contract.methods.addEntry(trackId, name, desc, location).send(options, _callback);
  } catch(e) {
    console.error(e);
  } 
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

