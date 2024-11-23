import { useState, useEffect } from 'react';
import { GameState, Card, GameMode, GameAction, TrainingConfig } from '../types/game';
import { createDeck, calculateHandValue, shuffleDeck } from '../utils/deck';
import { getOptimalPlay } from '../utils/strategy';

const STORAGE_KEY = 'blackjack_player_money';
const STATS_KEY = 'blackjack_stats';
const AUTO_DEAL_DELAY = 5000; // 5 seconds delay
const MIN_CUT_POSITION = 0.3; // Cut card must be at least 30% from the end
const MAX_CUT_POSITION = 0.7; // Cut card can't be more than 70% from the end

export const useBlackjackGame = (mode: GameMode = 'training') => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedMoney = localStorage.getItem(STORAGE_KEY);
    const savedStats = localStorage.getItem(STATS_KEY);
    const initialMoney = savedMoney ? parseInt(savedMoney) : 1000;
    const initialStats = savedStats
      ? JSON.parse(savedStats)
      : {
          wins: 0,
          losses: 0,
          pushes: 0,
          training: {
            correct: 0,
            incorrect: 0,
          },
        };

    if (!initialStats.training) {
      initialStats.training = {
        correct: 0,
        incorrect: 0,
      };
    }

    const deckCount = 6;
    const initialDeck = createDeck(deckCount);
    const totalCards = 52 * deckCount;
    const cutPosition = Math.floor(
      totalCards * (MIN_CUT_POSITION + Math.random() * (MAX_CUT_POSITION - MIN_CUT_POSITION))
    );

    return {
      deck: initialDeck,
      deckCount,
      cutPosition,
      needsShuffle: false,
      playerHands: [[]],
      activeHandIndex: 0,
      dealerHand: [],
      gameStatus: 'betting',
      playerScores: [0],
      dealerScore: 0,
      currentBet: 10,
      playerMoney: initialMoney,
      canSplit: false,
      canDouble: false,
      stats: initialStats,
      mode,
      trainingConfig: {
        includePairs: true,
        includeSoftHands: true,
        includeHardHands: true,
      },
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, gameState.playerMoney.toString());
  }, [gameState.playerMoney]);

  useEffect(() => {
    localStorage.setItem(STATS_KEY, JSON.stringify(gameState.stats));
  }, [gameState.stats]);

  useEffect(() => {
    if (
      gameState.gameStatus !== 'betting' &&
      gameState.gameStatus !== 'playing' &&
      gameState.playerMoney >= gameState.currentBet
    ) {
      const timer = setTimeout(() => {
        handleStartGame();
      }, AUTO_DEAL_DELAY);

      return () => clearTimeout(timer);
    }
  }, [gameState.gameStatus]);

  // ... all existing handler functions ...
  const handleStartGame = () => {
    if (gameState.currentBet <= 0 || gameState.currentBet > gameState.playerMoney) return;

    if (gameState.needsShuffle || gameState.deck.length < 15) {
      const newDeck = createDeck(gameState.deckCount);
      const totalCards = 52 * gameState.deckCount;
      const newCutPosition = Math.floor(
        totalCards * (MIN_CUT_POSITION + Math.random() * (MAX_CUT_POSITION - MIN_CUT_POSITION))
      );

      setGameState((prev) => ({
        ...prev,
        deck: newDeck,
        cutPosition: newCutPosition,
        needsShuffle: false,
      }));
      return;
    }

    if (gameState.mode === 'training') {
      let validHand = false;
      let attempts = 0;
      let currentDeck = [...gameState.deck];

      while (!validHand && attempts < 100) {
        // Draw potential hands
        const playerHand = [currentDeck[0], currentDeck[1]];
        const dealerHand = [currentDeck[2], currentDeck[3]];

        const playerScore = calculateHandValue(playerHand);
        const dealerScore = calculateHandValue(dealerHand);

        // Check if this is a valid training hand
        const isPair = playerHand[0].rank === playerHand[1].rank;
        const hasAce = playerHand.some((card) => card.rank === 'A');
        const isHardHand = !hasAce;

        // Validate hand type and ensure no blackjacks
        validHand =
          playerScore < 21 && // No player blackjacks
          dealerScore < 21 && // No dealer blackjacks
          ((isPair && gameState.trainingConfig.includePairs) ||
            (hasAce && !isPair && gameState.trainingConfig.includeSoftHands) ||
            (isHardHand && !isPair && gameState.trainingConfig.includeHardHands));

        if (!validHand) {
          // Shuffle the first four cards back into the deck
          currentDeck = shuffleDeck(currentDeck);
        }
        attempts++;
      }

      if (!validHand) {
        // If we couldn't find a valid hand, reshuffle and try again
        const newDeck = createDeck(gameState.deckCount);
        setGameState((prev) => ({
          ...prev,
          deck: newDeck,
          needsShuffle: false,
        }));
        return;
      }

      // Use the valid hand we found
      const playerHand = [currentDeck[0], currentDeck[1]];
      const dealerHand = [currentDeck[2], { ...currentDeck[3], hidden: true }];
      const playerScore = calculateHandValue(playerHand);
      const needsShuffle = currentDeck.length <= gameState.cutPosition;

      setGameState((prev) => ({
        ...prev,
        deck: currentDeck.slice(4),
        playerHands: [playerHand],
        dealerHand,
        gameStatus: 'playing',
        playerScores: [playerScore],
        dealerScore: calculateHandValue([dealerHand[0]]),
        canSplit: playerHand[0].rank === playerHand[1].rank,
        canDouble: true,
        activeHandIndex: 0,
        needsShuffle,
      }));
      return;
    }

    const currentDeck = [...gameState.deck];
    const playerHand = [currentDeck.shift()!, currentDeck.shift()!];
    const dealerHand = [currentDeck.shift()!, { ...currentDeck.shift()!, hidden: true }];
    const playerScore = calculateHandValue(playerHand);
    const needsShuffle = currentDeck.length <= gameState.cutPosition;

    // Check for player blackjack
    if (playerScore === 21) {
      // Reveal dealer's card immediately
      const fullDealerHand = dealerHand.map((card) => ({ ...card, hidden: false }));
      const dealerScore = calculateHandValue(fullDealerHand);

      // Determine if dealer also has blackjack
      const gameStatus = dealerScore === 21 ? 'push' : 'playerWon';

      // Calculate winnings (3:2 for blackjack)
      const winnings =
        dealerScore === 21
          ? gameState.currentBet // Push: return original bet
          : gameState.currentBet + Math.floor(gameState.currentBet * 1.5); // Blackjack pays 3:2

      // Update stats
      const newStats = { ...gameState.stats };
      if (gameStatus === 'playerWon') {
        newStats.wins++;
      } else {
        newStats.pushes++;
      }

      setGameState((prev) => ({
        ...prev,
        deck: currentDeck,
        playerHands: [playerHand],
        dealerHand: fullDealerHand,
        gameStatus,
        playerScores: [playerScore],
        dealerScore,
        playerMoney: prev.playerMoney - prev.currentBet + winnings,
        canSplit: false,
        canDouble: false,
        activeHandIndex: 0,
        needsShuffle,
        stats: newStats,
      }));
      return;
    }

    // Continue with normal game if no blackjack
    setGameState((prev) => ({
      ...prev,
      deck: currentDeck,
      playerHands: [playerHand],
      dealerHand,
      gameStatus: 'playing',
      playerScores: [playerScore],
      dealerScore: calculateHandValue([dealerHand[0]]),
      playerMoney: prev.playerMoney - prev.currentBet,
      canSplit: playerHand[0].rank === playerHand[1].rank,
      canDouble: true,
      activeHandIndex: 0,
      needsShuffle,
    }));
  };

  const handleDouble = () => {
    if (gameState.mode === 'training') {
      handleTrainingAction('double');
      return;
    }
    if (gameState.gameStatus !== 'playing' || !gameState.canDouble || gameState.currentBet > gameState.playerMoney)
      return;

    const newCard = gameState.deck[0];
    const currentHand = [...gameState.playerHands[gameState.activeHandIndex], newCard];
    const newScore = calculateHandValue(currentHand);

    const newPlayerHands = [...gameState.playerHands];
    newPlayerHands[gameState.activeHandIndex] = currentHand;

    const newPlayerScores = [...gameState.playerScores];
    newPlayerScores[gameState.activeHandIndex] = newScore;

    setGameState((prev) => ({
      ...prev,
      deck: prev.deck.slice(1),
      playerHands: newPlayerHands,
      playerScores: newPlayerScores,
      playerMoney: prev.playerMoney - prev.currentBet,
      currentBet: prev.currentBet * 2,
      canDouble: false,
      canSplit: false,
    }));

    handleStand();
  };

  const handleSplit = () => {
    if (gameState.mode === 'training') {
      handleTrainingAction('split');
      return;
    }
    if (gameState.gameStatus !== 'playing' || !gameState.canSplit || gameState.currentBet > gameState.playerMoney)
      return;

    const firstHand = [gameState.playerHands[0][0], gameState.deck[0]];
    const secondHand = [gameState.playerHands[0][1], gameState.deck[1]];

    setGameState((prev) => ({
      ...prev,
      deck: prev.deck.slice(2),
      playerHands: [firstHand, secondHand],
      playerScores: [calculateHandValue(firstHand), calculateHandValue(secondHand)],
      playerMoney: prev.playerMoney - prev.currentBet,
      canSplit: false,
      activeHandIndex: 0,
    }));
  };

  const handleHit = () => {
    if (gameState.mode === 'training') {
      handleTrainingAction('hit');
      return;
    }
    if (gameState.gameStatus !== 'playing') return;

    const newCard = gameState.deck[0];
    const currentHand = [...gameState.playerHands[gameState.activeHandIndex], newCard];
    const newScore = calculateHandValue(currentHand);

    const newPlayerHands = [...gameState.playerHands];
    newPlayerHands[gameState.activeHandIndex] = currentHand;

    const newPlayerScores = [...gameState.playerScores];
    newPlayerScores[gameState.activeHandIndex] = newScore;

    setGameState((prev) => ({
      ...prev,
      deck: prev.deck.slice(1),
      playerHands: newPlayerHands,
      playerScores: newPlayerScores,
      canDouble: false,
      canSplit: false,
      gameStatus: newScore > 21 ? 'playerBusted' : 'playing',
    }));
  };

  const handleStand = () => {
    if (gameState.mode === 'training') {
      handleTrainingAction('stand');
      return;
    }
    if (gameState.gameStatus !== 'playing') return;

    const nextHandIndex = gameState.activeHandIndex + 1;

    if (nextHandIndex < gameState.playerHands.length) {
      setGameState((prev) => ({
        ...prev,
        activeHandIndex: nextHandIndex,
        canDouble: true,
      }));
      return;
    }

    let newDealerHand = gameState.dealerHand.map((card) => ({ ...card, hidden: false }));
    let newDeck = [...gameState.deck];
    let dealerScore = calculateHandValue(newDealerHand);

    const isSoft17 = (hand: Card[]): boolean => {
      const hasAce = hand.some((card) => card.rank === 'A');
      const score = calculateHandValue(hand);
      return hasAce && score === 17 && hand.some((card) => card.rank === 'A' && !card.hidden);
    };

    while (dealerScore < 17 || (dealerScore === 17 && isSoft17(newDealerHand))) {
      const newCard = { ...newDeck[0], hidden: false };
      newDealerHand = [...newDealerHand, newCard];
      newDeck = newDeck.slice(1);
      dealerScore = calculateHandValue(newDealerHand);
    }

    const results = gameState.playerScores.map((score) => {
      if (score > 21) return 'playerBusted';
      if (dealerScore > 21) return 'dealerBusted';
      if (score > dealerScore) return 'playerWon';
      if (score < dealerScore) return 'dealerWon';
      return 'push';
    });

    const newStats = { ...gameState.stats };
    results.forEach((result) => {
      if (result === 'playerWon' || result === 'dealerBusted') newStats.wins++;
      else if (result === 'dealerWon' || result === 'playerBusted') newStats.losses++;
      else if (result === 'push') newStats.pushes++;
    });

    const totalWinnings = results.reduce((total, result, index) => {
      if (result === 'playerWon' || result === 'dealerBusted') {
        return total + gameState.currentBet + Math.floor(gameState.currentBet * 1.5);
      }
      if (result === 'push') {
        return total + gameState.currentBet;
      }
      return total;
    }, 0);

    setGameState((prev) => ({
      ...prev,
      dealerHand: newDealerHand,
      deck: newDeck,
      dealerScore,
      gameStatus: results[0],
      playerMoney: prev.playerMoney + totalWinnings,
      stats: newStats,
    }));
  };

  const handleBetChange = (amount: number) => {
    if (gameState.gameStatus !== 'betting') return;

    setGameState((prev) => ({
      ...prev,
      currentBet: Math.max(0, Math.min(prev.playerMoney, prev.currentBet + amount)),
    }));
  };

  const handleNewGame = () => {
    setGameState((prev) => ({
      ...prev,
      deck: [],
      playerHands: [[]],
      activeHandIndex: 0,
      dealerHand: [],
      gameStatus: 'betting',
      playerScores: [0],
      dealerScore: 0,
      currentBet: 10,
      canSplit: false,
      canDouble: false,
    }));
  };

  const handleResetMoney = () => {
    setGameState((prev) => ({
      ...prev,
      playerMoney: 1000,
    }));
  };

  const handleResetStats = () => {
    setGameState((prev) => ({
      ...prev,
      stats: { wins: 0, losses: 0, pushes: 0, training: { correct: 0, incorrect: 0 } },
    }));
  };

  const handleBetInput = (e: BetInputEvent) => {
    if (gameState.gameStatus !== 'betting') return;

    const value = parseInt(e.target.value) || 0;
    const newBet = Math.max(0, Math.min(gameState.playerMoney, value));

    setGameState((prev) => ({
      ...prev,
      currentBet: newBet,
    }));
  };

  const handleDealNow = () => {
    if (gameState.gameStatus === 'betting' || gameState.gameStatus === 'playing') return;
    if (gameState.playerMoney < gameState.currentBet) return;
    handleStartGame();
  };

  const handleDeckCountChange = (count: number) => {
    if (gameState.gameStatus !== 'betting') return;

    const newDeck = createDeck(count);
    const totalCards = 52 * count;
    const newCutPosition = Math.floor(
      totalCards * (MIN_CUT_POSITION + Math.random() * (MAX_CUT_POSITION - MIN_CUT_POSITION))
    );

    setGameState((prev) => ({
      ...prev,
      deck: newDeck,
      deckCount: count,
      cutPosition: newCutPosition,
      needsShuffle: false,
    }));
  };

  const handleTrainingAction = (action: GameAction) => {
    const optimalPlay = getOptimalPlay(gameState.playerHands[gameState.activeHandIndex], gameState.dealerHand[0]);

    const isCorrect = action === optimalPlay;
    const newStats = {
      ...gameState.stats,
      training: {
        correct: gameState.stats.training.correct + (isCorrect ? 1 : 0),
        incorrect: gameState.stats.training.incorrect + (isCorrect ? 0 : 1),
      },
    };

    setGameState((prev) => ({
      ...prev,
      gameStatus: isCorrect ? 'training_correct' : 'training_incorrect',
      stats: newStats,
    }));

    // Auto-deal next hand after showing result
    setTimeout(handleStartGame, 2000);
  };

  const handleModeChange = (newMode: GameMode) => {
    if (gameState.gameStatus !== 'betting') return;

    setGameState((prev) => ({
      ...prev,
      mode: newMode,
    }));
  };

  const handleTrainingConfigChange = (config: TrainingConfig) => {
    if (gameState.gameStatus !== 'betting') return;

    // Ensure at least one option is selected
    if (!config.includePairs && !config.includeSoftHands && !config.includeHardHands) {
      return;
    }

    setGameState((prev) => ({
      ...prev,
      trainingConfig: config,
    }));
  };

  return {
    gameState,
    handlers: {
      handleStartGame,
      handleDouble,
      handleSplit,
      handleHit,
      handleStand,
      handleBetChange,
      handleNewGame,
      handleResetMoney,
      handleResetStats,
      handleBetInput,
      handleDealNow,
      handleDeckCountChange,
      handleTrainingAction,
      handleModeChange,
      handleTrainingConfigChange,
    },
  };
};
