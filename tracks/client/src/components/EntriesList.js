import React, {Component} from "react";
import { withRouter } from "react-router";
import Entry from "./Entry";
import {getWeb3State, getEntries, getVotes} from "../helpers/Web3Helper";


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
			const entries = await getEntries(contract, this.props.trackId);
			const votes = await getVotes(contract, this.props.trackId);
			console.info("EntriesList::updateEntries ");
			this.setState({ entries: entries, votes: votes });
 			console.info("EntriesList::updateEntries:Updated entries with " + this.state.entries.length + " entries.");
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.error(error);
     }
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