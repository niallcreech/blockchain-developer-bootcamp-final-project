import React, {Component} from "react";
import EntriesList from "./EntriesList";
import EntryForm from "./EntryForm";
import { withRouter } from 'react-router-dom';
import {getEntries, getVotes} from "../helpers/Web3Helper";


class TrackView extends Component {
	constructor(props){
		super(props);
		this.state = {
			entries: [],
			votes: {},
		}

	}
	
	async componentDidMount() {
		const votes = await getVotes(this.props.match.params.trackId);
		const entries = await getEntries(this.props.match.params.trackId);
		this.setState({entries: entries, votes: votes});
	}

	render(){
		return (
    	<div>
				<EntriesList votes={this.state.votes} entries={this.state.entries}/>
				<EntryForm />
			</div>
  	);
	}
}

export default withRouter(TrackView);
