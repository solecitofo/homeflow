import { db, type UserPatterns, type ActivityLog } from '../database';

// ============================================================================
// OPERACIONES PARA USER PATTERNS
// ============================================================================

/**
 * Obtiene o crea los patrones del usuario
 */
export async function getOrCreateUserPatterns(userId: string): Promise<UserPatterns> {
  let patterns = await db.userPatterns.get(userId);
  
  if (!patterns) {
    patterns = {
      userId,
      successfulTimeSlots: {},
      taskDurations: [],
      totalPointsEarned: 0,
    };
    await db.userPatterns.add(patterns);
  }
  
  return patterns;
}

/**
 * Actualiza los patrones después de completar una tarea
 */
export async function updatePatternsAfterTask(
  userId: string,
  activityLog: ActivityLog,
  moodImprovement: number,
  pointsEarned: number
): Promise<void> {
  const patterns = await getOrCreateUserPatterns(userId);
  
  // 1. Detectar ventana de tiempo exitosa
  const hour = new Date(activityLog.startTime).getHours();
  const timeOfDay = getTimeOfDay(hour);
  
  if (activityLog.completed && moodImprovement >= 0) {
    patterns.successfulTimeSlots[timeOfDay] = 
      (patterns.successfulTimeSlots[timeOfDay] || 0) + 1;
  }
  
  // 2. Actualizar duración preferida
  if (activityLog.completed && activityLog.actualMinutes) {
    patterns.taskDurations.push(activityLog.actualMinutes);
    
    // Mantener solo últimas 20 duraciones
    if (patterns.taskDurations.length > 20) {
      patterns.taskDurations = patterns.taskDurations.slice(-20);
    }
    
    // Calcular mediana
    if (patterns.taskDurations.length >= 5) {
      patterns.preferredTaskDuration = calculateMedian(patterns.taskDurations);
    }
  }
  
  // 3. Actualizar mejor momento del día
  patterns.bestTimeOfDay = detectBestTimeOfDay(patterns.successfulTimeSlots);
  
  // 4. Actualizar puntos totales
  patterns.totalPointsEarned += pointsEarned;
  
  // Guardar usando put que reemplaza todo el registro
  await db.userPatterns.put(patterns);
}

/**
 * Detecta el mejor momento del día basado en historial
 */
function detectBestTimeOfDay(
  timeSlots: Record<string, number>
): 'morning' | 'afternoon' | 'evening' | undefined {
  const slots = Object.entries(timeSlots);
  if (slots.length === 0) return undefined;
  
  // Encontrar el slot con más éxitos
  slots.sort((a, b) => b[1] - a[1]);
  
  // Solo retornar si hay suficientes datos (al menos 3 éxitos)
  if (slots[0][1] >= 3) {
    return slots[0][0] as 'morning' | 'afternoon' | 'evening';
  }
  
  return undefined;
}

/**
 * Obtiene el período del día
 */
function getTimeOfDay(hour: number): 'morning' | 'afternoon' | 'evening' {
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'evening';
}

/**
 * Calcula la mediana de un array de números
 */
function calculateMedian(numbers: number[]): number {
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }
  
  return sorted[mid];
}

// ============================================================================
// INSIGHTS PARA EL USUARIO
// ============================================================================

export interface UserInsight {
  type: 'time' | 'task' | 'mood' | 'streak';
  icon: string;
  message: string;
}

/**
 * Genera insights personalizados para el usuario
 */
export async function generateInsights(userId: string): Promise<UserInsight[]> {
  const patterns = await getOrCreateUserPatterns(userId);
  const progress = await db.userProgress.get(userId);
  const insights: UserInsight[] = [];
  
  // Insight: Mejor momento del día
  if (patterns.bestTimeOfDay) {
    const timeLabels = {
      morning: 'las mañanas',
      afternoon: 'las tardes',
      evening: 'las noches',
    };
    insights.push({
      type: 'time',
      icon: '⏰',
      message: `${timeLabels[patterns.bestTimeOfDay].charAt(0).toUpperCase() + timeLabels[patterns.bestTimeOfDay].slice(1)} son tu mejor momento para activarte`,
    });
  }
  
  // Insight: Duración preferida
  if (patterns.preferredTaskDuration) {
    insights.push({
      type: 'task',
      icon: '⏱️',
      message: `Tus tareas suelen durarte unos ${patterns.preferredTaskDuration} minutos`,
    });
  }
  
  // Insight: Tareas de alto impacto
  if (progress?.highImpactTasks && progress.highImpactTasks.length > 0) {
    const topTask = progress.highImpactTasks[0];
    const task = await db.tasks.get(topTask.taskId);
    if (task) {
      insights.push({
        type: 'mood',
        icon: '💡',
        message: `"${task.title}" suele hacerte sentir mejor (${Math.round(topTask.avgMoodImprovement * 100)}% mejora de ánimo)`,
      });
    }
  }
  
  // Insight: Racha actual
  if (progress?.currentStreak && progress.currentStreak >= 3) {
    insights.push({
      type: 'streak',
      icon: '🔥',
      message: `¡${progress.currentStreak} días seguidos! Estás creando un hábito`,
    });
  }
  
  return insights;
}

/**
 * Obtiene el resumen de patrones para mostrar al usuario
 */
export async function getPatternsSummary(userId: string): Promise<{
  bestTime: string | null;
  preferredDuration: number | null;
  totalPoints: number;
  favoriteTaskType: string | null;
}> {
  const patterns = await getOrCreateUserPatterns(userId);
  
  const timeLabels: Record<string, string> = {
    morning: 'Mañanas',
    afternoon: 'Tardes',
    evening: 'Noches',
  };
  
  return {
    bestTime: patterns.bestTimeOfDay ? timeLabels[patterns.bestTimeOfDay] : null,
    preferredDuration: patterns.preferredTaskDuration || null,
    totalPoints: patterns.totalPointsEarned,
    favoriteTaskType: null, // TODO: Calcular basado en categorías completadas
  };
}
