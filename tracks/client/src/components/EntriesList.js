import React, {Component} from "react";
import {sendVote} from "../helpers/Web3Helper";
import VoteCounter from "./VoteCounter";


class EntriesList extends Component {
	constructor(props){
		super(props);
		this.handleVote = this.handleVote.bind(this);
	}
	
	async handleVote(value){
		await sendVote(value);
		this.props.handleUpdate();
	}

	render(){
		//console.debug(this.props);
		const listItems = this.props.entries.map((item) => (
			<li key={item.entryId}>
				{item.entryId} {item.name} {item.desc} {item.location}
				<VoteCounter votes={this.props.votes[item.entryId] || 0}/>    
				<button value={item.entryId} onClick={() => this.handleVote(item.entryId)}>Vote</button>
			</li>
    ));
		return (
    	<div>
				<ul>{listItems}</ul>
			</div>
  	);
	}
	
}

export default EntriesList;