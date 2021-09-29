import React, {Component} from "react";
import EntriesList from "./EntriesList";
import EntrySubmission from "./EntrySubmission";
import EntryForm from "./EntryForm";
import { withRouter } from 'react-router-dom';


class TrackView extends Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
    	<div>
				<EntriesList trackId={this.props.match.params.trackId}/>
				<EntryForm />
			</div>
  	);
	}
}

export default withRouter(TrackView);
