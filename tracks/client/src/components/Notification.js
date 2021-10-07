import React, {Component} from "react";
import "./Notification.css"


class Notification extends Component {
  
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  

  handleClick(){
    console.debug("Notification::handleClick");
    this.props.handleClick();
  }

  render(){
    console.debug(`Notification::render: (${this.props.statusCode})`);
    let className;
    if (!this.props.statusCode) {
      className = "Notification"
    }else if (this.props.statusCode === 200){
      className = "NotificationInfo";
    } else {
      className = "NotificationWarning";
    }
    let message;
    if (this.props.message){
      message = `${this.props.countdown||""} ${this.props.message}`;
    } else {
     message = <br/>;
    }
    return (
      <div className={className} onClick={this.handleClick}>
      {message}
      </div>
    );
  }
}

export default Notification;