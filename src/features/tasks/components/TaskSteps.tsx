import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface TaskStep {
  id: string;
  description: string;
  completed: boolean;
}

interface TaskStepsProps {
  steps: TaskStep[];
  onToggleStep: (stepId: string) => void;
  disabled?: boolean;
}

export const TaskSteps: React.FC<TaskStepsProps> = ({
  steps,
  onToggleStep,
  disabled = false,
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Pasos a seguir:
      </h3>
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-start gap-3"
        >
          <button
            onClick={() => !disabled && onToggleStep(step.id)}
            disabled={disabled}
            className={`
              flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center
              transition-all duration-200 mt-0.5
              ${
                step.completed
                  ? 'bg-primary-500 border-primary-500'
                  : 'border-gray-300 hover:border-primary-400'
              }
              ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            `}
          >
            <AnimatePresence>
              {step.completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          <p
            className={`
              flex-1 text-sm leading-relaxed transition-all duration-200
              ${
                step.completed
                  ? 'text-gray-500 line-through'
                  : 'text-gray-700'
              }
            `}
          >
            {step.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
};
