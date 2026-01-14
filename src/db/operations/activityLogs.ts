import { db, type ActivityLog, type EmotionalState, generateId } from '../database';
import { startOfDay, isSameDay } from '../../shared/utils/dateUtils';

/**
 * Convierte número (1-5) a estado emocional literal
 */
function numberToEmotionalState(num: number): 'very_bad' | 'bad' | 'neutral' | 'good' | 'very_good' {
  switch (num) {
    case 1: return 'very_bad';
    case 2: return 'bad';
    case 3: return 'neutral';
    case 4: return 'good';
    case 5: return 'very_good';
    default: return 'neutral';
  }
}

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
    emotionalStateBefore: numberToEmotionalState(emotionalStateBefore),
    routeUsed,
  };

  await db.activityLogs.add(log);
  return logId;
}

/**
 * Convierte estado emocional literal a número
 */
function emotionalStateToNumber(state: 'very_bad' | 'bad' | 'neutral' | 'good' | 'very_good'): number {
  switch (state) {
    case 'very_bad': return 1;
    case 'bad': return 2;
    case 'neutral': return 3;
    case 'good': return 4;
    case 'very_good': return 5;
  }
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

  const moodBefore = emotionalStateToNumber(log.emotionalStateBefore);
  const moodImprovement = emotionalStateAfter - moodBefore;

  await db.activityLogs.update(logId, {
    completed: true,
    endTime: new Date(),
    emotionalStateAfter: numberToEmotionalState(emotionalStateAfter),
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
 * Obtiene los IDs de tareas completadas hoy
 */
export async function getCompletedTaskIdsToday(userId: string): Promise<Set<string>> {
  const today = startOfDay(new Date());

  const logs = await db.activityLogs
    .where('userId')
    .equals(userId)
    .and((log) => {
      if (!log.completed) return false;
      const logDate = startOfDay(new Date(log.startTime));
      return isSameDay(logDate, today);
    })
    .toArray();

  return new Set(logs.map(log => log.taskId));
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
