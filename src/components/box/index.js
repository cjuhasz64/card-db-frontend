import React from 'react';
import './style.css';
import { Link } from "react-router-dom";

// http://localhost:3000/api/v1/teams

export default class Box extends React.Component {
    render() {
        return (
          <Link to={this.props.to}>
            <button className="box">
              {this.props.title}
            </button>
          </Link>
        )
    };




}   