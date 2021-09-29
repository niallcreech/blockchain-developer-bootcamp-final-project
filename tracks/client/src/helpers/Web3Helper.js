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

async function getPastTrackEvents(contract, trackId, eventName, eventFilter){
	if (contract === null) {
		getWeb3()
	}
	const events = await contract.getPastEvents('EntryCreated', {
    filter: eventFilter,
    fromBlock: 0,
    toBlock: 'latest'
	});
	console.info("getPastTrackEvents: "+ events.length + " events"); 
	return events;
}

export async function getPastEntryCreations(contract, trackId){
	const eventName = "EntryCreated";
	const eventFilter = {trackId: trackId};
	const events = getPastTrackEvents(contract, trackId, eventName, eventFilter)
	return events;
}

export async function getVotesForTrack(contract, trackId){
	const eventName = "EntryVotedFor";
	const eventFilter = {trackId: trackId};
	const events = await getPastTrackEvents(contract, trackId, eventName, eventFilter);
	return events;
}


export async function getWeb3State() {
  try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

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

