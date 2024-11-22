export type Suit = '♠' | '♣' | '♥' | '♦';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export type Card = {
  suit: Suit;
  rank: Rank;
  value: number;
  hidden?: boolean;
};

export type GameState = {
  deck: Card[];
  playerHands: Card[][];
  activeHandIndex: number;
  dealerHand: Card[];
  gameStatus: 'betting' | 'playing' | 'playerBusted' | 'dealerBusted' | 'playerWon' | 'dealerWon' | 'push';
  playerScores: number[];
  dealerScore: number;
  currentBet: number;
  playerMoney: number;
  canSplit: boolean;
  canDouble: boolean;
  stats: {
    wins: number;
    losses: number;
    pushes: number;
  };
};
