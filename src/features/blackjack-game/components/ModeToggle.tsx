type ModeToggleProps = {
  mode: 'standard' | 'training';
  onModeChange: (mode: 'standard' | 'training') => void;
  disabled: boolean;
};

export const ModeToggle = ({ mode, onModeChange, disabled }: ModeToggleProps) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-white text-sm">Mode:</label>
      <select
        value={mode}
        onChange={(e) => onModeChange(e.target.value as 'standard' | 'training')}
        disabled={disabled}
        className="bg-white rounded px-2 py-1 text-sm"
      >
        <option value="standard">Standard Play</option>
        <option value="training">Training Mode</option>
      </select>
    </div>
  );
};
