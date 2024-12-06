import { GameState, GameHandlers } from '@/types/game';
import { ChipIcon } from './ChipIcon';

export const GameHeader = ({ gameState, handlers }: { gameState: GameState; handlers: GameHandlers }) => {
  return (
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
  );
};
