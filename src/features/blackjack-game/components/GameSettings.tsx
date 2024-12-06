import { GameHandlers, GameState } from '@/types/game';
import { DeckCounter } from './DeckCounter';
import { DeckSettings } from './DeckSettings';
import { ModeToggle } from './ModeToggle';
import { TrainingConfigOptions } from './TrainingConfig';

interface GameSettingsProps {
  gameState: GameState;
  handlers: GameHandlers;
}

export const GameSettings = ({ gameState, handlers }: GameSettingsProps) => {
  return (
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
  );
};
