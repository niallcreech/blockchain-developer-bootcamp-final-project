import React, {Component} from "react";
import {sendVote} from "../helpers/ContractHelper";

class Entry extends Component {
	constructor(props){
		super(props);
		this.handleEntryVote = this.handleEntryVote.bind(this);
	}
	async componentDidMount() {
  }

	async handleEntryVote(value){
		await sendVote(value);
	}

	render(){
		console.debug(this.props);
		return (
    	<li key={this.props.entryId}>
				{this.props.entryId} {this.props.name} {this.props.desc} {this.props.location}({this.props.votes} votes)
				<button value={this.props.entryId} onClick={() => this.handleEntryVote(this.props.entryId)}>Vote</button>
       </li>
  	);
	}
	
}

export default Entry;