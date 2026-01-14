import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';
import { Plus, Sparkles, X } from 'lucide-react';
import { createCustomTask, suggestIntensityLevels } from '../../../db/operations/customTasks';
import { useUserId } from '../../../shared/hooks/useUserId';

interface CreateCustomTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (taskId: string) => void;
}

export const CreateCustomTaskModal: React.FC<CreateCustomTaskModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const userId = useUserId();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    room: '',
    category: 'organizing' as 'cleaning' | 'organizing' | 'shopping' | 'maintenance',
    estimatedMinutes: 10,
    steps: [''] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validar que al menos haya título y descripción
      if (!formData.title.trim() || !formData.description.trim()) {
        setError('Por favor completa todos los campos obligatorios');
        setLoading(false);
        return;
      }

      // Generar intensity levels automáticamente
      const intensityLevels = suggestIntensityLevels(formData.estimatedMinutes);

      // Filtrar pasos vacíos
      const steps = formData.steps.filter(s => s.trim());

      const taskId = await createCustomTask(userId, {
        ...formData,
        room: formData.room || undefined,
        steps: steps.length > 0 ? steps : undefined,
        intensityLevels,
      });

      onSuccess(taskId);

      // Resetear formulario
      setFormData({
        title: '',
        description: '',
        room: '',
        category: 'organizing',
        estimatedMinutes: 10,
        steps: [''],
      });

      onClose();
    } catch (error) {
      console.error('Error creating custom task:', error);
      setError('Error al crear la tarea. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const addStep = () => {
    setFormData({ ...formData, steps: [...formData.steps, ''] });
  };

  const removeStep = (index: number) => {
    const newSteps = formData.steps.filter((_, i) => i !== index);
    setFormData({ ...formData, steps: newSteps.length > 0 ? newSteps : [''] });
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData({ ...formData, steps: newSteps });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Crear Tarea Personalizada
        </h2>
        <p className="text-gray-600">
          Describe tu tarea y el sistema la adaptará automáticamente
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título de la tarea *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ej: Regar las plantas"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción *
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe qué implica esta tarea..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Categoría y Habitación */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="cleaning">Limpieza</option>
              <option value="organizing">Organización</option>
              <option value="shopping">Compras</option>
              <option value="maintenance">Mantenimiento</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Habitación (opcional)
            </label>
            <select
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Sin habitación</option>
              <option value="bedroom">Dormitorio</option>
              <option value="bathroom">Baño</option>
              <option value="kitchen">Cocina</option>
              <option value="living_room">Salón</option>
              <option value="entrance">Entrada</option>
              <option value="laundry">Lavadero</option>
            </select>
          </div>
        </div>

        {/* Tiempo estimado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiempo estimado (minutos) *
          </label>
          <input
            type="number"
            required
            min={1}
            max={180}
            value={formData.estimatedMinutes}
            onChange={(e) => setFormData({ ...formData, estimatedMinutes: parseInt(e.target.value) || 1 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Se generarán automáticamente versiones básica, estándar y profunda
          </p>
        </div>

        {/* Pasos opcionales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pasos (opcional)
          </label>
          <div className="space-y-2">
            {formData.steps.map((step, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={step}
                  onChange={(e) => updateStep(index, e.target.value)}
                  placeholder={`Paso ${index + 1}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {formData.steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                {index === formData.steps.length - 1 && formData.steps.length < 8 && (
                  <button
                    type="button"
                    onClick={addStep}
                    className="p-2 text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Creando...' : 'Crear Tarea'}
          </Button>
        </div>
      </form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200"
      >
        <div className="flex items-start gap-2">
          <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-purple-700">
            <strong>Auto-aprendizaje:</strong> El sistema aprenderá de tus hábitos y ajustará
            automáticamente el tiempo estimado basándose en tus completados reales.
          </p>
        </div>
      </motion.div>
    </Modal>
  );
};
