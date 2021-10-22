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
							votes={item.votes || 0}
							onClick={() => this.handleTrackView(item.trackId)}>
	            <div className="row">
	              <div className="bigCellName">{item.name}</div>
	              <div className="bigCellDesc">{item.desc}</div>
	              <div className="smallCell"><VoteCounter votes={item.votes || 0}/></div>
	            </div>
	          </div>
	        pinnedRows.push(row);
				} else {
					let row =
						<div
							className="rowGroup"
							key={item.trackId}
							votes={item.votes || 0}
							onClick={() => this.handleTrackView(item.trackId)}>
	            <div className="row">
	              <div className="bigCellName">{item.name}</div>
	              <div className="bigCellDesc">{item.desc}</div>
	              <div className="smallCell"><VoteCounter votes={item.votes || 0}/></div>
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
          <div className="bigCellName">Name</div>
          <div className="bigCellDesc">Description</div>
          <div className="smallCell">Votes</div>
        </div>
				{pinnedItems}
        {unpinnedItems}
    </div>
		);
	}
}
export default withRouter(TrackList);
