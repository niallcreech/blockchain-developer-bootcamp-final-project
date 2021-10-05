import React, {Component} from "react";
import Track from "./Track";
import TrackForm from "./TrackForm";
import { withRouter } from 'react-router-dom';


class TrackList extends Component {

	constructor(props) {
		super(props);
		this.handleTrackView = this.handleTrackView.bind(this);
	}
	
	async handleUpdate(event){
		console.log("handleUpdate");
		await this.props.handleUpdate();
	}

	handleTrackView(value){
		console.log("handleTrackView: " + value);
		this.props.history.push("/track/" + value);
	}

	render() {
		const listItems = this.props.tracks.map((track) => (
			<li key={track.trackId}>
    		<Track trackId={track.trackId} name={track.name} desc={track.desc} votes={track.votes} />
				<button value={track.trackId} onClick={() => this.handleTrackView(track.trackId)}>View</button>
			</li>
			)
  	);
    console.debug("TrackList::render: " + listItems.length +  " items.")
		return (
			<div className="TrackList">
				<ul className="TrackList_list">
					{listItems}
				</ul>
				<div className="TrackList_newtrack">
					<TrackForm handleUpdate={() => this.handleUpdate()}/>
				</div>
			</div>
		);
	}
}
export default withRouter(TrackList);
