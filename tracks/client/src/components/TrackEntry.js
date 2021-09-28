import React, {Component} from "react";

class TrackEntry extends Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
    	<span>{this.props.entryId} {this.props.name} {this.props.desc} {this.props.location}({this.props.votes} votes)</span>
  	);
	}
	
}

export default TrackEntry;