import React, {Component} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import Notification from "./components/Notification"
import TrackList from "./components/TrackList"
import TrackView from "./components/TrackView"
import TrackForm from "./components/TrackForm"
import WalletConnector from "./components/WalletConnector"
import HeaderView from "./components/HeaderView"


import "./App.css";
import {checkConnected, getTracks} from "./helpers/ContractHelper";


class App extends Component {
  constructor(props) {
		super(props);
		this.state = {
			tracks: [],
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
    const response = await checkConnected();
    const {statusCode, message, connected} = await checkConnected();
    console.debug(`App::componentDidMount: ${statusCode} ${message} ${connected}`);
    console.debug(response);
   this.setState({connected: connected});
    if (connected){
      await this.handleTrackListUpdate();
      this.handleNotificationMessage(message, statusCode, 5);
    } else {
      this.handleNotificationMessage(message, statusCode, null);
    }
	}
  
  async handleTrackListUpdate(){
     const result = await getTracks();
     this.setState({tracks: result.data});
  }
  
  async handleNotificationMessageClick(){
     this.setState({notificationMessages: ""});
  }
  
  async handleNotificationMessage(message, statusCode, delay=5){
    console.debug(`App::handleNotificationMessage: ${message}, ${statusCode}`);
    if (this.state.notificationTimer) {
      this.clearNotification();
    }
     
     this.setState({notificationMessage: message, notificationStatusCode: statusCode, notificationCountdown: 5});
     if (delay) {
      this.startNotificationTimer(delay);
     }
  }


  async handleNotificationCountdown(){
    console.debug(`Notification::handleNotificationCountdown: ${this.state.notificationCountdown}`);
    this.setState({notificationCountdown: this.state.notificationCountdown - 1});
     if (this.state.notificationCountdown < 0){
      this.clearNotification();
    }
  }

  async startNotificationTimer(delay){
    console.debug(`Notification::handleNotificationCountdown`);
    this.setState({notificationCountdown: delay});
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
          tracks={this.state.tracks}
          handleNotificationMessage={(message, status_code)=>this.handleNotificationMessage(message, status_code)}
        />
      </div>
    );
    
    const walletView = (
      <WalletConnector 
        handleNotificationMessage={(message, status_code)=>this.handleNotificationMessage(message, status_code)}
      />
    );
    
    const LinkheaderView = (
      <ul className="App-header">
              <li>
                <Link to="/">Tracks ({this.state.tracks.length})</Link>
              </li>
            </ul>
    );
    const dynamicHeader = (
      <div>
        <HeaderView tracks={this.state.tracks}/>
        <Notification
          handleClick={() => this.handleNotificationMessageClick()}
          message={this.state.notificationMessage}
          countdown={this.state.notificationCountdown}
          statusCode={this.state.notificationStatusCode}/>
       </div>
      );
    if (this.state.connected){
      routes = (
        <Switch>
              <Route exact path="/">
                {dynamicHeader}
                {multipleTrackView}
              </Route>
              <Route exact path="/track/:trackId">
                {dynamicHeader}
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
          <div>
		    {routes}
        </div>
        </Router>
        </div>
		  );
	}
}

export default App;
