import React, { Component } from 'react';
import { Grid, Col, Row, Button, Input, ListGroup, InputGroup, InputGroupAddon} from 'reactstrap';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import LocalDB from '../../actions/data';
import TaskItem from './TaskItem';
import BGImage from '../../images/FletchrBackground.jpg';

class TaskPage extends Component  {
  constructor(){
    super();

    // component state
    this.state = {
      tasks: [],
      newTaskText: ""
    }
    // bound functions
    this.taskTextUpdate = this.taskTextUpdate.bind(this);
    this.catchEnter = this.catchEnter.bind(this);
    this.createTaskClick = this.createTaskClick.bind(this);
    this.clearTaskText = this.clearTaskText.bind(this);
    this.createTask = this.createTask.bind(this);
    this.completeCheck = this.completeCheck.bind(this);
    this.removeTask = this.removeTask.bind(this);
  }
  componentWillMount() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('service-worker.js')
          .then(function(registration) {
            //Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
          // registration failed
          console.log('ServiceWorker registration failed: ', err);
        }).catch(function(err) {
          console.log(err)
        });
      });
    } else {
      console.log('service worker is not supported');
    }
    LocalDB.init()
    .then( () => {
      LocalDB.getAll()
      .then( (TaskList) => {
        this.setState( { tasks: TaskList});
      });
    });
  };
  componentWillUnmount(){
    LocalDB.close()
  }
  taskTextUpdate(e) {
    this.setState({newTaskText: e.target.value});
  };
  catchEnter(e) {
    if(e.key === "Enter" && this.state.newTaskText != ""){
      this.createTask(this.state.newTaskText);
    }
  };
  createTaskClick(e) {
    if (this.state.newTaskText !== ""){
      this.createTask(this.state.newTaskText);
    }
  };
  clearTaskText() {
    this.setState({newTaskText: ""});
  };
  createTask(text) {
    console.log("creating new task:", text);
    LocalDB.createTask(text)
    .then((CreatedDate) => {
      console.log("task added is:", CreatedDate);
      this.setState({tasks: [...this.state.tasks, {date: CreatedDate, text: this.state.newTaskText}]});
      this.clearTaskText();
    });
  };
  completeCheck(task) {
    //console.log("checked:", e.target.checked);
    console.log("delete item:", task);
    LocalDB.deleteTask(task.date)
    .then((success) => {
      console.log("deleted");
      this.removeTask(task);
    });
  };
  removeTask(task) {
    this.setState( { tasks: this.state.tasks.filter( item => item.date !== task.date )});
  };
  render() {
    return (
    <div>
      <div class="hero-image">
      </div>
      <div class="hero-contents">
        <Row>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <Button color="info" size="sm" onClick={this.createTaskClick}>+</Button>
            </InputGroupAddon>
            <Input id="task-input" type="text" bsSize="sm" onChange={this.taskTextUpdate} onKeyUp={this.catchEnter} placeholder="New task" value={this.state.newTaskText} />
          </InputGroup>
        </Row>
        <Row>
          <ListGroup>
            {this.state.tasks.map((task,i) => {
              return <TaskItem key={i} item={task} completeCheck={this.completeCheck}></TaskItem>;
            })}
          </ListGroup>
        </Row>
      </div>
      </div>
    );
  }
}

export default TaskPage;