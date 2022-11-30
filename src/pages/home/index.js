import React from 'react';
import axios from 'axios';
import Box from '../../components/box/index.js'
import fetchApi from '../../util/fetchApi';
import './style.css';
// http://localhost:3000/api/v1/teams
export default class Home extends React.Component {

    state = {
        cards: 0,
        sets: 0,
        varieties: 0,
        features: 0, 
        teams: 0,
        games: 0
    }

    async setCounts () {
        this.setState({
            cards: await fetchApi('count', '/v1/cards'),
            sets: await fetchApi('count', '/v1/sets'),
            varieties: await fetchApi('count', '/v1/varieties'),
            features: await fetchApi('count', '/v1/features'),
            teams: await fetchApi('count', '/v1/teams'),
            games: await fetchApi('count', '/v1/games')
        })
    }
    
    
    componentDidMount () {
        this.setCounts();
    }


    renderBox (title, count) {
        return <Box title = { title } to={ `/${title.toLowerCase()}` } count={ count } />
    }

    render() {
        return (
            <div className='home'>
                <h1>Trading Card Inventory</h1>
                <div className='flex-wrapper'> 
                    { this.renderBox("Cards", this.state.cards) }
                    { this.renderBox("Sets", this.state.sets) }
                    { this.renderBox("Varieties", this.state.varieties) }
                    { this.renderBox("Features", this.state.features) }
                    { this.renderBox("Teams", this.state.teams) }
                    { this.renderBox("Games", this.state.games) }
                </div>
            </div>
        )
    };
}   