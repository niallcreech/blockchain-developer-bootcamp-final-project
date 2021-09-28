import React, {Component} from "react";

class Track extends Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
    	<span key="{this.props.trackId}">{this.props.trackId} {this.props.name} {this.props.desc} ({this.props.votes} votes)</span>
  	);
	}
	
}

export default Track;