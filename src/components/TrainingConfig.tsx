import { TrainingConfig } from '../types/game';

type TrainingConfigProps = {
  config: TrainingConfig;
  onConfigChange: (config: TrainingConfig) => void;
  disabled: boolean;
};

export const TrainingConfigOptions = ({ config, onConfigChange, disabled }: TrainingConfigProps) => {
  const handleToggle = (field: keyof TrainingConfig) => {
    onConfigChange({
      ...config,
      [field]: !config[field],
    });
  };

  return (
    <div className="flex gap-4 items-center">
      <label className="text-white text-sm">Training:</label>
      <div className="flex gap-2">
        <button
          onClick={() => handleToggle('includePairs')}
          disabled={disabled}
          className={`px-2 py-1 rounded text-sm ${
            config.includePairs
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Pairs
        </button>
        <button
          onClick={() => handleToggle('includeSoftHands')}
          disabled={disabled}
          className={`px-2 py-1 rounded text-sm ${
            config.includeSoftHands
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Soft Hands
        </button>
        <button
          onClick={() => handleToggle('includeHardHands')}
          disabled={disabled}
          className={`px-2 py-1 rounded text-sm ${
            config.includeHardHands
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Hard Hands
        </button>
      </div>
    </div>
  );
};
