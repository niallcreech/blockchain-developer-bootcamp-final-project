import React, {Component} from "react";
import EntriesList from "./EntriesList";
import EntryForm from "./EntryForm";
import { withRouter } from 'react-router-dom';
import {getEntries, getVotes} from "../helpers/ContractHelper";
import "./TrackView.css"

class TrackView extends Component {
	constructor(props){
		super(props);
		this.state = {
			entries: [],
			votes: {},
      trackId: {name: "", desc: ""}
		}

	}
	
	async componentDidMount() {
		await this.handleUpdate();
	}
	
  
	async handleUpdate(){
		console.debug("handleUpdate::handleUpdate");
    this.setState({
        entries: await this.updateEntries(),
        votes: await this.updateVotes(),
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
    	<div className="TrackView">
        <EntriesList
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
	}
}

export default withRouter(TrackView);
