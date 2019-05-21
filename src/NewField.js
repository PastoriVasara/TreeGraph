import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import MenuItem from '@material-ui/core/MenuItem';
import Fab from '@material-ui/core/Fab';

class NewField extends Component {
    constructor() {
        super();
        this.state =
            {
                unit: '',
                selector: ''
            };
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value }, () => {this.updateProperties(); });             
    }
    componentDidMount() {
        this.setState({
            unit: this.props.unit
        });
        this.forceUpdate();
    }
    updateProperties = () =>
    {
        this.props.data(this.state.unit,this.state.selector,this.props.id);

    }
    addField = () => 
    {
        this.props.add();
    }
    deleteField = () =>
    {
        this.props.delete(this.props.id);
    }
    render() {
        return (<div style={{ display: 'flex', flexDirection: 'row' }}>
            <FormControl
                style={{ flexDirection: 'row', marginLeft: '50px' }}>
                <InputLabel>Unit</InputLabel>
              
                    <Select
                        style={{ margin: '10px' }}                       
                        onChange={this.handleChange('unit')}
                        value = {this.state.unit}
                        
                    >
                        <MenuItem value={"COMSTK"}>COMSTK</MenuItem>
                        <MenuItem value={"EDUTK"}>EDUTK</MenuItem>
                        <MenuItem value={"JKKTK"}>JKKTK</MenuItem>
                        <MenuItem value={"LANCE"}>LANCE</MenuItem>
                        <MenuItem value={"LUOTK"}>LUOTK</MenuItem>
                        <MenuItem value={"MEDTK"}>MEDTK</MenuItem>
                        <MenuItem value={"SOCTK"}>SOCTK</MenuItem>
                        <MenuItem value={"TUTKI"}>TUTKI</MenuItem>
                    </Select>
               

            </FormControl>
            <div style={{ margin: '10px' }}>
                    IS
                </div>
            <FormControl
                style={{ flexDirection: 'row', marginLeft: '50px' }}>
                <InputLabel>Operation</InputLabel>
                <Select
                    style={{ margin: '10px' }}
                    native
                    onChange={this.handleChange('selector')}
                    inputProps={{
                        name: 'selector',
                        id: 'selects'
                    }}
                >
                    <option value={"AND"}>AND </option>
                    <option value={"OR"}>OR </option>
                    <option value={"NOT"}>NOT </option>

                </Select>
                <Fab
                    size="small"
                    color="primary"
                    onClick = {(e,v) => {this.addField()}}
                    >
                    
                    <AddIcon />
                </Fab>
                <Fab
                    size="small"
                    color="primary"
                    onClick = {(e,v) => {this.deleteField()}}
                    >                   
                    <DeleteIcon />
                </Fab>
                
            </FormControl>
        </div>

        );
    }
}
export default NewField;