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
		const sortedItems = 
      <SortedList by='title'>
      {
        this.props.tracks.map((item) => (
          <div className="rowGroup" key={item.trackId} votes={this.props.trackVotes[item.trackId] || 0}>
            <div className="row">
              <div className="smallCell">{item.trackId}</div>
              <div className="bigCell">{item.name}</div>
              <div className="bigCell">{item.desc}</div>
              <div className="smallCell"><VoteCounter votes={this.props.trackVotes[item.trackId] || 0}/></div>
              <div className="smallCell">
                <button className="TrackListViewButton" value={item.trackId} onClick={() => this.handleTrackView(item.trackId)}>View</button>
              </div>
            </div>
          </div>
        ))
      }
    </SortedList>;
    return (
      <div className="TrackListTable">
        <div className="header">
          <div className="smallCell">ID</div>
          <div className="bigCell">Name</div>
          <div className="bigCell">Description</div>
          <div className="smallCell">Votes</div>
          <div className="smallCell"></div>
        </div>
        {sortedItems}
    </div>
		);
	}
}
export default withRouter(TrackList);
