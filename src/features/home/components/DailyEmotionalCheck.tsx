import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';
import { useAppStore } from '../../../../store';
import type { EmotionalState } from '../../../db/database';

interface EmotionalOptionProps {
  icon: string;
  title: string;
  subtitle: string;
  state: EmotionalState;
  selected: boolean;
  onSelect: (state: EmotionalState) => void;
  delay: number;
}

const EmotionalOption: React.FC<EmotionalOptionProps> = ({
  icon,
  title,
  subtitle,
  state,
  selected,
  onSelect,
  delay,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={() => onSelect(state)}
      className={`
        bg-white border-2 rounded-2xl p-6 cursor-pointer
        transition-all duration-200 active:scale-[0.98]
        ${
          selected
            ? 'border-primary-500 bg-primary-50 shadow-lg'
            : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 hover:shadow-md'
        }
      `}
    >
      <div className="text-center">
        <div className="text-5xl mb-3">{icon}</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
    </motion.div>
  );
};

interface DailyEmotionalCheckProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const DailyEmotionalCheck: React.FC<DailyEmotionalCheckProps> = ({
  isOpen,
  onComplete,
}) => {
  const [selectedState, setSelectedState] = useState<EmotionalState | null>(null);
  const setDailyEmotionalState = useAppStore((s) => s.setDailyEmotionalState);

  const handleConfirm = () => {
    if (selectedState) {
      setDailyEmotionalState(selectedState);
      onComplete();
    }
  };

  const emotionalOptions = [
    {
      icon: '😰',
      title: 'Abrumado/a',
      subtitle: 'No sé ni por dónde empezar',
      state: 'overwhelmed' as EmotionalState,
    },
    {
      icon: '😓',
      title: 'Cansado/a',
      subtitle: 'Sé que debo hacer cosas pero no puedo',
      state: 'tired' as EmotionalState,
    },
    {
      icon: '😐',
      title: 'Está OK',
      subtitle: 'Pero podría estar mejor organizado',
      state: 'ok' as EmotionalState,
    },
    {
      icon: '😊',
      title: 'Bien',
      subtitle: 'Quiero mantener buenos hábitos',
      state: 'good' as EmotionalState,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // No permitir cerrar sin seleccionar
      closeOnBackdrop={false}
      showCloseButton={false}
      size="lg"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
          className="text-6xl mb-4"
        >
          🏠
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-gray-800 mb-3"
        >
          ¿Cómo te sientes hoy?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600"
        >
          Tus tareas se adaptarán a tu estado de ánimo
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {emotionalOptions.map((option, index) => (
          <EmotionalOption
            key={option.state}
            {...option}
            selected={selectedState === option.state}
            onSelect={setSelectedState}
            delay={0.4 + index * 0.1}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          onClick={handleConfirm}
          disabled={!selectedState}
          fullWidth
          size="lg"
        >
          Continuar
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-sm text-gray-500 text-center mt-4"
      >
        Puedes cambiar tu estado en cualquier momento
      </motion.p>
    </Modal>
  );
};
