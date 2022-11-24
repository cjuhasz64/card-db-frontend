import React from 'react';
import axios from 'axios';
import Box from '../../components/box/index.js'

import './style.css';
// http://localhost:3000/api/v1/teams
export default class Home extends React.Component {

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

    renderBox(title) {
        return 
    }

    render() {
        return (
            <div className='home'>
                <h1>Trading Card Inventory</h1>
                <div className='flex-wrapper'>
                    <Box title={ "Cards" } to={ "/cards" }/>
                    <Box title={ "Sets" } to={ "/sets" }/>
                    <Box title={ "Varieties" } to={ "/varieties" }/>
                    <Box title={ "Featureds" } to={ "/featureds" }/>
                    <Box title={ "Teams" } to={ "/teams" }/>
                    <Box title={ "Games" } to={ "/games" }/>
             
                </div>
            </div>
        )
    };
}   