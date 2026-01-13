import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export const HomeConfigurationStart: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🏠</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Configura tu hogar
            </h1>
            <p className="text-gray-600">
              Vamos a personalizar HomeFlow para que se adapte a tu espacio.<br/>
              Solo tardará <strong>2 minutos</strong> y podrás cambiarlo cuando quieras.
            </p>
          </div>

          <div className="bg-empathy-50 border-l-4 border-empathy-500 rounded-xl p-6 mb-8">
            <p className="text-empathy-900">
              <strong>¿Por qué hacemos esto?</strong><br/>
              Para sugerirte tareas relevantes para <em>tu</em> hogar, no genéricas. 
              Así no tendrás que "traducir" mentalmente nuestras sugerencias.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
              <CheckCircle className="text-sage-500 flex-shrink-0" size={24} />
              <div>
                <p className="font-semibold text-gray-800 mb-1">
                  Tareas específicas
                </p>
                <p className="text-sm text-gray-600">
                  "Limpiar tu terraza" en lugar de "limpiar jardín"
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
              <CheckCircle className="text-sage-500 flex-shrink-0" size={24} />
              <div>
                <p className="font-semibold text-gray-800 mb-1">
                  Solo lo relevante
                </p>
                <p className="text-sm text-gray-600">
                  No verás tareas de espacios que no tienes
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
              <CheckCircle className="text-sage-500 flex-shrink-0" size={24} />
              <div>
                <p className="font-semibold text-gray-800 mb-1">
                  Más personal
                </p>
                <p className="text-sm text-gray-600">
                  Tu espacio, tus necesidades
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/onboarding/configure/step1')}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 
                       text-white py-4 rounded-xl font-semibold text-lg
                       hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                       transition-all duration-200"
            >
              Empezar configuración
            </button>
            
            <button
              onClick={() => navigate('/home')}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 
                       py-3 rounded-xl font-semibold
                       hover:bg-gray-50 transition-all duration-200"
            >
              Usar configuración por defecto
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
