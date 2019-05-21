import React, { Component } from 'react';
import $ from 'jquery';
import Select from 'react-select';
import Button from '@material-ui/core/Button';

class courseSelection extends Component {
    constructor() {
        super();
        this.state =
            {
                courses: []
            };
    }
    componentDidMount = () =>
    {
        this.setState({
            courses: this.inititializeDropdown()
        });
    }
    inititializeDropdown = () =>
    {
        var dropDown = [];
        var courses = this.props.courses;
        for(var i = 0; i < courses.length; i++)
        {
            dropDown.push({label: courses[i], value: i});
        }
        return dropDown;
    }
    updateValues = (values) =>
    {
        this.props.selectedCourses(values);
    }
    render() {
        return (
            <div>
            <Select 
            isMulti={true} 
            options={this.state.courses}
            onChange={(e,v) => {this.updateValues(e)}}
/>
            </div>
        );
    }
}
export default courseSelection;