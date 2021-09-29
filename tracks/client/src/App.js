import React, {Component} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import Home from "./components/Home"
import TrackList from "./components/TrackList"
import TrackView from "./components/TrackView"
import {getAllTracks} from "./helpers/TrackHelpers"
import "./App.css";
import {getWeb3State} from "./helpers/Web3Helper";


class App extends Component {
  constructor(props) {
		super(props);
		this.state = {
			tracks: [],
			entries: [],
			tracksLength: 0,
			web3: null, accounts: null, contract: null 
		}
		this.handleTrackListUpdate = this.handleTrackListUpdate.bind(this);
	}

	async componentDidMount() {
    this.setState(await getWeb3State(), this.updateTrackList);
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
		          <Route exact path="/tracks">
		            <TrackList tracks={this.state.tracks}  handleTrackListUpdate={this.handleTrackListUpdate}/>
		          </Route>
							<Route exact path="/track/:trackId">
		            <TrackView/>
		          </Route>
		        </Switch>
		      </div>
		    </Router>
		  );
	}
}

export default App;
