import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Flame, TrendingUp, ArrowRight } from 'lucide-react';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';
import { Task } from '../../../db/database';
import { calculateTaskPoints, calculateMoodImprovement } from '../../../shared/utils/points';
import { calculateStreak } from '../../../shared/utils/streak';
import { MoodLevel } from './EmotionalCheckIn';

interface TaskCompletionModalProps {
  isOpen: boolean;
  task: Task;
  actualMinutes: number;
  moodBefore: MoodLevel;
  moodAfter: MoodLevel;
  onClose: () => void;
}

export const TaskCompletionModal: React.FC<TaskCompletionModalProps> = ({
  isOpen,
  task,
  actualMinutes,
  moodBefore,
  moodAfter,
  onClose,
}) => {
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Calculate stats
  const pointsEarned = calculateTaskPoints(task, actualMinutes, moodBefore, moodAfter);
  const moodImprovement = calculateMoodImprovement(moodBefore, moodAfter);
  const savedTime = task.estimatedMinutes - actualMinutes;

  // Load streak
  useEffect(() => {
    if (isOpen) {
      calculateStreak('default_user').then(setStreak);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [isOpen]);

  const getMoodImprovementMessage = () => {
    if (moodImprovement > 0) {
      return {
        icon: '💚',
        text: `Tu ánimo mejoró ${moodImprovement} ${moodImprovement === 1 ? 'punto' : 'puntos'}`,
        color: 'text-green-600',
      };
    } else if (moodImprovement < 0) {
      return {
        icon: '💙',
        text: 'Gracias por completar la tarea de todas formas',
        color: 'text-blue-600',
      };
    } else {
      return {
        icon: '💛',
        text: 'Tu ánimo se mantuvo estable',
        color: 'text-yellow-600',
      };
    }
  };

  const moodMessage = getMoodImprovementMessage();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" closeOnBackdropClick={false}>
      <div className="relative">
        {/* Confetti effect placeholder - could add a library for this */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="text-4xl animate-bounce absolute top-0 left-1/4">🎉</div>
            <div className="text-4xl animate-bounce absolute top-0 right-1/4" style={{ animationDelay: '0.1s' }}>✨</div>
            <div className="text-4xl animate-bounce absolute top-10 left-1/3" style={{ animationDelay: '0.2s' }}>🌟</div>
          </div>
        )}

        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
        >
          <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-gray-800 text-center mb-2"
        >
          ¡Tarea completada!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-center mb-8"
        >
          {task.title}
        </motion.p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-primary-50 rounded-xl p-4 text-center"
          >
            <Star className="w-6 h-6 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary-700">{pointsEarned}</div>
            <div className="text-xs text-gray-600">puntos</div>
          </motion.div>

          {/* Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-orange-50 rounded-xl p-4 text-center"
          >
            <Flame className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-700">{streak}</div>
            <div className="text-xs text-gray-600">días seguidos</div>
          </motion.div>

          {/* Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-50 rounded-xl p-4 text-center"
          >
            <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">{actualMinutes}</div>
            <div className="text-xs text-gray-600">minutos</div>
          </motion.div>
        </div>

        {/* Mood Improvement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6 text-center"
        >
          <div className="text-3xl mb-2">{moodMessage.icon}</div>
          <p className={`font-semibold ${moodMessage.color}`}>
            {moodMessage.text}
          </p>
        </motion.div>

        {/* Additional info */}
        {savedTime > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm text-center text-gray-600 mb-6"
          >
            Completaste la tarea {savedTime} minuto{savedTime !== 1 ? 's' : ''} más rápido de lo estimado
          </motion.p>
        )}

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button onClick={onClose} variant="primary" fullWidth>
            <span>Continuar</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>

        {/* Motivational message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center text-sm text-gray-500 mt-4"
        >
          ¡Cada pequeño paso cuenta! 💪
        </motion.p>
      </div>
    </Modal>
  );
};
