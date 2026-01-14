import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../../store';
import { Play, CheckCircle2 } from 'lucide-react';

export const FirstGuidedTask: React.FC = () => {
  const navigate = useNavigate();
  const emotionalState = useAppStore(state => state.emotionalState);
  const [showTask, setShowTask] = useState(false);
  const [taskStarted, setTaskStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState<boolean[]>([false, false, false]);
  
  useEffect(() => {
    if (taskStarted) {
      const interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [taskStarted]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleComplete = () => {
    navigate('/onboarding/feedback');
  };
  
  const toggleStep = (index: number) => {
    setCheckedSteps(prev => {
      const newSteps = [...prev];
      newSteps[index] = !newSteps[index];
      return newSteps;
    });
  };
  
  if (!showTask) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-6xl mb-6"
            >
              ✨
            </motion.div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              ¡Configuración completa!
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Ahora que conocemos tu hogar,<br/>
              ¿qué tal si hacemos algo juntos ahora mismo?
            </p>
            
            <p className="text-gray-700 mb-8">
              Te voy a proponer algo <strong>pequeñito y rápido</strong>.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => setShowTask(true)}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 
                         text-white py-4 rounded-xl font-semibold text-lg
                         hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                         transition-all duration-200 flex items-center justify-center gap-2"
              >
                Sí, vamos
                <Play size={20} />
              </button>
              
              <button
                onClick={() => navigate('/home')}
                className="w-full bg-white border-2 border-gray-300 text-gray-700 
                         py-3 rounded-xl font-semibold
                         hover:bg-gray-50 transition-all duration-200"
              >
                Prefiero explorar primero
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  
  if (!taskStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <div className="text-center mb-6">
              <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-semibold mb-4">
                🎯 Tu primera misión
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold mb-3">
                Recoge 3 objetos
              </h2>
              <p className="mb-4 opacity-90">
                Encuentra 3 objetos que estén fuera de su sitio y colócalos donde van
              </p>
              <div className="flex gap-4 text-sm">
                <span>⏱️ 2 minutos</span>
                <span>✨ Impacto inmediato</span>
              </div>
            </div>
            
            <div className="bg-empathy-50 border-l-4 border-empathy-500 rounded-xl p-4 mb-6">
              <p className="text-sm text-empathy-900">
                <strong>💡 ¿Por qué esto?</strong><br/>
                Empezar con algo pequeño hace que sea más fácil continuar. 
                Es un principio de psicología del comportamiento.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => setTaskStarted(true)}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 
                         text-white py-4 rounded-xl font-semibold text-lg
                         hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                         transition-all duration-200"
              >
                Empezar ahora
              </button>
              
              <button
                onClick={() => navigate('/home')}
                className="w-full text-gray-600 py-2 underline hover:text-gray-800"
              >
                Mejor lo hago después
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  
  // Durante la tarea
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Recoge 3 objetos
          </h2>
          
          <div className="bg-gray-100 rounded-2xl p-8 text-center mb-6">
            <div className="text-5xl font-bold text-primary-600 mb-2">
              {formatTime(timer)}
            </div>
            <div className="text-sm text-gray-600">tiempo transcurrido</div>
          </div>
          
          <div className="space-y-3 mb-6">
            {['Objeto 1 guardado', 'Objeto 2 guardado', 'Objeto 3 guardado'].map((step, index) => (
              <div
                key={index}
                onClick={() => toggleStep(index)}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer
                         hover:bg-gray-100 transition-colors"
              >
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center
                              transition-colors ${
                  checkedSteps[index]
                    ? 'bg-primary-500 border-primary-500'
                    : 'border-gray-300'
                }`}>
                  {checkedSteps[index] && (
                    <CheckCircle2 size={16} className="text-white" />
                  )}
                </div>
                <span className="text-gray-700">{step}</span>
              </div>
            ))}
          </div>
          
          <div className="bg-sage-50 border-l-4 border-sage-500 rounded-xl p-4 mb-6">
            <p className="text-sm text-sage-900">
              💬 <strong>Mientras haces esto:</strong><br/>
              Fíjate en cómo te sientes. Normalmente, el acto de EMPEZAR 
              es lo más difícil. Una vez en movimiento, es más fácil continuar.
            </p>
          </div>
          
          <button
            onClick={handleComplete}
            className="w-full bg-gradient-to-r from-sage-500 to-sage-600 
                     text-white py-4 rounded-xl font-semibold text-lg
                     hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                     transition-all duration-200"
          >
            ✓ ¡Hecho!
          </button>
        </motion.div>
      </div>
    </div>
  );
};
