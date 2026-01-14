import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock, Check, Play, Pause, X } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { IntensitySelector, IntensityLevel } from './IntensitySelector';
import { db, type Task, generateId } from '../../../db/database';
import { useUserId } from '../../../shared/hooks/useUserId';
import { createActivityLog, completeActivityLog } from '../../../db/operations/activityLogs';
import { calculateTaskPoints, calculateMoodImprovement } from '../../../shared/utils/points';

type ExecutionPhase =
  | 'loading'     // Cargando tarea desde DB
  | 'intensity'   // Selector de intensidad
  | 'briefing'    // Mostrar pasos antes de empezar
  | 'timer'       // Timer con checklist
  | 'completion'  // Check emocional
  | 'feedback';   // Puntos y feedback

interface LocationState {
  taskId?: string;
  fromRoom?: string;
  intensityPreselected?: IntensityLevel;
  tempTask?: {
    title: string;
    room: string;
    estimatedMinutes: number;
  };
}

export const TaskExecutionFlow: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = useUserId();
  const state = location.state as LocationState | undefined;

  const [phase, setPhase] = useState<ExecutionPhase>('loading');
  const [task, setTask] = useState<Task | null>(null);
  const [selectedIntensity, setSelectedIntensity] = useState<IntensityLevel>(
    state?.intensityPreselected || 'standard'
  );
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [moodBefore, setMoodBefore] = useState<number>(3);
  const [moodAfter, setMoodAfter] = useState<number | null>(null);
  const [actualMinutes, setActualMinutes] = useState(0);
  const [activityLogId, setActivityLogId] = useState<string | null>(null);

  // Cargar tarea desde DB o crear temporal
  useEffect(() => {
    loadTask();
  }, []);

  const loadTask = async () => {
    if (state?.taskId) {
      // Cargar tarea real de DB
      const dbTask = await db.tasks.get(state.taskId);
      if (dbTask) {
        setTask(dbTask);
        setPhase('intensity');
      } else {
        console.error('Task not found:', state.taskId);
        navigate('/rooms');
      }
    } else if (state?.tempTask) {
      // Crear tarea temporal
      const tempTask: Task = {
        id: generateId(),
        category: 'cleaning',
        room: state.tempTask.room,
        title: state.tempTask.title,
        description: `Tarea de ${state.tempTask.room}`,
        estimatedMinutes: state.tempTask.estimatedMinutes,
        effortLevel: 'low',
        impactLevel: 'medium',
        isMicroTask: false,
        requiresDecisions: false,
        requiresMovement: true,
      };
      setTask(tempTask);
      setPhase('intensity');
    } else {
      // Sin información de tarea, volver
      navigate('/rooms');
    }
  };

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 flex items-center justify-center">
        <div className="text-gray-600">Cargando tarea...</div>
      </div>
    );
  }

  // Calcular duración según intensidad
  const getIntensityMinutes = (): number => {
    if (task.intensityLevels) {
      return task.intensityLevels[selectedIntensity].minutes;
    }

    // Fallback si no tiene intensityLevels definidos
    const baseMinutes = task.estimatedMinutes;
    switch (selectedIntensity) {
      case 'basic': return Math.round(baseMinutes * 0.4);
      case 'standard': return baseMinutes;
      case 'deep': return Math.round(baseMinutes * 2);
    }
  };

  const getIntensityDescription = (): string => {
    if (task.intensityLevels) {
      return task.intensityLevels[selectedIntensity].description;
    }

    // Fallback descriptions
    switch (selectedIntensity) {
      case 'basic': return 'Versión rápida y básica';
      case 'standard': return task.description;
      case 'deep': return 'Versión completa y profunda';
    }
  };

  const handleStartBriefing = () => {
    if (task.steps && task.steps.length > 0) {
      setPhase('briefing');
    } else {
      handleStartTimer();
    }
  };

  const handleStartTimer = async () => {
    const minutes = getIntensityMinutes();
    setTimeLeft(minutes * 60);
    setIsTimerRunning(true);
    setPhase('timer');

    // Crear activity log
    const logId = await createActivityLog(
      userId,
      task.id,
      moodBefore,
      'ok' // routeUsed - puede ser dinámico si lo pasamos desde RoomDetailScreen
    );
    setActivityLogId(logId);
  };

  const handleCompleteTask = async () => {
    setIsTimerRunning(false);

    // Calcular minutos reales
    const expectedSeconds = getIntensityMinutes() * 60;
    const actualSeconds = expectedSeconds - timeLeft;
    const minutes = Math.max(1, Math.round(actualSeconds / 60));
    setActualMinutes(minutes);

    setPhase('completion');
  };

  const handleMoodSelect = async (mood: number) => {
    setMoodAfter(mood);

    // Completar activity log
    if (activityLogId) {
      await completeActivityLog(activityLogId, mood, actualMinutes);
    }

    setPhase('feedback');
  };

  const handleFinish = () => {
    if (state?.fromRoom) {
      navigate(`/rooms/${state.fromRoom}`);
    } else {
      navigate('/');
    }
  };

  const toggleStep = (index: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = () => {
    const total = getIntensityMinutes() * 60;
    return ((total - timeLeft) / total) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => {
            if (phase === 'timer' && isTimerRunning) {
              // Confirmar antes de salir si el timer está corriendo
              if (window.confirm('¿Seguro que quieres salir? Se perderá el progreso.')) {
                navigate(-1);
              }
            } else {
              navigate(-1);
            }
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 mt-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </motion.button>

        <AnimatePresence mode="wait">
          {/* PHASE: Intensity Selection */}
          {phase === 'intensity' && (
            <motion.div
              key="intensity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {task.title}
              </h1>
              <p className="text-gray-600 mb-6">
                Elige el nivel de intensidad para esta tarea
              </p>

              <IntensitySelector
                selected={selectedIntensity}
                onSelect={setSelectedIntensity}
                taskName={task.title}
                intensityTimes={{
                  basic: Math.round(task.estimatedMinutes * 0.4),
                  standard: task.estimatedMinutes,
                  deep: Math.round(task.estimatedMinutes * 2),
                }}
              />

              <div className="mt-6">
                <Button onClick={handleStartBriefing} fullWidth>
                  <Play className="w-5 h-5 mr-2" />
                  Empezar tarea
                </Button>
              </div>
            </motion.div>
          )}

          {/* PHASE: Briefing - Mostrar pasos */}
          {phase === 'briefing' && task.steps && (
            <motion.div
              key="briefing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {task.title}
              </h1>
              <p className="text-gray-600 mb-6">
                Nivel: <strong className="capitalize">{selectedIntensity}</strong> ({getIntensityMinutes()} min)
              </p>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Pasos a seguir:
                </h3>
                <ul className="space-y-2">
                  {task.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-primary-600 font-semibold">{index + 1}.</span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button onClick={handleStartTimer} fullWidth>
                <Play className="w-5 h-5 mr-2" />
                Iniciar timer
              </Button>
            </motion.div>
          )}

          {/* PHASE: Timer - Ejecución con checklist */}
          {phase === 'timer' && (
            <motion.div
              key="timer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h1 className="text-xl font-bold text-gray-800 mb-6 text-center">
                {task.title}
              </h1>

              {/* Circular Timer */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-48 h-48 mb-4">
                  <svg className="transform -rotate-90 w-48 h-48">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#10b981"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 88}`}
                      strokeDashoffset={`${2 * Math.PI * 88 * (1 - progressPercent() / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <div className="text-4xl font-bold text-gray-800">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-sm text-gray-500">restantes</div>
                  </div>
                </div>

                {/* Play/Pause Button */}
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="bg-primary-500 hover:bg-primary-600 text-white rounded-full p-4 shadow-lg transition-all"
                >
                  {isTimerRunning ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-1" />
                  )}
                </button>
              </div>

              {/* Checklist de pasos */}
              {task.steps && task.steps.length > 0 && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 mb-6">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3">
                    PASOS
                  </h3>
                  <div className="space-y-2">
                    {task.steps.map((step, index) => (
                      <button
                        key={index}
                        onClick={() => toggleStep(index)}
                        className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all ${
                          completedSteps.has(index)
                            ? 'bg-green-50 border-2 border-green-200'
                            : 'bg-gray-50 border-2 border-transparent hover:border-gray-300'
                        }`}
                      >
                        <div
                          className={`min-w-[24px] h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            completedSteps.has(index)
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300'
                          }`}
                        >
                          {completedSteps.has(index) && (
                            <Check className="w-4 h-4 text-white" strokeWidth={3} />
                          )}
                        </div>
                        <span
                          className={`text-left text-sm ${
                            completedSteps.has(index)
                              ? 'text-green-700 line-through'
                              : 'text-gray-700'
                          }`}
                        >
                          {step}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Complete Button */}
              <Button onClick={handleCompleteTask} variant="primary" fullWidth>
                <Check className="w-5 h-5 mr-2" />
                Ya terminé
              </Button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Pulsa cuando hayas completado la tarea, incluso si el timer no ha terminado
              </p>
            </motion.div>
          )}

          {/* PHASE: Completion - Check emocional */}
          {phase === 'completion' && (
            <motion.div
              key="completion"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
              >
                <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                ¡Tarea completada!
              </h2>
              <p className="text-gray-600 mb-8">
                Completaste: <strong>{task.title}</strong>
              </p>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  ¿Cómo te sientes ahora?
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { emoji: '😣', label: 'Mal', value: 1 },
                    { emoji: '😔', label: 'Regular', value: 2 },
                    { emoji: '😐', label: 'Neutro', value: 3 },
                    { emoji: '😊', label: 'Bien', value: 4 },
                    { emoji: '😄', label: 'Muy bien', value: 5 },
                  ].map(({ emoji, label, value }) => (
                    <button
                      key={value}
                      onClick={() => handleMoodSelect(value)}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-primary-50 transition-all border-2 border-transparent hover:border-primary-300"
                    >
                      <span className="text-4xl">{emoji}</span>
                      <span className="text-xs text-gray-600">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* PHASE: Feedback - Puntos y celebración */}
          {phase === 'feedback' && moodAfter !== null && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className="text-center mb-6"
              >
                <div className="text-6xl mb-4">🎉</div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  ¡Excelente!
                </h1>
              </motion.div>

              {/* Mood Comparison */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 mb-6"
              >
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="text-center">
                    <div className="text-xs text-gray-600 font-semibold mb-2">ANTES</div>
                    <div className="text-5xl">
                      {['😣', '😔', '😐', '😊', '😄'][moodBefore - 1]}
                    </div>
                  </div>
                  <div className="text-center text-3xl text-green-500">→</div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600 font-semibold mb-2">AHORA</div>
                    <div className="text-5xl">
                      {['😣', '😔', '😐', '😊', '😄'][moodAfter - 1]}
                    </div>
                  </div>
                </div>

                {moodAfter > moodBefore && (
                  <div className="text-center mt-4">
                    <div className="text-2xl mb-2">💚</div>
                    <p className="font-semibold text-green-600">
                      Tu ánimo mejoró {moodAfter - moodBefore} {moodAfter - moodBefore === 1 ? 'punto' : 'puntos'}
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-4 mb-6"
              >
                <div className="bg-primary-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-primary-700">
                    +{calculateTaskPoints(task, actualMinutes, moodBefore, moodAfter)}
                  </div>
                  <div className="text-xs text-gray-600">puntos</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-blue-700">{actualMinutes}</div>
                  <div className="text-xs text-gray-600">minutos</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button onClick={handleFinish} variant="primary" fullWidth>
                  Continuar
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-sm text-gray-500 mt-4"
              >
                ¡Cada pequeño paso cuenta! 💪
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
