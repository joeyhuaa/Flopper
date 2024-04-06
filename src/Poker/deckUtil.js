export const ranks = ['2','3','4','5','6','7','8','9','T','J','Q','K','A']
export const suits = ['c','d','h','s']
export const madeHands = {
  'high card':1, 
  'one pair':2, 
  'two pair':3, 
  'trips':4, 
  'straight':5,
  'flush':6, 
  'boat':7, 
  'quads':8, 
  'straight flush':9
}

// functions we need to do card/deck operations
export function createDeck() {
  return ranks.reduce((d,rank) => {
    return d.concat([rank+suits[0],rank+suits[1],rank+suits[2],rank+suits[3]])
  }, [])
}

export function removeCards(deck, cardsToRemove) {
  for (let card of cardsToRemove) {
    let i = deck.indexOf(card)
    deck.splice(i,1)
  }
  return deck
}

export function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]
  } 
  return deck
}