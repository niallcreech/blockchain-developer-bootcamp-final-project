import React, {Component} from "react";

class VoteCounter extends Component {
	render(){
		//console.debug(this.props);
		return (
			<span>({this.props.votes} votes)</span>
  	);
	}
}

export default VoteCounter;