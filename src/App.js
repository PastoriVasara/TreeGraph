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

const theme = createMuiTheme({

  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: 'rgb(250, 146, 61)',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },

    secondary: {
      light: '#0066ff',
      main: '#0044ff',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffcc00',
    },
    // error: will use the default color
  },
});

class App extends Component {

  constructor() {
    super();
    this.state =
      {
        initializedCourses: this.initializeCourses(),
        courses: this.courseArray(),
        unit: 'COMSTK',
        specificUnits: [
          {
            id: 0,
            unit: 'COMSTK'
          }
        ],
        specificCourses: [],
        canvasContent: [],
        feedBackArray: []
      };

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
      //url: "http://localhost/phpCall/call.php",
      data: data,
      success: function (data) {
        courseList = data;
      },
      dataType: 'json',
      async: false
    });
    return courseList;
  }

  courseArray = () => {
    var data =
    {
      courses: 'all'
    };
    var courseList = [];
    $.ajax({
      type: 'POST',
      url: "https://request.kallu.fi/call.php",
      //url: "http://localhost/phpCall/call.php",
      data: data,
      success: function (data) {
        var returnList = data;
        for (var i = 0; i < returnList[0].length; i++) {
          courseList.push("[" + returnList[1][i] + "] : " + returnList[0][i]);
        }

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
    this.setState({
      canvasContent: fieldCombiner
    });

  }

  updateValues = (unit, id) => {
    for (var i = 0; i < this.state.specificUnits.length; i++) {
      if
        (this.state.specificUnits[i].id === id) {
        this.state.specificUnits[i].unit = unit;
      }
    }
    this.setState({
      unit: unit,
    });
  }
  addField = () => {
    var newID = this.state.specificUnits[this.state.specificUnits.length - 1].id + 1;
    this.state.specificUnits.push(
      {
        id: newID,
        unit: 'COMSTK'
      }
    );
    this.forceUpdate();
  }
  removeField = (id) => {
    var updatedArray = [];
    for (var i = 0; i < this.state.specificUnits.length; i++) {
      if (this.state.specificUnits[i].id !== id) {
        updatedArray.push(
          this.state.specificUnits[i]
        );
      }
    }
    this.setState({
      specificUnits: updatedArray
    });

  }
  updateSelectedCourses = (value) => {
    var stack = [];
    for (var i = 0; i < value.length; i++) {
      stack.push({
        label: value[i].label,
        value: value[i].value
      });
    }
    var updatedCourses = this.state.specificCourses;
    for (i = 0; i < value.length; i++) {
      updatedCourses.push(
        {
          name: this.state.initializedCourses[0][value[i].value],
          code: this.state.initializedCourses[1][value[i].value],
          id: this.state.initializedCourses[2][value[i].value]
        });
    }
    this.setState({
      specificCourses: updatedCourses,
      feedBackArray: stack
    });
  }
  addToCourses = (value) => {
    var updatedCourses = this.state.specificCourses;
    var addedCourse = [];
    for (var i = 0; i < this.state.initializedCourses[2].length; i++) {
      if (this.state.initializedCourses[2][i] === value) {
        var newCourse = {
          name: this.state.initializedCourses[0][i],
          code: this.state.initializedCourses[1][i],
          id: this.state.initializedCourses[2][i]
        };
        var duplicate = false;
        for (var j = 0; j < updatedCourses.length; j++) {
          if (updatedCourses[j].id === newCourse.id) {
            duplicate = true;
          }
        }
        if (!duplicate) {
          addedCourse.push({ label: "[" + newCourse.code + "] : " + newCourse.name, value: i });
          duplicate = false;
        }

      }
    }
    this.updateSelectedCourses(addedCourse);
    this.compileFields();
  }

  render() {
    let field = [];
    for (var i = 0; i < this.state.specificUnits.length; i++) {
      field.push(<NewField
        key={this.state.specificUnits[i].id}
        data={this.updateValues}
        add={this.addField}
        delete={this.removeField}
        id={this.state.specificUnits[i].id}
        unit={this.state.specificUnits[i].unit}
      />);
    }
    return (
      <MuiThemeProvider theme={theme}>
      <div className="App">
        <div className={styles.optionSection}>
          <div className={styles.treeRight}>
            {/* Drawing the Tree */}
            <Drawtree
              courseAdd={this.addToCourses}
              contents={this.state.canvasContent}
            />
          </div>
          <div className={styles.treeLeft}>
            <div className={styles.siteHeader}>Kurssipuu</div>         
            <div className={styles.sectionLeft}>
              <p>Tiedekunnat</p>
              <div style={{ height: '200px', overflowY: 'scroll' }}>
                {field}
              </div>
            </div >
            <div className={styles.rightBack}>
            <div className={styles.sectionRight}>
              <p>Kurssit</p>
              {/* Available courses */}
              <Paper>
                <CourseSelection
                  updatedCourse={this.state.feedBackArray}
                  selectedCourses={this.updateSelectedCourses}
                  courses={this.state.courses} />
              </Paper>
            </div>
            <div style={{ margin: '20px' }}>
              <Button variant="contained" color="primary" onClick={(e, v) => { this.compileFields() }}> Lähetä</Button>
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
