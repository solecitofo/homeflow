import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../../store';
import { Minus, Plus } from 'lucide-react';

interface NumberSelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const NumberSelector = ({ value, onChange, min = 0, max = 10 }: NumberSelectorProps) => (
  <div className="flex items-center justify-center gap-6 bg-gray-100 p-6 rounded-2xl">
    <button
      onClick={() => onChange(Math.max(min, value - 1))}
      disabled={value <= min}
      title="Disminuir valor"
      className="w-14 h-14 rounded-full bg-primary-500 text-white font-bold
               hover:bg-primary-600 active:scale-95 transition-all
               disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      <Minus className="mx-auto" size={24} />
    </button>
    
    <div className="text-5xl font-bold text-gray-800 min-w-[80px] text-center">
      {value}
    </div>
    
    <button
      onClick={() => onChange(Math.min(max, value + 1))}
      disabled={value >= max}
      title="Aumentar valor"
      className="w-14 h-14 rounded-full bg-primary-500 text-white font-bold
               hover:bg-primary-600 active:scale-95 transition-all
               disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      <Plus className="mx-auto" size={24} />
    </button>
  </div>
);

interface ProgressDotsProps {
  current: number;
  total: number;
}

const ProgressDots = ({ current, total }: ProgressDotsProps) => (
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

export const ConfigureRoomsStep1 = () => {
  const navigate = useNavigate();
  const { onboardingData, setOnboardingData } = useAppStore();
  
  const [homeName, setHomeName] = useState(onboardingData.homeName || '');
  const [bedrooms, setBedrooms] = useState(onboardingData.bedroomsCount || 1);
  const [bathrooms, setBathrooms] = useState(onboardingData.bathroomsCount || 1);
  
  const handleNext = () => {
    setOnboardingData({
      homeName: homeName || 'Mi hogar',
      bedroomsCount: bedrooms,
      bathroomsCount: bathrooms,
    });
    navigate('/onboarding/configure/step2');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <ProgressDots current={0} total={3} />
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu hogar</h2>
          <p className="text-gray-600 mb-8">Información básica de tu espacio</p>
          
          <div className="space-y-6 mb-8">
            <div>
              <label className="block font-semibold text-gray-800 mb-3">
                ¿Cómo quieres llamar a tu hogar?
              </label>
              <input
                type="text"
                value={homeName}
                onChange={(e) => setHomeName(e.target.value)}
                placeholder="Mi hogar"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl
                         focus:border-primary-500 focus:outline-none transition-colors"
              />
              <p className="text-sm text-gray-500 mt-2">
                Opcional - puedes dejarlo como "Mi hogar"
              </p>
            </div>
            
            <div>
              <label className="block font-semibold text-gray-800 mb-3">
                ¿Cuántos dormitorios/habitaciones tienes?
              </label>
              <NumberSelector value={bedrooms} onChange={setBedrooms} />
            </div>
            
            <div>
              <label className="block font-semibold text-gray-800 mb-3">
                ¿Cuántos baños?
              </label>
              <NumberSelector value={bathrooms} onChange={setBathrooms} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/onboarding/configure')}
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
