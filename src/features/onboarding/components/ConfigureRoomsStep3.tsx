import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../../store';

interface SpaceTagProps {
  icon: string;
  label: string;
  value: string;
  selected: boolean;
  onToggle: () => void;
}

const SpaceTag: React.FC<SpaceTagProps> = ({ icon, label, selected, onToggle }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onToggle}
    className={`px-4 py-3 rounded-full font-medium transition-all ${
      selected
        ? 'bg-primary-500 text-white border-2 border-primary-500'
        : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-primary-300'
    }`}
  >
    <span className="mr-2">{icon}</span>
    {label}
  </motion.button>
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

const ADDITIONAL_SPACES = [
  { value: 'terrace', icon: '🌿', label: 'Terraza' },
  { value: 'balcony', icon: '🏢', label: 'Balcón' },
  { value: 'office', icon: '💼', label: 'Despacho' },
  { value: 'garage', icon: '🚗', label: 'Garaje' },
  { value: 'storage', icon: '📦', label: 'Trastero' },
  { value: 'garden', icon: '🏡', label: 'Jardín' },
  { value: 'laundry', icon: '🧺', label: 'Lavadero' },
  { value: 'game_room', icon: '🎮', label: 'Sala de juegos' },
  { value: 'library', icon: '📚', label: 'Biblioteca' },
  { value: 'gym', icon: '🏋️', label: 'Gimnasio' },
];

export const ConfigureRoomsStep3: React.FC = () => {
  const navigate = useNavigate();
  const { onboardingData, setOnboardingData } = useAppStore();
  
  const [selectedSpaces, setSelectedSpaces] = useState<string[]>(
    onboardingData.additionalSpaces || []
  );
  
  const toggleSpace = (value: string) => {
    setSelectedSpaces(prev => 
      prev.includes(value)
        ? prev.filter(s => s !== value)
        : [...prev, value]
    );
  };
  
  const handleNext = () => {
    setOnboardingData({
      additionalSpaces: selectedSpaces,
    });
    navigate('/onboarding/summary');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <ProgressDots current={2} total={3} />
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Espacios adicionales
          </h2>
          <p className="text-gray-600 mb-8">
            Selecciona los que apliquen (puedes elegir varios)
          </p>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {ADDITIONAL_SPACES.map(space => (
              <SpaceTag
                key={space.value}
                icon={space.icon}
                label={space.label}
                value={space.value}
                selected={selectedSpaces.includes(space.value)}
                onToggle={() => toggleSpace(space.value)}
              />
            ))}
          </div>
          
          <div className="bg-sage-50 border-l-4 border-sage-500 rounded-xl p-4 mb-8">
            <p className="text-sm text-sage-900">
              Si no tienes ninguno de estos espacios, no pasa nada. 
              Simplemente no selecciones ninguno.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/onboarding/configure/step2')}
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
              Ver resumen
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
