import TracksContract from "../contracts/Tracks.json";
import Web3 from "web3";

const networkIdMapping = {
  "0": "rinkeby", //The default deployed network
  "1": "mainnet",
  "3": "ropsten",
  "4": "rinkeby",
  "5": "goerli",
  "1337802": "kiln",
}

export async function getTracks(){
    let tracks = [];
    let {contract, statusCode, message} = await getWeb3State();
  if (statusCode === 200){
			tracks = await contract.methods.getTracks().call();
    }
	if (!tracks){
		tracks = [];
	}
	console.debug(`getTracks: found ${tracks.length} tracks`);
    return {data: tracks,
            statusCode: statusCode,
            message: message};
}

export async function getUserState(addr){
  const status = {
		banned: false
	};
  let contract;
  let statusCode;
  let message;
	try {
    const state = await getWeb3State();
    contract = state.contract;
    statusCode = state.statusCode;
    message = state.message;
  } catch (err) {
    contract = null;
    statusCode = 500;
    message = err.message;
  }
  let isBanned = false;
	if (statusCode === 200){
		try {
			isBanned = await contract.methods.isUserBanned(addr).call();
			status["banned"] = isBanned;
		} catch(err) {
				status["banned"] = false;
		}
  }
  return {status: status,
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
	console.debug(`App::getVotesByTrack: ${_trackIds}`);
	let {contract, statusCode, message} = await getWeb3State();
  if (statusCode !== 200){
		return {data: {},
          statusCode: statusCode,
          message: message};
	}
	let _data = {}
	for (let i=0; i<_trackIds.length; i++){
		_data[_trackIds[i]] = await contract.methods.votesByTrack(_trackIds[i]).call();
	}
  return {data: _data,
          statusCode: statusCode,
          message: message};
}


export async function getTrackState(trackId){
		let exists = true;
		let open = false;
		let closed = false;
		let blocked = false;
		let {contract, statusCode, message} = await getWeb3State();
    if (statusCode === 200){
      const state = await contract.methods.getTrackState(trackId).call()
				.then((state) => {
    			console.debug(`getTrackState: ${state}`);
					if (state === 'open'){
						open = true;
					} else if (state === 'closed'){
						closed = true;
					} else if (state === 'blocked'){
						blocked = true;
					} else {
						exists = false;
					}
				})
				.catch ((err) => {
					console.debug(err);
					open = true;
				});
			
     	statusCode = 200;
     	message = `Track ${trackId} is in state ${state}`;
    }
    return {
			exists: exists,
			open: open,
			closed: closed,
			blocked: blocked,
      statusCode: statusCode,
      message: message};
}

export async function getTrackDetails(trackId){
		let track = null
		let {contract, statusCode, message} = await getWeb3State();
    if (statusCode === 200){
       track = await contract.methods.tracks(trackId).call();
    	console.debug(`getTrackDetails: ${track}`);
     	statusCode = 200;
     	message = "Found track.";
    } 
    return {data: track,
            statusCode: statusCode,
            message: message};
}

async function getEvents(eventName, eventFilter, fromBlock="earliest", toBlock="latest"){
	
	let results = [];
	let {contract, statusCode, message} = await getWeb3State();
  if (statusCode === 200){
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


export async function sendVote(_trackId, _entryId){
	// Send a contract call to vote for the entry
	let {accounts, contract, statusCode, message} = await getWeb3State();
	if (statusCode === 200){
	  const options = {from: accounts[0]}
		const _userInCooldown = await contract.methods.isSenderInVotingCooldown(_trackId).call();
		try {
			if (!_userInCooldown) {
				await contract.methods.vote(_entryId).send(options);
		    message = "Successfully voted for entry";
		    statusCode = 200;
				console.debug(`sendVote: ${message}, ${statusCode}`);
		  } else {
		      message = "Voting failed! You can only vote once for each entry, each track, during the cooldown period";
		      statusCode = 500;
					console.debug(`sendVote: ${message}, ${statusCode}`);
		  } 
		} catch(err) {
	      const parsedError = parseError(err);
	      message = parsedError.message;
	      statusCode = parsedError.code;
	  }
	}
  return {data: [], statusCode: statusCode, message: message};
}

export async function sendTrack(name, desc){
  // Send a contract call to vote for the entry
  let {accounts, contract, statusCode, message} = await getWeb3State();
	if (statusCode === 200){
	  const options = {from: accounts[0]}
	  console.debug("WEB3:sendTrack: "
	    + name + ", "
	    + desc  + ")"
	  ); 
    try {
			const _userInCooldown = await contract.methods.isSenderInTrackCreationCooldown().call();
			if (!_userInCooldown) {
	      try {
					await contract.methods.addTrack(name, desc).send(options);
	      	message = "Successfully created track";
	      	statusCode = 200;
				} catch(err) {
	      	const parsedError = parseError(err);
	      	message = parsedError.message;
	      	statusCode = parsedError.code;
	  		}
		  }  else {
	      message = "Track creation failed! You can create a track once during the cooldown period";
	      statusCode = 500;
	  	}
		} catch(err) {
	      const parsedError = parseError(err);
	      message = parsedError.message;
	      statusCode = parsedError.code;
	  }
	}
  return {data: [], statusCode: statusCode, message: message};
}

export async function sendEntry(trackId, name, desc, location){
  // Send a contract call to vote for the entry
  let {accounts, contract, statusCode, message} = await getWeb3State();
	if (statusCode === 200){
	  const options = {from: accounts[0]}
	  console.debug("WEB3:sendEntry: "
	    + trackId + ", "
	    + name + ", "
	    + desc + ", "
	    + location + ")"
	  ); 
		try {
			const _userInCooldown = await contract.methods.isSenderInEntryCreationCooldown().call();
			if (!_userInCooldown) {
	      await contract.methods.addEntry(trackId, name, desc, location).send(options)
	      message = "Successfully created entry";
	      statusCode = 200;
		  }  else {
	      message = "Entry creation failed! You can create an entry once during the cooldown period";
	      statusCode = 500;
	  	}
		} catch(err) {
	      const parsedError = parseError(err);
	      message = parsedError.message;
	      statusCode = parsedError.code;
	  }
	}
  return {data: [], statusCode: statusCode, message: message};
}

export async function checkConnected(){
	const {statusCode, message, connected} = await getWeb3State();
  return {statusCode, message, connected};
}

async function getWeb3Contract(web3){
	let contract;
	let statusCode;
	let message;
  let networkId=null;
  let networkName=null;
  
  try {
    networkId = await web3.eth.net.getId();
    networkName = networkIdMapping[networkId] || networkId;
    const deployedNetwork = TracksContract.networks[networkId];
		console.debug(`getWeb3Contract`);
    contract = new web3.eth.Contract(
      TracksContract.abi,
      deployedNetwork && deployedNetwork.address,
    );
    statusCode = statusCode || 200;
    message = 'Connected to web3 network.';
	} catch(err) {
	    contract = null;
	    statusCode = 500;
	    message = 'Failed to get web3 network connection.';
	}
	if (!contract){
    message =  `Contract not found on Ethereum '${networkName}', please select the '${networkIdMapping[0]}' network`;
    statusCode = 500;
	} else if (!contract._address){
    message =  `Contract not found on Ethereum '${networkName}', please select the '${networkIdMapping[0]}' network`;
		statusCode = 500;
  } else {
    statusCode = 200;
    message = `Found contract ${contract._address} on the Ethereum '${networkName}' network.`;
  }
	return {contract, statusCode, message};
}

async function getWeb3Accounts(web3){
	let accounts;
	let statusCode;
	let message;
  try {
	  accounts = await web3.eth.getAccounts();
    statusCode = 200;
    message = 'Connected to web3 accounts.'
  } catch(err) {
    accounts = [];
    statusCode = 500;
    message = 'Failed to get web3 accounts.'
  };
  if (accounts.length === 0) {
    statusCode = 500;
    message = 'Could not find any accounts.'
  }
	return {accounts, statusCode, message};
}

function getWeb3Object(){
  let web3 = null;
  let statusCode;
  let message;
  if(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'){
    window.ethereum.enable();
    web3 = new Web3(window.ethereum);
    statusCode = 200;
    message = "Enabled wallet connection.";
  } else if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider);
    statusCode = 200;
    message = "Enabled wallet connection.";
  } else {
    statusCode = 500;
    message = "No MetaMask detected, please install MetaMask first.";
  }
  return {web3, statusCode, message};
}
export async function getWeb3State() {
  let accounts = null;
  let contract = null;
  let connected = false;
  let web3 = false;
  let message;
  let statusCode;
  const web3Obj = getWeb3Object();
	if (web3Obj.statusCode !== 200) {
    message = web3Obj.message;
    statusCode = web3Obj.statusCode;
  } else {
    web3 = web3Obj.web3;
    const accountObj = await getWeb3Accounts(web3);
    	if (accountObj.statusCode !== 200) {
    		message = accountObj.message;
    		statusCode = accountObj.statusCode;
    	} else {
    		accounts = accountObj.accounts;
      	const contractObj = await getWeb3Contract(web3);
      	if (contractObj.statusCode !== 200) {
      		message = contractObj.message;
      		statusCode = contractObj.statusCode;
      	} else {
      		contract = contractObj.contract;
      		connected = true;
      	}
      message = contractObj.message;
      statusCode = contractObj.statusCode;
    }
  }
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
    console.debug(err);
  }
  return {
    code: err_code,
    message: err_message,
    reason: err_reason
  };
  
}

