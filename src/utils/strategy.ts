import { Card, GameAction } from '../types/game';
import { calculateHandValue } from './deck';

export const getOptimalPlay = (playerCards: Card[], dealerUpCard: Card): GameAction => {
  const playerValue = calculateHandValue(playerCards);
  const dealerValue = dealerUpCard.value;
  const hasAce = playerCards.some((card) => card.rank === 'A');
  const isPair = playerCards.length === 2 && playerCards[0].rank === playerCards[1].rank;

  // Handle pairs first
  if (isPair) {
    const pairValue = playerCards[0].value;
    if (pairValue === 11) return 'split'; // Always split Aces
    if (pairValue === 10) return 'stand'; // Never split 10s
    if (pairValue === 9 && dealerValue !== 7 && dealerValue !== 10 && dealerValue !== 11) return 'split';
    if (pairValue === 8) return 'split';
    if (pairValue === 7 && dealerValue <= 7) return 'split';
    if (pairValue === 6 && dealerValue <= 6) return 'split';
    if (pairValue === 4) return 'hit';
    if (pairValue === 3 && dealerValue >= 4 && dealerValue <= 7) return 'split';
    if (pairValue === 2 && dealerValue >= 4 && dealerValue <= 7) return 'split';
  }

  // Handle soft totals (hands with an Ace counted as 11)
  if (hasAce && playerValue <= 21) {
    if (playerValue >= 20) return 'stand';
    if (playerValue === 19) {
      if (dealerValue === 6) return 'double';
      return 'stand';
    }
    if (playerValue === 18) {
      if (dealerValue >= 9) return 'hit';
      if (dealerValue <= 6) return 'double';
      return 'stand';
    }
    if (playerValue === 17) {
      if (dealerValue >= 3 && dealerValue <= 6) return 'double';
      return 'hit';
    }

    if (playerValue >= 14 && playerValue <= 16) {
      if (dealerValue >= 4 && dealerValue <= 6) return 'double';
      return 'hit';
    }
    if (playerValue === 13) {
      if (dealerValue >= 5 && dealerValue <= 6) return 'double';
      return 'hit';
    }
  }

  // Handle hard totals
  if (playerValue >= 17) return 'stand';
  if (playerValue <= 8) return 'hit';

  if (playerValue >= 13 && playerValue <= 16) {
    if (dealerValue >= 7) return 'hit';
    return 'stand';
  }
  if (playerValue === 12) {
    if (dealerValue <= 3 || dealerValue >= 7) return 'hit';
    return 'stand';
  }
  if (playerValue === 11) return 'double';
  if (playerValue === 10) {
    if (dealerValue <= 9) return 'double';
    return 'hit';
  }
  if (playerValue === 9) {
    if (dealerValue <= 6) return 'double';
    return 'hit';
  }

  return 'hit';
};
