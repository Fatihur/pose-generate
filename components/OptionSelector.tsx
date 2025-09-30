
import React from 'react';
import type { Option } from '../types';

interface OptionSelectorProps {
  options: Option[];
  selectedOption: Option | null;
  onSelect: (option: Option) => void;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({ options, selectedOption, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option)}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ease-in-out
            ${selectedOption?.value === option.value
              ? 'bg-indigo-500 text-white shadow-md'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default OptionSelector;
