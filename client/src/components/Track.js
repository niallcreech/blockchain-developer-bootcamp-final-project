import React, {Component} from "react";

class Track extends Component {

	render(){
		return (
      <div className="row">
        <div className="smallCell">{this.props.trackId}</div>
        <div className="bigCell">{this.props.name}</div>
        <div className="bigCell">{this.props.desc}</div>
      </div>
  	);
	}
	
}

export default Track;