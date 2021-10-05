import React, {Component} from "react";
import {sendVote} from "../helpers/ContractHelper";
import VoteCounter from "./VoteCounter";
import SortedList from "./SortedList";


class EntriesList extends Component {
	constructor(props){
		super(props);
		this.handleVote = this.handleVote.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
	}
	
  async handleUpdate(){
    await this.props.handleUpdate();
  }

	async handleVote(value){
		await sendVote(value);
		this.handleUpdate();
	}

	render(){
		const listItems = 
      <SortedList by='title'>
      {
        this.props.entries.map((item) => (
          <li key={item.entryId} votes={this.props.votes[item.entryId] || 0}>
            {item.entryId} {item.name} {item.desc} {item.location}
            <VoteCounter votes={this.props.votes[item.entryId] || 0}/>    
            <button value={item.entryId} onClick={() => this.handleVote(item.entryId)}>Vote</button>
          </li>
        ))
      }
    </SortedList>;
    const unsortedItems = this.props.entries.map((item) => (
          <li key={item.entryId} votes={this.props.votes[item.entryId] || 0}>
            {item.entryId} {item.name} {item.desc} {item.location}
            <VoteCounter votes={this.props.votes[item.entryId] || 0}/>    
            <button value={item.entryId} onClick={() => this.handleVote(item.entryId)}>Vote</button>
          </li>
        ));
    console.debug("EntriesList::render: " + listItems.length +  " items.")
		return (
    	<div>
				<ul>{unsortedItems}</ul>
			</div>
  	);
	}
	
}

export default EntriesList;