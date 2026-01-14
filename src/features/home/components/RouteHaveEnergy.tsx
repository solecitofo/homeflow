import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, Check, ChevronRight } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import type { TimeAvailable, SuggestedTask } from '../types';

// Tareas sugeridas por tiempo disponible
const tasksByTime: Record<TimeAvailable, SuggestedTask[]> = {
  '5-10': [
    {
      id: 'quick-1',
      title: 'Limpieza express de encimera',
      description: 'Despeja y pasa la bayeta',
      estimatedMinutes: 5,
      wellbeingImpact: 4,
      steps: ['Recoge objetos sueltos', 'Pasa bayeta húmeda', 'Seca superficies'],
      reason: 'Una encimera despejada reduce la sensación de caos visual',
    },
    {
      id: 'quick-2',
      title: 'Hacer la cama',
      description: 'La habitación se ve ordenada al instante',
      estimatedMinutes: 3,
      wellbeingImpact: 5,
      steps: ['Estira sábanas', 'Coloca almohadas', 'Dobla manta/edredón'],
      reason: 'Tarea pequeña con alto impacto visual inmediato',
    },
    {
      id: 'quick-3',
      title: 'Vaciar lavaplatos/lavavajillas',
      description: 'Despeja para poder cargar platos sucios',
      estimatedMinutes: 8,
      wellbeingImpact: 4,
      steps: ['Saca platos', 'Guarda en su sitio', 'Deja listo para cargar'],
    },
  ],
  '15-20': [
    {
      id: 'medium-1',
      title: 'Limpieza express de cocina',
      description: 'Encimera, platos y bayetazo general',
      estimatedMinutes: 15,
      wellbeingImpact: 5,
      steps: ['Recoger encimera', 'Fregar platos visibles', 'Pasar bayeta', 'Barrer suelo rápido'],
      reason: 'La cocina limpia tiene un efecto calmante comprobado',
    },
    {
      id: 'medium-2',
      title: 'Ordenar salón',
      description: 'Recoger, colocar cojines, pasar plumero',
      estimatedMinutes: 15,
      wellbeingImpact: 5,
      steps: ['Recoger objetos sueltos', 'Doblar mantas', 'Colocar cojines', 'Limpiar superficies'],
    },
    {
      id: 'medium-3',
      title: 'Baño rápido',
      description: 'Espejo, lavabo y suelo',
      estimatedMinutes: 12,
      wellbeingImpact: 4,
      steps: ['Limpiar espejo', 'Lavar lavabo', 'Recoger toallas', 'Pasar mopa rápida'],
    },
  ],
  '30+': [
    {
      id: 'long-1',
      title: 'Limpieza profunda de cocina',
      description: 'Incluye electrodomésticos y organización',
      estimatedMinutes: 35,
      wellbeingImpact: 5,
      steps: ['Vaciar nevera de productos caducados', 'Limpiar encimeras', 'Fregar platos', 'Limpiar vitrocerámica', 'Barrer y fregar suelo'],
    },
    {
      id: 'long-2',
      title: 'Ordenar armario',
      description: 'Reorganiza una sección de tu armario',
      estimatedMinutes: 30,
      wellbeingImpact: 4,
      steps: ['Sacar todo de una sección', 'Decidir qué conservar', 'Doblar/colgar ordenadamente', 'Reorganizar por tipo/color'],
    },
  ],
  'unsure': [
    {
      id: 'unsure-1',
      title: 'Recorrido de 10 minutos',
      description: 'Recoge 10 objetos fuera de lugar en la casa',
      estimatedMinutes: 10,
      wellbeingImpact: 4,
      steps: ['Coge una bolsa o cesta', 'Recorre las habitaciones', 'Recoge objetos descolocados', 'Devuélvelos a su sitio'],
      reason: 'Cuando no sabes cuánto tiempo tienes, algo es mejor que nada',
    },
  ],
};

type Phase = 'time' | 'suggestion' | 'task' | 'complete';

export const RouteHaveEnergy: React.FC = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('time');
  const [timeAvailable, setTimeAvailable] = useState<TimeAvailable | null>(null);
  const [selectedTask, setSelectedTask] = useState<SuggestedTask | null>(null);
  const [taskIndex, setTaskIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleTimeSelect = (time: TimeAvailable) => {
    setTimeAvailable(time);
    const tasks = tasksByTime[time];
    setSelectedTask(tasks[0]);
    setPhase('suggestion');
  };

  const handleNextSuggestion = () => {
    if (!timeAvailable) return;
    const tasks = tasksByTime[timeAvailable];
    const nextIndex = (taskIndex + 1) % tasks.length;
    setTaskIndex(nextIndex);
    setSelectedTask(tasks[nextIndex]);
  };

  const handleStartTask = () => {
    setPhase('task');
    setCompletedSteps(new Set());
  };

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      
      // Si completó todos los pasos, ir a la fase de completado
      if (selectedTask && next.size === selectedTask.steps.length) {
        setTimeout(() => setPhase('complete'), 500);
      }
      
      return next;
    });
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < count ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-primary-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => phase === 'time' ? navigate('/') : setPhase('time')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 mt-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </motion.button>

        <AnimatePresence mode="wait">
          {/* PHASE: Time Selection */}
          {phase === 'time' && (
            <motion.div
              key="time"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="text-6xl mb-4"
                >
                  ⚡
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  ¡Aprovechemos esa energía!
                </h1>
                <p className="text-lg text-gray-600">
                  ¿Cuánto tiempo tienes disponible?
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { time: '5-10' as TimeAvailable, label: '5-10 minutos', icon: '⏱️' },
                  { time: '15-20' as TimeAvailable, label: '15-20 minutos', icon: '🕐' },
                  { time: '30+' as TimeAvailable, label: '30+ minutos', icon: '⏰' },
                  { time: 'unsure' as TimeAvailable, label: 'No estoy seguro/a', icon: '🤷' },
                ].map((option, index) => (
                  <motion.button
                    key={option.time}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTimeSelect(option.time)}
                    className="w-full bg-white rounded-xl p-4 shadow-sm border-2 border-gray-200 
                             hover:border-yellow-400 transition-all flex items-center gap-4"
                  >
                    <span className="text-3xl">{option.icon}</span>
                    <span className="text-lg font-medium text-gray-700">{option.label}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* PHASE: Task Suggestion */}
          {phase === 'suggestion' && selectedTask && (
            <motion.div
              key="suggestion"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-6">
                <p className="text-lg text-gray-600">
                  💡 Sugerencia personalizada
                </p>
              </div>

              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-3xl shadow-xl p-6 mb-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedTask.title}
                </h2>
                <p className="text-gray-600 mb-4">{selectedTask.description}</p>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-5 h-5" />
                    <span>{selectedTask.estimatedMinutes} min</span>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">Impacto en tu bienestar:</p>
                  <div className="flex items-center gap-1">
                    {renderStars(selectedTask.wellbeingImpact)}
                  </div>
                  {selectedTask.reason && (
                    <p className="text-xs text-gray-500 mt-2 italic">
                      {selectedTask.reason}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Incluye:</p>
                  <ul className="space-y-1">
                    {selectedTask.steps.map((step, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary-400 rounded-full" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-3">
                  <Button onClick={handleStartTask} className="w-full text-lg py-4">
                    ¡Hacerlo!
                  </Button>
                  <Button variant="outline" onClick={handleNextSuggestion} className="w-full">
                    Dame otra opción
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* PHASE: Task Execution */}
          {phase === 'task' && selectedTask && (
            <motion.div
              key="task"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedTask.title}
                  </h2>
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                    {completedSteps.size}/{selectedTask.steps.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedTask.steps.map((step, index) => (
                    <motion.button
                      key={index}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleStep(index)}
                      className={`
                        w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all
                        ${completedSteps.has(index)
                          ? 'bg-green-50 border-green-300'
                          : 'bg-gray-50 border-gray-200 hover:border-primary-300'
                        }
                      `}
                    >
                      <div
                        className={`
                          w-7 h-7 rounded-full flex items-center justify-center transition-colors
                          ${completedSteps.has(index)
                            ? 'bg-green-500 text-white'
                            : 'bg-white border-2 border-gray-300'
                          }
                        `}
                      >
                        {completedSteps.has(index) && <Check className="w-4 h-4" />}
                      </div>
                      <span
                        className={`
                          text-left flex-1
                          ${completedSteps.has(index) ? 'line-through text-gray-500' : 'text-gray-700'}
                        `}
                      >
                        {step}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <p className="text-center text-sm text-gray-500">
                Marca cada paso al completarlo
              </p>
            </motion.div>
          )}

          {/* PHASE: Complete */}
          {phase === 'complete' && selectedTask && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="text-7xl mb-6"
              >
                🎉
              </motion.div>

              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                ¡Completado!
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {selectedTask.title} en {selectedTask.estimatedMinutes} minutos
              </p>

              <div className="bg-sage-50 rounded-xl p-4 mb-8">
                <p className="text-sage-700">
                  🏆 Has aprovechado muy bien tu energía
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button onClick={() => setPhase('time')} className="w-full">
                  Hacer otra tarea
                </Button>
                <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                  Volver al inicio
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
