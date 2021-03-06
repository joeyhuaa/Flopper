import React, { useState, useEffect,useRef } from 'react'
import RangeChart from '../RangeChart'
import '../App.css'
import './index.css'

// variables we need
let Combinatorics = require('js-combinatorics')
let ranks = ['2','3','4','5','6','7','8','9','T','J','Q','K','A']
let suits = ['c','d','h','s']
let madeHands = {'high card':1, 'one pair':2, 'two pair':3, 
                 'trips':4, 'straight':5,'flush':6, 
                 'boat':7, 'quads':8, 'straight flush':9}

// functions we need to do card/deck operations
function createDeck() {
  return ranks.reduce((d,rank) => {
    return d.concat([rank+suits[0],rank+suits[1],rank+suits[2],rank+suits[3]])
  }, [])
}

function removeCards(deck, cardsToRemove) {
  for (let card of cardsToRemove) {
    let i = deck.indexOf(card)
    deck.splice(i,1)
  }
  return deck
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]
  } 
  return deck
}

function sortHand(hand) { // insertion sort
  hand = hand.map(card => card[0]) // ranks only, remove suits
  for (let i = 1; i < hand.length; i++) {
    while (i > 0 && ranks.indexOf(hand[i]) < ranks.indexOf(hand[i-1])) {
      [hand[i], hand[i-1]] = [hand[i-1], hand[i]]
      i--
    }
  }
  return hand.map(cardRank => ranks.indexOf(cardRank)) // return array of ints for convenience
}

function sumCardRanks(hand) {
  return hand.reduce((sum,card) => sum + ranks.indexOf(card[0]), 0)
}

function getRank(hand) {
  // console.log(hand)
  if (isStraight(hand) && isFlush(hand)) {
    return 'straight flush'
  } else if (isQuads(hand)) {
    return 'quads'
  } else if (isBoat(hand)) {
    return 'boat'
  } else if (isFlush(hand)) {
    return 'flush'
  } else if (isStraight(hand)) {
    return 'straight'
  } else if (isTrips(hand)) {
    return 'trips'
  } else if (isTwoPair(hand)) {
    return 'two pair'
  } else if (isOnePair(hand)) {
    return 'one pair'
  } else {
    return 'high card'
  }
}

// bug occurring here?
function isQuads(hand) {
  // console.log(hand)
  let ranksArray = hand.map(card => card[0])
  let ranksSet = new Set(ranksArray)
  let rCount = ranksArray.filter((r) => r === ranksArray[0]).length
  if (ranksSet.size === 2 && (rCount === 1 || rCount === 4)) {
    return true
  } else {
    return false
  }
}

function isBoat(hand) {
  let ranksArray = hand.map((card) => card[0])
  let ranksSet = new Set(ranksArray)
  let rCount = ranksArray.filter((r) => r === ranksArray[0]).length
  if (ranksSet.size === 2 && (rCount === 2 || rCount === 3)) {
    return true
  } else {
    return false
  }
}

function isFlush(hand) {
  let suitsSet = new Set(hand.map((card) => card[1]))
  if (suitsSet.size === 1) {
    return true
  } else { 
    return false
  }
}

function isStraight(hand) {
  for (let card of hand) {
    let index = hand.indexOf(card)
    let difference = ranks.indexOf(card[0]) - ranks.indexOf(hand[0])
    if (index === difference) {
      continue
    } else {
      return false
    }
  } return true
}

function isTrips(hand) {
  let ranksArray = hand.map((card) => card[0])
  let ranksSet = new Set(ranksArray)
  let rCount = ranksArray.filter((r) => r === ranksArray[2]).length
  if (ranksSet.size === 3 && rCount === 3) { 
    return true 
  } else { 
    return false 
  }
}

function isTwoPair(hand) {
  let ranksArray = hand.map((card) => card[0])
  let ranksSet = new Set(ranksArray)
  let rCount = ranksArray.filter((r) => r === ranksArray[0]).length
  if (ranksSet.size === 3 && (rCount === 1 || rCount === 2)) { 
    return true 
  } else { 
    return false 
  }
}

function isOnePair(hand) {
  let ranksSet = new Set(hand.map((card) => card[0]))
  if (ranksSet.size === 4) { 
    return true 
  } else { 
    return false 
  }
}

/*
.
.
.
.
.
*/

// this is where all the main simulation logic takes place
let Poker = () => {
  let [ranges, setRanges] = useState([[], []])
  let [equity1, setEquity1] = useState(0)
  let [equity2, setEquity2] = useState(0)

  useEffect(() => {
    // console.log(ranges)
  }, [ranges])

  function getEquities(wins) {
    // should take ties into account but do this later...
    let playerOneEquity = wins.filter(x => x === 1).length / wins.length
    let playerTwoEquity = wins.filter(x => x === 2).length / wins.length
    return [playerOneEquity, playerTwoEquity]
  }

  function getBestHand(hc, comm) {
    // 1
    let sevenCards = hc.concat(comm)
    // console.log(sevenCards)
    let fiveCardCombos = Combinatorics.combination(sevenCards, 5).toArray()
    let fiveCardRanks = fiveCardCombos.map(combo => madeHands[getRank(combo)])
    let fiveCardCombosRanks = fiveCardCombos.map((combo, i) => [combo, fiveCardRanks[i]])
    let bestCombosRanks = fiveCardCombosRanks.filter(val => val[1] === Math.max(...fiveCardRanks))
    
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

  function getWinner(handmap1, handmap2) {
    // figure out the winner 
    if (handmap1.handRank > handmap2.handRank) {
      return 1
    } else if (handmap1.handRank < handmap2.handRank) {
      return 2
    } else { // in case both hands are have equal handRanks, sort each hand s -> L, back traverse
      let [hand1, hand2] = [sortHand(handmap1.hand), sortHand(handmap2.hand)] // hand1 & hand2 are arrays of ints post sorting!

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
  function monteCarlo(ranges, n) {
    // array that holds which player wins each run
    let wins = [] // 0 - tie, 1 - P1, 2 - P2
    let deck, community, hc1, hc2, bestmap1, bestmap2
    let suitedRanges = assignSuitsToRanges(ranges)

    // for loop that runs the MONTE CARLO SIM
    for (let i = 0; i < n; i++) {
      // create the deck
      deck = createDeck()

      // pick random holecards from each range
      let holecards = suitedRanges.map(r => r[Math.floor(Math.random() * r.length)])
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

  function getRandomSuits(n) {
    let selectedSuits = []
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

  function assignSuitsToRanges(handRanges) {
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

  return (
    <div id='main'>
      {ranges.map((_, i) =>
        <RangeChart 
          key={i}
          getSelectedRange={newRange => updateRanges(newRange, i)}
        />
      )}
      <div id='display-and-button-container'>
        <div className='container'>{equity1}</div>
        <div className='container'>{equity2}</div>
        <div className='container'>
          <button onClick={handleClick}>Calculate</button>
        </div>
      </div>
    </div>
  )
}

export default Poker