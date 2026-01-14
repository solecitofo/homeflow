import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shuffle, Sofa, Lightbulb } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import type { Barrier } from '../types';

interface BarrierOption {
  barrier: Barrier;
  icon: string;
  title: string;
}

const barrierOptions: BarrierOption[] = [
  { barrier: 'no_energy', icon: '😴', title: 'No tengo energía' },
  { barrier: 'dont_know_first', icon: '🤔', title: 'No sé qué hacer primero' },
  { barrier: 'not_perfect_time', icon: '⏰', title: 'No es el momento "perfecto"' },
  { barrier: 'too_much', icon: '🎯', title: 'Me parece demasiado' },
  { barrier: 'anxiety', icon: '😰', title: 'Me da ansiedad empezar' },
];

// Tareas aleatorias de bajo esfuerzo
const lowEffortTasks = [
  'Vaciar una papelera de la casa',
  'Tirar un folleto o papel viejo',
  'Guardar algo que esté sobre la mesa',
  'Colgar una prenda que esté fuera del armario',
  'Limpiar una superficie con un paño',
  'Tirar una cosa caducada de la nevera',
  'Ordenar un cajón pequeño',
  'Doblar una toalla',
];

// Tareas desde el sofá (sin movimiento)
const sofaTasks = [
  { icon: '📝', title: 'Hacer lista de compra', desc: 'Revisa mentalmente qué falta' },
  { icon: '🗂️', title: 'Revisar qué hay en la nevera', desc: 'Haz inventario mental' },
  { icon: '📋', title: 'Planificar menú de mañana', desc: 'Decide qué comerás' },
  { icon: '📱', title: 'Pedir cita pendiente', desc: 'Médico, peluquería, etc.' },
  { icon: '💭', title: 'Decidir una cosa para donar', desc: 'Piensa en algo que no uses' },
];

type Phase = 'barrier' | 'intervention';

export const RouteHardToStart: React.FC = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('barrier');
  const [selectedBarrier, setSelectedBarrier] = useState<Barrier | null>(null);
  const [randomTask, setRandomTask] = useState(() => 
    lowEffortTasks[Math.floor(Math.random() * lowEffortTasks.length)]
  );

  const handleBarrierSelect = (barrier: Barrier) => {
    setSelectedBarrier(barrier);
    setPhase('intervention');
  };

  const getNewRandomTask = () => {
    const otherTasks = lowEffortTasks.filter(t => t !== randomTask);
    setRandomTask(otherTasks[Math.floor(Math.random() * otherTasks.length)]);
  };

  const renderIntervention = () => {
    switch (selectedBarrier) {
      case 'dont_know_first':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-6">
              <p className="text-lg text-gray-600">
                Voy a <span className="font-bold text-primary-600">decidir por ti</span> para ahorrar energía:
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
              <div className="flex items-center gap-2 text-purple-600 mb-4">
                <Shuffle className="w-5 h-5" />
                <span className="font-semibold">Tarea aleatoria de bajo esfuerzo:</span>
              </div>
              
              <motion.p
                key={randomTask}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl text-gray-800 mb-6"
              >
                "{randomTask}"
              </motion.p>

              <p className="text-sm text-gray-500 italic mb-6">
                A veces lo mejor es simplemente EMPEZAR con cualquier cosa
              </p>

              <div className="flex flex-col gap-3">
                <Button onClick={() => navigate('/')} className="w-full">
                  Vale, voy
                </Button>
                <Button variant="outline" onClick={getNewRandomTask} className="w-full">
                  <Shuffle className="w-4 h-4 mr-2" />
                  Dame otra
                </Button>
              </div>
            </div>
          </motion.div>
        );

      case 'no_energy':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="text-5xl mb-4"
              >
                😌
              </motion.div>
              <p className="text-lg text-gray-600">
                Entiendo. ¿Qué tal si hacemos algo que <br />
                <span className="font-bold text-primary-600">NO requiera moverte mucho</span>?
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {sofaTasks.map((task, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.08 }}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/')}
                  className="w-full bg-white rounded-xl p-4 shadow-sm border-2 border-gray-200 
                           hover:border-purple-300 transition-all flex items-center gap-4"
                >
                  <span className="text-2xl">{task.icon}</span>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">{task.title}</p>
                    <p className="text-sm text-gray-500">{task.desc}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="bg-sage-50 rounded-xl p-4 flex items-start gap-3">
              <Sofa className="w-5 h-5 text-sage-600 mt-0.5" />
              <p className="text-sm text-sage-700">
                <strong>Avanzar ≠ esfuerzo físico.</strong> Planificar desde el sofá también cuenta.
              </p>
            </div>
          </motion.div>
        );

      case 'not_perfect_time':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="text-5xl mb-4"
              >
                🙃
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Aquí hay un secreto:
              </h2>
              
              <p className="text-xl text-gray-600 mb-6">
                El momento perfecto <span className="font-bold text-purple-600">no existe</span>
              </p>

              <div className="bg-purple-50 rounded-xl p-4 mb-6">
                <p className="text-gray-700">
                  Pero... ¿qué pasaría si haces <strong>SOLO la primera parte</strong> ahora?
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  No tienes que terminar, solo empezar.
                </p>
              </div>

              <Button onClick={() => navigate('/flow/overwhelmed')} className="w-full">
                Ok, solo empiezo
              </Button>
            </div>

            <div className="flex items-start gap-3 text-left">
              <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
              <p className="text-sm text-gray-600">
                <strong>Dato TCC:</strong> La motivación suele venir DESPUÉS de empezar, no antes.
              </p>
            </div>
          </motion.div>
        );

      case 'too_much':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="text-5xl mb-4"
              >
                🧩
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Vamos a hacerlo diminuto
              </h2>
              
              <p className="text-lg text-gray-600 mb-6">
                No pienses en "ordenar la casa".<br />
                Piensa en <span className="font-bold text-purple-600">mover un objeto</span>.
              </p>

              <div className="bg-purple-50 rounded-xl p-4 mb-6">
                <p className="text-gray-700 font-medium mb-2">
                  Tu única misión ahora:
                </p>
                <p className="text-xl text-gray-800">
                  "Coge una cosa y ponla en su sitio"
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Eso es todo. Literalmente.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button onClick={() => navigate('/')} className="w-full">
                  Puedo hacer eso
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/flow/overwhelmed')}
                  className="w-full"
                >
                  Necesito más guía
                </Button>
              </div>
            </div>
          </motion.div>
        );

      case 'anxiety':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="text-5xl mb-4"
              >
                💜
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Primero, respira
              </h2>
              
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: 3, duration: 4 }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-200 to-primary-200 flex items-center justify-center"
              >
                <span className="text-4xl">🌬️</span>
              </motion.div>

              <p className="text-lg text-gray-600 mb-6">
                La ansiedad hace que todo parezca más grande de lo que es.
              </p>

              <div className="bg-purple-50 rounded-xl p-4 mb-6">
                <p className="text-gray-700">
                  No tienes que hacer nada perfecto.<br />
                  <strong>Cualquier paso pequeño vale.</strong>
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button onClick={() => navigate('/flow/overwhelmed')} className="w-full">
                  Dame algo muy pequeño
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  Mejor lo dejo para después
                </Button>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Está bien dejarlo. Cuidar tu bienestar también es importante.
            </p>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-primary-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => phase === 'barrier' ? navigate('/') : setPhase('barrier')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 mt-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </motion.button>

        <AnimatePresence mode="wait">
          {/* PHASE: Barrier Selection */}
          {phase === 'barrier' && (
            <motion.div
              key="barrier"
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
                  😓
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  ¿Qué te está frenando?
                </h1>
                <p className="text-lg text-gray-600">
                  Identificar la barrera nos ayuda a superarla
                </p>
              </div>

              <div className="space-y-3">
                {barrierOptions.map((option, index) => (
                  <motion.button
                    key={option.barrier}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.08 }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBarrierSelect(option.barrier)}
                    className="w-full bg-white rounded-xl p-4 shadow-sm border-2 border-gray-200 
                             hover:border-purple-400 transition-all flex items-center gap-4"
                  >
                    <span className="text-3xl">{option.icon}</span>
                    <span className="text-lg font-medium text-gray-700">{option.title}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* PHASE: Intervention */}
          {phase === 'intervention' && (
            <motion.div
              key="intervention"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderIntervention()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
