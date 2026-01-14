import type { Task } from '../../db/database';

/**
 * Calcula los puntos ganados por completar una tarea
 */
export function calculateTaskPoints(
  task: Task,
  actualMinutes: number,
  emotionalBefore?: number,
  emotionalAfter?: number
): number {
  // Puntos base según nivel de esfuerzo
  let basePoints = 0;
  switch (task.effortLevel) {
    case 'micro':
      basePoints = 5;
      break;
    case 'low':
      basePoints = 10;
      break;
    case 'medium':
      basePoints = 20;
      break;
    case 'high':
      basePoints = 30;
      break;
  }

  // Multiplicador según nivel de impacto
  const impactMultiplier = {
    low: 1.0,
    medium: 1.25,
    high: 1.5,
  }[task.impactLevel];

  // Bonus por completar más rápido de lo estimado (máximo 5 puntos)
  const timeDiff = task.estimatedMinutes - actualMinutes;
  const timeBonus = timeDiff > 0 ? Math.min(timeDiff, 5) : 0;

  // Bonus por mejora de ánimo (5 puntos por cada punto de mejora)
  let moodBonus = 0;
  if (emotionalBefore !== undefined && emotionalAfter !== undefined) {
    const improvement = emotionalAfter - emotionalBefore;
    moodBonus = improvement > 0 ? improvement * 5 : 0;
  }

  // Cálculo final
  const totalPoints = Math.round(basePoints * impactMultiplier + timeBonus + moodBonus);

  return Math.max(totalPoints, 1); // Mínimo 1 punto
}

/**
 * Calcula la mejora de ánimo (diferencia entre antes y después)
 */
export function calculateMoodImprovement(
  emotionalBefore: number,
  emotionalAfter: number
): number {
  return emotionalAfter - emotionalBefore;
}

/**
 * Convierte la escala emocional numérica a texto descriptivo
 */
export function getEmotionalLabel(value: number): string {
  switch (value) {
    case 1:
      return 'Muy mal';
    case 2:
      return 'Mal';
    case 3:
      return 'Regular';
    case 4:
      return 'Bien';
    case 5:
      return 'Muy bien';
    default:
      return 'Desconocido';
  }
}

// ============================================================================
// SISTEMA DE PUNTOS AVANZADO
// ============================================================================

/**
 * Calcula puntos con intensidad elegida (para tareas con niveles)
 */
export function calculatePointsWithIntensity(
  task: Task,
  intensityUsed?: 'basic' | 'standard' | 'deep'
): number {
  let basePoints = 0;
  
  switch (task.effortLevel) {
    case 'micro': basePoints = 5; break;
    case 'low': basePoints = 10; break;
    case 'medium': basePoints = 20; break;
    case 'high': basePoints = 35; break;
  }
  
  const impactMultiplier = {
    low: 1,
    medium: 1.3,
    high: 1.6,
  }[task.impactLevel];
  
  let intensityMultiplier = 1;
  if (task.intensityLevels && intensityUsed) {
    switch (intensityUsed) {
      case 'basic': intensityMultiplier = 0.6; break;
      case 'standard': intensityMultiplier = 1; break;
      case 'deep': intensityMultiplier = 1.5; break;
    }
  }
  
  return Math.round(basePoints * impactMultiplier * intensityMultiplier);
}

/**
 * Objetivo semanal de puntos según nivel de dificultad
 */
export const WEEKLY_GOALS = {
  easy: 50,      // ~7 micro-tareas por semana
  moderate: 100, // ~10-15 tareas mixtas
  ambitious: 200 // ~25+ tareas o varias medias
};

/**
 * Niveles de logro basados en puntos totales acumulados
 */
export const POINT_MILESTONES = [
  { points: 50, badge: '🌱', title: 'Semilla', description: 'Primeros pasos' },
  { points: 100, badge: '🌿', title: 'Brote', description: 'Creciendo fuerte' },
  { points: 250, badge: '🌳', title: 'Árbol', description: 'Raíces firmes' },
  { points: 500, badge: '🌲', title: 'Bosque', description: 'Imparable' },
  { points: 1000, badge: '🏔️', title: 'Montaña', description: 'Maestro del hogar' },
];

/**
 * Obtiene el nivel actual basado en puntos totales
 */
export function getCurrentLevel(totalPoints: number): typeof POINT_MILESTONES[0] | null {
  const achieved = POINT_MILESTONES.filter(m => totalPoints >= m.points);
  return achieved.length > 0 ? achieved[achieved.length - 1] : null;
}

/**
 * Obtiene el próximo nivel a alcanzar
 */
export function getNextLevel(totalPoints: number): typeof POINT_MILESTONES[0] | null {
  return POINT_MILESTONES.find(m => totalPoints < m.points) || null;
}

/**
 * Calcula el porcentaje de progreso hacia el próximo nivel
 */
export function getProgressToNextLevel(totalPoints: number): number {
  const current = getCurrentLevel(totalPoints);
  const next = getNextLevel(totalPoints);
  
  if (!next) return 100;
  
  const currentThreshold = current?.points || 0;
  const pointsInLevel = totalPoints - currentThreshold;
  const pointsNeeded = next.points - currentThreshold;
  
  return Math.round((pointsInLevel / pointsNeeded) * 100);
}
