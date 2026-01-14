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
      onClick={onClick}
      className="bg-white border-2 border-gray-200 rounded-2xl p-5 cursor-pointer
                 hover:border-primary-500 hover:bg-primary-50 hover:shadow-lg
                 active:scale-[0.98] transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Título */}
          <h3 className="text-lg font-bold text-gray-800 mb-2">{task.title}</h3>

          {/* Descripción */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {task.description}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {/* Tiempo estimado */}
            <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
              <Clock className="w-4 h-4" />
              <span>{task.estimatedMinutes} min</span>
            </div>

            {/* Nivel de esfuerzo */}
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${getEffortColor(
                task.effortLevel
              )}`}
            >
              {getEffortLabel(task.effortLevel)}
            </div>

            {/* Alto impacto */}
            {task.impactLevel === 'high' && (
              <div className="flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {getImpactIcon(task.impactLevel)}
                <span>Alto impacto</span>
              </div>
            )}

            {/* Habitación */}
            {task.room && (
              <div className="flex items-center gap-1 px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-sm">
                <Home className="w-4 h-4" />
                <span className="capitalize">{task.room.replace('_', ' ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Icono de acción */}
        <div className="ml-4 flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <ChevronRight className="w-6 h-6 text-primary-600" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
