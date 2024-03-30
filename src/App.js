import React from 'react';
import Poker from './Poker'
import './App.css';

function App() {
  return (
    <div className='App'>
      <h1>Flopper ♥️♠️♦️♣️</h1>
      <p>
        Check out the code  
        <a 
          href="https://github.com/joeyhuaa/Flopper/tree/master" target='_blank'
          style={{ color:'yellow', textDecoration:'none', fontWeight:'bold' }}
        >
          {' '}here.
        </a>
      </p>

      <span style={{color:'#ffaf96'}}>
        Drag mouse across charts to select hands for each player, then press <b>Calculate</b> to run equity calculator (Monte Carlo).
      </span>
      <span style={{color:'#ffaf96'}}>
        Press <b>Esc</b> to clear all ranges. Press the <b>Reset</b> button to clear everything.
      </span>
      <Poker />
    </div>
  );
}

export default App;
