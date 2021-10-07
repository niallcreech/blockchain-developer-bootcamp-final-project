import React, {Component} from "react";
import "./HeaderView.css";
import { withRouter } from 'react-router-dom';

class HeaderViewName extends Component {
  constructor(props){
    super(props);
    this.state = {
      text: null
    }
  }
  render(){
    return (
      <div className="HeaderViewName">
        <div trackId={this.props.trackId}  className="HeaderViewName">{this.props.text || "All Tracks"}</div>
      </div>
    );
  }
}
class HeaderViewDesc extends Component {
  constructor(props){
    super(props);
    this.state = {
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
      trackDesc: null,
      trackDetails: null,
    }
    this.handleReturnClick = this.handleReturnClick.bind(this);
    this.updateSelectedTrack = this.updateSelectedTrack.bind(this);
  }
  
  async componentDidMount(){
    await this.updateSelectedTrack();
  }
  
  async updateSelectedTrack(){
    console.debug(`HeaderView::updateTrack`);
    if (this.props.match.params.trackId) {
      this.props.updateSelectedTrack(this.props.match.params.trackId);
    } else {
      this.props.updateSelectedTrack(null);
    }
  }
  
  handleReturnClick(){
    this.props.history.push("/");
    this.updateSelectedTrack();
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
    console.debug("HeaderView::render: " + this.state.trackId);
    const headerView = (
      <div>
      {backView}
        <HeaderViewName trackId={this.props.trackId} text={this.state.trackName} />
        <HeaderViewDesc trackId={this.props.trackId} text={this.state.trackDesc}/>
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
