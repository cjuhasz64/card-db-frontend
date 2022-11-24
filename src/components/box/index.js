import React from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import fetchApi from '../../util/fetchApi';

// http://localhost:3000/api/v1/teams

export default class Box extends React.Component {

    render() {
        return (
            <Link to={this.props.to}>
                <button className="box">
                    <div className='header'>
                        <span>{this.props.title}</span>
                    </div>
                    
                    <div className='wrapper-data'>
                        Count: { this.props.count}
                    </div>
                </button>
            </Link>
        )
    };




}   