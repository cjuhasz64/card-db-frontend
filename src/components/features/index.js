import React from 'react';
import axios from 'axios';
import Box from '../../components/box/index.js'
import { Link } from "react-router-dom";
// http://localhost:3000/api/v1/teams
export default class Features extends React.Component {

    state = {
        teams: []
    }

    componentDidMount() {
        // axios.get(`http://localhost:3000/api/v1/teams`)
        // .then(res => {
        //     const teams = res.data;
        //     this.setState({ teams });
        // })
    }


    render() {
        return (
            <div>
                features
            </div>
        )
    };



}   