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
        this.props.data(this.state.unit,this.state.selector,this.state.id);

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
                        native
                        onChange={this.handleChange('unit')}
                        inputProps={{
                            name: 'unit',
                            id: 'age-native-simple',
                        }}
                    >
                        <option value={"COMSTK"}>COMSTK</option>
                        <option value={"EDUTK"}>EDUTK</option>
                        <option value={"JKKTK"}>JKKTK</option>
                        <option value={"LANCE"}>LANCE</option>
                        <option value={"LUOTK"}>LUOTK</option>
                        <option value={"MEDTK"}>MEDTK</option>
                        <option value={"SOCTK"}>SOCTK</option>
                        <option value={"TUTKI"}>TUTKI</option>
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