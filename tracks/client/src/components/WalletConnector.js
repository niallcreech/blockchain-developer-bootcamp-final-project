import React, {Component} from "react";

class WalletConnector extends Component {
  
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick(){
    console.debug("WalletConnector::handleClick");
  }

  render(){
    return (
      <div className="WalletConnector" onClick={this.handleClick}>
      </div>
    );
  }
}

export default WalletConnector;