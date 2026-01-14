import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../../store';
import { saveOnboarding, generateId } from '../../../db/database';

const SPACE_ICONS: Record<string, string> = {
  bedroom: '🛏️',
  bathroom: '🚿',
  kitchen: '🍳',
  living_room: '🛋️',
  dining_room: '🍽️',
  terrace: '🌿',
  balcony: '🏢',
  office: '💼',
  garage: '🚗',
  storage: '📦',
  garden: '🏡',
  laundry: '🧺',
  game_room: '🎮',
  library: '📚',
  gym: '🏋️',
};

const SPACE_NAMES: Record<string, string> = {
  terrace: 'Terraza',
  balcony: 'Balcón',
  office: 'Despacho',
  garage: 'Garaje',
  storage: 'Trastero',
  garden: 'Jardín',
  laundry: 'Lavadero',
  game_room: 'Sala de juegos',
  library: 'Biblioteca',
  gym: 'Gimnasio',
};

export const ConfigurationSummary: React.FC = () => {
  const navigate = useNavigate();
  const { userId, onboardingData, setLoading } = useAppStore();
  
  const handleConfirm = async () => {
    try {
      setLoading(true);
      
      // Guardar configuración completa
      await saveOnboarding({
        userId,
        emotionalState: onboardingData.emotionalState!,
        homeName: onboardingData.homeName || 'Mi hogar',
        bedroomsCount: onboardingData.bedroomsCount || 1,
        bathroomsCount: onboardingData.bathroomsCount || 1,
        hasKitchen: onboardingData.hasKitchen ?? true,
        hasLivingRoom: onboardingData.hasLivingRoom ?? true,
        hasDiningRoom: onboardingData.hasDiningRoom ?? false,
        additionalSpaces: onboardingData.additionalSpaces || [],
        completedAt: new Date(),
      });
      
      // Ir a primera tarea guiada
      navigate('/onboarding/first-task');
    } catch (error) {
      console.error('Error saving onboarding:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const spaces = [];
  
  // Dormitorios
  if (onboardingData.bedroomsCount) {
    spaces.push({
      icon: SPACE_ICONS.bedroom,
      label: 'Dormitorios',
      value: onboardingData.bedroomsCount,
    });
  }
  
  // Baños
  if (onboardingData.bathroomsCount) {
    spaces.push({
      icon: SPACE_ICONS.bathroom,
      label: 'Baños',
      value: onboardingData.bathroomsCount,
    });
  }
  
  // Cocina
  if (onboardingData.hasKitchen) {
    spaces.push({
      icon: SPACE_ICONS.kitchen,
      label: 'Cocina',
      value: '✓',
    });
  }
  
  // Salón
  if (onboardingData.hasLivingRoom) {
    spaces.push({
      icon: SPACE_ICONS.living_room,
      label: 'Salón',
      value: '✓',
    });
  }
  
  // Comedor
  if (onboardingData.hasDiningRoom) {
    spaces.push({
      icon: SPACE_ICONS.dining_room,
      label: 'Comedor',
      value: '✓',
    });
  }
  
  // Espacios adicionales
  (onboardingData.additionalSpaces || []).forEach(space => {
    spaces.push({
      icon: SPACE_ICONS[space],
      label: SPACE_NAMES[space],
      value: '✓',
    });
  });
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          {/* Títulos */}
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Confirmación
          </h2>
          <p className="text-gray-600 mb-8 text-center text-base">
            Así quedó configurado tu hogar
          </p>
          
          {/* Preview Card con Gradient */}
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl p-6 mb-6">
            {/* Preview Title */}
            <div className="text-xl font-bold mb-4">
              🏠 {onboardingData.homeName || 'Mi hogar'}
            </div>
            
            {/* Preview Grid */}
            <div className="space-y-2">
              {spaces.map((space, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center p-3 bg-white/10 rounded-lg"
                >
                  {/* Preview Item Label */}
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{space.icon}</span>
                    <span className="font-medium text-sm">{space.label}</span>
                  </div>
                  {/* Preview Item Value */}
                  <div className="font-semibold text-base">{space.value}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Info Box */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-4 mb-8">
            <p className="text-sm text-blue-900 leading-relaxed">
              <strong>Puedes cambiar esta configuración cuando quieras</strong><br/>
              Encontrarás la opción en Ajustes → Configuración del hogar
            </p>
          </div>
          
          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleConfirm}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 
                       text-white py-3 px-6 rounded-xl font-semibold
                       hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                       transition-all duration-200"
            >
              Confirmar y empezar
            </button>
            
            <button
              onClick={() => navigate('/onboarding/configure/step1')}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 
                       py-3 px-6 rounded-xl font-semibold
                       hover:bg-gray-50 transition-all duration-200"
            >
              Editar configuración
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
