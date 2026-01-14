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
