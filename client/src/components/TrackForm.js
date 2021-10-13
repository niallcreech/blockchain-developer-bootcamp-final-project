import React, {Component} from "react";
import {sendTrack} from "../helpers/ContractHelper";
import "./TrackForm.css";

class TrackForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			name: "",
			desc: "",
      inProgress: false
		}
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
		}
    return {
			valid: valid,
			message: message,
			statusCode: statusCode
		}
	}

	clearFields() {
		console.debug("EntryForm::clearFields");
    this.setState({
			name: "",
			desc: "",
		});
  }

	areFieldsValid(){
		console.debug("EntryForm::areFieldsValid");
		const emptyFields = this.areFieldsEmpty();
		if (!emptyFields.valid) {
			return emptyFields;
		}
		return {
			valid: true,
			message: "",
			statusCode: 200
		}
	}


  async handleSubmit(event){
    event.preventDefault();
    console.debug("TrackForm::handleSubmit: ("
       + this.state.name + ", "
       + this.state.desc +  ")"
    )
		const validFields = this.areFieldsValid();
    if (validFields.valid){
        this.setState({inProgress: true});
        await sendTrack(
          this.state.name,
          this.state.desc
        ).then(async (result) => {
          await this.props.handleNotificationMessage(result.message, result.statusCode);
					await this.handleUpdate();
					if (result.statusCode === 200) {
						this.clearFields();
					}
          this.setState({inProgress: false});
        })
        .catch((err) => {
          console.debug(err);
          this.setState({inProgress: false});
        })
     } else{
				await this.props.handleNotificationMessage(validFields.message, validFields.statusCode);
		}
  }

  async handleUpdate(){
		console.debug("TrackForm::handleUpdate");
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
          <input disabled={this.state.inProgress} type="text" value={this.state.name} onChange={this.handleNameChange} />
        </label>
				<label>
          Description
          <input disabled={this.state.inProgress} type="text" value={this.state.desc} onChange={this.handleDescriptionChange} />
        </label>
        <input 
          className={this.state.inProgress ? "TrackFormButtonDisabled":"TrackFormButton"}
          disabled={this.state.inProgress}
          type="submit"
          value={this.state.inProgress ? "In Progress":"Submit"} />
      </form>
      </div>
  	);
	}
	
}

export default TrackForm;