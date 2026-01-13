import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../../store';

interface ToggleSwitchProps {
  icon: string;
  title: string;
  subtitle: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  icon, 
  title, 
  subtitle, 
  enabled, 
  onChange 
}) => (
  <div 
    onClick={() => onChange(!enabled)}
    className="flex items-center justify-between p-5 bg-gray-100 rounded-xl
               hover:bg-gray-200 transition-colors cursor-pointer"
  >
    <div className="flex items-center gap-4">
      <div className="text-4xl">{icon}</div>
      <div>
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
    </div>
    
    <div className={`w-14 h-8 rounded-full transition-colors relative ${
      enabled ? 'bg-primary-500' : 'bg-gray-400'
    }`}>
      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
        enabled ? 'translate-x-7' : 'translate-x-1'
      }`} />
    </div>
  </div>
);

const ProgressDots: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="flex justify-center gap-2 mb-8">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`h-2 rounded-full transition-all duration-300 ${
          i === current 
            ? 'w-8 bg-primary-500' 
            : 'w-2 bg-gray-300'
        }`}
      />
    ))}
  </div>
);

export const ConfigureRoomsStep2: React.FC = () => {
  const navigate = useNavigate();
  const { onboardingData, setOnboardingData } = useAppStore();
  
  const [hasKitchen, setHasKitchen] = useState(
    onboardingData.hasKitchen ?? true
  );
  const [hasLivingRoom, setHasLivingRoom] = useState(
    onboardingData.hasLivingRoom ?? true
  );
  const [hasDiningRoom, setHasDiningRoom] = useState(
    onboardingData.hasDiningRoom ?? false
  );
  
  const handleNext = () => {
    setOnboardingData({
      hasKitchen,
      hasLivingRoom,
      hasDiningRoom,
    });
    navigate('/onboarding/configure/step3');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <ProgressDots current={1} total={3} />
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Espacios comunes
          </h2>
          <p className="text-gray-600 mb-8">
            ¿Qué otros espacios tienes en tu hogar?
          </p>
          
          <div className="space-y-4 mb-6">
            <ToggleSwitch
              icon="🍳"
              title="Cocina"
              subtitle="Espacio para cocinar"
              enabled={hasKitchen}
              onChange={setHasKitchen}
            />
            
            <ToggleSwitch
              icon="🛋️"
              title="Salón / Sala de estar"
              subtitle="Espacio de estar común"
              enabled={hasLivingRoom}
              onChange={setHasLivingRoom}
            />
            
            <ToggleSwitch
              icon="🍽️"
              title="Comedor"
              subtitle="Espacio separado para comer"
              enabled={hasDiningRoom}
              onChange={setHasDiningRoom}
            />
          </div>
          
          <div className="bg-empathy-50 border-l-4 border-empathy-500 rounded-xl p-4 mb-8">
            <p className="text-sm text-empathy-900">
              💡 <strong>Tip:</strong> Si tu salón y comedor son el mismo espacio, 
              activa solo "Salón"
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/onboarding/configure/step1')}
              className="py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl
                       font-semibold hover:bg-gray-50 transition-all"
            >
              Atrás
            </button>
            
            <button
              onClick={handleNext}
              className="py-3 px-6 bg-gradient-to-r from-primary-500 to-primary-600 
                       text-white rounded-xl font-semibold
                       hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                       transition-all duration-200"
            >
              Siguiente
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
