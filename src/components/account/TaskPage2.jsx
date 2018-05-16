import React from 'react';
import { Button, Label, Form, FormGroup, Input} from 'reactstrap';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';

var IndexedDBHelper = function(){
  // IndexedDB setup
  var db=null;
  const dbName = "Main";
  var lastIndex=0;

  var open = function(){
    console.log("IndexedDBHelper.open called!")
    // version 2 forces onpugradeneeded to run (stopped working for some reason)
    var version = 2;

    var promise = new Promise(function(resolve,reject){
      // Opening the DB
      var requestODB = window.indexedDB.open(dbName, version);
      console.log("open Promise created!");
      console.log(requestODB);

      //Called if database is modified or needs a new version
      requestODB.onupgradeneeded = function(e) {
        db = e.target.result;
        console.log("db assigned value e.target.result");
        // Creating a new DB store with auto-incremented key
        var objectStore = db.createObjectStore("tasks", {keyPath: "id", autoIncrement : true});

        objectStore.createIndex("goal", "goal", { unique: false});

        objectStore.transaction.oncomplete = function(e) {
          console.log("onupgradeneeded transaction complete");
        };
      };

      requestODB.onsuccess = function(e) {
        db = e.target.result;
        resolve();
      };

      requestODB.onerror = function(event) {
        reject("Couldn't open the database");
      };
    });
    return promise;
  };

  var addTask = function(taskText) {
    console.log("IndexedDBHelper.addTask called!")
    // Creating transaction and store for readwrite operations
    var taskStore = db.transactions(["tasks"], "readwrite").objectStore("tasks");
    lastIndex++;

    // Promise wrapped logic
    var promise = new Promise(function(resolve, reject){
      var taskRequest = taskStore.put({
        "id": lastIndex,
        "text": taskText
      });

      //Success callback
      taskRequest.onsuccess = function(e){
        resolve();
      };

      //Error callback
      taskRequest.onerror = function(e) {
        console.log(e.value);
        reject("Couldn't add the passed item to the database");
      };
    });
    return promise;
  };

  var getAllTasks = function() {
    console.log("IndexedDBHelper.getAllTasks called!")
    var taskList = [];

    // Transaction object for read/write and associated objectStore
    var taskStore = db.transaction(["tasks"], "readwrite").objectStore("tasks");

    // Promise wrapped logic
    var promise = new Promise(function(resolve, reject){
      // Open cursor to fetch items from lower bound in the DB
      var keyRange = IDBKeyRange.lowerBound(0);
      var cursorRequest = taskStore.openCursor(keyRange);

      // Success callback
      cursorRequest.onsuccess = function(e){
        var result = e.target.result;

        // Resolving the promise with tasks items when the result id is empty
        if(result === null || result === undefined){
          resolve(taskList);
        }
        // Push result to tasks list
        else{
          taskList.push(result.value);
          if(result.value.id > lastIndex){
            lastIndex=result.value.id;
          }
          result.continue();
        }
      };

      //Error callback
      cursorRequest.onerror = function(e){
        reject("Couldn't fetch items from the database");
      };
    });
    return promise;
  };

  var deleteTask = function(id) {
    console.log("IndexedDBHelper.deleteTask called!")
    var promise = new Promise(function(resolve, reject){
      var taskStore = db.transaction(["tasks"], "readwrite").objectStore("tasks");
      var taskRequest = store.delete(id);

      taskRequest.onsuccess = function(e) {
        resolve();
      };

      request.onerror = function(e) {
        console.log(e);
        reject("Couldn't delete the item");
      };
    });
  };

  return {
    open: open,
    addTask: addTask,
    getAllTasks: getAllTasks,
    deleteTask: deleteTask
  };

}();

// UI/UX
var uiActions = function(IndexedDBHelper){
  function init() {
    console.log("uiActions init called!")
    IndexedDBHelper.open()
      .then(function(){
      refreshList();
    }, function(err){
      alert(err);
    });
  }

  var addTask = function() {
    console.log("uiActions.addTask called!")
    var task = document.getElementByID('taskText');

    IndexedDBHelper.addTask(task.value)
      .then(function(){
      refreshList();
    }, function(err){
      alert(err);
    });
    task.value = '';
    return false;
  };

  var refreshList = function(){
    console.log("uiActions.refreshList called!")
    var taskText = IndexedDBHelper.getAllTasks()
      .then(function(tasks){
      return tasks[0]["goal"];
    }, function(err){
      alert(err);
    });
    console.log(taskText);
    return taskText;
  };

  var deleteTask = function(id){
    console.log("uiActions.deleteTask called!")
    IndexedDBHelper.deleteTask(id)
      .then(function(){
      refreshList();
    }, function(err){
      alert(err);
    });
  };

  init();

  return{
    addTask: addTask,
    refreshList: refreshList,
    deleteTask: deleteTask
  };

  // function refreshTaskList(tasks) {
  //    return tasks;
  // };

}(IndexedDBHelper);

export default class TaskPage extends React.Component {
  constructor(props) {
    super(props);

    // bound functions
    this.handleTaskForm = this.handleTaskForm.bind(this);


    // component state
    this.state = {
      viewForm: false
    };
  }

  handleTaskForm(e) {
    e.preventDefault();
    this.setState({
      viewForm: !this.state.viewForm 
    });
  }

  render() {
    return (
      <div className="row justify-content-center">
        <div className="col-10 col-sm-7 col-md-5 col-lg-4">
          <Button color="info" size="sm" onClick={this.handleTaskForm}>Add Task</Button>
          <Button color="info" size="sm">Goals</Button>
          < TaskList taskText = {uiActions.refreshList()}/>
          { this.state.viewForm && < TaskForm />}
        </div>
      </div>
    );
  }
}

// Display of All Tasks in Database
class TaskList extends React.Component {
  constructor(props) {
    super(props)

    //bound functions

    //component state
    this.state = {
      taskList: ["1", "2"]
    };
  }

  render() {
    // var taskText = this.props.taskText;
    console.log({taskText})
    return(
      <div>
        <table>
          <thead>
            <tr>
              <td className="task-text">cat 1</td>
              <td className="task-text-2">cat 2</td>
            </tr>
          </thead>
          <tbody>
            { this.state.taskList.map(task => <tr>{task}</tr>) }
            {/* taskText.map(task => <tr>{task}</tr>) */}
            {/* taskText.map(task => <tr>{task}</tr>) */}
          </tbody>
        </table>
      </div>
    )
  }
}

class TaskForm extends React.Component {
  constructor(props) {
    super(props)

    //bound functions
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleValidSubmit = this.handleValidSubmit.bind(this);
    this.handleInvalidSubmit = this.handleInvalidSubmit.bind(this);

    // component state
    // this.state = {taskText: false};
    this.state = {
      taskList: []
    };
  };

  componentWillMount(){
    // Fill state with IndexedDB task data
  };

  // catch enter clicks when the task form is open
  handleKeyPress(target) {
    if (target.charCode === 13 && !this.state.viewForm) {
      target.preventDefault();
      this.handleValidSubmit;
    }
  };

  handleValidSubmit(e, values) {
  };

  handleInvalidSubmit(e, errors, values) {
  };

  render(){
    return(
      <div>
        <AvForm onValidSubmit={this.handleValidSubmit} onInvalidSubmit={this.handleInvalidSubmit}>
          <AvField name="task" bsSize="sm" required/>
          <Button onClick={uiActions.refreshList}>Add Task</Button>
        </AvForm>
      </div>
    );
  };
};
