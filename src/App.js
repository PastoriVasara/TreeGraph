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

  logUndoState = () => {

    return {
      units: this.state.specificUnits,
      courses: this.state.specificCourses,
      language: this.state.language,
    }
  }

  rollBackState = (restoreValues) => {
    console.log(restoreValues);
    this.setState({
      specificUnits: restoreValues.units,
      specificCourses: restoreValues.courses,
      language: restoreValues.language,
    }, () => this.forceUpdate());
    console.log(this.state.specificCourses);
    
  }

  addToPastStates = () => {
    this.setState({
      pastStates: this.state.pastStates.concat([this.logUndoState()]),
      futureStates: []
    });
  }
  undo = () => {
    if (this.state.pastStates.length > 0) {
      const currentState = this.state.pastStates.pop();
      const previousState = this.state.pastStates;
      console.log();
      const futureState = this.state.futureStates.concat([this.logUndoState()]);
      this.rollBackState(currentState);
      this.setState({
        pastStates: previousState,
        futureStates: futureState,
        CourseSelectionUndo: currentState.courses
      });
      this.forceUpdate();
      console.log(this.state.specificCourses);
    }
  }
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

  compileFields = () => {
    var fieldCombiner = [];
    var unitField = $.extend(true, {}, this.state.specificUnits);
    var courseField = $.extend(true, {}, this.state.specificCourses);
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



  updateValues = (unit, id) => {
    console.log(this.state.specificUnits);

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
  addField = () => {
    this.addToPastStates();

    this.setState({
      specificUnits: this.state.specificUnits.concat([{ id: this.state.incrementingID, unit: 'COMSTK' }]),
      incrementingID: this.state.incrementingID + 1
    })
  }
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
  updateSelectedCourses = (value) => {
    this.addToPastStates();
    console.log(this.state.specificCourses);
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
  addToCourses = (value) => {
    console.log(this.state.specificCourses);
    var canBeAdded = true;
    var specificCoursesToAdd = [...this.state.specificCourses];
    for (var i = 0; i < specificCoursesToAdd.length; i++) {
      if (specificCoursesToAdd[i].code === value) {
        canBeAdded = false;
      }
    }
    
    if (canBeAdded) {
      console.log(value);
      console.log(this.state.specificCourses);
      console.log(specificCoursesToAdd);
      this.addToPastStates();
      var allCourses = this.state.initializedCourses;
      var postToCourseSelection = [];
      for (var i = 0; i < allCourses[2].length; i++) {
        if (allCourses[2][i] === value) {
          postToCourseSelection.push(i);
          specificCoursesToAdd.push({
            name: allCourses[0][i],
            code: allCourses[1][i],
            id: allCourses[2][i]
          });

        }
      }
      console.log(specificCoursesToAdd.length);
      this.setState({
        feedBackArray: postToCourseSelection,
        specificCourses: specificCoursesToAdd
      })
    }
  }
  ClearFeedBack = () => {
    console.log("speedtest?");
    this.setState({
      feedBackArray: []
    });
    this.compileFields();
    
  }

  render() {
    let field = [];
    console.log(this.state.specificUnits);
    if (this.state.specificUnits.length > 0) {
      for (var i = 0; i < this.state.specificUnits.length; i++) {
        console.log("rebuild");
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
