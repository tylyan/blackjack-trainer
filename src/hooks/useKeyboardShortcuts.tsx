import { useEffect } from 'react';
import { GameState, GameHandlers } from '@/types/game';

export const useKeyboardShortcuts = ({ gameState, handlers }: { gameState: GameState; handlers: GameHandlers }) => {
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
};
