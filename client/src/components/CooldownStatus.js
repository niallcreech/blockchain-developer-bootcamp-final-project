import React, {Component} from "react";
import "./CooldownStatus.css"
import {getCooldownStatus} from "../helpers/ContractHelper";


class CooldownStatus extends Component {
  
  constructor(props){
    super(props);
		this.state = {
			inTrackCreationCooldown: false,
			inEntryCreationCooldown: false,
			inVotingCooldown: false,
		}
  }
  
	async componentDidMount(){
		const {inTrackCreationCooldown, inEntryCreationCooldown} = await getCooldownStatus();
		console.debug(`CooldownStatus::componentDidMount: inTrackCreationCooldown: ${inTrackCreationCooldown} inEntryCreationCooldown: ${inEntryCreationCooldown}`);
		this.setState({
			inTrackCreationCooldown: inTrackCreationCooldown,
			inEntryCreationCooldown: inEntryCreationCooldown
		});
	}
	
  render(){
		let className;
    if (!this.props.visible) {
      className = "CooldownVisible"
    } else {
      className = "CooldownHidden";
    }
		let message;
		if (this.state.inTrackCreationCooldown && this.state.inEntryCreationCooldown){
			message = "User is in track and entry creation cooldown!";
			className = "CooldownAlert"
		} else if (this.state.inTrackCreationCooldown){
			message = "User is in track creation cooldown!";
			className = "CooldownAlert"
		} else if (this.state.inEntryCreationCooldown){
			message = "User is in entry creation cooldown!";
			className = "CooldownAlert"
		}
    return (
	<div className="CooldownStatusContainer">
      <div className={className}>
				{message}
      </div>
      </div>
    );
  }
}

export default CooldownStatus;