import React, {Component} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import Home from "./components/Home"
import Notification from "./components/Notification"
import TrackList from "./components/TrackList"
import TrackView from "./components/TrackView"
import TrackForm from "./components/TrackForm"
import WalletConnector from "./components/WalletConnector"


import "./App.css";
import {checkConnected, getTracks} from "./helpers/ContractHelper";


class App extends Component {
  constructor(props) {
		super(props);
		this.state = {
			tracks: [],
			entries: [],
			tracksLength: 0,
      notificationMessage: "",
      notificationStatusCode: null,
      notificationCountdown: 0,
      notificationTimer: null,
      connected: false
		}
    this.handleTrackListUpdate = this.handleTrackListUpdate.bind(this);
    this.handleNotificationMessage = this.handleNotificationMessage.bind(this);
    this.handleNotificationMessageClick = this.handleNotificationMessageClick.bind(this);
    this.handleNotificationCountdown = this.handleNotificationCountdown.bind(this);
	}

	async componentDidMount() {
    await this.checkWalletConnection().then(
      () => {
        if (this.state.connected){
          this.handleTrackListUpdate();
        }
      }
    );
	}
  
  async checkWalletConnection(){
     this.setState({connected: checkConnected()});
  }
  
  async handleTrackListUpdate(){
     const result = await getTracks();
     this.setState({tracks: result.data});
  }
  
  async handleNotificationMessageClick(){
     this.setState({notificationMessages: ""});
  }
  
  async handleNotificationMessage(message, statusCode){
      console.debug(`App::handleNotificationMessage: ${message}, ${statusCode}`);
     this.setState({notificationMessage: message, notificationStatusCode: statusCode, notificationCountdown: 5});
     this.startNotificationTimer();
  }


  async handleNotificationCountdown(){
    console.debug(`Notification::handleNotificationCountdown: ${this.state.notificationCountdown}`);
    this.setState({notificationCountdown: this.state.notificationCountdown - 1});
     if (this.state.notificationCountdown < 0){
      this.clearNotification();
    }
  }

  async startNotificationTimer(){
    console.debug(`Notification::handleNotificationCountdown`);
    this.setState({notificationCountdown: 5});
    this.timer = setInterval(this.handleNotificationCountdown, 1000);
  }
  
  async clearNotification(){
    this.setState({notificationMessage: "", notificationStatusCode: null});
    clearInterval(this.timer);
  }

  render() {
    console.debug("App::render: " + this.state.connected);
    let routes;
    const multipleTrackView = (
      <div className="MultipleTrackView">
        <TrackList 
          tracks={this.state.tracks}
          handleUpdate={() => this.handleTrackListUpdate()}
          handleNotificationMessage={(message, status_code)=>this.handleNotificationMessage(message, status_code)}
        />
        <TrackForm 
          handleUpdate={() => this.handleTrackListUpdate()} 
          handleNotificationMessage={(message, status_code)=>this.handleNotificationMessage(message, status_code)}
        />
      </div>
    );
    const singleTrackView = (
      <div className="SingleTrackView">
        <TrackView 
          className="TrackView"
          handleNotificationMessage={(message, status_code)=>this.handleNotificationMessage(message, status_code)}
        />
      </div>
    );
    
    const walletView = (
      <WalletConnector 
        handleNotificationMessage={(message, status_code)=>this.handleNotificationMessage(message, status_code)}
      />
    );
    
    const headerView = (
      <ul className="App-header">
              <li>
                <Link to="/">Tracks ({this.state.tracks.length})</Link>
              </li>
            </ul>
    );
    if (this.state.connected){
      routes = (
        <Switch>
              <Route exact path="/">
                {multipleTrackView}
              </Route>
              <Route exact path="/track/:trackId">
                {singleTrackView}
              </Route>
            </Switch>
      );
    } else {
      routes = <Switch>
          <Route path="/">
                {walletView}
              </Route>
              </Switch>
    }
		return (
      <div className="App">
        <Router>
          {headerView}
          <div>
            <Notification handleClick={() => this.handleNotificationMessageClick()} message={this.state.notificationMessage} countdown={this.state.notificationCountdown}statusCode={this.state.notificationStatusCode}/>
            <hr />
		    {routes}
        </div>
        </Router>
        </div>
		  );
	}
}

export default App;
