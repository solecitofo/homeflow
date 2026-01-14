import { useState, useEffect } from 'react';
import { useAppStore } from '../../../../store';
import { getRecommendedTasks } from '../../../db/operations/tasks';
import type { Task } from '../../../db/database';

interface UseRecommendedTasksReturn {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para obtener tareas recomendadas basadas en el estado emocional del usuario
 */
export function useRecommendedTasks(): UseRecommendedTasksReturn {
  const dailyEmotionalState = useAppStore((s) => s.dailyEmotionalState);
  const userId = useAppStore((s) => s.userId);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    if (!dailyEmotionalState) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const recommendedTasks = await getRecommendedTasks(dailyEmotionalState, userId);
      setTasks(recommendedTasks);
    } catch (err) {
      console.error('Error fetching recommended tasks:', err);
      setError('Error al cargar las tareas recomendadas');
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [dailyEmotionalState, userId]);

  return {
    tasks,
    isLoading,
    error,
    refetch: fetchTasks,
  };
}
