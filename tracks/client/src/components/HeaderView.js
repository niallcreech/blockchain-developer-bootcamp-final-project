import React, {Component} from "react";
import "./HeaderView.css";
import { withRouter } from 'react-router-dom';


class HeaderView extends Component {

  constructor(props){
    super(props);
  }
  
  
	render(){
    const backView = (
        <div>
          <div className="HeaderViewReturn"></div>
      </div>
      )
    const headerView = (
      <div>
      {backView}
        <div className="HeaderViewName">
          <div className="HeaderViewName">{this.props.name }</div>
        </div>
        <div className="HeaderViewDesc">
          <div className="HeaderViewDesc">{this.props.text }</div>
        </div>
      </div>
    );
    
		return (
      <div className="HeaderView">
        {headerView}
      </div>
  	);
	}
	
}

export default withRouter(HeaderView);
