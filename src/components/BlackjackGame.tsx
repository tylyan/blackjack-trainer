'use client';
import { useState, useEffect } from 'react';
import { GameState, Card } from '../types/game';
import { createDeck, calculateHandValue } from '../utils/deck';

const STORAGE_KEY = 'blackjack_player_money';
const STATS_KEY = 'blackjack_stats';
const AUTO_DEAL_DELAY = 5000; // 5 seconds delay

type BetInputEvent = React.ChangeEvent<HTMLInputElement>;

const BlackjackGame = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedMoney = localStorage.getItem(STORAGE_KEY);
    const savedStats = localStorage.getItem(STATS_KEY);
    const initialMoney = savedMoney ? parseInt(savedMoney) : 1000;
    const initialStats = savedStats ? JSON.parse(savedStats) : { wins: 0, losses: 0, pushes: 0 };

    return {
      deck: [],
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

  const handleStartGame = () => {
    if (gameState.currentBet <= 0 || gameState.currentBet > gameState.playerMoney) return;

    const newDeck = createDeck();
    const playerHand = [newDeck[0], newDeck[1]];
    const dealerHand = [newDeck[2], { ...newDeck[3], hidden: true }];

    const canSplit = playerHand[0].rank === playerHand[1].rank;
    const canDouble = true;

    setGameState((prev) => ({
      ...prev,
      deck: newDeck.slice(4),
      playerHands: [playerHand],
      dealerHand,
      gameStatus: 'playing',
      playerScores: [calculateHandValue(playerHand)],
      dealerScore: calculateHandValue([dealerHand[0]]),
      playerMoney: prev.playerMoney - prev.currentBet,
      canSplit,
      canDouble,
      activeHandIndex: 0,
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

  return (
    <div className="min-h-screen bg-green-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Blackjack</h1>
          <div className="flex justify-center items-center gap-8 mb-4">
            <p className="text-xl">Money: ${gameState.playerMoney}</p>
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

        <div className="mb-8">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-white text-2xl">Dealer's Hand</h2>
              <span className="bg-white text-black px-3 py-1 rounded-full font-bold text-xl flex items-center gap-2">
                {gameState.dealerScore}
                {gameState.dealerHand.some((card) => card.hidden) && (
                  <>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-400">{gameState.dealerScore + 10}</span>
                  </>
                )}
              </span>
            </div>
            <div className="flex gap-4">
              {gameState.dealerHand.map((card, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg p-4 w-24 h-36 flex items-center justify-center text-2xl
                    ${
                      card.hidden
                        ? 'bg-gray-300'
                        : card.suit === '♥' || card.suit === '♦'
                        ? 'text-red-600'
                        : 'text-black'
                    }`}
                >
                  {card.hidden ? '?' : `${card.rank}${card.suit}`}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            {gameState.playerHands.map((hand, handIndex) => (
              <div
                key={handIndex}
                className={`mb-4 ${
                  handIndex === gameState.activeHandIndex ? 'ring-2 ring-yellow-400 rounded-lg p-2' : ''
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-white text-2xl">
                    {gameState.playerHands.length > 1 ? `Hand ${handIndex + 1}` : 'Your Hand'}
                  </h2>
                  <span className="bg-white text-black px-3 py-1 rounded-full font-bold text-xl">
                    {gameState.playerScores[handIndex]}
                  </span>
                </div>
                <div className="flex gap-4">
                  {hand.map((card, cardIndex) => (
                    <div
                      key={cardIndex}
                      className={`bg-white rounded-lg p-4 w-24 h-36 flex items-center justify-center text-2xl
                        ${card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'}`}
                    >
                      {`${card.rank}${card.suit}`}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4">
          {gameState.gameStatus === 'betting' ? (
            <>
              <button
                onClick={() => handleBetChange(-10)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                -10
              </button>
              <div className="flex items-center gap-2">
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
                Hit
              </button>
              <button onClick={handleStand} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                Stand
              </button>
              {gameState.canDouble && (
                <button
                  onClick={handleDouble}
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                  disabled={gameState.currentBet > gameState.playerMoney}
                >
                  Double
                </button>
              )}
              {gameState.canSplit && (
                <button
                  onClick={handleSplit}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  disabled={gameState.currentBet > gameState.playerMoney}
                >
                  Split
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
          <div className="mt-4 text-center">
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
                Deal Now
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlackjackGame;
