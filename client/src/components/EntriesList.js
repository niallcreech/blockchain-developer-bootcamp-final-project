import React, {Component} from "react";
import {sendVote} from "../helpers/ContractHelper";
import VoteCounter from "./VoteCounter";
import SortedList from "./SortedList";
import "./EntriesList.css";


class EntriesList extends Component {
	constructor(props){
		super(props);
    this.state = {
      inProgress: false,
    }
		this.handleVote = this.handleVote.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
	}
	
  async handleUpdate(){
    console.debug("EntriesList::handleUpdate: ")
    await this.props.handleUpdate();
  }

	async handleVote(value){
		console.debug("EntriesList::handleUpdate:");
		if (this.props.open){
	    this.setState({inProgress: true});
			await sendVote(value)
				.then(async (result) => {
	        this.props.handleNotificationMessage(result.message, result.statusCode);
	        this.handleUpdate();
	        this.setState({inProgress: false});
	      })
	      .catch((err) => {
	        console.debug(err);
	        this.setState({inProgress: false});
	      });
	 }
	}
  
  async handleEntryClick(location){
    window.open(location);
  }
                 
	render(){
		const sortedItems = 
      <SortedList by='title'>
      {
        this.props.entries.map((item) => {
					let entry;
					if (this.props.open){
						entry = (
							<div className="rowGroup"
                key={item.entryId}
                votes={this.props.votes[item.entryId] || 0}
                onClick={() => this.handleEntryClick(item.location)}
               >
            <div className="row">
						 	<div className="smallCell">{item.entryId}</div>
              <div className="bigCell">{item.name}</div>
              <div className="bigCell">{item.desc}</div>
              <div className="bigCell"><a href={item.location}>{item.location}</a></div>
              <div className="smallCell"><VoteCounter votes={this.props.votes[item.entryId] || 0}/></div>
              <div className="smallCell">
                <button 
									enabled={(this.state.inProgress && this.props.open).toString()}
									className={this.state.inProgress ? "voteButtonDisabled" : "voteButton"}
                  disabled={this.state.inProgress}
                  value={item.entryId}
                  onClick={() => this.handleVote(item.entryId)}>
                  {this.state.inProgress ? "Wait" : "Vote"}
                </button>
              </div>
            </div>
          </div>);
				} else {
					entry = (
            <div
              className="rowGroup"
              key={item.entryId}
              onClick={() => this.handleEntryClick(item.location)}
              votes={this.props.votes[item.entryId] || 0}>
            <div className="row">
						 	<div className="smallCell">{item.entryId}</div>
              <div className="bigCell">{item.name}</div>
              <div className="bigCell">{item.desc}</div>
              <div className="bigCell"><a href={item.location}>{item.location}</a></div>
              <div className="smallCell"><VoteCounter votes={this.props.votes[item.entryId] || 0}/></div>
              <div className="smallCell"></div>
            </div>
          </div>);
				}
			return entry;
			})
		}
		</SortedList>;
    
		return (
      <div className="EntriesListTable">
        <div className="header">
          <div className="smallCell">ID</div>
          <div className="bigCell">Name</div>
          <div className="bigCell">Description</div>
          <div className="bigCell">Location</div>
          <div className="smallCell">Votes</div>
          <div className="smallCell"></div>
        </div>
        {sortedItems}
    </div>
  	);
	}
	
}

export default EntriesList;