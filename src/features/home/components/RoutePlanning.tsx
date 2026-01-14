import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, ListTodo, Clock, ChevronRight, Check } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

type PlanningType = 'weekly' | 'today' | 'priorities';

interface PlanningOption {
  type: PlanningType;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const planningOptions: PlanningOption[] = [
  {
    type: 'today',
    icon: <Clock className="w-6 h-6" />,
    title: 'Planificar hoy',
    description: '¿Qué puedo hacer hoy de forma realista?',
  },
  {
    type: 'weekly',
    icon: <Calendar className="w-6 h-6" />,
    title: 'Planificar la semana',
    description: 'Organizar tareas para los próximos días',
  },
  {
    type: 'priorities',
    icon: <ListTodo className="w-6 h-6" />,
    title: 'Definir prioridades',
    description: '¿Qué es lo más importante ahora?',
  },
];

// Preguntas guiadas para planificar el día
const todayQuestions = [
  { q: '¿Cuánta energía tienes hoy del 1 al 5?', type: 'energy' },
  { q: '¿Tienes compromisos fijos hoy?', type: 'commitments' },
  { q: '¿Hay algo urgente que deba hacerse?', type: 'urgent' },
];

// Áreas de la casa para priorizar
const houseAreas = [
  { id: 'kitchen', icon: '🍳', name: 'Cocina' },
  { id: 'bedroom', icon: '🛏️', name: 'Dormitorio' },
  { id: 'bathroom', icon: '🚿', name: 'Baño' },
  { id: 'living', icon: '🛋️', name: 'Salón' },
  { id: 'entrance', icon: '🚪', name: 'Entrada' },
  { id: 'laundry', icon: '🧺', name: 'Colada' },
];

type Phase = 'select' | 'today' | 'weekly' | 'priorities' | 'result';

export const RoutePlanning: React.FC = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('select');
  const [planningType, setPlanningType] = useState<PlanningType | null>(null);
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [selectedAreas, setSelectedAreas] = useState<Set<string>>(new Set());
  const [weeklyPlan, setWeeklyPlan] = useState<Record<string, string[]>>({});

  const handlePlanningSelect = (type: PlanningType) => {
    setPlanningType(type);
    setPhase(type);
  };

  const toggleArea = (areaId: string) => {
    setSelectedAreas(prev => {
      const next = new Set(prev);
      if (next.has(areaId)) {
        next.delete(areaId);
      } else {
        next.add(areaId);
      }
      return next;
    });
  };

  const generateDayPlan = () => {
    // Genera un plan basado en el nivel de energía
    const plans: Record<number, string[]> = {
      1: ['Hacer la cama', 'Recoger 5 objetos'],
      2: ['Hacer la cama', 'Limpiar encimera cocina', 'Sacar basura'],
      3: ['Hacer la cama', 'Limpieza rápida cocina', 'Ordenar una habitación'],
      4: ['Limpieza cocina completa', 'Ordenar dormitorio', 'Pasar aspiradora salón'],
      5: ['Limpieza profunda de una zona', 'Ordenar armario', 'Limpiar baño completo'],
    };
    return plans[energyLevel] || plans[3];
  };

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-primary-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => phase === 'select' ? navigate('/') : setPhase('select')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 mt-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </motion.button>

        <AnimatePresence mode="wait">
          {/* PHASE: Select Planning Type */}
          {phase === 'select' && (
            <motion.div
              key="select"
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
                  📝
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  ¿Qué quieres organizar?
                </h1>
                <p className="text-lg text-gray-600">
                  Planificar reduce la carga mental
                </p>
              </div>

              <div className="space-y-3">
                {planningOptions.map((option, index) => (
                  <motion.button
                    key={option.type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.08 }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePlanningSelect(option.type)}
                    className="w-full bg-white rounded-xl p-5 shadow-sm border-2 border-gray-200 
                             hover:border-blue-400 transition-all flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      {option.icon}
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-bold text-gray-800">{option.title}</p>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* PHASE: Plan Today */}
          {phase === 'today' && (
            <motion.div
              key="today"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  ¿Cuánta energía tienes hoy?
                </h2>

                <div className="flex justify-between mb-8">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <motion.button
                      key={level}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEnergyLevel(level)}
                      className={`
                        w-14 h-14 rounded-full text-2xl font-bold transition-all
                        ${energyLevel === level
                          ? 'bg-blue-500 text-white scale-110 shadow-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
                      `}
                    >
                      {level}
                    </motion.button>
                  ))}
                </div>

                <div className="flex justify-between text-sm text-gray-500 mb-6">
                  <span>Muy baja</span>
                  <span>Muy alta</span>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <p className="text-sm font-medium text-blue-800 mb-2">
                    Plan sugerido para energía nivel {energyLevel}:
                  </p>
                  <ul className="space-y-2">
                    {generateDayPlan().map((task, i) => (
                      <li key={i} className="flex items-center gap-2 text-blue-700">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button onClick={() => navigate('/')} className="w-full">
                  Aceptar este plan
                </Button>
              </div>

              <p className="text-center text-sm text-gray-500">
                💡 Es mejor hacer poco consistentemente que mucho de vez en cuando
              </p>
            </motion.div>
          )}

          {/* PHASE: Weekly Planning */}
          {phase === 'weekly' && (
            <motion.div
              key="weekly"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Plan semanal simple
                </h2>
                <p className="text-gray-600 mb-6">
                  Asigna un área de la casa a cada día
                </p>

                <div className="space-y-3 mb-6">
                  {days.slice(0, 5).map((day, index) => (
                    <div
                      key={day}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <span className="font-medium text-gray-700 w-24">{day}</span>
                      <span className="text-2xl">→</span>
                      <span className="text-lg">
                        {houseAreas[index % houseAreas.length].icon}
                      </span>
                      <span className="text-gray-600">
                        {houseAreas[index % houseAreas.length].name}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-sage-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-sage-700">
                    <strong>Tip:</strong> Los fines de semana puedes descansar o hacer tareas 
                    más grandes si tienes energía.
                  </p>
                </div>

                <Button onClick={() => navigate('/')} className="w-full">
                  Guardar plan semanal
                </Button>
              </div>
            </motion.div>
          )}

          {/* PHASE: Set Priorities */}
          {phase === 'priorities' && (
            <motion.div
              key="priorities"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  ¿Qué áreas necesitan más atención?
                </h2>
                <p className="text-gray-600 mb-6">
                  Selecciona máximo 3 prioridades
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {houseAreas.map((area) => (
                    <motion.button
                      key={area.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => selectedAreas.size < 3 || selectedAreas.has(area.id) 
                        ? toggleArea(area.id) 
                        : null}
                      className={`
                        p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2
                        ${selectedAreas.has(area.id)
                          ? 'bg-blue-50 border-blue-400'
                          : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                        }
                        ${selectedAreas.size >= 3 && !selectedAreas.has(area.id)
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                        }
                      `}
                    >
                      <span className="text-3xl">{area.icon}</span>
                      <span className="font-medium text-gray-700">{area.name}</span>
                      {selectedAreas.has(area.id) && (
                        <Check className="w-5 h-5 text-blue-500" />
                      )}
                    </motion.button>
                  ))}
                </div>

                {selectedAreas.size > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-blue-50 rounded-xl p-4 mb-6"
                  >
                    <p className="text-sm font-medium text-blue-800 mb-2">
                      Tus prioridades:
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {Array.from(selectedAreas).map(id => {
                        const area = houseAreas.find(a => a.id === id);
                        return area ? (
                          <span key={id} className="bg-blue-100 px-3 py-1 rounded-full text-blue-700">
                            {area.icon} {area.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </motion.div>
                )}

                <Button 
                  onClick={() => navigate('/')} 
                  className="w-full"
                  disabled={selectedAreas.size === 0}
                >
                  Establecer prioridades
                </Button>
              </div>

              <p className="text-center text-sm text-gray-500">
                💡 Enfocarte en pocas cosas es más efectivo que intentar todo a la vez
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
