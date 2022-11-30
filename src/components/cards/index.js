import React from 'react';
import axios from 'axios';
import Box from '../../components/box/index.js'
import { Link } from "react-router-dom";
import './style.css';
// http://localhost:3000/api/v1/teams
export default class Cards extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
            data: props.data
        }
    }

    componentDidMount() {
        
    }


    render() {
        return (
            <div>
                Cardsdwadwa
            </div>
        )
    };



}   