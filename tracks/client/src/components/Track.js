import React, {Component} from "react";

class Track extends Component {

	render(){
		return (
    	<span key="{this.props.trackId}">{this.props.trackId} {this.props.name} {this.props.desc}</span>
  	);
	}
	
}

export default Track;