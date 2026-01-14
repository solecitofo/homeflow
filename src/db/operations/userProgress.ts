import { db, type UserProgress, getOrCreateUser } from '../database';
import { calculateStreak } from '../../shared/utils/streak';
import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

/**
 * Actualiza el progreso del usuario después de completar una tarea
 */
export async function updateUserProgress(
  userId: string,
  points: number,
  taskId: string,
  moodImprovement: number
): Promise<void> {
  const progress = await getOrCreateUser(userId);

  // Calcular racha actual
  const currentStreak = await calculateStreak(userId);

  // Actualizar racha más larga si es necesario
  const longestStreak = Math.max(currentStreak, progress.longestStreak);

  // Calcular puntos semanales
  const weeklyPoints = await getWeeklyPoints(userId);

  // Actualizar o añadir high-impact task si hubo mejora de ánimo
  let highImpactTasks = progress.highImpactTasks || [];
  if (moodImprovement > 0) {
    const existingIndex = highImpactTasks.findIndex((t) => t.taskId === taskId);

    if (existingIndex >= 0) {
      // Actualizar promedio
      const existing = highImpactTasks[existingIndex];
      const newTimesCompleted = existing.timesCompleted + 1;
      const newAvgMoodImprovement =
        (existing.avgMoodImprovement * existing.timesCompleted + moodImprovement) /
        newTimesCompleted;

      highImpactTasks[existingIndex] = {
        taskId,
        avgMoodImprovement: newAvgMoodImprovement,
        timesCompleted: newTimesCompleted,
      };
    } else {
      // Añadir nueva tarea
      highImpactTasks.push({
        taskId,
        avgMoodImprovement: moodImprovement,
        timesCompleted: 1,
      });
    }

    // Mantener solo top 10 high-impact tasks
    highImpactTasks.sort((a, b) => b.avgMoodImprovement - a.avgMoodImprovement);
    highImpactTasks = highImpactTasks.slice(0, 10);
  }

  // Actualizar en base de datos
  await db.userProgress.update(userId, {
    currentStreak,
    longestStreak,
    lastActivityDate: new Date(),
    totalTasksCompleted: progress.totalTasksCompleted + 1,
    weeklyPoints,
    highImpactTasks,
  });
}

/**
 * Obtiene los puntos acumulados esta semana
 */
export async function getWeeklyPoints(userId: string): Promise<number> {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Lunes
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 }); // Domingo

  const logs = await db.activityLogs
    .where('userId')
    .equals(userId)
    .and((log) => {
      if (!log.completed) return false;
      const logDate = new Date(log.startTime);
      return isWithinInterval(logDate, { start: weekStart, end: weekEnd });
    })
    .toArray();

  // Aquí deberíamos calcular puntos, pero necesitamos Task info
  // Por ahora retornamos conteo simple
  // TODO: Implementar cálculo real de puntos cuando tengamos Task data
  return logs.length * 10; // Placeholder: 10 puntos promedio por tarea
}

/**
 * Obtiene un resumen del progreso semanal
 */
export async function getWeeklyProgress(userId: string): Promise<{
  weeklyPoints: number;
  weeklyGoal: number;
  percentage: number;
}> {
  const progress = await getOrCreateUser(userId);
  const weeklyPoints = await getWeeklyPoints(userId);
  const weeklyGoal = progress.weeklyGoal;
  const percentage = weeklyGoal > 0 ? Math.min((weeklyPoints / weeklyGoal) * 100, 100) : 0;

  return {
    weeklyPoints,
    weeklyGoal,
    percentage,
  };
}

/**
 * Obtiene el progreso del usuario
 */
export async function getUserProgress(userId: string): Promise<UserProgress> {
  return await getOrCreateUser(userId);
}

/**
 * Actualiza la meta semanal del usuario
 */
export async function updateWeeklyGoal(userId: string, newGoal: number): Promise<void> {
  await db.userProgress.update(userId, {
    weeklyGoal: newGoal,
  });
}
