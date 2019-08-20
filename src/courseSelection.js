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

    //on mounting initialize all the selectable courses
    componentDidMount = () => {
        this.setState({
            courses: this.inititializeDropdown(),
            value: []
        });
    }

    //when component updates e.g course is clicked from tree, add it to the dropdown
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.updatedCourse !== this.props.updatedCourse && this.props.updatedCourse.length > 0) { 
            //updatedCourse
            var noUndefineds = true;
            for (var i = 0; i < this.props.updatedCourse.length; i++) {
                if (this.props.updatedCourse[i] === undefined) {
                    noUndefineds = false;
                }
            }
            if (noUndefineds) {         
                this.clickUpdate(this.props.updatedCourse);
            }
        }
        if(prevProps.undo !== this.props.undo)
        {
            
            this.restoreCourses();
        }
    }
    //undo functionality via the main component through undo property
    restoreCourses = () => 
    {
        var newState = [];
        for(var i = 0; i < this.props.undo.length; i++)
        {
            for(var j = 0; j < this.state.courses.length; j++)
            {
                if(this.state.courses[j].courseID === this.props.undo[i].id)
                {
                    newState.push(this.state.courses[j]);
                }
            }
        }
        console.log(newState);
        this.setState({
            value: newState
        });
    }
    //initialization of the dropdown course selection
    inititializeDropdown = () => {
        var dropDown = [];
        var courses = this.props.courses;
        for (var i = 0; i < courses[0].length; i++) {
            dropDown.push({ 
                label: "[" + courses[1][i] + "] : " + courses[0][i], 
                value: i, 
                courseID: courses[2][i]}
                );
        }
        return dropDown;
    }
    //if course is clicked from the tree view add it to the dropdown
    clickUpdate = (addedCourse) => {
        var coursesFromGraph = [...this.state.value];
        for(var i = 0; i < addedCourse.length; i++)
        {
            var canBeAdded = true;
            for(var j = 0; j < coursesFromGraph.length; j++){
                if(coursesFromGraph[j] === this.state.courses[addedCourse[i]])
                {
                    canBeAdded = false;
                    break;
                }
            }
            if(canBeAdded){
                coursesFromGraph.push(this.state.courses[addedCourse[i]]);
            }
        }
        this.setState({
            value: coursesFromGraph
        });
        this.props.emptyField();
    }
    //update the selected courses
    updateValues = (values) => {
        console.log(this.state.value);
        this.props.selectedCourses(values);
        this.setState({
            value: values
        });
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