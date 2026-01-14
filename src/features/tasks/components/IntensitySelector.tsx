import React from 'react';
import { motion } from 'framer-motion';

export type IntensityLevel = 'basic' | 'standard' | 'deep';

interface IntensityOption {
  value: IntensityLevel;
  label: string;
  description: string;
  icon: string;
}

const intensityOptions: IntensityOption[] = [
  {
    value: 'basic',
    label: 'Básico',
    description: 'Lo mínimo para mantener el orden',
    icon: '🌱',
  },
  {
    value: 'standard',
    label: 'Estándar',
    description: 'Limpieza completa recomendada',
    icon: '⭐',
  },
  {
    value: 'deep',
    label: 'Profundo',
    description: 'Limpieza exhaustiva y detallada',
    icon: '✨',
  },
];

interface IntensitySelectorProps {
  selected: IntensityLevel;
  onSelect: (intensity: IntensityLevel) => void;
  disabled?: boolean;
}

export const IntensitySelector: React.FC<IntensitySelectorProps> = ({
  selected,
  onSelect,
  disabled = false,
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Nivel de intensidad:
      </h3>
      <div className="space-y-2">
        {intensityOptions.map((option) => (
          <motion.button
            key={option.value}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            onClick={() => !disabled && onSelect(option.value)}
            disabled={disabled}
            className={`
              w-full p-4 rounded-xl border-2 text-left
              transition-all duration-200
              ${
                selected === option.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-primary-300'
              }
              ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-start gap-3">
              <div
                className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                transition-all duration-200
                ${
                  selected === option.value
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300'
                }
              `}
              >
                {selected === option.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2.5 h-2.5 rounded-full bg-white"
                  />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{option.icon}</span>
                  <span className="font-semibold text-gray-800">
                    {option.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
