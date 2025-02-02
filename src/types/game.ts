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

export type TrainingConfig = {
  includePairs: boolean;
  includeSoftHands: boolean;
  includeHardHands: boolean;
};

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
  trainingConfig: TrainingConfig;
};

export type GameAction = 'hit' | 'stand' | 'double' | 'split';

export type BetInputEvent = React.ChangeEvent<HTMLInputElement>;

export type GameHandlers = {
  handleStartGame: () => void;
  handleDouble: () => void;
  handleSplit: () => void;
  handleHit: () => void;
  handleStand: () => void;
  handleBetChange: (bet: number) => void;
  handleNewGame: () => void;
  handleResetMoney: () => void;
  handleResetStats: () => void;
  handleBetInput: (event: BetInputEvent) => void;
  handleDealNow: () => void;
  handleDeckCountChange: (count: number) => void;
  handleTrainingAction: (action: GameAction) => void;
  handleModeChange: (newMode: GameMode) => void;
  handleTrainingConfigChange: (config: TrainingConfig) => void;
};
