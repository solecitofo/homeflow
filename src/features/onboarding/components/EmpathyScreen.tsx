import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../../store';
import { ArrowRight, BookOpen } from 'lucide-react';

const EMPATHY_MESSAGES = {
  overwhelmed: {
    title: "💙 Te entendemos",
    message: "Muchas personas se sienten así cuando miran su hogar.",
    insight: "La buena noticia: No tienes que hacerlo todo de golpe.",
    fact: "Hacer UNA cosa pequeña mejora tu ánimo más que pensar en hacer TODO",
    cta: "Vamos a empezar con algo pequeñito, ¿te parece?",
    color: "empathy"
  },
  tired: {
    title: "🫂 Lo entiendo perfectamente",
    message: "El cansancio hace que todo parezca una montaña.",
    insight: "Aquí está el secreto: La acción crea energía, no al revés.",
    fact: "Empezar con algo que NO requiera moverte físicamente puede ayudarte a entrar en ritmo",
    cta: "Vamos a encontrar algo que puedas hacer desde donde estás.",
    color: "warm"
  },
  ok: {
    title: "👍 Buen punto de partida",
    message: "Reconocer que puede mejorar ya es un gran paso.",
    insight: "La organización no es un destino, es un camino.",
    fact: "Pequeños cambios consistentes tienen más impacto que grandes esfuerzos ocasionales",
    cta: "Te ayudaremos a crear sistemas que funcionen para ti.",
    color: "sage"
  },
  good: {
    title: "✨ ¡Genial!",
    message: "Es mucho más fácil mantener un hogar cuando ya está funcionando.",
    insight: "La clave está en las rutinas predecibles.",
    fact: "Tener rutinas libera espacio mental para otras cosas importantes",
    cta: "Te ayudaremos a construir rutinas que funcionen para ti.",
    color: "primary"
  }
};

export const EmpathyScreen: React.FC = () => {
  const navigate = useNavigate();
  const emotionalState = useAppStore(state => state.emotionalState);
  
  if (!emotionalState) {
    navigate('/onboarding');
    return null;
  }
  
  const content = EMPATHY_MESSAGES[emotionalState];
  const colorClass = `${content.color}-500`;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {content.title}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {content.message}
            </p>
            <p className="text-xl font-semibold text-gray-800">
              {content.insight}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`bg-${content.color}-50 border-l-4 border-${colorClass} rounded-xl p-6 mb-8`}
          >
            <div className="flex items-start gap-3">
              <BookOpen className={`text-${colorClass} flex-shrink-0 mt-1`} size={24} />
              <div>
                <p className="font-semibold text-gray-800 mb-2">
                  ¿Sabías que...?
                </p>
                <p className={`text-${content.color}-900`}>
                  {content.fact}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <p className="text-lg text-gray-700 text-center mb-6">
              {content.cta}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-3"
          >
            <button
              onClick={() => navigate('/onboarding/configure')}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 
                       text-white py-4 rounded-xl font-semibold text-lg
                       hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                       transition-all duration-200 flex items-center justify-center gap-2"
            >
              Sí, vamos
              <ArrowRight size={20} />
            </button>
            
            <button
              onClick={() => navigate('/learn/why-small-steps')}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 
                       py-3 rounded-xl font-semibold
                       hover:bg-gray-50 hover:border-gray-400
                       transition-all duration-200"
            >
              Cuéntame más
            </button>
          </motion.div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          onClick={() => navigate('/onboarding')}
          className="mt-6 text-gray-500 hover:text-gray-700 text-sm mx-auto block"
        >
          ← Volver
        </motion.button>
      </div>
    </div>
  );
};
