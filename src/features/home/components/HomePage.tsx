import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, BookOpen, Settings } from 'lucide-react';
import { useAppStore } from '../../../../store';
import { DailyEmotionalCheck } from './DailyEmotionalCheck';
import { ProgressSummary } from './ProgressSummary';
import { TaskRecommendationList } from './TaskRecommendationList';
import { Button } from '../../../shared/components/Button';
import { isDateToday } from '../../../shared/utils/dateUtils';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dailyEmotionalState = useAppStore((s) => s.dailyEmotionalState);
  const lastEmotionalCheckDate = useAppStore((s) => s.lastEmotionalCheckDate);

  const [showEmotionalCheck, setShowEmotionalCheck] = useState(false);

  // Verificar si necesita seleccionar estado emocional
  useEffect(() => {
    const needsEmotionalCheck =
      !dailyEmotionalState ||
      !lastEmotionalCheckDate ||
      !isDateToday(lastEmotionalCheckDate);

    setShowEmotionalCheck(needsEmotionalCheck);
  }, [dailyEmotionalState, lastEmotionalCheckDate]);

  const getEmotionalStateLabel = (state: string) => {
    switch (state) {
      case 'overwhelmed':
        return '😰 Abrumado/a';
      case 'tired':
        return '😓 Cansado/a';
      case 'ok':
        return '😐 Está OK';
      case 'good':
        return '😊 Bien';
      default:
        return 'Sin seleccionar';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 p-4">
      {/* Modal de check emocional diario */}
      <DailyEmotionalCheck
        isOpen={showEmotionalCheck}
        onComplete={() => setShowEmotionalCheck(false)}
      />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 mt-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-gray-800">🏠 HomeFlow</h1>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                /* TODO: Settings */
              }}
              className="p-2 rounded-full hover:bg-white transition-colors"
            >
              <Settings className="w-6 h-6 text-gray-600" />
            </motion.button>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600"
          >
            Tu compañero de organización del hogar
          </motion.p>
        </motion.div>

        {/* Estado emocional actual */}
        {dailyEmotionalState && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="bg-white rounded-2xl p-4 shadow-lg flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Hoy te sientes:</p>
                <p className="text-xl font-bold text-gray-800">
                  {getEmotionalStateLabel(dailyEmotionalState)}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEmotionalCheck(true)}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Cambiar
              </Button>
            </div>
          </motion.div>
        )}

        {/* Resumen de progreso */}
        <div className="mb-8">
          <ProgressSummary />
        </div>

        {/* Lista de tareas recomendadas */}
        <div className="mb-8">
          <TaskRecommendationList />
        </div>

        {/* Botones de acción rápida */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          <Button
            variant="secondary"
            onClick={() => navigate('/learn')}
            className="h-auto py-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-600" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">Aprende</p>
                <p className="text-sm text-gray-600">
                  Descubre la ciencia detrás del método
                </p>
              </div>
            </div>
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              /* TODO: Progress view */
            }}
            className="h-auto py-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-sage-600" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">Mi Progreso</p>
                <p className="text-sm text-gray-600">
                  Ve tu historial y estadísticas
                </p>
              </div>
            </div>
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-sm text-gray-500 mb-8"
        >
          Recuerda: la consistencia supera a la intensidad 💪
        </motion.p>
      </div>
    </div>
  );
};
