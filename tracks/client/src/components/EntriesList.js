import React, {Component} from "react";
import { withRouter } from "react-router";
import Entry from "./Entry";
import {getWeb3State, getPastEntryCreations, getVotesForTrack} from "../helpers/Web3Helper";


class EntriesList extends Component {
	constructor(props){
		super(props);
		this.state = {
			entries: [],
			votes: {},
		}
		console.info("EntriesList::constructor: with " + this.state.entries.length + " entries" )
	}
	
	async componentDidMount() {
     this.setState(await getWeb3State(), this.updateEntries);
  }

	async updateEntries() {
    console.info("EntriesList::updateEntries:Getting entries for trackId: " + this.props.trackId);
    const { contract } = this.state;
		try {
			const trackId = parseInt(this.props.trackId);
			//const newentries = await contract.methods.getEntriesForTrack(parseInt(this.props.trackId)).call();
 			console.info("EntriesList::updateEntries: Called contract getPastEntryCreations with trackId " + parseInt(this.props.trackId));
			//console.info(newentries);
			const newEntries = await getPastEntryCreations(contract, this.props.trackId).then((result) => (result.map(entryEvent => this.getEntryEventDetails(entryEvent))));
			const voteEntries = await getVotesForTrack(contract, this.props.trackId).then((result) => (result.map(entryEvent => this.getEntryEventDetails(entryEvent))));
			const votes = this.countVotes(voteEntries);
			console.info("EntriesList::updateEntries ");
			this.setState({ entries: newEntries, votes: votes });
 			console.info("EntriesList::updateEntries:Updated entries with " + this.state.entries.length + " entries.");
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.error(error);
     }
  }
	countVotes(voteEntries){
		let votes = {};
		voteEntries.forEach(function(i){
			if (votes[i.entryId]) {
				votes[i.entryId]++;
			} else {
				votes[i.entryId] = 1;
			}
		});
		return votes;
	}

	getEntryEventDetails(entryEvent) {
 			console.info("EntriesList::getEntryEventDetails ");
 			console.info(entryEvent.returnValues);
		
		return entryEvent.returnValues;
	}
	

	render(){
		console.debug("EntriesList::render")
		const listItems = this.state.entries.map((item) => (
				<Entry key={item.entryId} entryId={item.entryId} name={item.name} desc={item.desc} votes={this.state.votes[item.entryId]}/>
           )
       );
		return (
    	<div>
				<ul>{listItems}</ul>
			</div>
  	);
	}
	
}

export default EntriesList;