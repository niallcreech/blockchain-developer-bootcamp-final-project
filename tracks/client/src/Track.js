import React, {Component} from "react";

class Track extends Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
			<div className={this.props.name}>
			<p>{this.props.desc}</p>
			</div>
		);
	}
	
}

export default Track;