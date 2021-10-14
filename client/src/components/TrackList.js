import React, {Component} from "react";
import { withRouter } from 'react-router-dom';
import "./TrackList.css";
import SortedList from "./SortedList";
import VoteCounter from "./VoteCounter";


class TrackList extends Component {

	constructor(props) {
		super(props);
		this.handleTrackView = this.handleTrackView.bind(this);
	}
	
	handleTrackView(value){
		console.log("handleTrackView: " + value);
		this.props.history.push("/track/" + value);
	}

	render() {
		let pinnedRows = [];
		let unpinnedRows = [];
		this.props.tracks.forEach((item) => {
			if (item.visible) {
				if (item.pinned) {
					let row =
						<div
							className="rowGroupPinned"
							key={item.trackId}
							votes={this.props.trackVotes[item.trackId] || 0}
							onClick={() => this.handleTrackView(item.trackId)}>
	            <div className="row">
	              <div className="bigCell">{item.name}</div>
	              <div className="bigCell">{item.desc}</div>
	              <div className="smallCell"><VoteCounter votes={this.props.trackVotes[item.trackId] || 0}/></div>
	            </div>
	          </div>
	        pinnedRows.push(row);
				} else {
					let row =
						<div
							className="rowGroup"
							key={item.trackId}
							votes={this.props.trackVotes[item.trackId] || 0}
							onClick={() => this.handleTrackView(item.trackId)}>
	            <div className="row">
	              <div className="bigCell">{item.name}</div>
	              <div className="bigCell">{item.desc}</div>
	              <div className="smallCell"><VoteCounter votes={this.props.trackVotes[item.trackId] || 0}/></div>
	            </div>
	          </div>
					unpinnedRows.push(row);
				}
			}
		});
						
		const pinnedItems = <SortedList by='title'>{pinnedRows}</SortedList>;
		const unpinnedItems = <SortedList by='title'>{unpinnedRows}</SortedList>;
    return (
      <div className="TrackListTable">
        <div className="header">
          <div className="bigCell">Name</div>
          <div className="bigCell">Description</div>
          <div className="smallCell">Votes</div>
        </div>
				{pinnedItems}
        {unpinnedItems}
    </div>
		);
	}
}
export default withRouter(TrackList);
