import type { Task, EmotionalState, Room, ActivityLog, UserProgress } from '../database';
import { db } from '../database';

// ============================================================================
// TIPOS PARA EL MOTOR DE RECOMENDACIÓN
// ============================================================================

export type UserIntention = 
  | 'overwhelmed'      // 🤯 Estoy abrumado/a
  | 'have_energy'      // ⚡ Tengo algo de energía
  | 'hard_to_start'    // 😓 Me cuesta ponerme en marcha
  | 'need_planning'    // 📝 Necesito planificar
  | 'need_shopping';   // 🛒 Necesito hacer la compra

export type Barrier = 
  | 'no_energy'        // 😴 No tengo energía
  | 'dont_know_first'  // 🤔 No sé qué hacer primero
  | 'not_perfect_time' // ⏰ No es el momento "perfecto"
  | 'too_much'         // 🎯 Me parece demasiado
  | 'anxiety';         // 😰 Me da ansiedad empezar

export type TimeAvailable = '5-10' | '15-20' | '30+' | 'unsure';

export type EnergyLevel = 'low' | 'medium' | 'high';

export interface UserState {
  timestamp: Date;
  intention: UserIntention;
  availableTime?: TimeAvailable;
  energyLevel?: EnergyLevel;
  barrier?: Barrier;
}

export interface TCCStrategy {
  name: string;
  principles: string[];
  filters: TaskFilters;
  messaging?: {
    preTask?: string;
    emphasizeBasicLevel?: boolean;
  };
}

export interface TaskFilters {
  isMicroTask?: boolean;
  maxMinutes?: number;
  effortLevel?: ('micro' | 'low' | 'medium' | 'high')[];
  requiresDecisions?: boolean;
  requiresMovement?: boolean;
  category?: ('cleaning' | 'organizing' | 'shopping' | 'maintenance')[];
  impactLevel?: ('low' | 'medium' | 'high')[];
  hasIntensityLevels?: boolean;
  previouslyCompleted?: boolean;
}

export interface ScoredTask {
  task: Task;
  score: number;
  reason?: string;
}

export interface UserPatterns {
  userId: string;
  bestTimeOfDay?: 'morning' | 'afternoon' | 'evening';
  bestDayOfWeek?: string[];
  preferredTaskDuration?: number;
  successfulTimeSlots?: Record<string, number>;
  avoidsTasksWith?: string[];
}

// ============================================================================
// MOTOR DE RECOMENDACIÓN TCC
// ============================================================================

export class TaskRecommendationEngine {
  
  /**
   * Función principal: recomienda tareas según estado del usuario
   */
  async recommendTasks(
    userState: UserState,
    userId: string,
    limit: number = 5
  ): Promise<ScoredTask[]> {
    
    // PASO 1: Determinar estrategia TCC según estado
    const strategy = this.selectTCCStrategy(userState);
    
    // PASO 2: Obtener datos necesarios
    const [allTasks, userRooms, userProgress, activityHistory] = await Promise.all([
      db.tasks.toArray(),
      db.rooms.where('userId').equals(userId).toArray(),
      this.getUserProgress(userId),
      this.getActivityHistory(userId, 50),
    ]);
    
    // PASO 3: Filtrar tareas según estrategia
    const candidateTasks = this.filterTasksByStrategy(allTasks, strategy, activityHistory);
    
    // PASO 4: Scoring de tareas
    const scoredTasks = this.scoreTasks(
      candidateTasks,
      userState,
      userRooms,
      userProgress,
      activityHistory
    );
    
    // PASO 5: Retornar top N
    return scoredTasks.slice(0, limit);
  }

  /**
   * Obtiene una micro-tarea aleatoria para estado abrumado
   */
  async getRandomMicroTask(): Promise<Task | null> {
    const microTasks = await db.tasks
      .where('isMicroTask')
      .equals(1) // Dexie usa 1/0 para boolean indexado
      .toArray();
    
    // Fallback si no hay índice
    const allTasks = microTasks.length > 0 
      ? microTasks 
      : (await db.tasks.toArray()).filter(t => t.isMicroTask);
    
    const filtered = allTasks.filter(
      t => t.isMicroTask && !t.requiresDecisions && t.estimatedMinutes <= 3
    );
    
    if (filtered.length === 0) return null;
    
    return filtered[Math.floor(Math.random() * filtered.length)];
  }

  /**
   * PASO 1: Seleccionar estrategia TCC según estado del usuario
   */
  private selectTCCStrategy(userState: UserState): TCCStrategy {
    
    // RUTA A: Usuario abrumado - Activación mínima
    if (userState.intention === 'overwhelmed') {
      return {
        name: 'micro_activation',
        principles: [
          'minimize_cognitive_load',
          'immediate_action',
          'no_choice_paralysis'
        ],
        filters: {
          isMicroTask: true,
          maxMinutes: 3,
          requiresDecisions: false,
          effortLevel: ['micro'],
        },
        messaging: {
          preTask: 'Vamos a empezar MUY pequeño. Sin presión.',
        }
      };
    }
    
    // RUTA B: Usuario con energía - Capitalizar impulso
    if (userState.intention === 'have_energy') {
      const maxMinutes = this.getMaxMinutesFromTime(userState.availableTime);
      
      return {
        name: 'capitalize_activation',
        principles: [
          'maximize_impact',
          'leverage_momentum',
          'high_reinforcement_tasks'
        ],
        filters: {
          maxMinutes,
          impactLevel: ['medium', 'high'],
          effortLevel: ['low', 'medium', 'high'],
        }
      };
    }
    
    // RUTA C: Usuario bloqueado - Depende de la barrera
    if (userState.intention === 'hard_to_start') {
      return this.selectStrategyForBarrier(userState.barrier);
    }
    
    // RUTA D: Planificación - Mostrar opciones
    if (userState.intention === 'need_planning') {
      return {
        name: 'planned_activation',
        principles: ['user_directed', 'show_options'],
        filters: {} // Sin filtros restrictivos
      };
    }
    
    // Default: Neutral
    return {
      name: 'neutral',
      principles: ['balanced_options'],
      filters: {
        effortLevel: ['micro', 'low', 'medium'],
      }
    };
  }

  /**
   * Selecciona estrategia específica según la barrera del usuario
   */
  private selectStrategyForBarrier(barrier?: Barrier): TCCStrategy {
    switch (barrier) {
      case 'no_energy':
        return {
          name: 'low_effort_activation',
          principles: ['minimize_physical_effort', 'mental_tasks_ok'],
          filters: {
            requiresMovement: false,
            effortLevel: ['micro', 'low'],
            category: ['organizing', 'shopping'],
          }
        };
      
      case 'dont_know_first':
        return {
          name: 'remove_choice',
          principles: ['provide_direction', 'random_ok'],
          filters: {
            effortLevel: ['micro', 'low'],
          }
        };
      
      case 'not_perfect_time':
        return {
          name: 'challenge_perfectionism',
          principles: ['emphasize_progress_over_perfection', 'time_boxing'],
          filters: {
            hasIntensityLevels: true,
          },
          messaging: {
            preTask: 'Recuerda: solo vas a hacer el nivel BÁSICO. Hecho es mejor que perfecto.',
            emphasizeBasicLevel: true,
          }
        };
      
      case 'too_much':
        return {
          name: 'micro_fragmentation',
          principles: ['break_down', 'tiny_steps'],
          filters: {
            isMicroTask: true,
            maxMinutes: 2,
          },
          messaging: {
            preTask: 'Solo un pequeño paso. Eso es todo.',
          }
        };
      
      case 'anxiety':
        return {
          name: 'reduce_anxiety',
          principles: ['familiar_tasks', 'high_success_rate'],
          filters: {
            previouslyCompleted: true,
            effortLevel: ['micro', 'low'],
          },
          messaging: {
            preTask: 'Vamos con algo que ya conoces y te sale bien.',
          }
        };
      
      default:
        return {
          name: 'gentle_start',
          principles: ['low_barrier'],
          filters: {
            effortLevel: ['micro', 'low'],
          }
        };
    }
  }

  /**
   * PASO 2: Filtrar tareas según estrategia
   */
  private filterTasksByStrategy(
    tasks: Task[],
    strategy: TCCStrategy,
    activityHistory: ActivityLog[]
  ): Task[] {
    const { filters } = strategy;
    
    return tasks.filter(task => {
      // Filtro: micro-tareas
      if (filters.isMicroTask !== undefined) {
        if (task.isMicroTask !== filters.isMicroTask) return false;
      }
      
      // Filtro: duración máxima
      if (filters.maxMinutes !== undefined) {
        if (task.estimatedMinutes > filters.maxMinutes) return false;
      }
      
      // Filtro: nivel de esfuerzo
      if (filters.effortLevel && filters.effortLevel.length > 0) {
        if (!filters.effortLevel.includes(task.effortLevel)) return false;
      }
      
      // Filtro: requiere decisiones
      if (filters.requiresDecisions === false) {
        if (task.requiresDecisions) return false;
      }
      
      // Filtro: requiere movimiento
      if (filters.requiresMovement === false) {
        if (task.requiresMovement) return false;
      }
      
      // Filtro: categorías
      if (filters.category && filters.category.length > 0) {
        if (!filters.category.includes(task.category)) return false;
      }
      
      // Filtro: nivel de impacto
      if (filters.impactLevel && filters.impactLevel.length > 0) {
        if (!filters.impactLevel.includes(task.impactLevel)) return false;
      }
      
      // Filtro: tiene niveles de intensidad
      if (filters.hasIntensityLevels) {
        if (!task.intensityLevels) return false;
      }
      
      // Filtro: previamente completada (para reducir ansiedad)
      if (filters.previouslyCompleted) {
        const wasCompleted = activityHistory.some(
          log => log.taskId === task.id && log.completed
        );
        if (!wasCompleted) return false;
      }
      
      return true;
    });
  }

  /**
   * PASO 3: Scoring de tareas
   */
  private scoreTasks(
    tasks: Task[],
    userState: UserState,
    userRooms: Room[],
    userProgress: UserProgress,
    activityHistory: ActivityLog[]
  ): ScoredTask[] {
    const currentHour = new Date().getHours();
    
    const scoredTasks = tasks.map(task => {
      let score = 0;
      let reason = '';
      
      // Factor 1: Historial de impacto emocional (PESO ALTO: 30 pts max)
      const taskPattern = userProgress.highImpactTasks?.find(
        p => p.taskId === task.id
      );
      if (taskPattern && taskPattern.avgMoodImprovement > 0) {
        const impactScore = Math.min(taskPattern.avgMoodImprovement * 10, 30);
        score += impactScore;
        if (impactScore > 15) {
          reason = 'Esta tarea suele hacerte sentir bien';
        }
      }
      
      // Factor 2: Prioridad de habitación (20 pts max)
      if (task.room) {
        const room = userRooms.find(r => r.type === task.room);
        if (room?.priority === 'high') score += 20;
        else if (room?.priority === 'medium') score += 10;
        
        // Tiempo desde última limpieza (10 pts max)
        if (room?.lastCleaned) {
          const daysSince = this.daysSince(room.lastCleaned);
          score += Math.min(daysSince * 2, 10);
        }
      }
      
      // Factor 3: Nivel de impacto visual/emocional (15 pts max)
      if (task.impactLevel === 'high') score += 15;
      else if (task.impactLevel === 'medium') score += 8;
      
      // Factor 4: Ajuste de tiempo disponible (10 pts max)
      if (userState.availableTime) {
        const maxMinutes = this.getMaxMinutesFromTime(userState.availableTime);
        const timeFit = Math.abs(task.estimatedMinutes - maxMinutes / 2);
        score += Math.max(10 - timeFit, 0);
      }
      
      // Factor 5: Evitar repetición reciente (-20 pts penalty)
      const recentlyDone = activityHistory
        .filter(log => log.taskId === task.id && log.completed)
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0];
      
      if (recentlyDone) {
        const hoursSince = this.hoursSince(new Date(recentlyDone.startTime));
        if (hoursSince < 24) score -= 20;
        else if (hoursSince < 72) score -= 10;
      }
      
      // Factor 6: Bonus para tareas micro en estado abrumado (15 pts)
      if (userState.intention === 'overwhelmed' && task.isMicroTask) {
        score += 15;
      }
      
      // Factor 7: Bonus para alto impacto cuando hay energía (10 pts)
      if (userState.intention === 'have_energy' && task.impactLevel === 'high') {
        score += 10;
      }
      
      return { task, score, reason };
    });
    
    // Ordenar por score descendente
    return scoredTasks.sort((a, b) => b.score - a.score);
  }

  // ============================================================================
  // MÉTODOS AUXILIARES
  // ============================================================================

  private getMaxMinutesFromTime(time?: TimeAvailable): number {
    switch (time) {
      case '5-10': return 10;
      case '15-20': return 20;
      case '30+': return 60;
      case 'unsure': return 15;
      default: return 20;
    }
  }

  private async getUserProgress(userId: string): Promise<UserProgress> {
    let progress = await db.userProgress.get(userId);
    if (!progress) {
      progress = {
        userId,
        currentStreak: 0,
        longestStreak: 0,
        totalTasksCompleted: 0,
        weeklyPoints: 0,
        weeklyGoal: 100,
        highImpactTasks: [],
      };
    }
    return progress;
  }

  private async getActivityHistory(userId: string, limit: number): Promise<ActivityLog[]> {
    return await db.activityLogs
      .where('userId')
      .equals(userId)
      .reverse()
      .limit(limit)
      .toArray();
  }

  private daysSince(date: Date): number {
    return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
  }

  private hoursSince(date: Date): number {
    return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60));
  }
}

// Instancia singleton para uso en la app
export const taskRecommendationEngine = new TaskRecommendationEngine();
