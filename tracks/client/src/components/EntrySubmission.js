import React, {Component} from "react";

class EntrySubmission extends Component {
	constructor(props){
		super(props);
	}
	
	async componentDidMount() {
  }

	handleEntrySubmission(){
		console.info("handleEntrySubmission");
	}

	render(){
		return (
    	<div>
				<button onClick={() => this.handleEntrySubmission()}>Nominate</button>
			</div>
  	);
	}
	
}

export default EntrySubmission;