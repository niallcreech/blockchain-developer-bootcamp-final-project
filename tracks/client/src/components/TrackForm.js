import React, {Component} from "react";

class TrackForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			name: "",
			desc: "",
		}
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
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