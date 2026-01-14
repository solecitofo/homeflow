import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Home } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

// Tipos
interface RoomStatus {
  id: string;
  name: string;
  icon: string;
  status: 'good' | 'warning' | 'alert' | 'unknown';
  lastCleaned?: string;
  statusText: string;
}

// Mock data - en producción vendría de la base de datos
const mockRooms: RoomStatus[] = [
  {
    id: 'kitchen',
    name: 'Cocina',
    icon: '🍳',
    status: 'good',
    lastCleaned: 'Hoy',
    statusText: 'Mantenida hoy',
  },
  {
    id: 'living',
    name: 'Salón',
    icon: '🛋️',
    status: 'warning',
    lastCleaned: 'Hace 2 días',
    statusText: 'Última vez: hace 2 días',
  },
  {
    id: 'bedroom',
    name: 'Dormitorio',
    icon: '🛏️',
    status: 'alert',
    lastCleaned: 'Hace 5 días',
    statusText: 'Necesita atención',
  },
  {
    id: 'bathroom',
    name: 'Baño',
    icon: '🚿',
    status: 'unknown',
    statusText: 'Sin datos recientes',
  },
  {
    id: 'entrance',
    name: 'Entrada',
    icon: '🚪',
    status: 'good',
    lastCleaned: 'Ayer',
    statusText: 'Ordenada ayer',
  },
  {
    id: 'laundry',
    name: 'Lavadero',
    icon: '🧺',
    status: 'warning',
    lastCleaned: 'Hace 3 días',
    statusText: 'Pendiente revisar',
  },
];

const mockWeeklyStats = {
  currentPoints: 6,
  goalPoints: 10,
  tasksCompleted: 8,
  daysActive: 5,
};

export const RoomOverviewScreen: React.FC = () => {
  const navigate = useNavigate();

  const getStatusColor = (status: RoomStatus['status']) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-700';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700';
      case 'alert':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  const getStatusIcon = (status: RoomStatus['status']) => {
    switch (status) {
      case 'good':
        return '✓';
      case 'warning':
        return '!';
      case 'alert':
        return '!';
      default:
        return '?';
    }
  };

  const progressPercent = Math.round((mockWeeklyStats.currentPoints / mockWeeklyStats.goalPoints) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-primary-50 p-4">
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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Estado de tu hogar</h1>
          <p className="text-gray-600">Vista general de cada zona</p>
        </motion.div>

        {/* Weekly Points Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-6 mb-6 text-white shadow-lg"
        >
          <div className="text-center mb-4">
            <div className="text-4xl font-bold mb-1">
              {mockWeeklyStats.currentPoints} / {mockWeeklyStats.goalPoints}
            </div>
            <div className="text-primary-200">puntos esta semana</div>
          </div>
          
          {/* Progress Bar */}
          <div className="bg-white/20 h-3 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </motion.div>

        {/* Rooms Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 mb-6"
        >
          {mockRooms.map((room, index) => (
            <motion.button
              key={room.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/rooms/${room.id}`)}
              className="w-full bg-white rounded-xl p-4 shadow-sm border-2 border-gray-200 
                       hover:border-primary-300 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{room.icon}</span>
                <div className="text-left">
                  <h4 className="font-bold text-gray-800">{room.name}</h4>
                  <p className="text-sm text-gray-500">{room.statusText}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getStatusColor(room.status)}`}
                >
                  {getStatusIcon(room.status)}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Action Button */}
        <Button onClick={() => navigate('/flow/energy')} className="w-full">
          Ver tareas disponibles
        </Button>

        {/* Info Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100"
        >
          <p className="text-sm text-blue-700">
            <strong>💡 Tip:</strong> No tienes que mantener todo perfecto. 
            Enfócate en una habitación a la vez.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
