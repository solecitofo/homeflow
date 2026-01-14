import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Star, Target } from 'lucide-react';
import { useAppStore } from '../../../../store';
import { getUserProgress, getWeeklyProgress } from '../../../db/operations/userProgress';
import { calculateStreak } from '../../../shared/utils/streak';

export const ProgressSummary: React.FC = () => {
  const userId = useAppStore((s) => s.userId);
  const [streak, setStreak] = useState(0);
  const [weeklyPoints, setWeeklyPoints] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(100);
  const [weeklyPercentage, setWeeklyPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        // Calcular racha
        const currentStreak = await calculateStreak(userId);
        setStreak(currentStreak);

        // Obtener progreso semanal
        const progress = await getWeeklyProgress(userId);
        setWeeklyPoints(progress.weeklyPoints);
        setWeeklyGoal(progress.weeklyGoal);
        setWeeklyPercentage(progress.percentage);
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl p-6 shadow-lg"
    >
      <div className="grid grid-cols-3 gap-4">
        {/* Racha */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 mb-2"
          >
            <Flame className="w-8 h-8 text-white" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-3xl font-bold text-gray-800">{streak}</p>
            <p className="text-sm text-gray-600">
              {streak === 1 ? 'día' : 'días'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Racha</p>
          </motion.div>
        </div>

        {/* Puntos semanales */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-2"
          >
            <Star className="w-8 h-8 text-white" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-3xl font-bold text-gray-800">{weeklyPoints}</p>
            <p className="text-sm text-gray-600">puntos</p>
            <p className="text-xs text-gray-500 mt-1">Esta semana</p>
          </motion.div>
        </div>

        {/* Meta semanal */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 mb-2"
          >
            <Target className="w-8 h-8 text-white" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-3xl font-bold text-gray-800">
              {Math.round(weeklyPercentage)}%
            </p>
            <p className="text-sm text-gray-600">de {weeklyGoal}</p>
            <p className="text-xs text-gray-500 mt-1">Meta semanal</p>
          </motion.div>
        </div>
      </div>

      {/* Barra de progreso semanal */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-6"
      >
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${weeklyPercentage}%` }}
            transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};
