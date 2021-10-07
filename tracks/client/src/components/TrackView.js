import React, {Component} from "react";
import EntriesList from "./EntriesList";
import EntryForm from "./EntryForm";
import { withRouter } from 'react-router-dom';
import {getEntries, getVotes} from "../helpers/ContractHelper";


class TrackView extends Component {
	constructor(props){
		super(props);
		this.state = {
			entries: [],
			votes: {},
		}

	}
	
	async componentDidMount() {
		await this.handleUpdate();
	}
	
  
	async handleUpdate(){
    const entries = await this.updateEntries();
    const votes = await this.updateVotes();
    this.setState({
        entries: entries,
        votes: votes
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
		return (
    	<div>
        <EntriesList
          votes={this.state.votes}
          entries={this.state.entries}
          handleNotificationMessage={(message, statusCode) => this.props.handleNotificationMessage(message, statusCode)}
          handleUpdate={() => this.handleUpdate()}/>
        <EntryForm
          trackId={this.props.match.params.trackId}
          handleUpdate={() => this.handleUpdate()}
          handleNotificationMessage={(message, statusCode) => this.props.handleNotificationMessage(message, statusCode)}/>
			</div>
  	);
	}
}

export default withRouter(TrackView);
