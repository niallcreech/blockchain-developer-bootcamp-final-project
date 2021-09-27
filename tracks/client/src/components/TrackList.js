import React, {Component} from "react";

class TrackList extends Component {
	constructor(props) {
		super(props);
		this.handleUpdateClick = this.handleUpdateClick.bind(this);
	}
	
	handleUpdateClick(event){
		console.log("handleUpdateClick");
		this.props.handleTrackListUpdate();
	}

	render() {
		const listItems = this.props.tracks.map((track) =>
    	<li key="{track.id}">
				<div>{track.id}</div>
				<div>{track.name}</div>
				<div>{track.desc}</div>
				<div>{track.votes}</div>
			</li>
  	);
		return (
			<div>
			<button onClick={this.handleUpdateClick}>Update</button>
				{listItems}
			</div>
		);
	}
}

export default TrackList;