type DeckSettingsProps = {
  deckCount: number;
  onDeckCountChange: (count: number) => void;
  disabled: boolean;
};

export const DeckSettings = ({ deckCount, onDeckCountChange, disabled }: DeckSettingsProps) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-white text-sm">Decks:</label>
      <select
        value={deckCount}
        onChange={(e) => onDeckCountChange(parseInt(e.target.value))}
        disabled={disabled}
        className="bg-white rounded px-2 py-1 text-sm"
      >
        {[1, 2, 4, 6, 8].map((count) => (
          <option key={count} value={count}>
            {count}
          </option>
        ))}
      </select>
    </div>
  );
};
