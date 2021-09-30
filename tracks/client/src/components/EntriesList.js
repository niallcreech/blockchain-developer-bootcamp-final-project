import React, {Component} from "react";
import Entry from "./Entry";


class EntriesList extends Component {
	
	render(){
		//console.debug(this.props);
		const listItems = this.props.entries.map((item) => (
				<Entry key={item.entryId} entryId={item.entryId} name={item.name} desc={item.desc} votes={this.props.votes[item.entryId] || 0}/>
           )
       );
		return (
    	<div>
				<ul>{listItems}</ul>
			</div>
  	);
	}
	
}

export default EntriesList;