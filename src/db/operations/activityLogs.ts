import { db, type ActivityLog, type EmotionalState, generateId } from '../database';
import { startOfDay, isSameDay } from '../../shared/utils/dateUtils';

/**
 * Crea un nuevo log de actividad cuando el usuario empieza una tarea
 */
export async function createActivityLog(
  userId: string,
  taskId: string,
  emotionalStateBefore: number,
  routeUsed: EmotionalState
): Promise<string> {
  const logId = generateId();

  const log: ActivityLog = {
    id: logId,
    userId,
    taskId,
    startTime: new Date(),
    completed: false,
    emotionalStateBefore: emotionalStateBefore as 1 | 2 | 3 | 4 | 5,
    routeUsed,
  };

  await db.activityLogs.add(log);
  return logId;
}

/**
 * Actualiza un log de actividad cuando el usuario completa la tarea
 */
export async function completeActivityLog(
  logId: string,
  emotionalStateAfter: number,
  actualMinutes: number
): Promise<void> {
  const log = await db.activityLogs.get(logId);
  if (!log) {
    throw new Error(`Activity log ${logId} not found`);
  }

  const moodImprovement = emotionalStateAfter - log.emotionalStateBefore;

  await db.activityLogs.update(logId, {
    completed: true,
    endTime: new Date(),
    emotionalStateAfter: emotionalStateAfter as 1 | 2 | 3 | 4 | 5,
    actualMinutes,
    moodImprovement,
  });
}

/**
 * Obtiene el conteo de tareas completadas hoy
 */
export async function getTodayActivityCount(userId: string): Promise<number> {
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

/**
 * Obtiene los logs recientes del usuario
 */
export async function getRecentLogs(
  userId: string,
  limit: number = 10
): Promise<ActivityLog[]> {
  const logs = await db.activityLogs
    .where('userId')
    .equals(userId)
    .and((log) => log.completed === true)
    .reverse()
    .limit(limit)
    .toArray();

  return logs;
}

/**
 * Obtiene logs completados del usuario
 */
export async function getCompletedLogs(userId: string): Promise<ActivityLog[]> {
  return await db.activityLogs
    .where('userId')
    .equals(userId)
    .and((log) => log.completed === true)
    .reverse()
    .sortBy('startTime');
}
