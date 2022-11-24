import { Component } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
  } from "react-router-dom";

import Home from './pages/home/index.js';
import Cards from './pages/cards/index.js';
import Sets from './pages/sets/index.js';
import Varieties from './pages/varieties/index.js';
import Featureds from './pages/featureds/index.js';
import Teams from './pages/teams/index.js';
import Games from './pages/games/index.js';

import './App.css';


export default class App extends Component {
    render() {
      return (
        <Router>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/cards" element={<Cards />} />      
            <Route path="/sets" element={<Sets />} />      
            <Route path="/varieties" element={<Varieties />} />      
            <Route path="/featureds" element={<Featureds />} />      
            <Route path="/teams" element={<Teams />} />                     
            <Route path="/games" element={<Games />} />    
          </Routes>
        </Router>
      )
    }
}