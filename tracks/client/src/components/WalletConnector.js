import React, {Component} from "react";
import {getWeb3State} from "../helpers/ContractHelper";
 

class WalletConnector extends Component {
	constructor(props){
		super(props);
		this.state = {
		}
		this.handleUpdate = this.handleUpdate.bind(this);
	}

  async handleUpdate(){
    console.debug("Connector::handleUpdate");
    const {accounts, contract, web3, statusCode, message, connected} = getWeb3State();
    await this.props.handleUpdate();
  }

	render(){
		return (
     <div className="ConnectorContainer">
     	<div className="Connector">
        <button onClick={this.handleUpdate}>Click Me</button>
    	</div>
    </div>
  	);
	}
	
}

export default WalletConnector;