import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, TrendingUp, Home, ChevronRight } from 'lucide-react';
import type { Task } from '../../../db/database';

interface TaskRecommendationCardProps {
  task: Task;
  onClick: () => void;
  delay?: number;
}

export const TaskRecommendationCard: React.FC<TaskRecommendationCardProps> = ({
  task,
  onClick,
  delay = 0,
}) => {
  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'micro':
        return 'bg-green-100 text-green-700';
      case 'low':
        return 'bg-blue-100 text-blue-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'high':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getEffortLabel = (effort: string) => {
    switch (effort) {
      case 'micro':
        return 'Micro';
      case 'low':
        return 'Bajo';
      case 'medium':
        return 'Medio';
      case 'high':
        return 'Alto';
      default:
        return effort;
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high':
        return <TrendingUp className="w-4 h-4" />;
      case 'medium':
        return <Zap className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-gradient-to-br from-primary-500 to-primary-900 rounded-2xl p-6 cursor-pointer
                 shadow-lg hover:shadow-2xl transition-all duration-300 text-white"
    >
      <div className="flex flex-col">
        {/* Badge superior */}
        <div className="mb-4">
          <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
            {task.isMicroTask ? '🎯 Tu micro-misión' : '💡 Tarea recomendada'}
          </span>
        </div>

        {/* Título */}
        <h3 className="text-2xl font-bold mb-3">{task.title}</h3>

        {/* Descripción */}
        <p className="text-white/90 mb-4 line-clamp-2 leading-relaxed">
          {task.description}
        </p>

        {/* Meta información */}
        <div className="flex flex-wrap gap-3 text-sm text-white/90">
          {/* Tiempo */}
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{task.estimatedMinutes} minutos</span>
          </div>

          {/* Impacto */}
          {task.impactLevel === 'high' && (
            <div className="flex items-center gap-1">
              <span>⭐⭐⭐⭐⭐ Impacto alto</span>
            </div>
          )}
          {task.impactLevel === 'medium' && (
            <div className="flex items-center gap-1">
              <span>⭐⭐⭐ Impacto medio</span>
            </div>
          )}
          {task.impactLevel === 'low' && (
            <div className="flex items-center gap-1">
              <span>✨ Impacto bajo</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
