import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Plus, Clock, TrendingUp } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { CreateCustomTaskModal } from './CreateCustomTaskModal';
import { getUserCustomTasks, deleteCustomTask } from '../../../db/operations/customTasks';
import { useUserId } from '../../../shared/hooks/useUserId';
import type { Task } from '../../../db/database';

const categoryIcons = {
  cleaning: '🧹',
  organizing: '📦',
  shopping: '🛒',
  maintenance: '🔧',
};

const categoryLabels = {
  cleaning: 'Limpieza',
  organizing: 'Organización',
  shopping: 'Compras',
  maintenance: 'Mantenimiento',
};

export const MyCustomTasks: React.FC = () => {
  const navigate = useNavigate();
  const userId = useUserId();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const customTasks = await getUserCustomTasks(userId);
      setTasks(customTasks);
    } catch (error) {
      console.error('Error loading custom tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [userId]);

  const handleDelete = async (taskId: string) => {
    try {
      await deleteCustomTask(taskId, userId);
      await loadTasks();
      setTaskToDelete(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Error al eliminar la tarea');
    }
  };

  const handleTaskCreated = () => {
    setShowCreateModal(false);
    loadTasks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Mis Tareas Personalizadas
              </h1>
              <p className="text-gray-600">
                Tareas adaptadas a tu rutina y necesidades
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nueva Tarea
            </Button>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Cargando tareas...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white rounded-2xl shadow-sm"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No tienes tareas personalizadas
            </h3>
            <p className="text-gray-600 mb-6">
              Crea tu primera tarea adaptada a tu rutina
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Crear Mi Primera Tarea
            </Button>
          </motion.div>
        )}

        {/* Tasks Grid */}
        {!loading && tasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border-2 border-gray-100"
              >
                {/* Task Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-3xl">
                      {categoryIcons[task.category]}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg mb-1">
                        {task.title}
                      </h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {categoryLabels[task.category]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Task Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {task.description}
                </p>

                {/* Task Metadata */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{task.estimatedMinutes} min</span>
                  </div>
                  {task.customMetadata && task.customMetadata.usageCount > 0 && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{task.customMetadata.usageCount} veces</span>
                    </div>
                  )}
                </div>

                {/* Learning Badge */}
                {task.customMetadata && task.customMetadata.usageCount >= 3 && (
                  <div className="mb-4 p-2 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-xs text-purple-700">
                      ✨ Tiempo ajustado automáticamente basándose en tus completados reales
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/tasks/${task.id}`)}
                    className="flex-1"
                  >
                    Ejecutar
                  </Button>
                  <button
                    onClick={() => setTaskToDelete(task.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Eliminar tarea"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        <CreateCustomTaskModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleTaskCreated}
        />

        {/* Delete Confirmation Modal */}
        {taskToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                ¿Eliminar tarea?
              </h3>
              <p className="text-gray-600 mb-6">
                Esta acción no se puede deshacer. Se perderán todos los datos de aprendizaje asociados.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setTaskToDelete(null)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => handleDelete(taskToDelete)}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Eliminar
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};
