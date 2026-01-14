import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Flame, Trophy, Target, TrendingUp, Lightbulb, Clock } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

// Mock data - esto vendría de la base de datos
const mockProgress = {
  currentStreak: 5,
  longestStreak: 12,
  totalTasksCompleted: 47,
  weeklyPoints: 320,
  weeklyGoal: 500,
  daysActive: [true, true, false, true, true, true, false], // L-D
  recentCompletions: [
    { date: 'Hoy', tasks: ['Limpiar cocina', 'Hacer la cama'] },
    { date: 'Ayer', tasks: ['Ordenar salón', 'Sacar basura'] },
    { date: 'Hace 2 días', tasks: ['Baño completo'] },
  ],
  achievements: [
    { icon: '🌟', title: '5 días seguidos', unlocked: true },
    { icon: '🔥', title: 'Semana perfecta', unlocked: false },
    { icon: '🏆', title: '50 tareas completadas', unlocked: false },
    { icon: '💪', title: 'Maestro de micro-tareas', unlocked: true },
  ],
  // Insights del motor TCC (Pantalla 12)
  insights: [
    {
      type: 'pattern',
      icon: '💡',
      title: 'Insight',
      description: 'Cuando haces micro-tareas de cocina, tu estado de ánimo mejora en un <strong>85%</strong> de las veces',
    },
    {
      type: 'time',
      icon: '⏰',
      title: 'Patrón detectado',
      description: 'Las mañanas son tu mejor momento para activarte (3x más completaciones)',
    },
  ],
};

export const ProgressScreen: React.FC = () => {
  const navigate = useNavigate();
  const progressPercent = Math.round((mockProgress.weeklyPoints / mockProgress.weeklyGoal) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-primary-50 p-4">
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
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tu progreso</h1>
          <p className="text-gray-600">Cada pequeño paso suma</p>
        </motion.div>

        {/* Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl p-6 mb-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 mb-1">Racha actual</p>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold">{mockProgress.currentStreak}</span>
                <span className="text-xl mb-1">días</span>
              </div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Flame className="w-16 h-16 text-orange-200" />
            </motion.div>
          </div>
          <p className="text-sm text-orange-100 mt-4">
            🏆 Tu mejor racha: {mockProgress.longestStreak} días
          </p>
        </motion.div>

        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 mb-6 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary-600" />
            <span className="font-bold text-gray-800">Objetivo semanal</span>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">{mockProgress.weeklyPoints} puntos</span>
              <span className="text-gray-400">{mockProgress.weeklyGoal} puntos</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                transition={{ delay: 0.5, duration: 1 }}
                className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
              />
            </div>
          </div>

          <p className="text-sm text-gray-500">
            {progressPercent >= 100
              ? '🎉 ¡Objetivo cumplido esta semana!'
              : `${100 - progressPercent}% restante para completar tu objetivo`}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="bg-white rounded-2xl p-5 shadow-md text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-800">{mockProgress.totalTasksCompleted}</p>
            <p className="text-sm text-gray-500">Tareas completadas</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-md text-center">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-800">{mockProgress.weeklyPoints}</p>
            <p className="text-sm text-gray-500">Puntos esta semana</p>
          </div>
        </motion.div>

        {/* Days Active - Pantalla 12 Wireframe */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-3xl p-6 mb-6 shadow-lg"
        >
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📅</span> Días activos
          </h3>
          <div className="flex gap-2 mb-2">
            {mockProgress.daysActive.map((active, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className={`flex-1 h-10 rounded-lg ${active ? 'bg-green-400' : 'bg-gray-200'}`}
              />
            ))}
          </div>
          <div className="flex gap-2 text-xs text-gray-500">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, index) => (
              <div key={index} className="flex-1 text-center">{day}</div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-3">
            {mockProgress.daysActive.filter(Boolean).length} de 7 días
          </p>
        </motion.div>

        {/* Insights - Pantalla 12 Wireframe */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 mb-6"
        >
          {mockProgress.insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + index * 0.1 }}
              className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-r-xl"
            >
              <h4 className="text-primary-800 font-bold mb-2 flex items-center gap-2">
                <span>{insight.icon}</span> {insight.title}
              </h4>
              <p 
                className="text-primary-700 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: insight.description }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-6 mb-6 shadow-lg"
        >
          <h3 className="font-bold text-gray-800 mb-4">Actividad reciente</h3>
          <div className="space-y-4">
            {mockProgress.recentCompletions.map((day, index) => (
              <div key={index} className="border-l-2 border-primary-200 pl-4">
                <p className="text-sm font-medium text-gray-700 mb-1">{day.date}</p>
                <div className="flex flex-wrap gap-2">
                  {day.tasks.map((task, i) => (
                    <span key={i} className="bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-xs">
                      ✓ {task}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl p-6 shadow-lg"
        >
          <h3 className="font-bold text-gray-800 mb-4">Logros</h3>
          <div className="grid grid-cols-2 gap-3">
            {mockProgress.achievements.map((achievement, index) => (
              <div
                key={index}
                className={`
                  p-4 rounded-xl text-center transition-all
                  ${achievement.unlocked
                    ? 'bg-yellow-50 border-2 border-yellow-200'
                    : 'bg-gray-100 opacity-50'
                  }
                `}
              >
                <span className="text-3xl block mb-2">{achievement.icon}</span>
                <p className="text-sm font-medium text-gray-700">{achievement.title}</p>
                {!achievement.unlocked && (
                  <p className="text-xs text-gray-400 mt-1">Bloqueado</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Button onClick={() => navigate('/')} className="w-full">
            Seguir avanzando
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
