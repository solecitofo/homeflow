import React from 'react';
import { motion } from 'framer-motion';

export type IntensityLevel = 'basic' | 'standard' | 'deep';

interface IntensityOption {
  value: IntensityLevel;
  label: string;
  badge: string;
  badgeColor: string;
  description: string;
  timeMinutes?: number;
}

interface IntensitySelectorProps {
  selected: IntensityLevel;
  onSelect: (intensity: IntensityLevel) => void;
  disabled?: boolean;
  taskName?: string;
  intensityTimes?: { basic: number; standard: number; deep: number };
}

export const IntensitySelector: React.FC<IntensitySelectorProps> = ({
  selected,
  onSelect,
  disabled = false,
  taskName = 'esta tarea',
  intensityTimes = { basic: 5, standard: 15, deep: 30 },
}) => {
  const intensityOptions: IntensityOption[] = [
    {
      value: 'basic',
      label: 'BÁSICO',
      badge: '🟢',
      badgeColor: 'bg-green-100 text-green-800',
      description: 'Lo mínimo para mantener',
      timeMinutes: intensityTimes.basic,
    },
    {
      value: 'standard',
      label: 'ESTÁNDAR',
      badge: '🟡',
      badgeColor: 'bg-yellow-100 text-yellow-800',
      description: 'Limpieza completa recomendada',
      timeMinutes: intensityTimes.standard,
    },
    {
      value: 'deep',
      label: 'PROFUNDO',
      badge: '🔴',
      badgeColor: 'bg-red-100 text-red-800',
      description: 'Limpieza exhaustiva y detallada',
      timeMinutes: intensityTimes.deep,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Mensaje motivacional - Wireframe Pantalla 8 */}
      <div className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-r-lg mb-6">
        <p className="text-primary-800">
          Recuerda: <strong>Hecho es mejor que perfecto</strong>. 
          Elige el nivel que te parezca manejable hoy.
        </p>
      </div>

      <div className="space-y-3">
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
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-primary-300'
              }
              ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${option.badgeColor}`}
                >
                  {option.badge} {option.label}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {option.timeMinutes} minutos
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2 ml-1">
              {option.description}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
