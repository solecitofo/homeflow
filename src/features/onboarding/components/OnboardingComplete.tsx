import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Home, BookOpen } from 'lucide-react';

export const OnboardingComplete: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1 
            }}
            className="text-7xl mb-6"
          >
            ✨
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-gray-800 mb-4"
          >
            ¡Primer logro desbloqueado!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 mb-8"
          >
            Has completado tu primera tarea en HomeFlow
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-empathy-500 to-empathy-600 text-white rounded-2xl p-6 mb-8"
          >
            <BookOpen className="mx-auto mb-3" size={32} />
            <h3 className="text-xl font-bold mb-2">
              💡 ¿Ves? Esto es activación conductual
            </h3>
            <p className="text-sm opacity-90 mb-4">
              Lo que acabas de experimentar es uno de los principios más poderosos 
              de la psicología del comportamiento:
            </p>
            <div className="bg-white/20 rounded-xl p-4 text-left">
              <p className="font-semibold mb-2">La acción mejora el ánimo, no al revés.</p>
              <p className="text-sm opacity-90">
                No necesitas "estar motivado" para empezar. 
                Empezar crea motivación.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-3"
          >
            <button
              onClick={() => navigate('/home')}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 
                       text-white py-4 rounded-xl font-semibold text-lg
                       hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                       transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Ir a Mi Hogar
            </button>
            
            <button
              onClick={() => navigate('/learn')}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 
                       py-3 rounded-xl font-semibold
                       hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              Aprender más sobre esto
            </button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 pt-6 border-t border-gray-200"
          >
            <div className="flex items-center justify-center gap-2 text-coral-500">
              <div className="text-3xl font-bold">🔥 1</div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              día haciendo algo • ¡Empieza tu racha!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
