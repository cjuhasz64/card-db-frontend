import React from 'react';
import axios from 'axios';
import Box from '../../components/box/index.js'
import { Link } from "react-router-dom";
import './style.scss'
import fetchApi from '../../util/fetchApi.js';

const columns = ['name'];

// http://localhost:3000/api/v1/teams
export default class Games extends React.Component {

    
    constructor (props) {
        super(props)
      

    }

    componentDidMount () {
       
    }


    componentDidUpdate () {
    
    }

    renderTable ()
    {
        if (this.props.data.length == 0) {
            return (
                <div>No Data to be displayed</div>
            )
        }

        return (
            <table>
                <thead>   
                    <tr>
                        {columns.map((key) => <th key={key}>{ key }</th> )}
                    </tr> 
                </thead>
                <tbody>
                    {this.props.data.map((row, index) => 
                        <tr>{
                            columns.map((key) => 
                                <td key=''> {row[key]} </td>
                            )
                        }<td className='delete' onClick={() => this.props.handleDelete(row['id'])}>x</td></tr>   // delete coloumn 
                    )}
                </tbody>
            </table>
        )
    }


    render() {
        return (
            <div className='games'>
                {this.renderTable()}
            </div>
        )
    }
        



}   