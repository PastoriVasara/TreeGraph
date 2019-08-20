import React, { Component } from 'react';
import styles from './App.css';
import './treeStyle.css';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Drawtree from './drawtree.js';
import NewField from './NewField.js';
import CourseSelection from './courseSelection.js';
import $ from 'jquery';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Finnish from './lang/fi.json';
import English from './lang/eng.json';

const theme = createMuiTheme({

  palette: {
    primary: {
      main: 'rgb(250, 146, 61)',
    }
  },
});

class App extends Component {

  constructor() {
    super();
    this.state =
      {
        initializedCourses: this.initializeCourses(),
        specificUnits: [],
        specificCourses: [],
        canvasContent: [],
        feedBackArray: [],
        isCanvasDrawn: false,
        language: English,
        pastStates: [],
        futureStates: [],
        incrementingID: 0,
        CourseSelectionUndo: ''
      };

  }
  //helper function for storing an undo operation
  logUndoState = () => {
    return {
      units: this.state.specificUnits,
      courses: this.state.specificCourses,
      language: this.state.language,
    }
  }
  //helper function for undoing and redoing
  rollBackState = (restoreValues) => {
    this.setState({
      specificUnits: restoreValues.units,
      specificCourses: restoreValues.courses,
      language: restoreValues.language,
    }, () => this.forceUpdate());
  }

  addToPastStates = () => {
    this.setState({
      pastStates: this.state.pastStates.concat([this.logUndoState()]),
      futureStates: []
    });
  }

  //undo an action
  undo = () => {
    if (this.state.pastStates.length > 0) {
      const currentState = this.state.pastStates.pop();
      const previousState = this.state.pastStates;
      const futureState = this.state.futureStates.concat([this.logUndoState()]);
      this.rollBackState(currentState);
      this.setState({
        pastStates: previousState,
        futureStates: futureState,
        CourseSelectionUndo: currentState.courses
      });
      this.forceUpdate();
    }
  }

  //redo an action
  redo = () => {
    if (this.state.futureStates.length > 0) {
      const previousState = this.state.pastStates.concat([this.logUndoState()]);
      const currentState = this.state.futureStates.pop();
      const futureState = this.state.futureStates;
      this.rollBackState(currentState);
      this.setState({
        pastStates: previousState,
        futureStates: futureState,
        CourseSelectionUndo: currentState.courses
      });
      this.forceUpdate();
    }
  }

  initializeCourses = () => {
    var data =
    {
      courses: 'all'
    };
    var courseList = [];
    //connect to the SQL server for getting all courses to select from
    $.ajax({
      type: 'POST',
      url: "https://request.kallu.fi/call.php",
      data: data,
      success: function (data) {
        courseList = data;
      },
      dataType: 'json',
      async: false
    });
    return courseList;
  }

  //combine course field and unit field for sending to the component which draws the tree
  compileFields = () => {
    var fieldCombiner = [];
    var unitField = { ...this.state.specificUnits };
    var courseField = { ...this.state.specificCourses };
    fieldCombiner =
      {
        units: unitField,
        courses: courseField
      };

    if (Object.keys(courseField).length !== 0 || Object.keys(unitField).length !== 0) {

      this.setState({
        canvasContent: fieldCombiner,
        isCanvasDrawn: true
      });
    }
  }


  //update values of the courses
  updateValues = (unit, id) => {

    this.addToPastStates();
    var updatedArray = [];

    for (var i = 0; i < this.state.specificUnits.length; i++) {
      if
        (this.state.specificUnits[i].id === id) {
        updatedArray.push({
          id: id,
          unit: unit
        });
      }
      else {
        updatedArray.push({
          id: this.state.specificUnits[i].id,
          unit: this.state.specificUnits[i].unit
        });
      }
    }
    this.setState({
      specificUnits: updatedArray
    });
  }
  //add a new unit field
  addField = () => {
    this.addToPastStates();

    this.setState({
      specificUnits: this.state.specificUnits.concat([{ id: this.state.incrementingID, unit: 'COMSTK' }]),
      incrementingID: this.state.incrementingID + 1
    })
  }

  //remove selected unit field
  removeField = (id) => {
    this.addToPastStates();
    var updatedArray = [];
    for (var i = 0; i < this.state.specificUnits.length; i++) {
      if (this.state.specificUnits[i].id !== id) {
        updatedArray.push(
          this.state.specificUnits[i]
        );
      }
    }
    this.setState({
      specificUnits: updatedArray,
    });

  }
  //if the value of selected course/unit is change update it for drawing
  updateSelectedCourses = (value) => {
    this.addToPastStates();
    var updatedCourses = [];
    var graphTreeChecker = this.state.feedBackArray;
    for (var i = 0; i < value.length; i++) {
      for (var j = 0; j < graphTreeChecker.length; j++) {
        if (graphTreeChecker[j] === i) {
          graphTreeChecker = graphTreeChecker.splice(j, 1);
          j--;
        }
      }
      updatedCourses.push(
        {
          name: this.state.initializedCourses[0][value[i].value],
          code: this.state.initializedCourses[1][value[i].value],
          id: this.state.initializedCourses[2][value[i].value]
        });
    }
    this.setState({
      specificCourses: updatedCourses,
      feedBackArray: graphTreeChecker
    })
  }

  //add selected courses the the selected course state for drawing
  addToCourses = (value) => {
    var canBeAdded = true;

    //spread operator for fixing immutability issues
    var specificCoursesToAdd = [...this.state.specificCourses];
    for (var i = 0; i < specificCoursesToAdd.length; i++) {
      if (specificCoursesToAdd[i].code === value) {
        canBeAdded = false;
      }
    }

    if (canBeAdded) {
      this.addToPastStates();
      var allCourses = this.state.initializedCourses;
      var postToCourseSelection = [];
      for (i = 0; i < allCourses[2].length; i++) {
        if (allCourses[2][i] === value) {
          postToCourseSelection.push(i);
          specificCoursesToAdd.push({
            name: allCourses[0][i],
            code: allCourses[1][i],
            id: allCourses[2][i]
          });

        }
      }
      this.setState({
        feedBackArray: postToCourseSelection,
        specificCourses: specificCoursesToAdd
      })
    }
  }
  ClearFeedBack = () => {
    this.setState({
      feedBackArray: []
    });
    this.compileFields();

  }

  render() {
    let field = [];

    if (this.state.specificUnits.length > 0) {
      for (var i = 0; i < this.state.specificUnits.length; i++) {
        field.push(
          <NewField
            key={this.state.specificUnits[i].id}
            data={this.updateValues}
            add={this.addField}
            delete={this.removeField}
            id={this.state.specificUnits[i].id}
            unit={this.state.specificUnits[i].unit}
          />);
      }
    }
    else {
      field.push(
        <Fab
          key="0"
          size="small"
          color="primary"
          onClick={(e, v) => { this.addField() }}>
          <AddIcon />
        </Fab>
      );
    }
    return (
      <MuiThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Button
              variant="contained"
              color="secondary"
              style={{ left: '92%', margin: '0px 0px 0px 0px' }}
              onClick={(e, v) => { this.addToPastStates(); this.setState({ language: Finnish }) }}>
              FI
        </Button>
            <Button
              variant="contained"
              color="secondary"
              style={{ left: '92%', margin: '0px 10px 0px 10px' }}
              onClick={(e, v) => { this.addToPastStates(); this.setState({ language: English }) }}>
              ENG
        </Button>
          </Toolbar>
        </AppBar>
        <div className="App">
          <div className={styles.optionSection}>
            <div className={styles.treeRight}>
              {/* Drawing the Tree */}
              <Drawtree
                courseAdd={this.addToCourses}
                contents={this.state.canvasContent}
                drawn={this.state.isCanvasDrawn}
                language={this.state.language}
              />
            </div>
            <div className={styles.treeLeft}>
              <div className={styles.siteHeader}>{this.state.language.site_header}</div>
              <div className={styles.sectionLeft}>
                <p>{this.state.language.unit_header}</p>
                <div style={{ height: '200px', overflowY: 'scroll' }}>
                  {field}
                </div>
              </div >
              <div className={styles.rightBack}>
                <div className={styles.sectionRight}>
                  <p>{this.state.language.course_header}</p>
                  {/* Available courses */}
                  <Paper>
                    <CourseSelection
                      undo={this.state.CourseSelectionUndo}
                      emptyField={this.ClearFeedBack}
                      updatedCourse={this.state.feedBackArray}
                      selectedCourses={this.updateSelectedCourses}
                      courses={this.state.initializedCourses} />
                  </Paper>
                </div>
                <div style={{ margin: '20px' }}>
                  <Button
                    disabled={this.state.pastStates.length === 0}
                    color="secondary"
                    style={{ margin: '0px 20px 0px 20px' }}
                    onClick={(e, v) => { this.undo() }}>
                    {this.state.language.button_undo}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ margin: '0px 20px 0px 20px' }}
                    onClick={(e, v) => { this.compileFields() }}>
                    {this.state.language.button_send}
                  </Button>
                  <Button
                    disabled={this.state.futureStates.length === 0}
                    color="secondary"
                    style={{ margin: '0px 20px 0px 20px' }}
                    onClick={(e, v) => { this.redo() }}>
                    {this.state.language.button_redo}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div >

      </MuiThemeProvider>

    );
  }
}

export default App;
