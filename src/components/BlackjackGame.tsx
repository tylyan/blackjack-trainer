'use client';

import { useBlackjackGame } from '@/hooks/useBlackjackGame';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { GameSettings } from './GameSettings';
import { GameHeader } from './GameHeader';
import { TableHands } from './TableHands';
import { HandFeedback } from './HandFeedback';
import { ControlBar } from './ControlBar';

const BlackjackGame = () => {
  const { gameState, handlers } = useBlackjackGame();
  useKeyboardShortcuts({ gameState, handlers });

  return (
    <div className="h-screen bg-green-800 p-4">
      <div className="max-w-3xl mx-auto flex flex-col h-full relative">
        <GameSettings gameState={gameState} handlers={handlers} />
        <GameHeader gameState={gameState} handlers={handlers} />
        <TableHands gameState={gameState} />
        <ControlBar gameState={gameState} handlers={handlers} />
        <HandFeedback gameState={gameState} handlers={handlers} />
      </div>
    </div>
  );
};

export default BlackjackGame;
