import { GameState, GameHandlers } from '@/types/game';
import { ChipIcon } from './ChipIcon';

export const ControlBar = ({ gameState, handlers }: { gameState: GameState; handlers: GameHandlers }) => {
  return (
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
          <button onClick={handlers.handleHit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
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
  );
};
