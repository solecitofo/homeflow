import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Clock, Play, ListChecks } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

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
  const [selectedMissions, setSelectedMissions] = useState<Set<string>>(new Set());

  const room = roomId ? roomsData[roomId] : null;

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

  const handleDoOne = (missionId: string) => {
    // TODO: Navegar a ejecución de tarea específica
    navigate('/flow/overwhelmed');
  };

  const handleDoAll = () => {
    // TODO: Iniciar secuencia de tareas
    navigate('/flow/overwhelmed');
  };

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
          Misiones rápidas disponibles
        </motion.h3>

        {/* Missions List */}
        <div className="space-y-3 mb-6">
          {room.missions.map((mission, index) => (
            <motion.button
              key={mission.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDoOne(mission.id)}
              className={`w-full bg-gradient-to-r ${mission.color} rounded-xl p-4 text-white shadow-md
                         flex items-center justify-between transition-all`}
            >
              <div className="text-left">
                <div className="font-semibold text-lg">{mission.title}</div>
                <div className="flex items-center gap-1 text-white/90 text-sm">
                  <Clock className="w-4 h-4" />
                  {mission.durationMinutes} minutos
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-white/80" />
            </motion.button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={() => handleDoOne(room.missions[0].id)} 
            className="w-full"
          >
            <Play className="w-5 h-5 mr-2" />
            Hacer una
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={handleDoAll}
            className="w-full"
          >
            <ListChecks className="w-5 h-5 mr-2" />
            Hacer todas ({room.missions.reduce((a, m) => a + m.durationMinutes, 0)} min)
          </Button>
        </div>

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
