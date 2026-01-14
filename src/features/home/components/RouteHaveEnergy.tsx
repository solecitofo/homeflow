import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, Check, Loader2 } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { SessionClosure } from './SessionClosure';
import { useAdaptiveEngine } from '../hooks/useAdaptiveEngine';
import { useUserId } from '../../../shared/hooks/useUserId';
import { IntensitySelector, IntensityLevel } from '../../tasks/components/IntensitySelector';
import type { TimeAvailable, SuggestedTask, PostTaskFeeling } from '../types';

// Tareas sugeridas por tiempo disponible (fallback si el motor no retorna nada)
const tasksByTime: Record<TimeAvailable, SuggestedTask[]> = {
  '5min': [
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
  '15min': [
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
  '30min': [
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
  '1hour': [
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

type Phase = 'loading' | 'suggestion' | 'intensity' | 'task' | 'feedback' | 'complete' | 'closure';


export const RouteHaveEnergy: React.FC = () => {
  const navigate = useNavigate();
  const userId = useUserId();
  const { getRecommendations, recommendations, completeTask, loading: engineLoading } = useAdaptiveEngine(userId);
  
  const [phase, setPhase] = useState<Phase>('loading');
  const [selectedTask, setSelectedTask] = useState<SuggestedTask | null>(null);
  const [taskIndex, setTaskIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [feeling, setFeeling] = useState<PostTaskFeeling | null>(null);
  const [selectedIntensity, setSelectedIntensity] = useState<IntensityLevel>('basic');
  
  // Todas las tareas de fallback combinadas
  const allFallbackTasks: SuggestedTask[] = [
    ...tasksByTime['5min'],
    ...tasksByTime['15min'],
    ...tasksByTime['30min'],
  ];
  
  // Convertir tareas del motor a formato SuggestedTask
  const tasksFromEngine: SuggestedTask[] = recommendations.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description || '',
    estimatedMinutes: task.intensityLevels?.standard?.minutes || task.estimatedMinutes || 15,
    wellbeingImpact: (task.impactLevel === 'high' ? 5 : task.impactLevel === 'medium' ? 4 : 3) as 1 | 2 | 3 | 4 | 5,
    steps: task.steps || [],
    reason: `Basado en tus registros previos, esto suele hacerte sentir muy bien`,
  }));

  // Cargar recomendaciones al montar
  useEffect(() => {
    const loadRecommendations = async () => {
      await getRecommendations('have_energy');
      
      // Usar tareas del motor o fallback
      const tasks = tasksFromEngine.length > 0 ? tasksFromEngine : allFallbackTasks;
      if (tasks.length > 0) {
        setSelectedTask(tasks[0]);
      }
      setPhase('suggestion');
    };
    
    loadRecommendations();
  }, []);
  
  // Actualizar tarea seleccionada cuando cambien las recomendaciones
  useEffect(() => {
    if (tasksFromEngine.length > 0 && !selectedTask) {
      setSelectedTask(tasksFromEngine[0]);
    }
  }, [tasksFromEngine]);

  // Tareas disponibles
  const availableTasks = tasksFromEngine.length > 0 ? tasksFromEngine : allFallbackTasks;

  const handleNextSuggestion = () => {
    if (availableTasks.length === 0) return;
    const nextIndex = (taskIndex + 1) % availableTasks.length;
    setTaskIndex(nextIndex);
    setSelectedTask(availableTasks[nextIndex]);
  };

  const handleSelectIntensity = () => {
    // Ir a pantalla de selección de intensidad (Pantalla 8)
    setPhase('intensity');
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
      
      // Si completó todos los pasos, ir a la fase de feedback
      if (selectedTask && next.size === selectedTask.steps.length) {
        setTimeout(() => setPhase('feedback'), 500);
      }
      
      return next;
    });
  };

  const handleFeelingSelect = async (selectedFeeling: PostTaskFeeling) => {
    setFeeling(selectedFeeling);
    
    // Buscar si la tarea actual viene del motor
    const engineTask = recommendations.find(t => t.id === selectedTask?.id);
    if (engineTask && selectedTask) {
      // Tareas medianas dan 10 puntos base + 1 por minuto
      const points = 10 + selectedTask.estimatedMinutes;
      await completeTask(engineTask, selectedFeeling, selectedTask.estimatedMinutes, points);
    }
    
    setPhase('complete');
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
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 mt-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </motion.button>

        <AnimatePresence mode="wait">
          {/* PHASE: Loading */}
          {phase === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Buscando la mejor tarea para ti...</p>
            </motion.div>
          )}

          {/* PHASE: Task Suggestion - Pantalla 5 del wireframe */}
          {phase === 'suggestion' && selectedTask && (
            <motion.div
              key="suggestion"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Mensaje de ánimo */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl p-4 mb-6"
              >
                <p className="text-gray-700 text-center">
                  ¡Genial! Aprovechemos esa energía de forma estratégica
                </p>
              </motion.div>

              {/* Task Card - estilo wireframe */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-6 mb-6 text-white shadow-lg"
              >
                <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm mb-4">
                  💡 Sugerencia personalizada
                </div>
                
                <h2 className="text-2xl font-bold mb-2">
                  {selectedTask.title}
                </h2>
                <p className="opacity-90 mb-4">{selectedTask.description}</p>

                <div className="flex items-center gap-4 text-sm opacity-90">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedTask.estimatedMinutes} minutos
                  </span>
                  <span className="flex items-center gap-1">
                    {renderStars(selectedTask.wellbeingImpact)}
                    Impacto {selectedTask.wellbeingImpact >= 4 ? 'alto' : 'medio'}
                  </span>
                </div>
              </motion.div>

              {/* ¿Por qué esta tarea? */}
              <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
                <p className="text-gray-700">
                  <strong>¿Por qué esta?</strong> {selectedTask.reason || 'Basado en registros previos, esto suele hacerte sentir muy bien'}
                </p>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col gap-3">
                <Button onClick={handleSelectIntensity} className="w-full text-lg py-4">
                  Hacerlo
                </Button>
                <Button variant="outline" onClick={handleNextSuggestion} className="w-full">
                  Dame otra opción
                </Button>
              </div>
            </motion.div>
          )}

          {/* PHASE: Intensity Selection - Pantalla 8 del wireframe */}
          {phase === 'intensity' && selectedTask && (
            <motion.div
              key="intensity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {selectedTask.title}
              </h2>

              <IntensitySelector
                selected={selectedIntensity}
                onSelect={setSelectedIntensity}
                taskName={selectedTask.title}
                intensityTimes={{
                  basic: Math.round(selectedTask.estimatedMinutes * 0.3),
                  standard: selectedTask.estimatedMinutes,
                  deep: Math.round(selectedTask.estimatedMinutes * 2),
                }}
              />

              <div className="mt-6">
                <Button onClick={handleStartTask} className="w-full text-lg py-4">
                  Empezar con nivel {selectedIntensity === 'basic' ? 'básico' : selectedIntensity === 'standard' ? 'estándar' : 'profundo'}
                </Button>
              </div>
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

          {/* PHASE: Feedback - Pantalla 4 del wireframe */}
          {phase === 'feedback' && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              {/* Celebración */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="text-6xl mb-4"
              >
                ✨
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                ¡Lo hiciste!
              </h2>
              <p className="text-gray-600 mb-2">
                Completaste: {selectedTask?.title}
              </p>
              <p className="text-gray-500 text-sm mb-6">
                en {selectedTask?.estimatedMinutes} minutos
              </p>

              {/* Comparación de ánimo ANTES → AHORA */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center justify-center gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">ANTES</p>
                  <span className="text-4xl">⚡</span>
                </div>
                <span className="text-2xl text-green-500">→</span>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">AHORA</p>
                  <span className="text-4xl">?</span>
                </div>
              </div>
              
              {/* Pregunta de feedback */}
              <p className="font-semibold text-gray-700 mb-4">
                ¿Cómo te sientes AHORA?
              </p>
              
              <div className="flex justify-center gap-3 mb-6">
                {[
                  { feeling: 'worse' as PostTaskFeeling, icon: '😓' },
                  { feeling: 'same' as PostTaskFeeling, icon: '😐' },
                  { feeling: 'relieved' as PostTaskFeeling, icon: '😌' },
                  { feeling: 'better' as PostTaskFeeling, icon: '😊' },
                  { feeling: 'proud' as PostTaskFeeling, icon: '😁' },
                ].map((option) => (
                  <motion.button
                    key={option.feeling}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFeelingSelect(option.feeling)}
                    className="text-4xl p-2 rounded-xl hover:bg-gray-100 transition-all opacity-60 hover:opacity-100"
                  >
                    {option.icon}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* PHASE: Complete - Después del feedback */}
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
                {feeling === 'proud' || feeling === 'better' ? '🎉' : feeling === 'relieved' ? '😌' : '💪'}
              </motion.div>

              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {feeling === 'proud' || feeling === 'better' 
                  ? '¡Genial! El movimiento genera motivación.'
                  : feeling === 'relieved'
                  ? '¡Aliviado/a! Un peso menos encima.'
                  : 'Has dado un paso. Eso es lo que importa.'}
              </h1>

              {/* Racha - Wireframe Pantalla 4 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-4 mb-6 text-white"
              >
                <div className="text-3xl font-bold">🔥 3</div>
                <div className="text-sm opacity-90">días seguidos haciendo algo</div>
              </motion.div>

              <p className="text-gray-600 mb-6">
                ¿Quieres seguir aprovechando la energía?
              </p>

              <div className="flex flex-col gap-3">
                <Button onClick={() => {
                  handleNextSuggestion();
                  setPhase('suggestion');
                  setSelectedIntensity('basic');
                  setCompletedSteps(new Set());
                }} className="w-full">
                  Sí, hacer otra tarea
                </Button>
                <Button variant="outline" onClick={() => setPhase('closure')} className="w-full">
                  No, suficiente por hoy
                </Button>
                        {/* PHASE: Closure - Cierre de sesión */}
                        {phase === 'closure' && (
                          <SessionClosure onHome={() => navigate('/')} />
                        )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
