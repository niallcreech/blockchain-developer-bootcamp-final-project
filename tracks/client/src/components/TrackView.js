import React, {Component} from "react";
import { withRouter } from "react-router";
import TrackEntry from "./TrackEntry";
import {getWeb3State} from "../helpers/Web3Helper";

class TrackView extends Component {
	constructor(props){
		super(props);
		this.state = {
			entries: [],
		};
	}
	
	async componentDidMount() {
     this.setState(await getWeb3State(), this.updateEntries);
  }

	async updateEntries(){
 		console.info("Updating track list");
    const { contract } = this.state;
		try {
			const trackId = parseInt(this.props.match.params.trackId);
      console.info("Getting entries for trackId: " + trackId);
			const entries = await contract.methods.getEntriesForTrack(parseInt(this.props.match.params.trackId)).call();
			this.setState({ entries: entries });
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.error(error);
			return {};
    }
		
  }


	render(){
		const listItems = this.state.entries.map((item) => (
			<li key="{item.entryId}">
    		<TrackEntry entryId={item.entryId} name={item.name} desc={item.desc} votes={item.votes} />
				<button value={item.entryId} onClick={() => this.handleEntryVote(item.entryId)}>Vote</button>
			</li>
			)
  	);
		return (
    	<div>
				<div>{this.props.match.params.trackId}</div>
    		<div>{listItems}</div>
			</div>
  	);
	}
	
}

export default withRouter(TrackView);