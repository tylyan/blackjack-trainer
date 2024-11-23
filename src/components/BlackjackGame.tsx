'use client';

import { useEffect } from 'react';
import { Hand } from './Hand';
import { DeckCounter } from './DeckCounter';
import { ChipIcon } from './ChipIcon';
import { DeckSettings } from './DeckSettings';
import { getOptimalPlay } from '../utils/strategy';
import { ModeToggle } from './ModeToggle';
import { TrainingConfigOptions } from './TrainingConfig';
import { useBlackjackGame } from '@/hooks/useBlackjackGame';

const BlackjackGame = () => {
  const { gameState, handlers } = useBlackjackGame();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === ' ') {
        event.preventDefault();
      }

      if (gameState.gameStatus === 'playing') {
        switch (event.key.toLowerCase()) {
          case ' ': // Spacebar
            handlers.handleHit();
            break;
          case 'escape':
            handlers.handleStand();
            break;
          case 'd':
            if (gameState.canDouble) {
              handlers.handleDouble();
            }
            break;
          case 's':
            if (gameState.canSplit) {
              handlers.handleSplit();
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
        handlers.handleDealNow();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState]);

  const getTrainingFeedback = () => {
    if (gameState.gameStatus === 'training_correct') {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-green-600 text-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-4xl font-bold mb-4">Correct Play!</div>
            <div className="text-xl">
              {getOptimalPlay(gameState.playerHands[gameState.activeHandIndex], gameState.dealerHand[0])} was the right
              move
            </div>
            <div className="text-lg mt-4 text-green-200">Next hand in 2 seconds...</div>
          </div>
        </div>
      );
    }

    if (gameState.gameStatus === 'training_incorrect') {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-red-600 text-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-4xl font-bold mb-4">Incorrect Play</div>
            <div className="text-xl">
              You should have chosen:{' '}
              {getOptimalPlay(gameState.playerHands[gameState.activeHandIndex], gameState.dealerHand[0])}
            </div>
            <div className="text-lg mt-4 text-red-200">Next hand in 2 seconds...</div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="h-screen bg-green-800 p-4">
      <div className="max-w-3xl mx-auto flex flex-col h-full relative">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-4">
            <DeckSettings
              deckCount={gameState.deckCount}
              onDeckCountChange={handlers.handleDeckCountChange}
              disabled={gameState.gameStatus !== 'betting'}
            />
            <ModeToggle
              mode={gameState.mode}
              onModeChange={handlers.handleModeChange}
              disabled={gameState.gameStatus !== 'betting'}
            />
            {gameState.mode === 'training' && (
              <TrainingConfigOptions
                config={gameState.trainingConfig}
                onConfigChange={handlers.handleTrainingConfigChange}
                disabled={gameState.gameStatus !== 'betting'}
              />
            )}
          </div>
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
            {gameState.mode === 'standard' ? (
              <>
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
              </>
            ) : (
              <div className="flex gap-8 text-lg">
                <span className="text-green-300">Correct Plays: {gameState.stats.training.correct}</span>
                <span className="text-red-300">Incorrect Plays: {gameState.stats.training.incorrect}</span>
                <span className="text-gray-300">
                  Accuracy:{' '}
                  {Math.round(
                    (gameState.stats.training.correct /
                      Math.max(1, gameState.stats.training.correct + gameState.stats.training.incorrect)) *
                      100
                  )}
                  %
                </span>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-2">
            {gameState.mode === 'standard' && (
              <button
                onClick={handlers.handleResetMoney}
                className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
              >
                Reset Money
              </button>
            )}
            <button
              onClick={handlers.handleResetStats}
              className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
            >
              Reset Stats
            </button>
          </div>
        </div>

        <div className="flex-grow flex flex-col justify-center mb-4">
          <div className="mb-4">
            <div className="mb-8">
              <Hand
                title="Dealer's Hand"
                score={gameState.dealerHand[0]?.rank === 'A' ? 'A' : gameState.dealerScore}
                cards={gameState.dealerHand}
              />
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
                onClick={() => handlers.handleBetChange(-10)}
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
                  onChange={handlers.handleBetInput}
                  className="w-24 px-2 py-1 rounded text-center"
                  min="0"
                  max={gameState.playerMoney}
                />
                <button
                  onClick={handlers.handleStartGame}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2"
                  disabled={gameState.currentBet <= 0}
                >
                  Update Bet
                </button>
              </div>
              <button
                onClick={() => handlers.handleBetChange(10)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                +10
              </button>
            </>
          ) : gameState.gameStatus === 'playing' ? (
            <>
              <button
                onClick={handlers.handleHit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Hit (Space)
              </button>
              <button
                onClick={handlers.handleStand}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Stand (Esc)
              </button>
              {gameState.canDouble && (
                <button
                  onClick={handlers.handleDouble}
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                  disabled={gameState.currentBet > gameState.playerMoney}
                >
                  Double (D)
                </button>
              )}
              {gameState.canSplit && (
                <button
                  onClick={handlers.handleSplit}
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
              <button
                onClick={handlers.handleDealNow}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Deal Now (Space)
              </button>
            )}
          </div>
        )}

        {gameState.mode === 'training' && getTrainingFeedback()}
      </div>
    </div>
  );
};

export default BlackjackGame;
