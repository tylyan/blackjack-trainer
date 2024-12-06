import { GameState, GameHandlers } from '@/types/game';
import { getOptimalPlay } from '@/utils/strategy';

const getTrainingFeedback = (gameState: GameState) => {
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

export const HandFeedback = ({ gameState, handlers }: { gameState: GameState; handlers: GameHandlers }) => {
  return (
    <>
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

      {gameState.mode === 'training' && getTrainingFeedback(gameState)}
    </>
  );
};
