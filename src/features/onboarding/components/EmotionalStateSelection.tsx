import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../../store';
import type { EmotionalState } from '../../../db/database';

interface EmotionalOptionProps {
  icon: string;
  title: string;
  subtitle: string;
  state: EmotionalState;
  delay: number;
}

const EmotionalOption: React.FC<EmotionalOptionProps> = ({ 
  icon, 
  title, 
  subtitle, 
  state,
  delay 
}) => {
  const navigate = useNavigate();
  const setEmotionalState = useAppStore(state => state.setEmotionalState);
  
  const handleClick = () => {
    setEmotionalState(state);
    navigate('/onboarding/empathy');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      onClick={handleClick}
      className="bg-white border-2 border-gray-200 rounded-2xl p-6 cursor-pointer
                 hover:border-primary-500 hover:bg-gray-50 hover:shadow-md
                 transition-all duration-200 active:scale-[0.98]"
    >
      <div className="flex items-start gap-4">
        <div className="text-5xl flex-shrink-0">{icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-600">
            {subtitle}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export const EmotionalStateSelection: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-4">🏠</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            HomeFlow
          </h1>
          <p className="text-lg text-gray-600">
            Tu compañero de organización del hogar
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            ¿Cómo te sientes con tu hogar ahora mismo?
          </h2>
          
          <div className="space-y-4">
            <EmotionalOption
              icon="😰"
              title="Abrumado/a"
              subtitle="No sé ni por dónde empezar"
              state="overwhelmed"
              delay={0.3}
            />
            
            <EmotionalOption
              icon="😓"
              title="Cansado/a"
              subtitle="Sé que debo hacer cosas pero no puedo"
              state="tired"
              delay={0.4}
            />
            
            <EmotionalOption
              icon="😐"
              title="Está OK"
              subtitle="Pero podría estar mejor organizado"
              state="ok"
              delay={0.5}
            />
            
            <EmotionalOption
              icon="😊"
              title="Bien"
              subtitle="Quiero mantener buenos hábitos"
              state="good"
              delay={0.6}
            />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-gray-500"
        >
          Sin registro • Sin compromisos • Solo ayuda
        </motion.p>
      </div>
    </div>
  );
};
