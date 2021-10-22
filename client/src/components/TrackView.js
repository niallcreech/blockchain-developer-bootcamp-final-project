import React, {Component} from "react";
import EntriesList from "./EntriesList";
import EntryForm from "./EntryForm";
import { withRouter } from 'react-router-dom';
import {getEntries, getVotes, getTrackState} from "../helpers/ContractHelper";
import "./TrackView.css"

class TrackView extends Component {
	constructor(props){
		super(props);
		this.state = {
			entries: [],
			votes: {},
 			exists: false,
 			open: false,
 			closed: false,
      blocked: false
		}

	}
	
	async componentDidMount() {
		await this.handleUpdate();
	}
	
  
	async handleUpdate(){
		console.debug("TrackView::handleUpdate");
    this.setState({
        entries: await this.updateEntries(),
        votes: await this.updateVotes(),
    }, await this.updateTrackAccessState());
	}

	async updateTrackAccessState(){
		console.debug("TrackView::updateTrackAccessState");
		const {exists, open, closed, blocked} = await getTrackState(this.props.match.params.trackId);
    this.setState({
			exists: exists,
			open: open,
			closed: closed,
			blocked: blocked
    });
	}

  async updateEntries(){
    const result = await getEntries(this.props.match.params.trackId);
    return result.data;
  }
  
  async updateVotes(){
    const result = await getVotes(this.props.match.params.trackId);
    console.debug(`TrackView::updateVotes`);
    console.debug(result);
    return result.data;
  }

	render(){
		let view;
		if (this.state.open){
			view = (
	    	<div className="TrackView">
	        <EntriesList
						open={(!this.state.exists || this.state.blocked || this.state.closed)? false : true}
						trackId={this.props.match.params.trackId}
	          votes={this.state.votes}
	          entries={this.state.entries}
	          name={this.props.name}
	          desc={this.props.desc}
	          handleNotificationMessage={(message, statusCode) => this.props.handleNotificationMessage(message, statusCode)}
	          handleUpdate={() => this.handleUpdate()}/>

	        <EntryForm
	          trackId={this.props.match.params.trackId}
	          handleUpdate={() => this.handleUpdate()}
	          handleNotificationMessage={(message, statusCode) => this.props.handleNotificationMessage(message, statusCode)}/>
				</div>
  		);
		} else {
			view = (
				<div className="TrackView">
	        <EntriesList
						open={(!this.state.exists || this.state.blocked || this.state.closed)? false : true}
						trackId={this.props.match.params.trackId}
	          votes={this.state.votes}
	          entries={this.state.entries}
	          name={this.props.name}
	          desc={this.props.desc}
	          handleNotificationMessage={(message, statusCode) => this.props.handleNotificationMessage(message, statusCode)}
	          handleUpdate={() => this.handleUpdate()}/>
				</div>
			);
		}
		return view;
	}
}

export default withRouter(TrackView);
