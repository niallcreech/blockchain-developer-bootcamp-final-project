import React, {Component} from "react";
import "./HeaderView.css";
import { withRouter } from 'react-router-dom';
import {getTrackDetails} from "../helpers/ContractHelper";

class HeaderViewName extends Component {
  constructor(props){
    super(props);
    this.state = {
      trackId: null,
      text: null
    }
  }
  render(){
    return (
      <div className="HeaderViewName">
        <div trackId={this.props.id}  className="HeaderViewName">{this.props.text || "All Tracks"}</div>
      </div>
    );
  }
}
class HeaderViewDesc extends Component {
  constructor(props){
    super(props);
    this.state = {
      trackId: null,
      text: null
    }
  }
  render(){
    return (
      <div className="HeaderViewDesc">
        <div trackId={this.props.trackId}  className="HeaderViewDesc">{this.state.text || ""}</div>
      </div>
    );
  }
}

class HeaderView extends Component {

  constructor(props){
    super(props);
    this.state = {
      trackId: null,
      trackName: null,
      trackDetails: null,
      selectedTrack: false,
    }
    this.handleReturnClick = this.handleReturnClick.bind(this);
  }
  
  async componentDidMount(){
    await this.updateTrack().then((trackDetails) => {
      this.setState({trackId: this.props.match.params.trackId, trackName: trackDetails.name, trackDesc: trackDetails.desc});
      console.debug(`HeaderView::componentDidMount: (${this.state.trackName}, ${this.state.trackDetails})`);
      console.debug(this.state.track);
    });
  }
  async updateTrack(){
    console.debug(`HeaderView::updateTrack: ${this.props.match.params.trackId}`);
    if (this.props.match.params.trackId) {
      const trackId = this.props.match.params.trackId;
      const trackDetails =  await getTrackDetails(trackId);
      console.debug(`HeaderView::updateTrack`);
      console.debug(trackDetails);
      return trackDetails.data;
    } else {
      return {name: null, desc: null};
    }
  }
  
  handleReturnClick(){
    this.props.history.push("/");
  }

	render(){
    let backView;
    if (this.props.match.params.trackId){
      backView = (
        <div>
          <div trackId={this.state.trackId} className="HeaderViewReturn" onClick={this.handleReturnClick}>Back</div>
      </div>
      )
    } else {
      backView = (
        <div>
      </div>
      )
    }
    const headerView = (
      <div>
      {backView}
        <HeaderViewName trackId={this.state.trackId} text={this.state.trackName} />
        <HeaderViewDesc trackId={this.state.trackId} text={this.state.trackDesc}/>
      </div>
    );
    
		return (
      <div className="HeaderView">
        {headerView}
      </div>
  	);
	}
	
}

export default withRouter(HeaderView);
