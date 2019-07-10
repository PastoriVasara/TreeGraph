import React, { Component } from 'react';
import Select from 'react-select';

class courseSelection extends Component {
    constructor() {
        super();
        this.state =
            {
                courses: [],
                value: []
            };
    }

    componentDidMount = () => {
        this.setState({
            courses: this.inititializeDropdown(),
            value: []
        });
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.updatedCourse != this.props.updatedCourse) {
            //updatedCourse
            var noUndefineds = true;
            for (var i = 0; i < this.props.updatedCourse.length; i++) {
                if (this.props.updatedCourse[i].value == undefined) {
                    noUndefineds = false;
                }

            }
            if (noUndefineds) {
                this.clickUpdate(this.props.updatedCourse);
            }
        }
    }
    inititializeDropdown = () => {
        var dropDown = [];
        var courses = this.props.courses;
        for (var i = 0; i < courses.length; i++) {
            dropDown.push({ label: courses[i], value: i });
        }
        return dropDown;
    }
    checkValue = (newValue) => {
        var dropDown = this.state.value;
        dropDown.push({ label: newValue.value, value: newValue.value });
        this.setState({
            value: dropDown
        });
    }
    clickUpdate = (values) => {
        var dropDown = this.state.value;
        for (var i = 0; i < values.length; i++) {
            var canBeAdded = true;
            for (var j = 0; j < this.state.value.length; j++) {
                if (this.state.value[j].value == values[i].value) {
                    canBeAdded = false;
                }
            }
            if (canBeAdded) {
                dropDown.push(values[i]);
            }
        }
        this.setState({
            value: dropDown
        });
        this.forceUpdate();
    }

    updateValues = (values) => {
        this.props.selectedCourses(values);
    }
    render() {
        return (
            <div>
                <Select
                    autoload={true}
                    isMulti={true}
                    options={this.state.courses}
                    value={this.state.value}
                    key={JSON.stringify(this.state.value)}
                    onChange={(e, v) => { this.updateValues(e) }}
                />
            </div>
        );
    }
}
export default courseSelection;