import React, {Component} from 'react';
import {ListGroupItem, Button} from 'reactstrap';

class TaskItem extends Component {
  constructor(props){
    super();

    // component state
    this.state = {
    	isHovering: false,
    };
    // bound functions
    this.completeCheck = this.completeCheck.bind(this);
    this.handleMouseHover = this.handleMouseHover.bind(this);
  }

  handleMouseHover() {
  	this.setState(this.toggleHoverState);
  }

  toggleHoverState(state) {
  	return {
  		isHovering: !state.isHovering,
  	};
  }
  completeCheck(event) {
    event.preventDefault();
    this.props.completeCheck(this.props.item);
  };
  render(){
    return (
      <div>
	      <ListGroupItem className="taskItem">
  	      <Button className="taskCompleteBtn" color="info" size="sm" onClick={this.completeCheck}> 
  		    </Button>
  		    {'\u00A0 \u00A0'}
  	      {this.props.item.text}
	      </ListGroupItem>
	  </div>
    );
  }
}

export default TaskItem;