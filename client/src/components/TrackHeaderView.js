import React, {Component} from "react";
import "./HeaderView.css";
import { withRouter } from 'react-router-dom';
import {getTrackDetails} from "../helpers/ContractHelper";


class TrackHeaderView extends Component {

  constructor(props){
    super(props);
    this.state = {
      trackId: null,
      trackName: null,
      trackDesc: null,
    };
    this.handleReturnClick = this.handleReturnClick.bind(this);
    this.getSelectedTrack = this.getSelectedTrack.bind(this);
		this.handleReturnClick = this.handleReturnClick.bind(this);
  }
  
  async componentDidMount(){
    this.getSelectedTrack();
  }
  
  async getSelectedTrack(){
    const trackDetails =  await getTrackDetails(this.props.match.params.trackId);
    this.setState({
      trackId: this.props.match.params.trackId,
      trackName: trackDetails.data.name,
      trackDesc: trackDetails.data.desc,
    });
  }
  
  async handleReturnClick(){
    console.debug(`HeaderView::handleReturnClick`);
    await this.props.handleTrackListUpdate();
		this.props.history.push("/");
  }
	render(){
		return (
      <div className="HeaderView">
        <div>
          <div className="HeaderViewReturn" onClick={this.handleReturnClick}>Back</div>
        </div>
        <div className="HeaderViewTextContainer">
          <div className="HeaderView">
            <div className="HeaderViewName">
              <div className="HeaderViewName">{this.state.trackName }</div>
            </div>
            <div className="HeaderViewDesc">
              <div className="HeaderViewDesc">{this.state.trackDesc }</div>
            </div>
          </div>
      </div>
      </div>
  	);
	}
	
}

export default withRouter(TrackHeaderView);
