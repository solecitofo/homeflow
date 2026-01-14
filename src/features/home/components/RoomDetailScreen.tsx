import React, { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Clock, Play, ListChecks, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { db, type Task } from '../../../db/database';
import { getCompletedTaskIdsToday } from '../../../db/operations/activityLogs';
import { useUserId } from '../../../shared/hooks/useUserId';

// Tipos
interface QuickMission {
  id: string;
  title: string;
  durationMinutes: number;
  color: string;
}

interface RoomData {
  id: string;
  name: string;
  icon: string;
  lastAttention: string;
  missions: QuickMission[];
}

// Datos de habitaciones con misiones
const roomsData: Record<string, RoomData> = {
  kitchen: {
    id: 'kitchen',
    name: 'Cocina',
    icon: '🍳',
    lastAttention: 'Hoy',
    missions: [
      { id: 'k1', title: 'Limpiar encimera', durationMinutes: 5, color: 'from-green-400 to-green-600' },
      { id: 'k2', title: 'Fregar platos', durationMinutes: 10, color: 'from-blue-400 to-blue-600' },
      { id: 'k3', title: 'Barrer suelo', durationMinutes: 5, color: 'from-orange-400 to-orange-600' },
      { id: 'k4', title: 'Limpiar vitro', durationMinutes: 8, color: 'from-purple-400 to-purple-600' },
    ],
  },
  living: {
    id: 'living',
    name: 'Salón',
    icon: '🛋️',
    lastAttention: 'Hace 2 días',
    missions: [
      { id: 'l1', title: 'Recoger objetos sueltos', durationMinutes: 5, color: 'from-green-400 to-green-600' },
      { id: 'l2', title: 'Colocar cojines', durationMinutes: 2, color: 'from-blue-400 to-blue-600' },
      { id: 'l3', title: 'Pasar plumero', durationMinutes: 5, color: 'from-orange-400 to-orange-600' },
      { id: 'l4', title: 'Doblar mantas', durationMinutes: 3, color: 'from-purple-400 to-purple-600' },
    ],
  },
  bedroom: {
    id: 'bedroom',
    name: 'Dormitorio',
    icon: '🛏️',
    lastAttention: 'Hace 5 días',
    missions: [
      { id: 'b1', title: 'Hacer la cama', durationMinutes: 2, color: 'from-green-400 to-green-600' },
      { id: 'b2', title: 'Recoger ropa del suelo', durationMinutes: 5, color: 'from-blue-400 to-blue-600' },
      { id: 'b3', title: 'Ordenar mesita de noche', durationMinutes: 3, color: 'from-orange-400 to-orange-600' },
      { id: 'b4', title: 'Guardar ropa limpia', durationMinutes: 10, color: 'from-purple-400 to-purple-600' },
    ],
  },
  bathroom: {
    id: 'bathroom',
    name: 'Baño',
    icon: '🚿',
    lastAttention: 'Sin datos',
    missions: [
      { id: 'ba1', title: 'Limpiar espejo', durationMinutes: 2, color: 'from-green-400 to-green-600' },
      { id: 'ba2', title: 'Limpiar lavabo', durationMinutes: 3, color: 'from-blue-400 to-blue-600' },
      { id: 'ba3', title: 'Limpiar WC', durationMinutes: 5, color: 'from-orange-400 to-orange-600' },
      { id: 'ba4', title: 'Ordenar toallas', durationMinutes: 2, color: 'from-purple-400 to-purple-600' },
    ],
  },
  entrance: {
    id: 'entrance',
    name: 'Entrada',
    icon: '🚪',
    lastAttention: 'Ayer',
    missions: [
      { id: 'e1', title: 'Ordenar zapatos', durationMinutes: 3, color: 'from-green-400 to-green-600' },
      { id: 'e2', title: 'Colgar abrigos', durationMinutes: 2, color: 'from-blue-400 to-blue-600' },
      { id: 'e3', title: 'Barrer entrada', durationMinutes: 3, color: 'from-orange-400 to-orange-600' },
    ],
  },
  laundry: {
    id: 'laundry',
    name: 'Lavadero',
    icon: '🧺',
    lastAttention: 'Hace 3 días',
    missions: [
      { id: 'la1', title: 'Poner lavadora', durationMinutes: 5, color: 'from-green-400 to-green-600' },
      { id: 'la2', title: 'Tender ropa', durationMinutes: 10, color: 'from-blue-400 to-blue-600' },
      { id: 'la3', title: 'Doblar ropa seca', durationMinutes: 15, color: 'from-orange-400 to-orange-600' },
      { id: 'la4', title: 'Planchar básico', durationMinutes: 20, color: 'from-purple-400 to-purple-600' },
    ],
  },
};

export const RoomDetailScreen: React.FC = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const userId = useUserId();
  const [selectedMissions, setSelectedMissions] = useState<Set<string>>(new Set());
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showTaskComplete, setShowTaskComplete] = useState(false);
  // Secuencia "Hacer todas"
  const [multiTaskMode, setMultiTaskMode] = useState(false);
  const [multiTaskQueue, setMultiTaskQueue] = useState<string[]>([]);
  const [multiTaskIndex, setMultiTaskIndex] = useState(0);
  const multiTaskActive = useRef(false);

  const room = roomId ? roomsData[roomId] : null;

  // Cargar tareas de la habitación y tareas completadas hoy
  useEffect(() => {
    if (!room) return;

    const loadRoomTasks = async () => {
      try {
        setLoading(true);

        // Cargar tareas de esta habitación desde DB
        const tasks = await db.tasks
          .where('room')
          .equals(room.id)
          .toArray();

        // Cargar IDs de tareas completadas hoy
        const completed = await getCompletedTaskIdsToday(userId);

        setAvailableTasks(tasks);
        setCompletedToday(completed);
      } catch (error) {
        console.error('Error loading room tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRoomTasks();
  }, [room, userId]);

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Habitación no encontrada</p>
          <Button onClick={() => navigate('/rooms')}>Volver</Button>
        </div>
      </div>
    );
  }

  const toggleMission = (missionId: string) => {
    setSelectedMissions(prev => {
      const next = new Set(prev);
      if (next.has(missionId)) {
        next.delete(missionId);
      } else {
        next.add(missionId);
      }
      return next;
    });
  };

  const totalTime = room.missions
    .filter(m => selectedMissions.has(m.id))
    .reduce((acc, m) => acc + m.durationMinutes, 0);

  const handleDoOne = async (taskId?: string, isMulti?: boolean) => {
    // Si se pasa un taskId, usar esa tarea directamente
    if (taskId) {
      navigate('/task/execute', {
        state: {
          taskId,
          fromRoom: room.id,
          intensityPreselected: 'standard',
          onComplete: () => {
            setShowTaskComplete(true);
            setTimeout(() => {
              setShowTaskComplete(false);
              if (isMulti && multiTaskActive.current) {
                setMultiTaskIndex(idx => idx + 1);
              }
            }, 1800);
          }
        }
      });
      return;
    }

    // Si no, buscar una tarea pendiente (no completada hoy)
    const pendingTask = availableTasks.find(t => !completedToday.has(t.id));

    if (pendingTask) {
      navigate('/task/execute', {
        state: {
          taskId: pendingTask.id,
          fromRoom: room.id,
          intensityPreselected: 'standard',
          onComplete: () => {
            setShowTaskComplete(true);
            setTimeout(() => setShowTaskComplete(false), 2000);
          }
        }
      });
    } else if (availableTasks.length > 0) {
      // Si todas están completadas, usar la primera
      navigate('/task/execute', {
        state: {
          taskId: availableTasks[0].id,
          fromRoom: room.id,
          intensityPreselected: 'standard',
          onComplete: () => {
            setShowTaskComplete(true);
            setTimeout(() => setShowTaskComplete(false), 2000);
          }
        }
      });
    }
  };

  const handleDoAll = () => {
    // Secuencia: solo tareas no completadas hoy
    const pending = availableTasks.filter(t => !completedToday.has(t.id)).map(t => t.id);
    if (pending.length === 0) return;
    setMultiTaskQueue(pending);
    setMultiTaskIndex(0);
    setMultiTaskMode(true);
    multiTaskActive.current = true;
    // Lanzar la primera tarea
    handleDoOne(pending[0], true);
  };

  // Secuencia: al completar una tarea, lanzar la siguiente
  useEffect(() => {
    if (!multiTaskMode) return;
    if (!multiTaskActive.current) return;
    if (multiTaskIndex >= multiTaskQueue.length) {
      // Fin de la secuencia
      setTimeout(() => {
        setMultiTaskMode(false);
        setMultiTaskQueue([]);
        setMultiTaskIndex(0);
        multiTaskActive.current = false;
      }, 1800);
      return;
    }
    // Lanzar siguiente tarea si no es la primera
    if (multiTaskIndex > 0 && multiTaskIndex < multiTaskQueue.length) {
      handleDoOne(multiTaskQueue[multiTaskIndex], true);
    }
    // eslint-disable-next-line
  }, [multiTaskIndex, multiTaskMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-primary-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/rooms')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 mt-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </motion.button>

        {/* Room Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-2"
        >
          <span className="text-5xl">{room.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{room.name}</h1>
            <p className="text-gray-500">Última atención: {room.lastAttention}</p>
          </div>
        </motion.div>

        {/* Section Title */}
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg font-semibold text-gray-700 mb-4 mt-6"
        >
          Tareas disponibles ({availableTasks.length})
        </motion.h3>

        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Cargando tareas...
          </div>
        ) : availableTasks.length === 0 ? (
          <div className="text-center py-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="flex flex-col items-center mb-4"
            >
              <CheckCircle2 className="w-16 h-16 text-gray-300 mb-2" />
              <span className="text-lg text-gray-500">No hay tareas disponibles para esta habitación</span>
            </motion.div>
            <Button onClick={() => navigate('/rooms')}>Volver</Button>
          </div>
        ) : (
          <>
            {/* Feedback visual al completar tarea */}
            <AnimatePresence>
              {showTaskComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                >
                  <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={180} recycle={false} />
                  <div className="bg-white rounded-full shadow-lg p-8 flex flex-col items-center">
                    <CheckCircle2 className="w-24 h-24 text-green-500 mb-2 animate-bounce" />
                    <span className="text-2xl font-bold text-green-700">¡Tarea completada!</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Tasks List */}
            <div className="space-y-3 mb-6">
              {availableTasks.map((task, index) => {
                const isCompleted = completedToday.has(task.id);
                const colors = [
                  'from-green-400 to-green-600',
                  'from-blue-400 to-blue-600',
                  'from-orange-400 to-orange-600',
                  'from-purple-400 to-purple-600',
                  'from-pink-400 to-pink-600',
                  'from-indigo-400 to-indigo-600',
                ];
                const color = colors[index % colors.length];
                return (
                  <motion.button
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDoOne(task.id)}
                    className={`w-full bg-gradient-to-r ${isCompleted ? 'from-gray-300 to-gray-400' : color} rounded-xl p-4 text-white shadow-md flex items-center justify-between transition-all relative ${isCompleted ? 'opacity-70' : ''}`}
                  >
                    {isCompleted && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="text-left">
                      <div className="font-semibold text-lg flex items-center gap-2">
                        {task.title}
                        {isCompleted && <span className="text-xs">(Completada hoy)</span>}
                      </div>
                      <div className="flex items-center gap-1 text-white/90 text-sm">
                        <Clock className="w-4 h-4" />
                        {task.estimatedMinutes} minutos
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-white/80" />
                  </motion.button>
                );
              })}
            </div>
          </>
        )}

        {/* Action Buttons */}
        {!loading && availableTasks.length > 0 && !multiTaskMode && (
          <div className="space-y-3">
            <Button
              onClick={() => handleDoOne()}
              className="w-full"
              disabled={availableTasks.length === 0}
            >
              <Play className="w-5 h-5 mr-2" />
              {completedToday.size === availableTasks.length
                ? 'Repetir una tarea'
                : 'Hacer siguiente pendiente'}
            </Button>

            <Button
              variant="secondary"
              onClick={handleDoAll}
              className="w-full"
              disabled={availableTasks.length === 0}
            >
              <ListChecks className="w-5 h-5 mr-2" />
              Hacer todas ({availableTasks.filter(t => !completedToday.has(t.id)).reduce((a, t) => a + t.estimatedMinutes, 0)} min)
            </Button>
          </div>
        )}

        {/* Mensaje de fin de secuencia */}
        {multiTaskMode && multiTaskIndex >= multiTaskQueue.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center border-2 border-green-200">
              <CheckCircle2 className="w-24 h-24 text-green-500 mb-4 animate-bounce" />
              <span className="text-3xl font-bold text-green-700 mb-2">¡Completaste todas las tareas pendientes!</span>
              <Button onClick={() => { setMultiTaskMode(false); setMultiTaskQueue([]); setMultiTaskIndex(0); multiTaskActive.current = false; }} className="mt-6">Volver a la habitación</Button>
            </div>
          </motion.div>
        )}

        {/* Motivational Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-purple-50 rounded-xl p-4 border border-purple-100"
        >
          <p className="text-sm text-purple-700">
            <strong>💜 Recuerda:</strong> No tienes que hacerlo todo. 
            Elige una tarea y celebra haberla completado.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
