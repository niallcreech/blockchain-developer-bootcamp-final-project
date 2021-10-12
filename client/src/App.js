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
import {getTracks, getVotesByTrack, getWeb3State} from "./helpers/ContractHelper";


class App extends Component {
  constructor(props) {
		super(props);
		this.state = {
			tracks: [],
			trackVotes: [],
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
    this.handleConnectionUpdate = this.handleConnectionUpdate.bind(this);
	}

  async componentWillUnmount() {
    window.ethereum.removeListener('accountsChanged', this.handleConnectionUpdate);
    window.ethereum.removeListener('networkChanged', this.handleConnectionUpdate);
  }

	async componentDidMount() {
			document.title = "Tracks smudger";
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
		console.debug("App::handleConnectionUpdate");
		const {statusCode, message, connected} = await getWeb3State();
	  this.setState({connected: connected});
    return {connected, statusCode, message};
}
  async handleTrackListUpdate(){
		console.debug("App::handleTrackListUpdate");
    const {data, statusCode, message} = await getTracks();
    const _trackIds = data.map((track) => (track.trackId));
		this.setState({
			tracks: data,
			trackVotes: await getVotesByTrack(_trackIds).then(results => results.data)});
    return {statusCode, message};
  }
  
  async handleNotificationMessageClick(){
     this.setState({notificationMessages: ""});
  }
  
  async handleNotificationMessage(message, statusCode, delay=5){
    if (this.state.notificationTimer) {
      this.clearNotification();
    }
     
     this.setState({notificationMessage: message, notificationStatusCode: statusCode, notificationCountdown: 5});
     if (delay) {
      this.startNotificationTimer(delay);
     }
  }

  async handleNotificationCountdown(){
    this.setState({notificationCountdown: this.state.notificationCountdown - 1});
     if (this.state.notificationCountdown < 0){
      this.clearNotification();
    }
  }

  async startNotificationTimer(delay){
    this.setState({notificationCountdown: delay});
    this.timer = setInterval(this.handleNotificationCountdown, 1000);
  }
  
  async clearNotification(){
    this.setState({notificationMessage: "", notificationStatusCode: null});
    clearInterval(this.timer);
  }


  render() {
    let routes;
    const multipleTrackView = (
      <div className="MultipleTrackView">
        <TrackList 
          tracks={this.state.tracks}
          trackVotes={this.state.trackVotes}
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
