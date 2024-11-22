import { Card, Rank, Suit } from '../types/game';

const SUITS: Suit[] = ['♠', '♣', '♥', '♦'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const createDeck = (): Card[] => {
  const deck: Card[] = [];

  for (const suit of SUITS) {
    for (const rank of RANKS) {
      const value = calculateCardValue(rank);
      deck.push({ suit, rank, value });
    }
  }

  return shuffleDeck(deck);
};

export const calculateCardValue = (rank: Rank): number => {
  if (rank === 'A') return 11;
  if (['K', 'Q', 'J'].includes(rank)) return 10;
  return parseInt(rank);
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const calculateHandValue = (hand: Card[]): number => {
  let value = 0;
  let aces = 0;

  for (const card of hand) {
    if (!card.hidden) {
      if (card.rank === 'A') {
        aces += 1;
      }
      value += card.value;
    }
  }

  while (value > 21 && aces > 0) {
    value -= 10;
    aces -= 1;
  }

  return value;
};
