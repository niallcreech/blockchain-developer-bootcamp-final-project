import React, {Component} from "react";
import {sendTrack} from "../helpers/ContractHelper";
import "./TrackForm.css";

class TrackForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			name: "",
			desc: "",
		}
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
	}

  async handleSubmit(event){
    event.preventDefault();
    console.debug("TrackForm::handleSubmit: ("
       + this.state.name + ", "
       + this.state.desc +  ")"
    )
    if (this.state.name.length > 0
      && this.state.desc.length > 0){
        await sendTrack(
          this.state.name,
          this.state.desc,
          this.handleUpdate
        ).then((result) => {
          this.props.handleNotificationMessage(result.message, result.statusCode);
        });
        
    }
  }

  async handleUpdate(){
    await this.props.handleUpdate()
  }

	handleDescriptionChange(event) {
    this.setState({desc: event.target.value});
  }
	handleNameChange(event) {
    this.setState({name: event.target.value});
  }

	render(){
		return (
    <div className="TrackForm" >
    	<form onSubmit={this.handleSubmit}>
        <label>
          Name
          <input type="text" value={this.state.name} onChange={this.handleNameChange} />
        </label>
				<label>
          Description
          <input type="text" value={this.state.desc} onChange={this.handleDescriptionChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      </div>
  	);
	}
	
}

export default TrackForm;