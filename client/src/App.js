import React, {Component} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Notification from "./components/Notification"
import TrackList from "./components/TrackList"
import TrackView from "./components/TrackView"
import TrackForm from "./components/TrackForm"
import HeaderView from "./components/HeaderView"
import TrackHeaderView from "./components/TrackHeaderView"


import "./App.css";
import {getTracks, getUserState, getVotesByTrack, getWeb3State} from "./helpers/ContractHelper";


class App extends Component {
  _isMounted = false;
  _trackListUpdateTimer = null;
  _notificationTimer = null
  _isBackgroundDark = true;

  constructor(props) {
		super(props);
		this.state = {
			tracks: [],
      notificationMessage: "",
      notificationStatusCode: null,
      notificationCountdown: 0,
      notificationTimer: null,
      connected: false,
      address: null,
      banned: false
		}
    this.handleTrackListUpdate = this.handleTrackListUpdate.bind(this);
    this.handleNotificationMessage = this.handleNotificationMessage.bind(this);
    this.handleNotificationMessageClick = this.handleNotificationMessageClick.bind(this);
    this.handleNotificationCountdown = this.handleNotificationCountdown.bind(this);
    this.handleConnectionUpdate = this.handleConnectionUpdate.bind(this);
	}

  async componentWillUnmount() {
    if (this._isMounted  && window.ethereum) {
      try {
        window.ethereum.removeListener('accountsChanged', this.handleConnectionUpdate);
        window.ethereum.removeListener('networkChanged', this.handleConnectionUpdate);
      } catch (err) {
        console.debug(err);
      }
    }
    clearInterval(this._notificationTimer);
    clearInterval(this._trackListUpdateTimer);
    this._isMounted = false;
  }

	async componentDidMount() {
      console.debug(`App::componentDidMount`);
      this._isMounted = true;
      this.startTrackListUpdateTimer();
      const {statusCode, message} = await this.handleConnectionUpdate();
      if (this.state.connected){
        await this.handleTrackListUpdate();
        this.handleNotificationMessage(message, statusCode, 5);
      } else {
        this.handleNotificationMessage(message, statusCode, 0);
      }
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', async () => {
          console.debug(`App::componentDidMount: accountsChanged event`);
          window.location.reload();
        });
        window.ethereum.on('networkChanged', async () => {
          console.debug(`App::componentDidMount: networkChanged event`);
          window.location.reload();
        });
        window.ethereum.on('chainChanged', async () => {
          console.debug(`App::componentDidMount: chainChanged event`);
          window.location.reload();
        });
      }
	}
	
 
  async handleConnectionUpdate(){
    let account = null;
    let banned = false;
		const {accounts, statusCode, message, connected} = await getWeb3State();
    if (accounts) {
      account = (accounts.length > 0)? accounts[0] : null;
      const state = await getUserState(account);
      banned = state.banned;
    }
		if (this._isMounted) {
    	  this.setState({
    			account: account,
    			banned: banned,
    			connected: connected
    		});
    }
    return {connected, statusCode, message};
}
  
  async handleTrackListUpdate(){
		console.debug("App::handleTrackListUpdate");
		let statusCode;
		let message;
		const _newTracks = await getTracks().then(ret => {return ret.data});
		const _trackIds = _newTracks.map((track) => (track.trackId));
		const _newVotes = await getVotesByTrack(_trackIds).then(ret => {return ret.data;});
		_newTracks.forEach((item) => {
			item.votes = _newVotes[item.trackId];
		});
		this.setState({
		 	tracks: _newTracks,
		});
    return {statusCode, message};
  }
  
  async handleNotificationMessageClick(){
    if (this._isMounted) {
     this.setState({notificationMessages: ""});
    }
  }
  
  async handleNotificationMessage(message, statusCode, delay=5){
    if (this._isMounted) {
      if (this.state.notificationTimer) {
        this.clearNotification();
      }
       
       this.setState({notificationMessage: message, notificationStatusCode: statusCode, notificationCountdown: 5});
       if (delay) {
        this.startNotificationTimer(delay);
       }
     }
  }

  async handleNotificationCountdown(){
    if (this._isMounted) {
      this.setState({notificationCountdown: this.state.notificationCountdown - 1});
       if (this.state.notificationCountdown < 0){
        this.clearNotification();
      }
     }
  }

  async startNotificationTimer(delay){
    if (this._isMounted) {
      this.setState({notificationCountdown: delay});
      this._notificationTimer = setInterval(this.handleNotificationCountdown, 1000);
     }
  }
  
  async startTrackListUpdateTimer(delay){
    if (this._isMounted) {
      console.debug(`App::startTrackListUpdateTimer`);
      this.trackListUpdatetimer = setInterval(this.handleTrackListUpdate, 10000);
     }
  }
  

  async clearNotification(){
    if (this._isMounted) {
      this.setState({notificationMessage: "", notificationStatusCode: null});
    }
    clearInterval(this._notificationTimer);
  }


  render() {
    let routes;
    const multipleTrackView = (
      <div className="MultipleTrackView">
        <TrackList 
          tracks={this.state.tracks}
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
    
      routes = (
        <Switch>
              <Route exact path="/">
                <div>
                  <HeaderView name="All Tracks" text="Find the track you want to explore."/>
                  <Notification
                    handleClick={() => this.handleNotificationMessageClick()}
                    message={this.state.notificationMessage}
                    countdown={this.state.notificationCountdown}
                    statusCode={this.state.notificationStatusCode}/>
                 </div>
                {multipleTrackView}
              </Route>
              <Route exact path="/track/:trackId">
                <div>
                <TrackHeaderView 
									handleTrackListUpdate={() => this.handleTrackListUpdate()}
								/>
                <Notification
                  handleClick={() => this.handleNotificationMessageClick()}
                  message={this.state.notificationMessage}
                  countdown={this.state.notificationCountdown}
                  statusCode={this.state.notificationStatusCode}/>
               </div>
                {singleTrackView}
              </Route>
            </Switch>
      );
		return (
      <div className={this._isBackgroundDark ? 'App-dark' : 'App'}>
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
