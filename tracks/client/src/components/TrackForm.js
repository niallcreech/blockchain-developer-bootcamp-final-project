import React, {Component} from "react";
import {sendTrack} from "../helpers/ContractHelper";


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

  handleSubmit(event){
    console.debug("TrackForm::handleSubmit: ("
       + this.state.name + ", "
       + this.state.desc +  ")"
    )
    if (this.state.name.length > 0
      && this.state.desc.length > 0){
        sendTrack(
          this.state.name,
          this.state.desc,
          this.handleUpdate
        );
    }
    event.preventDefault();
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
    	<form className="TrackForm" onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.name} onChange={this.handleNameChange} />
        </label>
				<label>
          Description:
          <input type="text" value={this.state.desc} onChange={this.handleDescriptionChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
  	);
	}
	
}

export default TrackForm;