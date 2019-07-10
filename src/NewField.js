import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import DeleteIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import MenuItem from '@material-ui/core/MenuItem';
import Fab from '@material-ui/core/Fab';

class NewField extends Component {
    constructor() {
        super();
        this.state =
            {
                unit: ''
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
        this.props.data(this.state.unit,this.props.id);

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
        return (
        <div style={{ display: 'flex', flexDirection: 'row',background: 'rgb(250, 250, 250)',borderRadius: '5px',margin:'10px',padding: '10px' }}>
            <FormControl
                variant="filled"
                style={{ flexDirection: 'row', marginLeft: '50px' }}>
                <InputLabel>Unit</InputLabel>
              
                    <Select
                        style={{ margin: '15px' }}                       
                        onChange={this.handleChange('unit')}
                        value = {this.state.unit}
                        
                    >
                        <MenuItem key={"COMSTK"} value={"COMSTK"}>COMSTK</MenuItem>
                        <MenuItem key={"EDUTK"} value={"EDUTK"}>EDUTK</MenuItem>
                        <MenuItem key={"JKKTK"} value={"JKKTK"}>JKKTK</MenuItem>
                        <MenuItem key={"LANCE"} value={"LANCE"}>LANCE</MenuItem>
                        <MenuItem key={"LUOTK"} value={"LUOTK"}>LUOTK</MenuItem>
                        <MenuItem key={"MEDTK"} value={"MEDTK"}>MEDTK</MenuItem>
                        <MenuItem key={"SOCTK"} value={"SOCTK"}>SOCTK</MenuItem>
                        <MenuItem key={"TUTKI"} value={"TUTKI"}>TUTKI</MenuItem>
                    </Select>
               

            </FormControl>
            <FormControl
                style={{ flexDirection: 'row', marginLeft: '400px',marginTop:'10px' }}>
                
                <Fab
                    size="small"
                    color="primary"
                    onClick = {(e,v) => {this.addField()}}
                    >
                    
                    <AddIcon />
                </Fab>{/*
                <Fab
                    style={{marginLeft:'5px'}}
                    size="small"
                    color="primary"
                    onClick = {(e,v) => {this.deleteField()}}
                    >                   
                    <DeleteIcon />
                </Fab>*/}
                
            </FormControl>
        </div>

        );
    }
}
export default NewField;