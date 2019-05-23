import React, { Component } from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Drawtree from './drawtree.js';
import NewField from './NewField.js';
import CourseSelection from './courseSelection.js';
import $ from 'jquery';



class App extends Component {
  constructor() {
    super();
    this.state =
      {
        initializedCourses: this.initializeCourses(), 
        courses: this.courseArray(),
        unit: 'COMSTK',
        condition: 'AND',
        specificUnits: [
          {
            id: 0,
            unit: 'COMSTK',
            condition: 'AND'
          }
        ],
        specificCourses: [],
        canvasContent: []
      };

  }

  initializeCourses = () => 
  {
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
  courseArray = () => {
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
  compileFields = () => 
  {
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

  updateValues = (unit, condition, id) => {
    for (var i = 0; i < this.state.specificUnits.length; i++) {
      if
        (this.state.specificUnits[i].id == id) {
        this.state.specificUnits[i].unit = unit;
        this.state.specificUnits[i].condition = condition;
      }
    }
    this.setState({
      unit: unit,
      condition: condition
    });
  }
  addField = () => {
    var newID = this.state.specificUnits[this.state.specificUnits.length - 1].id + 1;
    this.state.specificUnits.push(
      {
        id: newID,
        unit: 'COMSTK',
        condition: 'AND'
      }
    );
    this.forceUpdate();
  }
  removeField = (id) => {
    var updatedArray = [];
    for (var i = 0; i < this.state.specificUnits.length; i++) {
      if (this.state.specificUnits[i].id != id) {
        updatedArray.push(
          this.state.specificUnits[i]
        );
      }
    }
    this.setState({
      specificUnits: updatedArray
    });

  }
  updateSelectedCourses = (value) =>
  {
    var updatedCourses = [];
    for(var i = 0; i < value.length; i++)
    {
      updatedCourses.push(
        {
          name: this.state.initializedCourses[0][value[i].value],
          code: this.state.initializedCourses[1][value[i].value]
        });
    }
    this.setState({
      specificCourses: updatedCourses
    });
  }

  render() {
    console.log(this.state.canvasContent);
    let field = [];
    for (var i = 0; i < this.state.specificUnits.length; i++) {
      field.push(<NewField
        data={this.updateValues}
        add={this.addField}
        delete={this.removeField}
        id={this.state.specificUnits[i].id}
        unit={this.state.specificUnits[i].unit}
        condition={this.state.specificUnits[i].condition}
      />);
    }
    return (
      <div className="App">
        
        <Drawtree
        contents={this.state.canvasContent}
        />
        <div>
        <p>Kurssit</p>
          <CourseSelection
            selectedCourses={this.updateSelectedCourses}
            courses={this.state.courses} />
          <p>Tiedekunnat</p>
          <div style={{ height: '200px', overflowY: 'scroll' }}>
            {field}
          </div>
        </div>
        <Button onClick ={(e,v) => {this.compileFields()}}> Lähetä</Button>
      </div>

    );
  }
}

export default App;
