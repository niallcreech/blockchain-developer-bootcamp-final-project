import React, {Component} from "react";
import "./HeaderView.css";
import { withRouter } from 'react-router-dom';
import {getTrackDetails} from "../helpers/ContractHelper";


class HeaderView extends Component {

  constructor(props){
    super(props);
    this.state = {
      track: {name: null, desc: null}
    }
  }
  
  async componentDidMount(){
    this.setState({track: await this.updateTrack()})
  }
  async updateTrack(){
    console.debug(`HeaderView::updateTrack: ${this.props.match.params.trackId}`);
    if (this.props.match.params.trackId && this.props.tracks.length > 0) {
      const trackId = this.props.match.params.trackId;
      return await getTrackDetails(trackId);
    } else {
      return {name: null, desc: null};
    }
  }

	render(){
    const headerView = (
      <div>
        <div className="HeaderViewName">{this.state.track.name || "All Tracks"}</div>
        <div className="HeaderViewDesc">{this.state.track.desc || ""}</div>
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
