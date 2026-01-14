import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import type { UserIntention } from '../types';
import { CreateCustomTaskModal } from '../../tasks/components/CreateCustomTaskModal';

interface StateOption {
  icon: string;
  title: string;
  subtitle: string;
  intention: UserIntention;
  route: string;
  color: string;
}

const stateOptions: StateOption[] = [
  {
    icon: '🤯',
    title: 'Estoy abrumado/a',
    subtitle: 'No sé ni por dónde empezar',
    intention: 'overwhelmed',
    route: '/flow/overwhelmed',
    color: 'from-red-100 to-red-50 border-red-200 hover:border-red-400',
  },
  {
    icon: '⚡',
    title: 'Tengo algo de energía',
    subtitle: '¿Qué puedo hacer?',
    intention: 'have_energy',
    route: '/flow/energy',
    color: 'from-yellow-100 to-yellow-50 border-yellow-200 hover:border-yellow-400',
  },
  {
    icon: '📝',
    title: 'Necesito planificar',
    subtitle: 'Organizar qué hacer',
    intention: 'need_planning',
    route: '/flow/planning',
    color: 'from-blue-100 to-blue-50 border-blue-200 hover:border-blue-400',
  },
  {
    icon: '🛒',
    title: 'Hacer la compra',
    subtitle: 'Lista y organización',
    intention: 'need_shopping',
    route: '/flow/shopping',
    color: 'from-green-100 to-green-50 border-green-200 hover:border-green-400',
  },
  {
    icon: '😓',
    title: 'Me cuesta arrancar',
    subtitle: 'Sé que debo pero no puedo',
    intention: 'hard_to_start',
    route: '/flow/hard-to-start',
    color: 'from-purple-100 to-purple-50 border-purple-200 hover:border-purple-400',
  },
  {
    icon: '✅',
    title: 'Ver mi progreso',
    subtitle: 'Mis logros y racha',
    intention: 'see_progress',
    route: '/progress',
    color: 'from-sage-100 to-sage-50 border-sage-200 hover:border-sage-400',
  },
  {
    icon: '🏠',
    title: 'Ver mi hogar',
    subtitle: 'Estado de cada habitación',
    intention: 'see_home',
    route: '/rooms',
    color: 'from-indigo-100 to-indigo-50 border-indigo-200 hover:border-indigo-400',
  },
  {
    icon: '📚',
    title: 'Aprender',
    subtitle: 'Tips y estrategias TCC',
    intention: 'learn',
    route: '/learn',
    color: 'from-pink-100 to-pink-50 border-pink-200 hover:border-pink-400',
  },
  {
    icon: '⭐',
    title: 'Mis Tareas',
    subtitle: 'Gestionar tareas personalizadas',
    intention: 'my_tasks',
    route: '/my-tasks',
    color: 'from-amber-100 to-amber-50 border-amber-200 hover:border-amber-400',
  },
  {
    icon: '🚨',
    title: 'Urgente',
    subtitle: 'Acceso rápido a lo urgente',
    intention: 'urgent',
    route: '#', // Sin funcionalidad aún
    color: 'from-red-100 to-red-50 border-red-300 hover:border-red-500',
  },
];

export const StateSelectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);

  const handleSelect = (option: StateOption) => {
    navigate(option.route);
  };

  const handleTaskCreated = (taskId: string) => {
    setShowCreateTaskModal(false);
    // Opcionalmente podríamos navegar a la tarea recién creada
    // navigate(`/tasks/${taskId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-8 pb-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
            className="text-6xl mb-4"
          >
            🏠
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-800 mb-3"
          >
            ¿Cómo puedo ayudarte hoy?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600"
          >
            Selecciona tu estado actual
          </motion.p>
        </motion.div>

        

        {/* State Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stateOptions.map((option, index) => (
            <motion.button
              key={option.intention}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.08 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (option.intention !== 'urgent') handleSelect(option);
              }}
              className={`
                w-full bg-gradient-to-br ${option.color}
                border-2 rounded-2xl p-5 text-left
                transition-all duration-200 shadow-sm hover:shadow-md
                ${option.intention === 'urgent' ? 'ring-2 ring-red-400' : ''}
              `}
              disabled={option.intention === 'urgent'}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{option.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg mb-1">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {option.subtitle}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Subtle Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-sm text-gray-400 mt-8"
        >
          Cada día es diferente. Tus tareas se adaptan a ti.
        </motion.p>
      </div>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowCreateTaskModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
        aria-label="Crear tarea personalizada"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Create Custom Task Modal */}
      <CreateCustomTaskModal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        onSuccess={handleTaskCreated}
      />
    </div>
  );
};
