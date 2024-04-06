import '../App.css'
import './index.css'
import React, { useState, useEffect, useRef } from 'react'

import RangeChart from '../RangeChart'
import { createDeck, removeCards, shuffle } from './deckUtil' //functions
import { ranks, suits, madeHands } from './deckUtil' //constants
import { getRank, sortHand, HandMap } from './handUtil'
const Combinatorics = require('js-combinatorics')

// this is where all the main simulation logic takes place
const Poker = () => {
  const [ranges, setRanges] = useState([[], []])
  const [equity1, setEquity1] = useState(0)
  const [equity2, setEquity2] = useState(0)
  const selectableRefs = [useRef(), useRef()] // 1 for each range chart

  function sumCardRanks(hand: string[]): number {
    return hand.reduce((sum,card) => sum + ranks.indexOf(card[0]), 0)
  }

  function getEquities(wins: number[]): number[] {
    // should take ties into account but do this later...
    let playerOneEquity = wins.filter(x => x === 1).length / wins.length
    let playerTwoEquity = wins.filter(x => x === 2).length / wins.length
    return [playerOneEquity, playerTwoEquity]
  }

  function getBestHand(hc: string[], comm: string[]): {
    hand: string[],
    handRank: string,
    sumCardRanks: number
  } {
    // 1
    let sevenCards = hc.concat(comm)
    // console.log(sevenCards)
    let fiveCardCombos = Combinatorics.combination(sevenCards, 5).toArray()
    let fiveCardRanks = fiveCardCombos.map((combo: string[]) => madeHands[getRank(combo)])
    let fiveCardCombosRanks = fiveCardCombos.map((combo: any, i: string | number) => [combo, fiveCardRanks[i]])
    let bestCombosRanks = fiveCardCombosRanks.filter((val: number[]) => val[1] === Math.max(...fiveCardRanks))
    
    // 2
    // algo for getting the best hand:
    // start at array[0], calculate the total hand value
    // for each array[i], delete array[i] if value < array[0]; delete array[0] if value > array[0]
    let valueHighest = sumCardRanks(bestCombosRanks[0][0])
    while (bestCombosRanks.length > 1) {
      let nextValue = sumCardRanks(bestCombosRanks[1][0])
      if (nextValue < valueHighest) {
        bestCombosRanks.splice(1, 1)
      } else {
        bestCombosRanks.splice(0, 1)
      }
    }
    
    // 3
    // return a map with hand in array form, handRank as int, and sumCardRanks as int
    return {
      hand: bestCombosRanks[0][0], // actual hand
      handRank: bestCombosRanks[0][1], // rank of hand
      sumCardRanks: sumCardRanks(bestCombosRanks[0][0]) // sum of card ranks in the hand 
    }
  }

  function getWinner(handmap1: HandMap, handmap2: HandMap): number {
    // figure out the winner 
    if (handmap1.handRank > handmap2.handRank) {
      return 1
    } else if (handmap1.handRank < handmap2.handRank) {
      return 2
    } else { // in case both hands are have equal handRanks, sort each hand s -> L, back traverse
      const [hand1, hand2] = [sortHand(handmap1.hand), sortHand(handmap2.hand)] // hand1 & hand2 are arrays of ints post sorting!

      // back traverse 
      for (let i = hand1.length - 1; i > 0; i--) {
        if (hand1[i] === hand2[i]) { continue } // keep searching
        else {
          if (hand1[i] > hand2[i]) { return 1 } // P1 wins
          else { return 2 } // P2 wins
        }
      }

      // if the function gets to this point, that means it's a tie
      return 0
    }
  }

  // Monte Carlo simulation
  function monteCarlo(ranges: string[], n: number): number[] {
    // array that holds which player wins each run
    let wins = [] // 0 - tie, 1 - P1, 2 - P2
    let deck, community, hc1, hc2, bestmap1, bestmap2
    let suitedRanges = assignSuitsToRanges(ranges)

    // for loop that runs the MONTE CARLO SIM
    for (let i = 0; i < n; i++) {
      // create the deck
      deck = createDeck()

      // pick random holecards from each range
      let holecards = suitedRanges.map((r: string[]) => r[Math.floor(Math.random() * r.length)])
      deck = removeCards(deck, [].concat(...holecards))

      // deal community
      deck = shuffle(deck)
      community = [deck.pop(),deck.pop(),deck.pop(),deck.pop(),deck.pop()] 

      // get best hand for each pair of holecards
      bestmap1 = getBestHand(holecards[0], community)
      bestmap2 = getBestHand(holecards[1], community)

      wins.push(getWinner(bestmap1, bestmap2)) // get winner! 
    }
    return wins
  }

  function getRandomSuits(n: number): string[] {
    let selectedSuits: string[] = []
    for (let i = 0; i < n; i++) {
      let s = suits[Math.floor(Math.random() * 4)]
      if (!selectedSuits.includes(s)) {
        selectedSuits.push(s)
      } else {
        i--
      }
    }
    return selectedSuits
  }

  function assignSuitsToRanges(handRanges: string[][]): string[][][] {
    return handRanges.map(range => range.map(hand => {
      if (hand.includes('s')) {          // suited 
        let s = getRandomSuits(1)
        return [hand[0] + s[0], hand[1] + s[0]]
      } else {                           // offsuit or pairs
        let s = getRandomSuits(2)
        return [hand[0] + s[0], hand[1] + s[1]]
      }
    }))
  }

  // first function called on click
  function handleClick() {
    let wins = monteCarlo(ranges, 5000) 
    let equities = getEquities(wins)
    setEquity1(equities[0])
    setEquity2(equities[1])
  }

  function updateRanges(newRange, i) {
    let newRanges = [...ranges]
    newRanges[i] = newRange
    setRanges(newRanges)
  }

  function equityToPercentage(equity) {
    return (equity * 100).toFixed(2)
  }

  function reset() {
    selectableRefs.forEach(ref => ref.current.clearSelection())

    setRanges([[], []])
    setEquity1(0)
    setEquity2(0)
  }

  return (
    <div id='main'>
      {ranges.map((_, i) =>
        <RangeChart 
          key={i}
          getSelectedRange={newRange => updateRanges(newRange, i)}
          selectableRef={selectableRefs[i]}
          title={`Player ${i+1} Equity`}
        />
      )}
      
      <div id='display-and-button-container'>
        <div className='container'>
          <b>Player 1 Preflop Equity: </b>
          {equityToPercentage(equity1)}%
        </div>
        <div className='container'>
          <b>Player 2 Preflop Equity: </b>
          {equityToPercentage(equity2)}%
        </div>
        <div className='container'>
          <button onClick={handleClick} disabled={ranges[0].length === 0 || ranges[1].length === 0}>
            Calculate
          </button>
          <button onClick={reset} style={{margin:'10px'}}>
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default Poker