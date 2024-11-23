import { GameState } from '@/types/game';
import { Hand } from './Hand';

export const TableHands = ({ gameState }: { gameState: GameState }) => {
  return (
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
  );
};
