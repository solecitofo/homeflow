import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../../store';
import type { EmotionalState } from '../../../db/database';

const MOOD_OPTIONS = [
  { emoji: '😓', value: 'tired' as EmotionalState, label: 'Cansado' },
  { emoji: '😐', value: 'ok' as EmotionalState, label: 'OK' },
  { emoji: '😌', value: 'calm' as const, label: 'Tranquilo' },
  { emoji: '😊', value: 'good' as EmotionalState, label: 'Bien' },
  { emoji: '😁', value: 'excited' as const, label: 'Emocionado' },
];

const EMOTIONAL_STATE_EMOJIS: Record<EmotionalState, string> = {
  overwhelmed: '😰',
  tired: '😓',
  ok: '😐',
  good: '😊',
};

export const TaskFeedback: React.FC = () => {
  const navigate = useNavigate();
  const { emotionalState, setLoading } = useAppStore();
  
  const [selectedMood, setSelectedMood] = useState<string>('good');
  const [taskTime] = useState('2 minutos');
  const [taskName] = useState('Recoge 3 objetos');
  
  const initialEmoji = emotionalState ? EMOTIONAL_STATE_EMOJIS[emotionalState] : '😴';
  
  const handleContinue = async () => {
    try {
      setLoading(true);
      // Aquí se guardaría el feedback emocional en la base de datos
      // Por ahora solo navegamos
      navigate('/onboarding/complete');
    } catch (error) {
      console.error('Error saving feedback:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          {/* Success Animation */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-6xl mb-4"
            >
              ✨
            </motion.div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              ¡Lo hiciste!
            </h2>
            
            <p className="text-gray-600 mb-1">
              Completaste: <strong>{taskName}</strong>
            </p>
            
            <p className="text-gray-600 text-sm">
              en {taskTime}
            </p>
          </div>
          
          {/* Mood Comparison */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="text-center">
              <div className="text-xs font-semibold text-gray-600 mb-2">ANTES</div>
              <div className="text-5xl">{initialEmoji}</div>
            </div>
            
            <div className="text-2xl text-gray-400">→</div>
            
            <div className="text-center">
              <div className="text-xs font-semibold text-gray-600 mb-2">AHORA</div>
              <div className="text-5xl">
                {MOOD_OPTIONS.find(m => m.value === selectedMood)?.emoji || '?'}
              </div>
            </div>
          </div>
          
          {/* Feedback Question */}
          <div className="mb-8">
            <label className="block text-center font-semibold text-gray-800 mb-4">
              ¿Cómo te sientes AHORA?
            </label>
            
            <div className="flex justify-center gap-3">
              {MOOD_OPTIONS.map(mood => (
                <motion.button
                  key={mood.value}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`text-4xl p-3 rounded-2xl transition-all ${
                    selectedMood === mood.value
                      ? 'bg-primary-100 scale-110'
                      : 'hover:bg-gray-100'
                  }`}
                  title={mood.label}
                >
                  {mood.emoji}
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 
                     text-white py-4 rounded-xl font-semibold text-lg
                     hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                     transition-all duration-200 mb-8"
          >
            Continuar
          </button>
          
          {/* Streak */}
          <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200">
            <div className="text-4xl font-bold text-orange-600 mb-2">
              🔥 3
            </div>
            <div className="text-sm text-orange-900 font-medium">
              días seguidos haciendo algo
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
