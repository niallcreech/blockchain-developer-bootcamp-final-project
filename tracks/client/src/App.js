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
import "./App.css";
import {getTracks} from "./helpers/ContractHelper";


class App extends Component {
  constructor(props) {
		super(props);
		this.state = {
			tracks: [],
			entries: [],
			tracksLength: 0
		}
    this.handleTrackListUpdate = this.handleTrackListUpdate.bind(this);
	}

	async componentDidMount() {
		await this.handleTrackListUpdate() ;
	}
  
  async handleTrackListUpdate(){
     this.setState({tracks: await getTracks()});
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
		            <Link to="/tracks">Tracks ({this.state.tracks.length})</Link>
		          </li>
		        </ul>
		
		        <hr />
	
		        <Switch>
		          <Route exact path="/">
		            <Home />
		          </Route>
		          <Route exact path="/tracks">
		            <TrackList tracks={this.state.tracks} handleUpdate={() => this.handleTrackListUpdate()} />
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
