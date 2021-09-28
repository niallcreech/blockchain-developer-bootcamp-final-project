import React, {Component} from "react";

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

	render(){
		return (
    	<form className="EntryForm" onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.name} onChange={this.handleNameChange} />
        </label>
				<label>
          Description:
          <input type="text" value={this.state.desc} onChange={this.handleDescriptionChange} />
        </label>
				<label>
          Location:
          <input type="text" value={this.state.location} onChange={this.handleLocationChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
  	);
	}
	
}

export default EntryForm;