import React, {Component} from "react";
import Track from "./Track";
import TrackForm from "./TrackForm";
import { withRouter } from 'react-router-dom';
import "./TrackList.css";


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
      <div className="rowGroup" key={track.trackId}>
    		  <div className="row">
          <div className="smallCell">{track.trackId}</div>
          <div className="bigCell">{track.name}</div>
          <div className="bigCell">{track.desc}</div>
          <div className="smallCell">
            <button value={track.trackId} onClick={() => this.handleTrackView(track.trackId)}>View</button>
          </div>
        </div>
			</div>
			)
  	);
    return (
      <div className="TrackListTable">
        <div className="header">
          <div className="smallCell">ID</div>
          <div className="bigCell">Name</div>
          <div className="bigCell">Description</div>
          <div className="smallCell"></div>
        </div>
        {listItems}
    </div>
		);
	}
}
export default withRouter(TrackList);
