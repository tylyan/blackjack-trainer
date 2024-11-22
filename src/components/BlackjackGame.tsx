'use client';
import { useState, useEffect } from 'react';
import { GameState, Card } from '../types/game';
import { createDeck, calculateHandValue } from '../utils/deck';
import { Hand } from './Hand';
import { DeckCounter } from './DeckCounter';
import { ChipIcon } from './ChipIcon';
import { DeckSettings } from './DeckSettings';

const STORAGE_KEY = 'blackjack_player_money';
const STATS_KEY = 'blackjack_stats';
const AUTO_DEAL_DELAY = 5000; // 5 seconds delay
const MIN_CUT_POSITION = 0.3; // Cut card must be at least 30% from the end
const MAX_CUT_POSITION = 0.7; // Cut card can't be more than 70% from the end

type BetInputEvent = React.ChangeEvent<HTMLInputElement>;

const BlackjackGame = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedMoney = localStorage.getItem(STORAGE_KEY);
    const savedStats = localStorage.getItem(STATS_KEY);
    const initialMoney = savedMoney ? parseInt(savedMoney) : 1000;
    const initialStats = savedStats ? JSON.parse(savedStats) : { wins: 0, losses: 0, pushes: 0 };
    const deckCount = 6; // Default to 6 decks
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

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === ' ') {
        event.preventDefault();
      }

      if (gameState.gameStatus === 'playing') {
        switch (event.key.toLowerCase()) {
          case ' ': // Spacebar
            handleHit();
            break;
          case 'escape':
            handleStand();
            break;
          case 'd':
            if (gameState.canDouble) {
              handleDouble();
            }
            break;
          case 's':
            if (gameState.canSplit) {
              handleSplit();
            }
            break;
        }
      } else if (
        (gameState.gameStatus === 'playerBusted' ||
          gameState.gameStatus === 'dealerBusted' ||
          gameState.gameStatus === 'playerWon' ||
          gameState.gameStatus === 'dealerWon' ||
          gameState.gameStatus === 'push') &&
        gameState.playerMoney >= gameState.currentBet &&
        event.key === ' '
      ) {
        handleDealNow();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState]);

  const handleStartGame = () => {
    if (gameState.currentBet <= 0 || gameState.currentBet > gameState.playerMoney) return;

    if (gameState.needsShuffle || gameState.deck.length < 15) {
      // 15 cards minimum for safety
      const newDeck = createDeck();
      const newCutPosition = Math.floor(
        TOTAL_CARDS * (MIN_CUT_POSITION + Math.random() * (MAX_CUT_POSITION - MIN_CUT_POSITION))
      );

      setGameState((prev) => ({
        ...prev,
        deck: newDeck,
        cutPosition: newCutPosition,
        needsShuffle: false,
      }));
      return;
    }

    const currentDeck = [...gameState.deck];
    const playerHand = [currentDeck.shift()!, currentDeck.shift()!];
    const dealerHand = [currentDeck.shift()!, { ...currentDeck.shift()!, hidden: true }];

    const needsShuffle = currentDeck.length <= gameState.cutPosition;

    setGameState((prev) => ({
      ...prev,
      deck: currentDeck,
      playerHands: [playerHand],
      dealerHand,
      gameStatus: 'playing',
      playerScores: [calculateHandValue(playerHand)],
      dealerScore: calculateHandValue([dealerHand[0]]),
      playerMoney: prev.playerMoney - prev.currentBet,
      canSplit: playerHand[0].rank === playerHand[1].rank,
      canDouble: true,
      activeHandIndex: 0,
      needsShuffle,
    }));
  };

  const handleDouble = () => {
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
      stats: { wins: 0, losses: 0, pushes: 0 },
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

  return (
    <div className="h-screen bg-green-800 p-4">
      <div className="max-w-3xl mx-auto flex flex-col h-full relative">
        <div className="flex justify-between items-start mb-4">
          <DeckSettings
            deckCount={gameState.deckCount}
            onDeckCountChange={handleDeckCountChange}
            disabled={gameState.gameStatus !== 'betting'}
          />
          <DeckCounter
            cardsRemaining={gameState.deck.length}
            totalCards={52 * gameState.deckCount}
            cutPosition={gameState.cutPosition}
            needsShuffle={gameState.needsShuffle}
          />
        </div>

        <div className="mb-4 text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Blackjack</h1>
          <div className="flex justify-center items-center gap-8 mb-4">
            <p className="text-xl">Money: ${gameState.playerMoney}</p>
            <div className="flex items-center gap-2">
              <ChipIcon />
              <p className="text-xl">Current Bet: ${gameState.currentBet}</p>
            </div>
            <div className="flex gap-4 text-lg">
              <span className="text-green-300">Wins: {gameState.stats.wins}</span>
              <span className="text-red-300">Losses: {gameState.stats.losses}</span>
              <span className="text-gray-300">Pushes: {gameState.stats.pushes}</span>
            </div>
          </div>
          <div className="flex justify-center gap-2">
            <button
              onClick={handleResetMoney}
              className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
            >
              Reset Money
            </button>
            <button
              onClick={handleResetStats}
              className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
            >
              Reset Stats
            </button>
          </div>
        </div>

        <div className="flex-grow flex flex-col justify-center mb-4">
          <div className="mb-4">
            <div className="mb-8">
              <Hand title="Dealer's Hand" score={gameState.dealerScore} cards={gameState.dealerHand} />
            </div>

            <div>
              {gameState.playerHands.map((hand, handIndex) => (
                <Hand
                  key={handIndex}
                  title={gameState.playerHands.length > 1 ? `Hand ${handIndex + 1}` : 'Your Hand'}
                  score={gameState.playerScores[handIndex]}
                  cards={hand}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-2">
          {gameState.gameStatus === 'betting' ? (
            <>
              <button
                onClick={() => handleBetChange(-10)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                -10
              </button>
              <div className="flex items-center gap-2">
                <ChipIcon />
                <span className="text-white">Bet: $</span>
                <input
                  type="number"
                  value={gameState.currentBet}
                  onChange={handleBetInput}
                  className="w-24 px-2 py-1 rounded text-center"
                  min="0"
                  max={gameState.playerMoney}
                />
                <button
                  onClick={() => handleStartGame()}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2"
                  disabled={gameState.currentBet <= 0}
                >
                  Update Bet
                </button>
              </div>
              <button
                onClick={() => handleBetChange(10)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                +10
              </button>
            </>
          ) : gameState.gameStatus === 'playing' ? (
            <>
              <button onClick={handleHit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Hit (Space)
              </button>
              <button onClick={handleStand} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                Stand (Esc)
              </button>
              {gameState.canDouble && (
                <button
                  onClick={handleDouble}
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                  disabled={gameState.currentBet > gameState.playerMoney}
                >
                  Double (D)
                </button>
              )}
              {gameState.canSplit && (
                <button
                  onClick={handleSplit}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  disabled={gameState.currentBet > gameState.playerMoney}
                >
                  Split (S)
                </button>
              )}
            </>
          ) : (
            <div className="text-white text-xl">
              {gameState.playerMoney >= gameState.currentBet
                ? 'Next hand in 5 seconds...'
                : 'Not enough money to continue. Reset money to play again.'}
            </div>
          )}
        </div>

        {gameState.gameStatus !== 'betting' && gameState.gameStatus !== 'playing' && (
          <div className="mt-2 text-center">
            <div className="text-white text-2xl mb-2">
              {gameState.gameStatus === 'playerBusted' && 'Bust! You lose!'}
              {gameState.gameStatus === 'dealerBusted' && 'Dealer busts! You win!'}
              {gameState.gameStatus === 'playerWon' && 'You win!'}
              {gameState.gameStatus === 'dealerWon' && 'Dealer wins!'}
              {gameState.gameStatus === 'push' && 'Push!'}
            </div>
            <div className="text-gray-300 text-lg mb-4">
              {gameState.playerMoney >= gameState.currentBet
                ? 'Next hand in 5 seconds...'
                : 'Not enough money to continue. Reset money to play again.'}
            </div>
            {gameState.playerMoney >= gameState.currentBet && (
              <button onClick={handleDealNow} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Deal Now (Space)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlackjackGame;
