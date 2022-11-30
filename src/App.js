import { Component } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
  } from "react-router-dom";

import Home from './pages/home/index.js';
import Cards from './components/cards/index.js';
import Sets from './components/sets/index.js';
import Varieties from './components/varieties/index.js';
import Features from './components/features/index.js';
import Teams from './components/teams/index.js';
import Games from './components/games/index.js';

import './App.css';
import MasterPage from './pages/master_page/index.js';


export default class App extends Component {
    render() {
      return (
        <Router>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/cards" element={<MasterPage target="cards"/>} />      
            <Route path="/sets" element={<MasterPage target="sets"/>} />      
            <Route path="/varieties" element={<MasterPage target="varieties"/>} />      
            <Route path="/features" element={<MasterPage target="features"/>} />      
            <Route path="/teams" element={<MasterPage target="teams"/>} />                     
            <Route path="/games" element={<MasterPage target="games"/>} />    
          </Routes>
        </Router>
      )
    }
}