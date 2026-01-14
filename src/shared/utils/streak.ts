import { db, type ActivityLog } from '../../db/database';
import { startOfDay, isSameDay, subDays } from 'date-fns';

/**
 * Calcula la racha actual del usuario
 * Una racha se mantiene si hay al menos una tarea completada cada día
 */
export async function calculateStreak(userId: string): Promise<number> {
  // Obtener todos los logs completados, ordenados por fecha descendente
  const logs = await db.activityLogs
    .where('userId')
    .equals(userId)
    .and((log) => log.completed === true)
    .reverse()
    .sortBy('startTime');

  if (logs.length === 0) {
    return 0;
  }

  let streak = 0;
  let currentDate = startOfDay(new Date());
  const processedDates = new Set<string>();

  for (const log of logs) {
    const logDate = startOfDay(new Date(log.startTime));
    const logDateKey = logDate.toISOString();

    // Evitar contar múltiples tareas del mismo día
    if (processedDates.has(logDateKey)) {
      continue;
    }

    // Si el log es del día actual o del día anterior al que estamos revisando
    if (isSameDay(logDate, currentDate)) {
      streak++;
      processedDates.add(logDateKey);
      // Mantenerse en la fecha actual por si hay más tareas del mismo día
    } else if (isSameDay(logDate, subDays(currentDate, 1))) {
      streak++;
      processedDates.add(logDateKey);
      currentDate = logDate; // Moverse al día anterior
    } else {
      // Hay un gap mayor a 1 día, la racha se rompe
      break;
    }
  }

  return streak;
}

/**
 * Verifica si el usuario ha completado al menos una tarea hoy
 */
export async function hasCompletedTaskToday(userId: string): Promise<boolean> {
  const today = startOfDay(new Date());

  const count = await db.activityLogs
    .where('userId')
    .equals(userId)
    .and((log) => {
      if (!log.completed) return false;
      const logDate = startOfDay(new Date(log.startTime));
      return isSameDay(logDate, today);
    })
    .count();

  return count > 0;
}

/**
 * Obtiene el número de tareas completadas hoy
 */
export async function getTodayTaskCount(userId: string): Promise<number> {
  const today = startOfDay(new Date());

  const count = await db.activityLogs
    .where('userId')
    .equals(userId)
    .and((log) => {
      if (!log.completed) return false;
      const logDate = startOfDay(new Date(log.startTime));
      return isSameDay(logDate, today);
    })
    .count();

  return count;
}
