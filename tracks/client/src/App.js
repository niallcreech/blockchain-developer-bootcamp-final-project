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
import {getTracks} from "./helpers/Web3Helper";


class App extends Component {
  constructor(props) {
		super(props);
		this.state = {
			tracks: [],
			entries: [],
			tracksLength: 0
		}
	}

	async componentDidMount() {
		const tracks = await getTracks() ;
    this.setState({tracks: tracks});
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
		            <TrackList tracks={this.state.tracks}  />
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
