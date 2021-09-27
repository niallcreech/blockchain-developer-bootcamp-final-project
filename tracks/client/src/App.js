import React, {Component} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import TracksContract from "./contracts/Tracks.json";
import getWeb3 from "./getWeb3";
import Home from "./components/Home"
import TrackList from "./components/TrackList"
import {getAllTracks} from "./helpers/TrackHelpers"
import "./App.css";
	

class App extends Component {
  constructor(props) {
		super(props);
		this.state = {
			tracks: [],
			tracksLength: 0,
			web3: null, accounts: null, contract: null 
		}

		this.handleTrackListUpdate = this.handleTrackListUpdate.bind(this);
	}

	async componentDidMount() {
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
			const _tracks = await instance.methods.getTracks().call();
      this.setState({ web3, accounts, contract: instance }, this.updateTrackList);
   } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

	async updateTrackList(){
 		console.info("Updating track list");
    const { accounts, contract } = this.state;
    this.setState({ tracks: await contract.methods.getTracks().call() });
 		console.info("Updated track list: " + this.state.tracks.length);
  }

	handleTrackListUpdate(){
		this.updateTrackList();
	}

  render() {
		return (
		    <Router>
		      <div>
		        <ul>
		          <li>
		            <Link to="/">Home</Link>
		          </li>
		          <li>
		            <Link to="/tracks">Tracks ({this.state.tracksLength})</Link>
		          </li>
		        </ul>
		
		        <hr />
	
		        <Switch>
		          <Route exact path="/">
		            <Home />
		          </Route>
		          <Route path="/tracks">
		            <TrackList tracks={this.state.tracks} handleTrackListUpdate={this.handleTrackListUpdate}/>
		          </Route>
		        </Switch>
		      </div>
		    </Router>
		  );
	}
}

export default App;
