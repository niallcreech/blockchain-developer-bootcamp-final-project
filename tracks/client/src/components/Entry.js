import React, {Component} from "react";

class Entry extends Component {
	constructor(props){
		super(props);
		this.state = {
			name: "",
			desc: "",
			location: "",
			votes: "",
			web3: null, accounts: null, contract: null 
		}
		this.handleEntryVote = this.handleEntryVote.bind(this);
	}
	
	handleEntryVote(value){
		console.debug("Entry::handleEntryVote");
	}

	render(){
		return (
    	<li key={this.props.entryId}>
				{this.props.entryId} {this.props.name} {this.props.desc} {this.props.location}({this.props.votes} votes)
				<button value={this.props.entryId} onClick={() => this.handleEntryVote(this.props.entryId)}>Vote</button>
       </li>
  	);
	}
	
}

export default Entry;