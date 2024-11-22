export type Suit = '♠' | '♣' | '♥' | '♦';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export type Card = {
  suit: Suit;
  rank: Rank;
  value: number;
  hidden?: boolean;
};

export type GameMode = 'standard' | 'training';

export type GameStatus =
  | 'betting'
  | 'playing'
  | 'playerBusted'
  | 'dealerBusted'
  | 'playerWon'
  | 'dealerWon'
  | 'push'
  | 'training_correct'
  | 'training_incorrect';

export type GameState = {
  deck: Card[];
  playerHands: Card[][];
  activeHandIndex: number;
  dealerHand: Card[];
  gameStatus: GameStatus;
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
    training: {
      correct: number;
      incorrect: number;
    };
  };
  cutPosition: number;
  needsShuffle: boolean;
  deckCount: number;
  mode: GameMode;
};

export type GameAction = 'hit' | 'stand' | 'double' | 'split';
