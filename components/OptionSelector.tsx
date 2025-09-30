import React from 'react';
import type { Option } from '../types';

interface OptionSelectorProps {
  options: Option[];
  selectedOption: Option | null;
  onSelect: (option: Option) => void;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({ options, selectedOption, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option)}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ease-in-out border
            ${selectedOption?.value === option.value
              ? 'bg-indigo-600 text-white border-transparent shadow-sm'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
            }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default OptionSelector;