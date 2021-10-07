import React, {Component} from "react";
import {sendEntry} from "../helpers/ContractHelper";
import "./EntryForm.css";
 

class EntryForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			name: "",
			desc: "",
			location: ""
		}
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
	}

  async handleUpdate(){
    console.debug("EntryForm::handleUpdate");
    await this.props.handleUpdate();
  }

	handleDescriptionChange(event) {
    this.setState({desc: event.target.value});
  }
	handleNameChange(event) {
    this.setState({name: event.target.value});
  }
  handleLocationChange(event) {
    this.setState({location: event.target.value});
  }

	async handleSubmit(event){
    event.preventDefault();
    console.debug("EntryForm::handleSubmit: ("
       + this.props.trackId + ", "
       + this.state.name + ", "
       + this.state.desc + ", "
       + this.state.location + ")"
    );
    if (this.state.name.length > 0
      && this.state.desc.length > 0
      &&  this.state.location.length > 0){
        await sendEntry(
          this.props.trackId,
          this.state.name,
          this.state.desc,
          this.state.location,
          this.handleUpdate
        )
        .then((result) => {
          alert("EntryForm::handleSubmit: ("
       + result.code + ", "
       + result.message + ")");
      }
    );
    }
    
		
	}

	render(){
		return (
     <div className="EntryForm">
    	<form onSubmit={this.handleSubmit}>
        <label>
          Name
          <input type="text" value={this.state.name} onChange={this.handleNameChange} />
        </label>
				<label>
          Description
          <input type="text" value={this.state.desc} onChange={this.handleDescriptionChange} />
        </label>
				<label>
          URL
          <input type="text" value={this.state.location} onChange={this.handleLocationChange} />
        </label>
        <input className="EntryFormButton" type="submit" value="Nominate" />
      </form>
      </div>
  	);
	}
	
}

export default EntryForm;