import React, { Component } from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Drawtree from './drawtree.js';
import NewField from './NewField.js';



class App extends Component {
  constructor() {
    super();
    this.state =
      {
        unit: 'COMSTK',
        condition: 'AND',
        currentID: 1,
        fieldValues: [
          {
            id: 0,
            unit: 'COMSTK',
            condition: 'AND'
          }]
      };
  }

  changevalue = (value) => {
    this.setState({
      unit: value.target.value
    });
    this.forceUpdate();
  }
  updateValues = (unit, condition, id) => {
    //fix this shit
    var newArray = [];
    for(var i = 0; i < this.state.fieldValues.length; i++)
    {
      if(i == id)
      {
        newArray.push({
          id: id,
          unit: unit,
          condition: condition
        });
      }
      else
      {
        newArray.push(this.state.fieldValues[i]);
      }
    }
    this.setState({
      fieldValues: [],
      unit: unit,
      condition: condition
    }, () => { this.setState({ fieldValues: newArray }); });
    this.forceUpdate();
    console.log(this.state.fieldValues);

  }
  addField = () => {
    this.state.fieldValues.push(
      {
        id: this.state.fieldValues.length,
        unit: 'COMSTK',
        condition: 'AND'
      }
    );
    this.setState({ currentID: this.state.currentID + 1 });
    this.forceUpdate();
  }
  removeField = (id) => {
    console.log(id);
    var updatedArray = [];
    for (var i = 0; i < this.state.fieldValues.length; i++) {
      if (this.state.fieldValues[i].id != id) {
        updatedArray.push(
          this.state.fieldValues[i]
        );
      }
    }
    this.setState({
      fieldValues: []
    }, () => { this.setState({ fieldValues: updatedArray }); });

  }

  render() {

    let field = [];
    for (var i = 0; i < this.state.fieldValues.length; i++) {
      field.push(<NewField
        id={i}
        data={this.updateValues}
        add={this.addField}
        delete={this.removeField}
        unit={this.state.fieldValues[i].unit}
        condition={this.state.fieldValues[i].condition}
      />);
    }
    return (
      <div className="App">
        <Drawtree
          unit={this.state.unit}
          condition={this.state.condition}
        />
        <div>
          <p>Tiedekunnat</p>
          <div style={{ height: '200px', overflowY: 'scroll' }}>
            {field}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
