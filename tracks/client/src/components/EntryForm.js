import React, {Component} from "react";
import {sendEntry, isValidUrl} from "../helpers/ContractHelper";
import "./EntryForm.css";
 

class EntryForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			name: "",
			desc: "",
			location: "http://"
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

	clearFields() {
		console.debug("EntryForm::clearFields");
    this.setState({
			name: "",
			desc: "",
			location: "http://",
		});
  }

	areFieldsEmpty(){
		console.debug("EntryForm::areFieldsEmpty");
		let valid = true;
		let message = "";
		let statusCode = 200;
		if (this.state.name.length === 0) {
			message = "Name field is empty";
			statusCode = 500;
			valid = false;
		} else if (this.state.desc.length === 0) {
			message = "Description field is empty";
			statusCode = 500;
			valid = false;
		} else if (this.state.location.length === 0) {
			message = "Location field is empty";
			statusCode = 500;
			valid = false;
		}
    return {
			valid: valid,
			message: message,
			statusCode: statusCode
		}
	}

	areFieldsValid(){
		console.debug("EntryForm::areFieldsValid");
		const emptyFields = this.areFieldsEmpty();
		if (!emptyFields.valid) {
			return emptyFields;
		}
		const validLocation = isValidUrl(this.state.location);
		if (!validLocation.valid) {
			return validLocation;
		}
		return {
			valid: true,
			message: "",
			statusCode: 200
		}
	}

	async handleSubmit(event){
		console.debug("EntryForm::handleSubmit: ("
       + this.props.trackId + ", "
       + this.state.name + ", "
       + this.state.desc + ", "
       + this.state.location + ")"
    );
    event.preventDefault();
		const validFields = this.areFieldsValid();
    if (validFields.valid){
        await sendEntry(
          this.props.trackId,
          this.state.name,
          this.state.desc,
          this.state.location
        )
        .then(async (result) => {
          await this.props.handleNotificationMessage(result.message, result.statusCode);
	        await this.handleUpdate();
						if (result.statusCode === 200) {
							this.clearFields();
						}
        })
     } else{
			await this.props.handleNotificationMessage(validFields.message, validFields.statusCode);
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