import React from 'react';
import Poker from './Poker'
import './App.css';

function App() {
  return (
    <div className='App'>
      <h1>Flopper ♥️♠️♦️♣️</h1>
      <span style={{color:'#e86548'}}>
        Drag mouse across charts to select hands for each player, then press <b>Calculate</b> to run a Monte Carlo simulation.
      </span>
      <Poker />
    </div>
  );
}

export default App;
