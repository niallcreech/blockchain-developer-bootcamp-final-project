import TracksContract from "../contracts/Tracks.json";
import Web3 from "web3";



export async function getTracks(){
    const {contract} = await getWeb3State();
 		const tracks = await contract.methods.getTracks().call();
    const statusCode = 200;
    const message = "Found " + tracks.length + " tracks.";
    return {data: tracks,
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


export async function sendVote(_entryId, _callback){
	// Send a contract call to vote for the entry
  let message;
  let statusCode;
	const {accounts, contract} = await getWeb3State();
  const options = {from: accounts[0]}
  console.debug("WEB3:sendVote: " + _entryId);
  await contract.methods.vote(_entryId).send(options, _callback)
    .then(() => {
      message = "Successfully voted for entry";
      statusCode = 200;
    })
    .catch((err) => {
      const parsedError = parseError(err);
      message = parsedError.message;
      statusCode = parsedError.code;
    });
  console.debug(`sendVote: ${message}, ${statusCode}`);
  return {data: [], statusCode: statusCode, message: message};
}

export async function sendTrack(name, desc, _callback){
  // Send a contract call to vote for the entry
  let message;
  let statusCode;
  const {accounts, contract} = await getWeb3State();
  const options = {from: accounts[0]}
  console.debug("WEB3:sendTrack: "
    + name + ", "
    + desc + ", "
    + _callback + ")"
  ); 
  await contract.methods.addTrack(name, desc).send(options, _callback)
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

export async function sendEntry(trackId, name, desc, location, _callback){
  let message;
  let statusCode;
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
    let isConnected;
    let message;
  let statusCode;
    await getWeb3State()
      .then(({accounts}) => {
        isConnected = (accounts.length > 0)
        message = "Wallet is connected";
        statusCode = 200;
      })
      .catch((err) => {
        const parsedError = parseError(err);
        message = parsedError.message;
        statusCode = parsedError.code;
      });
  return {data: [], statusCode: statusCode, message: message};
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

function parseError(err){
  let parsedError;
  let err_code;
  let err_message;
  try {
    parsedError = JSON.parse(err.message.match(/{.*}/)[0]);
    err_code = parsedError.value.code
    err_message = parsedError.value.data.message
  } catch (e) {
    parsedError = err;
    err_code = err.code || 500;
    err_message = err.message || "An error occurred in the contract transaction";
  }
  return {
    code: err_code,
    message: err_message
  };
  
}

