import { useState, useCallback } from 'react';
import { 
  TaskRecommendationEngine, 
  type ScoredTask, 
  type UserState,
  type UserIntention,
  type Barrier,
  type TimeAvailable as EngineTimeAvailable,
} from '../../../db/engines/TaskRecommendationEngine';
import { updatePatternsAfterTask } from '../../../db/operations/userPatterns';
import { db, type Task, type ActivityLog } from '../../../db/database';
import type { PostTaskFeeling } from '../types';

interface EngineState {
  recommendations: ScoredTask[];
  selectedTask: Task | null;
  microTask: Task | null;
  loading: boolean;
  error: string | null;
}

export function useAdaptiveEngine(userId: string) {
  const [state, setState] = useState<EngineState>({
    recommendations: [],
    selectedTask: null,
    microTask: null,
    loading: false,
    error: null,
  });
  
  const engine = new TaskRecommendationEngine();

  /**
   * Obtiene recomendaciones basadas en la intención del usuario
   */
  const getRecommendations = useCallback(async (
    intention: UserIntention,
    timeAvailable?: EngineTimeAvailable,
    barrier?: Barrier
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const userState: UserState = {
        timestamp: new Date(),
        intention,
        availableTime: timeAvailable,
        barrier,
      };
      
      const scoredTasks = await engine.recommendTasks(userState, userId, 5);
      
      setState(prev => ({
        ...prev,
        recommendations: scoredTasks,
        loading: false,
      }));
      
      return scoredTasks;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      setState(prev => ({ ...prev, loading: false, error: message }));
      return [];
    }
  }, [userId]);

  /**
   * Obtiene una micro-tarea para estado de agobio
   */
  const getMicroTask = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const micro = await engine.getRandomMicroTask();
      
      setState(prev => ({
        ...prev,
        microTask: micro,
        loading: false,
      }));
      
      return micro;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      setState(prev => ({ ...prev, loading: false, error: message }));
      return null;
    }
  }, []);

  /**
   * Selecciona una tarea para ejecutar
   */
  const selectTask = useCallback((task: Task) => {
    setState(prev => ({ ...prev, selectedTask: task }));
  }, []);

  /**
   * Registra la finalización de una tarea y actualiza patrones
   */
  const completeTask = useCallback(async (
    task: Task,
    feeling: PostTaskFeeling,
    actualMinutes: number,
    pointsEarned: number
  ) => {
    try {
      // Crear log de actividad
      const activityLog: ActivityLog = {
        id: crypto.randomUUID(),
        taskId: task.id,
        userId,
        completed: true,
        startTime: new Date(Date.now() - actualMinutes * 60000),
        endTime: new Date(),
        actualMinutes,
        emotionalStateBefore: 'neutral',
        emotionalStateAfter: feelingToMood(feeling),
        routeUsed: 'tired', // Valor por defecto
      };
      
      await db.activityLogs.add(activityLog);
      
      // Calcular mejora de ánimo
      const moodImprovement = calculateMoodImprovement(feeling);
      
      // Actualizar patrones del usuario
      await updatePatternsAfterTask(userId, activityLog, moodImprovement, pointsEarned);
      
      // Actualizar progreso
      const progress = await db.userProgress.get(userId);
      if (progress) {
        await db.userProgress.update(userId, {
          totalTasksCompleted: progress.totalTasksCompleted + 1,
          weeklyPoints: progress.weeklyPoints + pointsEarned,
        });
      }
      
      setState(prev => ({ ...prev, selectedTask: null }));
      
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al guardar';
      setState(prev => ({ ...prev, error: message }));
      return false;
    }
  }, [userId]);

  /**
   * Descarta la tarea actual y obtiene otra
   */
  const skipTask = useCallback(async () => {
    setState(prev => ({ ...prev, selectedTask: null }));
    
    // Obtener nueva recomendación excluyendo la actual
    const userState: UserState = {
      timestamp: new Date(),
      intention: 'have_energy',
    };
    
    const newTasks = await engine.recommendTasks(userState, userId, 5);
    
    const filtered = newTasks.filter(scored => 
      scored.task.id !== state.selectedTask?.id
    );
    
    if (filtered.length > 0) {
      setState(prev => ({ ...prev, selectedTask: filtered[0].task }));
    }
  }, [userId, state.selectedTask]);

  // Devolver tareas como Task[] para compatibilidad
  const tasks = state.recommendations.map(scored => scored.task);

  return {
    ...state,
    recommendations: tasks,
    getRecommendations,
    getMicroTask,
    selectTask,
    completeTask,
    skipTask,
  };
}

// ============================================================================
// Helpers
// ============================================================================

function feelingToMood(feeling: PostTaskFeeling): 'very_bad' | 'bad' | 'neutral' | 'good' | 'very_good' {
  switch (feeling) {
    case 'better':
    case 'proud':
    case 'relieved':
      return 'good';
    case 'same':
      return 'neutral';
    case 'tired':
      return 'neutral';
    case 'worse':
      return 'bad';
    default:
      return 'neutral';
  }
}

function calculateMoodImprovement(feeling: PostTaskFeeling): number {
  switch (feeling) {
    case 'better': return 0.3;
    case 'same': return 0;
    case 'worse': return -0.2;
    case 'tired': return -0.1;
    case 'relieved': return 0.4;
    case 'proud': return 0.5;
    default: return 0;
  }
}
