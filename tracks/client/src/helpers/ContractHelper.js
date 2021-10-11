import TracksContract from "../contracts/Tracks.json";
import Web3 from "web3";



export async function getTracks(){
    let tracks;
    const {contract, statusCode, message} = await getWeb3State();
    if (statusCode !== 200){
      tracks = [];
    } else {
      tracks = await contract.methods.getTracks().call();
    }
    return {data: tracks,
            statusCode: statusCode,
            message: message};
}

export function isValidUrl(string){
  let url;
  let valid;
  let message;
  let statusCode;
  try {
    url = new URL(string);
		valid = url.protocol === "http:" || url.protocol === "https:";
		statusCode = 200;
		message = "";
  } catch (_) {
    valid = false;  
		message = `"${string}" is not a valid url.`;
		statusCode = 500;
  }
  return {
		valid: valid,
		message: message,
		statusCode: statusCode
}
}

export async function getVotesByTrack(_trackIds){
  const {contract} = await getWeb3State();
	let tracks = {};
	let statusCode;
	let message;
	_trackIds.map(async (trackId) => {
		await contract.methods.votesByTrack(trackId).call()
		.then((result)=> {
				tracks[trackId] = result;
		})
		.catch((err) => {
			console.error(`getVotesByTrack: ${err}`);
	    let parsedError = parseError(err);
	    statusCode = parsedError.code;
	    message = parsedError.message;
		});
	});
  return {data: tracks,
          statusCode: statusCode,
          message: message};
}


export async function getTrackDetails(trackId){
    const {contract} = await getWeb3State();
    const track = await contract.methods.tracks(trackId).call();
    console.debug(`getTrackDetails: ${track}`);
    const statusCode = 200;
    const message = "Found track.";
    return {data: track,
            statusCode: statusCode,
            message: message};
}

async function getEvents(eventName, eventFilter, fromBlock="earliest", toBlock="latest"){
	const {contract} = await getWeb3State();
	let results;
  let message;
  let statusCode;
	try{
		const resultsRaw = await contract.getPastEvents(eventName, {
    	filter: eventFilter,
    	fromBlock: fromBlock,
    	toBlock: toBlock
		});
		results = resultsRaw.map(event => event.returnValues);
    statusCode = 200;
    message = "Found " + results.length + " events.";
	} catch(e) {
		results = [];
    let parsedError = parseError(e);
    statusCode = parsedError.code;
    message = parsedError.message;
	}	
  
  return {data: results,
          statusCode: statusCode,
          message: message};
}

export async function getVotes(trackId){
  let votes = {};
	const eventName = "EntryVotedFor";
	const eventFilter = {trackId: trackId};
  const res = await getEvents(eventName, eventFilter);
  if (res.statusCode === 200){
    	res.data.forEach(function(event) {
    		console.debug(event)
    		const entryId = parseInt(event.entryId);
    		if (votes[entryId]){
    			votes[entryId]++;
    		} else {
    			votes[entryId] = 1;
    		}
    	});
  }
  return {data: votes, statusCode: res.statusCode, message: res.message};
}
	
export async function getEntries(trackId){
	const eventName = "EntryCreated";
	const eventFilter = {trackId: trackId};
	const res = await getEvents(eventName, eventFilter);
  return {data: res.data, statusCode: res.statusCode, message: res.message};
}


export async function sendVote(_entryId){
	// Send a contract call to vote for the entry
  let message;
  let statusCode;
	const {accounts, contract} = await getWeb3State();
  const options = {from: accounts[0]}
  await contract.methods.vote(_entryId).send(options)
    .then(() => {
      message = "Successfully voted for entry";
      statusCode = 200;
    })
    .catch((err) => {
      const parsedError = parseError(err);
      message = parsedError.reason || "Voting failed! You can only vote once for each entry, each track, during the cooldown period";
      statusCode = parsedError.code;
    });
  console.debug(`sendVote: ${message}, ${statusCode}`);
  return {data: [], statusCode: statusCode, message: message};
}

export async function sendTrack(name, desc){
  // Send a contract call to vote for the entry
  let message;
  let statusCode;
  const {accounts, contract} = await getWeb3State();
  const options = {from: accounts[0]}
  console.debug("WEB3:sendTrack: "
    + name + ", "
    + desc  + ")"
  ); 
  await contract.methods.addTrack(name, desc).send(options)
    .then(() => {
      message = "Successfully created track";
      statusCode = 200;
    })
    .catch((err) => {
      const parsedError = parseError(err);
      message = parsedError.message;
      statusCode = parsedError.code;
    });
  return {data: [], statusCode: statusCode, message: message};
}

export async function sendEntry(trackId, name, desc, location){
  let message;
  let statusCode;
  // Send a contract call to vote for the entry
  const {accounts, contract} = await getWeb3State();
  const options = {from: accounts[0]}
  console.debug("WEB3:sendEntry: "
    + trackId + ", "
    + name + ", "
    + desc + ", "
    + location + ")"
  ); 
  await contract.methods.addEntry(trackId, name, desc, location).send(options)
    .then(() => {
      message = "Successfully created entry";
      statusCode = 200;
    })
    .catch((err) => {
      const parsedError = parseError(err);
      message = parsedError.message;
      statusCode = parsedError.code;
    });
  return {data: [], statusCode: statusCode, message: message};
}

export async function checkConnected(){
	const {accounts, contract, web3, statusCode, message, connected} = await getWeb3State();
  return {statusCode, message, connected};
}

async function getWeb3Contract(web3){
	let contract;
	let statusCode;
	let message; 
	await web3.eth.net.getId()
	  .then((networkId) => {
	    const deployedNetwork = TracksContract.networks[networkId];
			console.debug(`getWeb3Contract: ${deployedNetwork}`);
			console.debug(`getWeb3Contract: ${TracksContract.networks}`);
			console.debug(TracksContract.networks);
	    contract = new web3.eth.Contract(
	      TracksContract.abi,
	      deployedNetwork && deployedNetwork.address,
	    );
	    statusCode = statusCode || 200;
	    message = 'Connected to web3 network.';
	  })
	  .catch((err) => {
	    contract = null;
	    statusCode = statusCode || 500;
	    message = 'Failed to get web3 network connection.';
	  });
  if (contract.currentProvider.selectedAddress.length === 0){
    contract = null;
    statusCode = statusCode || 500;
    message =  `Contract not found on network ${contract.currentProvider.chainId}, please select the correct network`;
  }
	return {contract, statusCode, message};
}

async function getWeb3Accounts(web3){
	let accounts;
	let statusCode;
	let message;
	await web3.eth.getAccounts()
    .then((acc) => {
      accounts = acc;
      statusCode = 200;
      message = 'Connected to web3 accounts.'
    })
    .catch((err) => {
      accounts = [];
      statusCode = 500;
      message = 'Failed to get web3 accounts.'
    });
	return {accounts, statusCode, message};
}
export async function getWeb3State() {
  let accounts = null;
  let contract = null;
  let connected = false;
  let message;
  let statusCode;
  const web3 = new Web3(window.ethereum);
	const accountObj = await getWeb3Accounts(web3);
	if (accountObj.statusCode !== 200) {
		connected = false;
		message = accountObj.message;
		statusCode = accountObj.statusCode;
	} else {
		accounts = accountObj.accounts;
	}
	const contractObj = await getWeb3Contract(web3);
	if (contractObj.statusCode !== 200) {
		connected = false;
		message = contractObj.message;
		statusCode = contractObj.statusCode;
	} else {
		contract = contractObj.contract;
		connected = true;
	}
  message = contractObj.message;
  statusCode = contractObj.statusCode;
  console.debug(accounts, contract, web3, statusCode, message, connected);
	return {accounts, contract, web3, statusCode, message, connected};
    
}


function parseError(err){
  let parsedError;
  let err_code;
  let err_message;
  let err_reason;
  try {
    parsedError = JSON.parse(err.message.match(/{.*}/)[0]);
    err_code = parsedError.value.code
    err_message = parsedError.value.data.message
    err_reason = null;
  } catch (e) {
    parsedError = err;
    err_code = err.code || 500;
    err_reason = err.reason || null;
    if (!err.message || err.message.match("Transaction has been reverted by the EVM")) {
      err_message = "An error occurred in the contract transaction";
    } else {
      err_message = err.message;
    }
  }
  return {
    code: err_code,
    message: err_message,
    reason: err_reason
  };
  
}

