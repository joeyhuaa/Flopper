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
export function createDeck(): string[] {
  const deck = ranks.reduce<string[]>((d,rank) => {
    return d.concat([rank+suits[0],rank+suits[1],rank+suits[2],rank+suits[3]])
  }, [])
  return deck
}

export function removeCards(deck: string[], cardsToRemove: string[]): string[] {
  for (let card of cardsToRemove) {
    console.log('card',card)
    let i = deck.indexOf(card)
    deck.splice(i,1)
  }
  return deck
}

export function shuffle(deck: string[]): string[] {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]
  } 
  return deck
}