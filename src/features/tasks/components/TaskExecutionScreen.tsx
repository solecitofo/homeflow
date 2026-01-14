import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, Check, Clock } from 'lucide-react';
import { db, Task } from '../../../db/database';
import { useTaskExecution } from '../hooks/useTaskExecution';
import { useTimer, formatTime } from '../../../shared/hooks/useTimer';
import { Button } from '../../../shared/components/Button';
import { IntensitySelector } from './IntensitySelector';
import { EmotionalCheckIn } from './EmotionalCheckIn';
import { TaskSteps } from './TaskSteps';
import { TaskCompletionModal } from './TaskCompletionModal';

export const TaskExecutionScreen: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  // Load task
  useEffect(() => {
    if (!taskId) {
      navigate('/');
      return;
    }

    const loadTask = async () => {
      const foundTask = await db.tasks.get(taskId);
      if (!foundTask) {
        navigate('/');
        return;
      }
      setTask(foundTask);
      setLoading(false);
    };

    loadTask();
  }, [taskId, navigate]);

  // Task execution state machine
  const execution = task ? useTaskExecution(task) : null;

  // Timer
  const timer = useTimer(0, false);

  // Handle back navigation
  const handleBack = () => {
    if (execution?.phase === 'executing' && timer.isRunning) {
      if (confirm('¿Estás seguro de que quieres salir? Perderás el progreso de esta tarea.')) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  // Loading state
  if (loading || !task || !execution) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Cargando tarea...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver</span>
          </button>
          {execution.phase === 'executing' && (
            <div className="flex items-center gap-2 text-primary-600">
              <Clock className="w-5 h-5" />
              <span className="text-lg font-mono font-bold">
                {formatTime(timer.seconds)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Preview Phase */}
          {execution.phase === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Task Header */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {task.title}
                </h1>
                <p className="text-gray-600 mb-4">{task.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    {task.estimatedMinutes} min
                  </span>
                  <span className="px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-sm font-medium capitalize">
                    {task.effortLevel}
                  </span>
                  <span className="px-3 py-1 bg-empathy-100 text-empathy-700 rounded-full text-sm font-medium capitalize">
                    Impacto {task.impactLevel}
                  </span>
                </div>
              </div>

              {/* Intensity Selector (if task has intensity levels) */}
              {task.intensityLevels && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <IntensitySelector
                    selected={execution.intensity}
                    onSelect={execution.setIntensity}
                  />
                </div>
              )}

              {/* Task Steps Preview */}
              {execution.steps.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Pasos de la tarea:
                  </h3>
                  <ul className="space-y-2">
                    {execution.steps.map((step, index) => (
                      <li key={step.id} className="flex items-start gap-2 text-gray-700">
                        <span className="text-primary-500 font-bold">{index + 1}.</span>
                        <span>{step.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Start Button */}
              <Button
                variant="primary"
                onClick={execution.startTask}
                fullWidth
                className="text-lg py-4"
              >
                <Play className="w-5 h-5 mr-2" />
                Comenzar tarea
              </Button>
            </motion.div>
          )}

          {/* Mood Before Phase */}
          {execution.phase === 'mood-before' && (
            <motion.div
              key="mood-before"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <EmotionalCheckIn
                title="¿Cómo te sientes ahora antes de empezar?"
                selected={execution.moodBefore}
                onSelect={execution.setMoodBefore}
              />
              <p className="text-sm text-gray-500 text-center mt-4">
                Esto nos ayudará a entender el impacto de la tarea en tu bienestar
              </p>
            </motion.div>
          )}

          {/* Executing Phase */}
          {execution.phase === 'executing' && (
            <motion.div
              key="executing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Timer Card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{task.title}</h2>
                <div className="text-6xl font-mono font-bold text-primary-600 mb-6">
                  {formatTime(timer.seconds)}
                </div>
                <div className="flex gap-3 justify-center">
                  {!timer.isRunning ? (
                    <Button variant="primary" onClick={timer.start}>
                      <Play className="w-5 h-5 mr-2" />
                      Iniciar
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={timer.pause}>
                      <Pause className="w-5 h-5 mr-2" />
                      Pausar
                    </Button>
                  )}
                </div>
              </div>

              {/* Task Steps */}
              {execution.steps.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <TaskSteps
                    steps={execution.steps}
                    onToggleStep={execution.toggleStep}
                  />
                </div>
              )}

              {/* Complete Button */}
              <Button
                variant="primary"
                onClick={() => {
                  timer.pause();
                  execution.completeTask();
                }}
                disabled={!execution.allStepsCompleted}
                fullWidth
                className="text-lg py-4"
              >
                <Check className="w-5 h-5 mr-2" />
                {execution.allStepsCompleted
                  ? 'Completar tarea'
                  : 'Completa todos los pasos primero'}
              </Button>
            </motion.div>
          )}

          {/* Mood After Phase */}
          {execution.phase === 'mood-after' && (
            <motion.div
              key="mood-after"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <EmotionalCheckIn
                title="¿Cómo te sientes ahora después de completar la tarea?"
                selected={execution.moodAfter}
                onSelect={execution.setMoodAfter}
              />
              <p className="text-sm text-gray-500 text-center mt-4">
                ¡Casi terminamos! Solo necesitamos saber cómo te sientes ahora
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Completion Modal */}
      {execution.phase === 'completed' &&
        execution.moodBefore !== null &&
        execution.moodAfter !== null && (
          <TaskCompletionModal
            isOpen={true}
            task={task}
            actualMinutes={timer.minutes}
            moodBefore={execution.moodBefore}
            moodAfter={execution.moodAfter}
            onClose={() => navigate('/')}
          />
        )}
    </div>
  );
};
