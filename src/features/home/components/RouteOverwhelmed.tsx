import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Timer, ArrowLeft, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { SessionClosure } from './SessionClosure';
import { useAdaptiveEngine } from '../hooks/useAdaptiveEngine';
import { useUserId } from '../../../shared/hooks/useUserId';
import type { PostTaskFeeling } from '../types';

// Micro-tareas de fallback (solo se usan si la DB está vacía)
const fallbackMicroTasks = [
  {
    id: 'micro-1',
    title: 'Recoge 3 objetos que estén fuera de su sitio y colócalos donde van',
    smallerTitle: 'Recoge 1 objeto y ponlo en su sitio',
    durationMinutes: 2,
  },
  {
    id: 'micro-2',
    title: 'Lleva algo a la basura que lleve tiempo esperando',
    smallerTitle: 'Identifica una cosa para tirar (la tirarás después)',
    durationMinutes: 2,
  },
  {
    id: 'micro-3',
    title: 'Vacía una superficie: mesita, encimera, o estante',
    smallerTitle: 'Despeja solo un rincón de una superficie',
    durationMinutes: 2,
  },
  {
    id: 'micro-4',
    title: 'Abre una ventana y respira profundo mientras miras alrededor',
    smallerTitle: 'Solo respira profundo 3 veces donde estés',
    durationMinutes: 1,
  },
];

type Phase = 'validation' | 'loading' | 'task' | 'timer' | 'feedback' | 'continue' | 'closure';

export const RouteOverwhelmed: React.FC = () => {
  const navigate = useNavigate();
  const userId = useUserId();
  const { getMicroTask, microTask, completeTask, loading: engineLoading } = useAdaptiveEngine(userId);
  
  const [phase, setPhase] = useState<Phase>('validation');
  const [fallbackTask, setFallbackTask] = useState(fallbackMicroTasks[Math.floor(Math.random() * fallbackMicroTasks.length)]);
  const [isSmaller, setIsSmaller] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutos
  const [timerActive, setTimerActive] = useState(false);
  const [feeling, setFeeling] = useState<PostTaskFeeling | null>(null);

  // Obtener tarea del motor cuando avanza
  const loadMicroTask = async () => {
    setPhase('loading');
    const task = await getMicroTask();
    if (!task) {
      // Usar fallback si no hay tareas en DB
      setFallbackTask(fallbackMicroTasks[Math.floor(Math.random() * fallbackMicroTasks.length)]);
    }
    setPhase('task');
  };

  // Datos de la tarea actual (del motor o fallback)
  const currentTask = microTask ? {
    id: microTask.id,
    title: microTask.title,
    smallerTitle: microTask.intensityLevels?.basic?.description || microTask.description || 'Hazlo un poco más pequeño',
    durationMinutes: microTask.intensityLevels?.basic?.minutes || 2,
  } : fallbackTask;

  // Timer logic
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimerActive(false);
          setPhase('feedback');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMakeSmaller = () => {
    setIsSmaller(true);
    setTimeLeft(60); // Reducir a 1 minuto
  };

  const handleStartTimer = () => {
    setPhase('timer');
    setTimerActive(true);
  };

  const handleDone = () => {
    setTimerActive(false);
    setPhase('feedback');
  };

  const handleFeelingSelect = async (selectedFeeling: PostTaskFeeling) => {
    setFeeling(selectedFeeling);
    
    // Guardar completación si tenemos tarea del motor
    if (microTask) {
      const actualMinutes = isSmaller 
        ? (currentTask.durationMinutes / 2) 
        : currentTask.durationMinutes;
      // Micro-tareas dan 5 puntos base + 1 por minuto
      const points = 5 + actualMinutes;
      await completeTask(microTask, selectedFeeling, actualMinutes, points);
    }
    
    setPhase('continue');
  };

  const handleContinue = async (wantMore: boolean) => {
    if (wantMore) {
      // Obtener otra micro-tarea del motor
      await loadMicroTask();
      setIsSmaller(false);
      setTimeLeft(120);
    } else {
      setPhase('closure');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-primary-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 mt-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </motion.button>

        <AnimatePresence mode="wait">
          {/* PHASE: Validation */}
          {phase === 'validation' && (
            <motion.div
              key="validation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="text-6xl mb-6"
              >
                💜
              </motion.div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Entiendo, a veces el desorden nos puede.
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Vamos a empezar <span className="font-bold text-primary-600">MUY pequeño</span>.
                <br />
                Sin presión, sin listas, solo una cosa.
              </p>
              <Button
                onClick={() => loadMicroTask()}
                className="text-lg px-8 py-4"
              >
                Mostrarme qué hacer
              </Button>
            </motion.div>
          )}

          {/* PHASE: Loading */}
          {phase === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Buscando algo sencillo para ti...</p>
            </motion.div>
          )}

          {/* PHASE: Task Presentation */}
          {phase === 'task' && (
            <motion.div
              key="task"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
                <div className="flex items-center gap-2 text-primary-600 mb-4">
                  <span className="text-2xl">🎯</span>
                  <span className="font-semibold">Tu micro-misión</span>
                  <span className="ml-auto bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                    {isSmaller ? '1 min' : '2 min'}
                  </span>
                </div>
                
                <motion.p
                  key={isSmaller ? 'smaller' : 'normal'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xl text-gray-800 leading-relaxed mb-6"
                >
                  "{isSmaller ? currentTask.smallerTitle : currentTask.title}"
                </motion.p>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleStartTimer}
                    className="w-full text-lg py-4"
                  >
                    <Timer className="w-5 h-5 mr-2" />
                    Empezar
                  </Button>
                  
                  {!isSmaller && (
                    <Button
                      variant="outline"
                      onClick={handleMakeSmaller}
                      className="w-full"
                    >
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Necesito algo más pequeño
                    </Button>
                  )}
                </div>
              </div>

              <p className="text-center text-sm text-gray-500">
                No tienes que hacerlo perfecto. Solo empieza.
              </p>
            </motion.div>
          )}

          {/* PHASE: Timer Running */}
          {phase === 'timer' && (
            <motion.div
              key="timer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
                <p className="text-gray-600 mb-4">Estás haciéndolo...</p>
                
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="relative w-48 h-48 mx-auto mb-6"
                >
                  {/* Circular Progress */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#e2e8f0"
                      strokeWidth="8"
                      fill="none"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#10b981"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 1 }}
                      animate={{ pathLength: timeLeft / (isSmaller ? 60 : 120) }}
                      transition={{ duration: 0.5 }}
                      style={{
                        strokeDasharray: '553',
                        strokeDashoffset: 0,
                      }}
                    />
                  </svg>
                  
                  {/* Time Display */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-bold text-gray-800">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </motion.div>

                <p className="text-lg text-gray-700 mb-6">
                  {isSmaller ? currentTask.smallerTitle : currentTask.title}
                </p>

                <Button
                  onClick={handleDone}
                  variant="secondary"
                  className="w-full"
                >
                  ¡Ya terminé!
                </Button>
              </div>
            </motion.div>
          )}

          {/* PHASE: Feedback */}
          {phase === 'feedback' && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="text-7xl mb-6"
              >
                ✨
              </motion.div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                ¡Lo hiciste!
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Cada pequeño paso cuenta. ¿Cómo te sientes ahora?
              </p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { feeling: 'better' as PostTaskFeeling, emoji: '😊', label: 'Mejor' },
                  { feeling: 'same' as PostTaskFeeling, emoji: '😐', label: 'Igual' },
                  { feeling: 'worse' as PostTaskFeeling, emoji: '😔', label: 'Peor' },
                ].map((option) => (
                  <motion.button
                    key={option.feeling}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFeelingSelect(option.feeling)}
                    className="bg-white rounded-2xl p-4 shadow-md border-2 border-transparent hover:border-primary-300 transition-colors"
                  >
                    <span className="text-4xl block mb-2">{option.emoji}</span>
                    <span className="text-gray-700 font-medium">{option.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* PHASE: Continue? */}
          {phase === 'continue' && (
            <motion.div
              key="continue"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="text-6xl mb-6"
              >
                {feeling === 'better' ? '🌟' : feeling === 'same' ? '💪' : '💜'}
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {feeling === 'better' 
                  ? '¡Genial! El movimiento genera motivación.'
                  : feeling === 'same'
                  ? 'A veces toma tiempo. Has dado un paso.'
                  : 'Está bien. Has hecho algo, y eso importa.'
                }
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                ¿Quieres hacer otra micro-misión?
              </p>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => handleContinue(true)}
                  className="w-full text-lg py-4"
                >
                  Sí, dame otra
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPhase('closure')}
                  className="w-full"
                >
                  No, suficiente por hoy
                </Button>
              </div>

              {feeling === 'better' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 bg-sage-50 rounded-xl p-4"
                >
                  <p className="text-sm text-sage-700">
                    💡 <strong>Dato:</strong> Completar pequeñas tareas libera dopamina, 
                    creando un ciclo positivo de motivación.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* PHASE: Closure - Cierre de sesión */}
          {phase === 'closure' && (
            <SessionClosure onHome={() => navigate('/')} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
