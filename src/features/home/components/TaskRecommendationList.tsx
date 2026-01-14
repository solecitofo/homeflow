import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TaskRecommendationCard } from './TaskRecommendationCard';
import { useRecommendedTasks } from '../hooks/useRecommendedTasks';
import { Loader2 } from 'lucide-react';

export const TaskRecommendationList: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, isLoading, error } = useRecommendedTasks();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center"
      >
        <p className="text-red-700">{error}</p>
      </motion.div>
    );
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-sage-50 border border-sage-200 rounded-2xl p-8 text-center"
      >
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          ¡No hay tareas disponibles ahora!
        </h3>
        <p className="text-gray-600">
          Selecciona tu estado emocional para ver tareas recomendadas
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-gray-800 mb-4"
      >
        Tareas recomendadas para ti
      </motion.h2>

      {tasks.map((task, index) => (
        <TaskRecommendationCard
          key={task.id}
          task={task}
          onClick={() => navigate(`/tasks/${task.id}`)}
          delay={0.4 + index * 0.1}
        />
      ))}

      {tasks.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 + tasks.length * 0.1 }}
          className="text-sm text-gray-500 text-center mt-6"
        >
          {tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'} disponibles
        </motion.p>
      )}
    </div>
  );
};
