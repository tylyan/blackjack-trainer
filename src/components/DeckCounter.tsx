type DeckCounterProps = {
  cardsRemaining: number;
  totalCards: number;
  cutPosition: number;
  needsShuffle: boolean;
};

export const DeckCounter = ({ cardsRemaining, totalCards, cutPosition, needsShuffle }: DeckCounterProps) => {
  const percentage = (cardsRemaining / totalCards) * 100;
  const cutPercentage = (cutPosition / totalCards) * 100;

  return (
    <div className="absolute top-4 right-4 flex flex-col items-end">
      <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden mb-1 relative">
        <div
          className={`h-full transition-all duration-300 ease-out ${needsShuffle ? 'bg-red-400' : 'bg-white'}`}
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute top-0 bottom-0 w-0.5 bg-yellow-400" style={{ left: `${cutPercentage}%` }} />
      </div>
      <span className="text-white text-sm">
        {cardsRemaining} / {totalCards} cards
        {needsShuffle && ' (Shuffle needed)'}
      </span>
    </div>
  );
};
