import React from 'react';
import { Sun, Cloud, CloudRain, CloudLightning } from 'lucide-react';
import { WeatherCondition } from '../types';

interface WeatherSelectorProps {
  label: string;
  selected: WeatherCondition | null;
  onSelect: (condition: WeatherCondition) => void;
}

const WeatherSelector: React.FC<WeatherSelectorProps> = ({ label, selected, onSelect }) => {
  const options: { value: WeatherCondition; icon: React.ReactNode; label: string }[] = [
    { value: 'ensolarado', icon: <Sun className="w-5 h-5" />, label: 'Sol' },
    { value: 'nublado', icon: <Cloud className="w-5 h-5" />, label: 'Nublado' },
    { value: 'chuvoso', icon: <CloudRain className="w-5 h-5" />, label: 'Chuva' },
    { value: 'tempestade', icon: <CloudLightning className="w-5 h-5" />, label: 'Tempestade' },
  ];

  return (
    <div className="flex flex-col items-center border-r border-gray-300 last:border-r-0 px-4 py-2 w-full">
      <span className="text-xs font-bold uppercase text-gray-500 mb-2">{label}</span>
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            title={option.label}
            className={`p-2 rounded-full transition-all duration-200 border ${
              selected === option.value
                ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-110'
                : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            {option.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WeatherSelector;
