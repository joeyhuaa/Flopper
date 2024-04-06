import { ranks } from "./deckUtil"

export function sortHand(hand) { // insertion sort
  hand = hand.map(card => card[0]) // ranks only, remove suits
  for (let i = 1; i < hand.length; i++) {
    while (i > 0 && ranks.indexOf(hand[i]) < ranks.indexOf(hand[i-1])) {
      [hand[i], hand[i-1]] = [hand[i-1], hand[i]]
      i--
    }
  }
  return hand.map(cardRank => ranks.indexOf(cardRank)) // return array of ints for convenience
}


export function getRank(hand) {
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