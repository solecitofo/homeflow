import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../shared/components/Button';

interface SessionClosureProps {
  onHome: () => void;
}

export const SessionClosure: React.FC<SessionClosureProps> = ({ onHome }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="text-center py-16 px-4"
    >
      <div className="text-7xl mb-6">🌅</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        ¡Buen trabajo hoy!
      </h2>
      <p className="text-gray-600 mb-6">
        Has dado pasos importantes para tu bienestar y el de tu hogar. Recuerda que descansar también es parte del progreso.
      </p>
      <Button onClick={onHome} className="w-full text-lg py-4">
        Volver al inicio
      </Button>
    </motion.div>
  );
};
