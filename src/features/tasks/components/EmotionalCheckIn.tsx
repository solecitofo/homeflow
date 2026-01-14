import React from 'react';
import { motion } from 'framer-motion';

export type MoodLevel = 1 | 2 | 3 | 4 | 5;

interface MoodOption {
  value: MoodLevel;
  emoji: string;
  label: string;
}

const moodOptions: MoodOption[] = [
  { value: 1, emoji: '😣', label: 'Muy mal' },
  { value: 2, emoji: '😔', label: 'Mal' },
  { value: 3, emoji: '😐', label: 'Normal' },
  { value: 4, emoji: '😊', label: 'Bien' },
  { value: 5, emoji: '😄', label: 'Muy bien' },
];

interface EmotionalCheckInProps {
  title: string;
  selected: MoodLevel | null;
  onSelect: (mood: MoodLevel) => void;
  disabled?: boolean;
}

export const EmotionalCheckIn: React.FC<EmotionalCheckInProps> = ({
  title,
  selected,
  onSelect,
  disabled = false,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <div className="flex justify-between gap-2">
        {moodOptions.map((option) => (
          <motion.button
            key={option.value}
            whileTap={!disabled ? { scale: 0.9 } : {}}
            whileHover={!disabled ? { scale: 1.05 } : {}}
            onClick={() => !disabled && onSelect(option.value)}
            disabled={disabled}
            className={`
              flex-1 flex flex-col items-center gap-2 p-3 rounded-xl
              border-2 transition-all duration-200
              ${
                selected === option.value
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-primary-300'
              }
              ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            `}
          >
            <motion.span
              className="text-3xl"
              animate={
                selected === option.value
                  ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }
                  : {}
              }
              transition={{ duration: 0.3 }}
            >
              {option.emoji}
            </motion.span>
            <span
              className={`
              text-xs font-medium text-center
              ${selected === option.value ? 'text-primary-700' : 'text-gray-600'}
            `}
            >
              {option.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
